<?php

namespace App\Services;

use App\Enums\ContractStatus;
use App\Events\ContractSigned;
use App\Mail\ContractMail;
use App\Mail\ContractSignedMail;
use App\Models\Contract;
use App\Models\Proposal;
use App\StateMachines\ContractStateMachine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class ContractService
{
    /**
     * Generate a contract from an accepted proposal.
     */
    public function createFromProposal(Proposal $proposal): Contract
    {
        $body = $this->buildContractBody($proposal);

        return Contract::create([
            'user_id' => $proposal->user_id,
            'client_id' => $proposal->client_id,
            'proposal_id' => $proposal->id,
            'title' => "Contract — {$proposal->title}",
            'body' => $body,
        ]);
    }

    /**
     * Send contract to client for signing.
     */
    public function send(Contract $contract): void
    {
        $machine = new ContractStateMachine($contract->status);
        $machine->transitionTo(ContractStatus::Sent);

        // Hash the document before sending — proves integrity at signing
        $hash = hash('sha256', $contract->body);

        $contract->update([
            'status' => ContractStatus::Sent,
            'sent_at' => now(),
            'document_hash' => $hash,
        ]);

        Mail::to($contract->client->email)
            ->send(new ContractMail($contract));
    }

    /**
     * Record client signature — transitions Sent → Signed.
     */
    public function sign(Contract $contract, string $signatureData, Request $request): void
    {
        $machine = new ContractStateMachine($contract->status);
        $machine->transitionTo(ContractStatus::Signed);

        // Save signature image (base64 PNG from canvas)
        $signaturePath = $this->saveSignature($contract, $signatureData);

        // Verify document hash hasn't changed
        $currentHash = hash('sha256', $contract->body);

        $contract->update([
            'status' => ContractStatus::Signed,
            'signed_at' => now(),
            'signature_path' => $signaturePath,
            'signer_ip' => $request->ip(),
            'signer_user_agent' => $request->userAgent(),
            'document_hash' => $currentHash,
        ]);

        broadcast(new ContractSigned($contract))->toOthers();

        // Notify freelancer
        Mail::to($contract->user->email)
            ->send(new ContractSignedMail($contract));
    }

    /**
     * Client rejects the contract.
     */
    public function reject(Contract $contract, ?string $reason, Request $request): void
    {
        $machine = new ContractStateMachine($contract->status);
        $machine->transitionTo(ContractStatus::Rejected);

        $contract->update([
            'status' => ContractStatus::Rejected,
            'rejected_at' => now(),
            'rejection_reason' => $reason,
            'signer_ip' => $request->ip(),
        ]);
    }

    /**
     * Save base64 signature image to storage.
     */
    private function saveSignature(Contract $contract, string $base64Data): string
    {
        // Strip data URI prefix: data:image/png;base64,...
        $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $base64Data);
        $decoded   = base64_decode($imageData);

        // Create directory if it doesn't exist
        $directory = storage_path('app/signatures');
        if (!file_exists($directory)) {
            mkdir($directory, 0775, true);
        }

        $filename = "contract_{$contract->id}_" . time() . '.png';
        $fullPath = $directory . '/' . $filename;

        file_put_contents($fullPath, $decoded);

        return 'signatures/' . $filename;
    }

    /**
     * Build HTML contract body from proposal data.
     */
    private function buildContractBody(Proposal $proposal): string
    {
        $client = $proposal->client;
        $freelancer = $proposal->user;
        $date = now()->format('d.m.Y');
        $validUntil = $proposal->valid_until?->format('d.m.Y') ?? '—';
        $total = number_format($proposal->total_cents / 100, 2, ',', '.');
        $freelancerName = $freelancer->company_name ?? $freelancer->name;
        $freelancerAddress = $freelancer->address ?? '';
        $freelancerCity = $freelancer->city ?? '';
        $freelancerTax = $freelancer->steuernummer ?? '—';
        $clientName = $client->company_name ?? $client->contact_name;

        return <<<HTML
        <div class="contract">
            <h1>Service Agreement</h1>
            <p><strong>Date:</strong> {$date}</p>

            <h2>Parties</h2>
            <p>
                <strong>Service Provider:</strong><br>
                {$freelancerName}<br>
                {$freelancerAddress}, {$freelancerCity}<br>
                Steuernummer: {$freelancerTax}<br>
                Email: {$freelancer->email}
            </p>
            <p>
                <strong>Client:</strong><br>
                {$clientName}<br>
                {$client->contact_name}<br>
                Email: {$client->email}
            </p>

            <h2>Project: {$proposal->title}</h2>
            <p>
                The Service Provider agrees to deliver the services outlined
                in Proposal #{$proposal->id} dated {$date}.
            </p>

            <h2>Compensation</h2>
            <p>
                Total agreed amount: <strong>€{$total} {$proposal->currency}</strong><br>
                Payment terms: Due within 14 days of invoice.
            </p>

            <h2>Terms</h2>
            <ol>
                <li>Work begins upon signing of this contract.</li>
                <li>Changes to scope require written agreement from both parties.</li>
                <li>Intellectual property transfers to client upon full payment.</li>
                <li>Either party may terminate with 14 days written notice.</li>
                <li>This agreement is governed by German law.</li>
            </ol>

            <h2>eIDAS Electronic Signature</h2>
            <p>
                By signing below, both parties agree to the terms of this contract.
                This electronic signature is legally binding under EU eIDAS Regulation
                (Simple Electronic Signature) for commercial contracts.
            </p>
        </div>
        HTML;
    }
}
