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
        Schema::create('member_cases', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('member_id');
            $table->string('membership_application_id')->nullable();
            $table->string('case_number')->index();
            $table->string('title');
            $table->string('category')->default('Civil');
            $table->string('jurisdiction')->nullable();
            $table->string('opposing_party')->nullable();
            $table->string('status')->default('en_cours');
            $table->date('hearing_date')->nullable();
            $table->string('hearing_reason')->nullable();
            $table->text('summary')->nullable();
            $table->date('opened_at')->nullable();
            $table->date('closed_at')->nullable();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members')->onDelete('cascade');
            $table->foreign('membership_application_id')->references('id')->on('membership_applications')->onDelete('set null');
        });

        Schema::create('member_case_documents', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('member_case_id');
            $table->string('title');
            $table->text('file_path');
            $table->string('file_name');
            $table->string('file_type')->nullable();
            $table->integer('file_size')->nullable();
            $table->timestamps();

            $table->foreign('member_case_id')->references('id')->on('member_cases')->onDelete('cascade');
        });

        Schema::create('member_case_events', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('member_case_id');
            $table->date('event_date');
            $table->string('status');
            $table->date('next_hearing_date')->nullable();
            $table->text('reason')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('member_case_id')->references('id')->on('member_cases')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_case_events');
        Schema::dropIfExists('member_case_documents');
        Schema::dropIfExists('member_cases');
    }
};
