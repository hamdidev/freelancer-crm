<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('number')->unique();          // INV-2024-0001 (GoBD)
            $table->string('status')->default('draft');
            $table->string('currency', 3)->default('EUR');
            $table->integer('subtotal_cents')->default(0);
            $table->decimal('tax_rate', 5, 2)->default(19.00); // German VAT default
            $table->integer('tax_cents')->default(0);
            $table->integer('total_cents')->default(0);
            $table->date('issue_date');
            $table->date('due_at');
            $table->date('service_date')->nullable();    // Leistungsdatum (German law)
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->string('stripe_payment_intent_id')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('recurring')->default(false);
            $table->string('recurring_interval')->nullable(); // weekly | monthly
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
