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
        Schema::create('articles', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->nullable();
            $table->text('excerpt')->nullable();
            $table->text('content')->nullable();
            $table->string('category')->default('Actualité');
            $table->string('author_name')->default('Équipe Droit & Justice');
            $table->string('author_role')->nullable();
            $table->string('published_at')->nullable();
            $table->string('read_time')->default('5 min');
            $table->string('image_url')->nullable();
            $table->json('tags')->nullable();
            $table->string('pdf_url')->nullable();
            $table->timestamps();
        });

        Schema::create('members', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('role');
            $table->string('organization')->nullable();
            $table->string('category')->default('Conseil d\'Administration');
            $table->string('subcategory')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar_url')->nullable();
            $table->json('specialties')->nullable();
            $table->integer('publication_count')->default(0);
            $table->string('email')->nullable();
            $table->integer('joined_year')->default(2024);
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('status')->default('En cours');
            $table->string('category')->default('Réforme');
            $table->text('description')->nullable();
            $table->string('lead')->nullable();
            $table->string('start_date')->nullable();
            $table->string('target_date')->nullable();
            $table->json('deliverables')->nullable();
            $table->integer('progress')->default(0);
            $table->timestamps();
        });

        Schema::create('activities', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('type')->default('Colloque');
            $table->string('date')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->json('speakers')->nullable();
            $table->string('status')->default('À venir');
            $table->string('registration_link')->nullable();
            $table->timestamps();
        });

        Schema::create('legal_texts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('reference')->nullable();
            $table->string('category')->default('Doctrine');
            $table->string('date')->nullable();
            $table->text('summary')->nullable();
            $table->text('full_text')->nullable();
            $table->string('pdf_url')->nullable();
            $table->timestamps();
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('legal_texts');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('members');
        Schema::dropIfExists('articles');
    }
};
