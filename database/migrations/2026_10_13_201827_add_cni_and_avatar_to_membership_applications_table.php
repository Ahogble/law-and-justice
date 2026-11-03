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
            $table->string('cni')->nullable()->after('marital_status');
            $table->longText('cni_url')->nullable()->after('cni');
            $table->longText('avatar_url')->nullable()->after('cni_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('membership_applications', function (Blueprint $table) {
            $table->dropColumn(['cni', 'cni_url', 'avatar_url']);
        });
    }
};
