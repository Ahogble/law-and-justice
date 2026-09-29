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
        Schema::table('dispute_officers', function (Blueprint $table) {
            $table->longText('avatar_url')->nullable()->change();
        });

        Schema::table('members', function (Blueprint $table) {
            $table->longText('avatar_url')->nullable()->change();
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->longText('image_url')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dispute_officers', function (Blueprint $table) {
            $table->string('avatar_url')->nullable()->change();
        });

        Schema::table('members', function (Blueprint $table) {
            $table->string('avatar_url')->nullable()->change();
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->string('image_url')->nullable()->change();
        });
    }
};
