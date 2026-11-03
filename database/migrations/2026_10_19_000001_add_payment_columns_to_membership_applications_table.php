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
        Schema::table('membership_applications', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->after('motivation');
            $table->string('payment_reference')->nullable()->after('payment_method');
            $table->longText('payment_receipt_url')->nullable()->after('payment_reference');
            $table->string('payment_status')->default('pending')->after('payment_receipt_url'); // 'pending', 'verified', 'rejected'
            $table->timestamp('payment_verified_at')->nullable()->after('payment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('membership_applications', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'payment_reference',
                'payment_receipt_url',
                'payment_status',
                'payment_verified_at',
            ]);
        });
    }
};
