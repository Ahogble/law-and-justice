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
        Schema::table('legal_texts', function (Blueprint $table) {
            $table->string('titleEn')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('subtitleEn')->nullable();
            $table->string('dateEn')->nullable();
            $table->string('referenceEn')->nullable();
            $table->json('sections')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('legal_texts', function (Blueprint $table) {
            $table->dropColumn(['titleEn', 'subtitle', 'subtitleEn', 'dateEn', 'referenceEn', 'sections']);
        });
    }
};
