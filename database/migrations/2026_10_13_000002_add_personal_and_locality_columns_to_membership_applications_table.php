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
            $table->date('birth_date')->nullable()->after('last_name');
            $table->string('birth_place')->nullable()->after('birth_date');
            $table->string('marital_status')->nullable()->after('birth_place');
            $table->text('address')->nullable()->after('phone');
            $table->string('country')->nullable()->after('address');
            $table->string('region')->nullable()->after('country');
            $table->string('department')->nullable()->after('region');
            $table->string('locality')->nullable()->after('department');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('membership_applications', function (Blueprint $table) {
            $table->dropColumn([
                'birth_date',
                'birth_place',
                'marital_status',
                'address',
                'country',
                'region',
                'department',
                'locality',
            ]);
        });
    }
};
