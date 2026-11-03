<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->string('profession')->nullable()->after('role');
            $table->string('city')->nullable()->after('organization');
        });

        // Seed/backfill standard members
        DB::table('members')->where('id', 'm1')->update([
            'profession' => 'Avocate au Barreau de Paris',
            'city' => 'Paris',
        ]);
        DB::table('members')->where('id', 'm2')->update([
            'profession' => 'Professeur émérite de Droit Privé',
            'city' => 'Paris',
        ]);
        DB::table('members')->where('id', 'm3')->update([
            'profession' => 'Magistrate honoraire',
            'city' => 'Paris',
        ]);
        DB::table('members')->where('id', 'm4')->update([
            'profession' => 'Directeur Juridique Groupe',
            'city' => 'Paris',
        ]);
        DB::table('members')->where('id', 'm5')->update([
            'profession' => 'Avocate & Chercheuse CNRS',
            'city' => 'Lyon',
        ]);
        DB::table('members')->where('id', 'm6')->update([
            'profession' => 'Avocat au Barreau de Paris',
            'city' => 'Paris',
        ]);

        // Backfill members linked to membership applications
        $applications = DB::table('membership_applications')->whereNotNull('member_id')->get();
        foreach ($applications as $app) {
            DB::table('members')->where('id', $app->member_id)->update([
                'profession' => $app->profession ?: 'Membre Adhérent',
                'city' => $app->locality ?: ($app->country ?: 'Paris'),
            ]);
        }

        // Fill remaining members who still have null city or profession
        DB::table('members')->whereNull('profession')->update([
            'profession' => DB::raw("COALESCE(role, 'Juriste')"),
        ]);
        DB::table('members')->whereNull('city')->update([
            'city' => 'Paris',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn(['profession', 'city']);
        });
    }
};
