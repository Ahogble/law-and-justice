<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\MemberAssociativeActivity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemberAssociativeActivityTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_associative_activity_for_member(): void
    {
        $admin = User::factory()->create();

        $member = Member::create([
            'id' => 'mem-test-01',
            'name' => 'Me Alain Kassi',
            'role' => 'Avocat Associé',
            'organization' => 'Barreau de Côte d\'Ivoire',
            'category' => 'Conseil d\'Administration',
        ]);

        $payload = [
            'member_id' => $member->id,
            'type' => 'commission',
            'title' => 'Commission Droits Humains & Éthique',
            'role' => 'Rapporteur Général',
            'organization_unit' => 'Pôle Contentieux',
            'start_date' => '2025-01-10',
            'is_current' => '1',
            'status' => 'actif',
            'description' => 'Animation des séances de travail bimensuelles et rédaction des avis déontologiques.',
        ];

        $response = $this->actingAs($admin)->post('/admin/member-associative-activities', $payload);

        $response->assertStatus(302);

        $this->assertDatabaseHas('member_associative_activities', [
            'member_id' => $member->id,
            'type' => 'commission',
            'title' => 'Commission Droits Humains & Éthique',
            'role' => 'Rapporteur Général',
            'status' => 'actif',
        ]);
    }

    public function test_admin_can_update_associative_activity(): void
    {
        $admin = User::factory()->create();

        $member = Member::create([
            'id' => 'mem-test-02',
            'name' => 'Pr Sarah Touré',
            'role' => 'Professeur Agrégé',
            'organization' => 'Faculté de Droit',
            'category' => 'Conseil Scientifique',
        ]);

        $activity = MemberAssociativeActivity::create([
            'member_id' => $member->id,
            'type' => 'mandat',
            'title' => 'Membre du Conseil de Discipline',
            'role' => 'Assesseur',
            'start_date' => '2024-01-01',
            'is_current' => true,
            'status' => 'actif',
        ]);

        $payload = [
            'id' => $activity->id,
            'member_id' => $member->id,
            'type' => 'mandat',
            'title' => 'Membre du Conseil de Discipline',
            'role' => 'Président du Conseil',
            'start_date' => '2024-01-01',
            'is_current' => '1',
            'status' => 'actif',
            'description' => 'Élu à l\'unanimité des voix.',
        ];

        $response = $this->actingAs($admin)->post('/admin/member-associative-activities', $payload);

        $response->assertStatus(302);

        $this->assertDatabaseHas('member_associative_activities', [
            'id' => $activity->id,
            'role' => 'Président du Conseil',
            'description' => 'Élu à l\'unanimité des voix.',
        ]);
    }

    public function test_admin_can_delete_associative_activity(): void
    {
        $admin = User::factory()->create();

        $member = Member::create([
            'id' => 'mem-test-03',
            'name' => 'Me Christian Koffi',
            'role' => 'Juriste Conseil',
            'organization' => 'Cabinet Lex',
            'category' => 'Membres Adhérents',
        ]);

        $activity = MemberAssociativeActivity::create([
            'member_id' => $member->id,
            'type' => 'distinction',
            'title' => 'Médaille d\'Honneur de l\'Association',
            'role' => 'Récipiendaire',
            'start_date' => '2024-12-15',
            'is_current' => true,
            'status' => 'honoraire',
        ]);

        $response = $this->actingAs($admin)->delete("/admin/member-associative-activities/{$activity->id}");

        $response->assertStatus(302);

        $this->assertDatabaseMissing('member_associative_activities', [
            'id' => $activity->id,
        ]);
    }
}
