<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('timezone')->default('Europe/Berlin');
            $table->string('currency', 3)->default('EUR');
            $table->string('brand_color', 7)->default('#6366f1');
            $table->string('logo_path')->nullable();
            $table->string('steuernummer')->nullable();   // German tax ID
            $table->string('ust_idnr')->nullable();       // German VAT ID
            $table->string('company_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->default('DE');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'timezone',
                'currency',
                'brand_color',
                'logo_path',
                'steuernummer',
                'ust_idnr',
                'company_name',
                'phone',
                'address',
                'city',
                'country',
            ]);
        });
    }
};
