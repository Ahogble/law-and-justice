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
        Schema::create('dispute_officers', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('title');
            $table->string('role');
            $table->string('stage')->default('conciliation');
            $table->string('category')->default('interne');
            $table->json('specialties')->nullable();
            $table->integer('experience_years')->default(10);
            $table->integer('cases_handled')->default(0);
            $table->string('avatar_url')->nullable();
            $table->string('email')->nullable();
            $table->string('availability')->default('Disponible');
            $table->timestamps();
        });

        Schema::create('dispute_cases', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('case_number');
            $table->string('title');
            $table->string('category')->default('interne');
            $table->string('stage')->default('conciliation');
            $table->boolean('is_public')->default(true);
            $table->string('status')->default('En cours');
            $table->string('date_submitted')->nullable();
            $table->text('summary')->nullable();
            $table->string('parties')->nullable();
            $table->string('assigned_officer')->nullable();
            $table->text('confidentiality_note')->nullable();
            $table->string('resolution_timeframe')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dispute_cases');
        Schema::dropIfExists('dispute_officers');
    }
};
