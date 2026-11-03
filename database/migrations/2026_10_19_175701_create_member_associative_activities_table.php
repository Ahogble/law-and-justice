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
        Schema::create('member_associative_activities', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('member_id')->nullable()->index();
            $table->string('membership_application_id')->nullable()->index();
            $table->string('type')->default('commission')->index();
            $table->string('title');
            $table->string('role')->nullable();
            $table->string('organization_unit')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(true);
            $table->string('status')->default('actif');
            $table->text('description')->nullable();
            $table->text('document_url')->nullable();
            $table->string('document_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_associative_activities');
    }
};
