<?php

namespace Tests\Feature;

use App\Models\MembershipApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MembershipApplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_candidate_can_submit_membership_application(): void
    {
        $payload = [
            'civility' => 'M.',
            'first_name' => 'Antonin',
            'last_name' => 'Dubois',
            'birth_date' => '1990-05-15',
            'birth_place' => 'Lyon',
            'marital_status' => 'Marié(e)',
            'address' => '14 rue de la République',
            'country' => 'France',
            'region' => 'Auvergne-Rhône-Alpes',
            'department' => 'Rhône',
            'locality' => 'Lyon',
            'email' => 'antonin.dubois@avocat.fr',
            'phone' => '+33 6 12 34 56 78',
            'profession' => 'Avocat au Barreau',
            'institution' => 'Barreau de Lyon',
            'motivation' => 'Je souhaite contribuer aux travaux sur le droit et le numérique.',
            'tier_id' => 'titular',
            'tier_name' => 'Membre Titulaire',
            'tier_price' => 150,
        ];

        $response = $this->postJson('/membership-applications', $payload);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('membership_applications', [
            'civility' => 'M.',
            'first_name' => 'Antonin',
            'last_name' => 'Dubois',
            'birth_date' => '1990-05-15 00:00:00',
            'birth_place' => 'Lyon',
            'marital_status' => 'Marié(e)',
            'address' => '14 rue de la République',
            'country' => 'France',
            'region' => 'Auvergne-Rhône-Alpes',
            'department' => 'Rhône',
            'locality' => 'Lyon',
            'email' => 'antonin.dubois@avocat.fr',
            'status' => 'pending',
            'tier_name' => 'Membre Titulaire',
        ]);
    }

    public function test_candidate_can_submit_membership_application_without_email_and_with_secondary_phones(): void
    {
        $payload = [
            'civility' => 'Mme',
            'first_name' => 'Aminata',
            'last_name' => 'Traoré',
            'phone' => '+225 07 11 22 33 44',
            'whatsapp' => '+225 05 22 33 44 55',
            'secondary_phone' => '+225 01 33 44 55 66',
            'email' => null,
            'profession' => 'Magistrate',
            'tier_name' => 'Membre Titulaire',
            'tier_price' => 150,
        ];

        $response = $this->postJson('/membership-applications', $payload);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('membership_applications', [
            'first_name' => 'Aminata',
            'last_name' => 'Traoré',
            'email' => null,
            'phone' => '+225 07 11 22 33 44',
            'whatsapp' => '+225 05 22 33 44 55',
            'secondary_phone' => '+225 01 33 44 55 66',
            'profession' => 'Magistrate',
        ]);
    }

    public function test_admin_can_approve_application_and_create_member(): void
    {
        $user = User::factory()->create();

        $application = MembershipApplication::create([
            'id' => 'cand-test1234',
            'application_number' => 'DJ-2026-9999',
            'tier_id' => 'titular',
            'tier_name' => 'Membre Titulaire',
            'tier_price' => 150,
            'civility' => 'Me',
            'first_name' => 'Claire',
            'last_name' => 'Fontaine',
            'email' => 'claire.fontaine@justice.fr',
            'profession' => 'Magistrate',
            'institution' => 'Cour d\'Appel',
            'motivation' => 'Engagement déontologique.',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->post("/admin/applications/{$application->id}/approve", [
            'category' => 'Conseil d\'Administration',
            'subcategory' => 'National',
            'create_member' => true,
            'admin_notes' => 'Approuvé lors de la session ordinaire.',
        ]);

        $response->assertRedirect();

        $application->refresh();
        $this->assertEquals('approved', $application->status);
        $this->assertNotNull($application->member_id);
        $this->assertNotNull($application->reviewed_at);

        $this->assertDatabaseHas('members', [
            'id' => $application->member_id,
            'name' => 'Me Claire Fontaine',
            'role' => 'Magistrate',
            'category' => 'Conseil d\'Administration',
            'email' => 'claire.fontaine@justice.fr',
        ]);
    }

    public function test_admin_can_update_cni_and_avatar_on_application(): void
    {
        $user = User::factory()->create();

        $application = MembershipApplication::create([
            'id' => 'cand-cni-test',
            'application_number' => 'DJ-2026-1111',
            'tier_name' => 'Membre Titulaire',
            'civility' => 'M.',
            'first_name' => 'Jean',
            'last_name' => 'Kouassi',
            'profession' => 'Avocat',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->post("/admin/applications/{$application->id}/admin-fields", [
            'cni' => 'CI-001928374',
            'avatar_url' => 'data:image/jpeg;base64,sampleimage',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('membership_applications', [
            'id' => 'cand-cni-test',
            'cni' => 'CI-001928374',
            'avatar_url' => 'data:image/jpeg;base64,sampleimage',
        ]);
    }

    public function test_admin_can_reject_application(): void
    {
        $user = User::factory()->create();

        $application = MembershipApplication::create([
            'id' => 'cand-reject123',
            'application_number' => 'DJ-2026-8888',
            'tier_name' => 'Membre Étudiant',
            'civility' => 'M.',
            'first_name' => 'Lucas',
            'last_name' => 'Moreau',
            'email' => 'lucas.moreau@univ.fr',
            'profession' => 'Étudiant',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->post("/admin/applications/{$application->id}/reject", [
            'admin_notes' => 'Dossier incomplet.',
        ]);

        $response->assertRedirect();

        $application->refresh();
        $this->assertEquals('rejected', $application->status);
        $this->assertEquals('Dossier incomplet.', $application->admin_notes);
        $this->assertNull($application->member_id);
    }

    public function test_admin_can_delete_application(): void
    {
        $user = User::factory()->create();

        $application = MembershipApplication::create([
            'id' => 'cand-delete123',
            'application_number' => 'DJ-2026-7777',
            'tier_name' => 'Membre Bienfaiteur',
            'civility' => 'Mme',
            'first_name' => 'Sophie',
            'last_name' => 'Bernard',
            'email' => 'sophie.bernard@cabinet.fr',
            'profession' => 'Notaire',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->delete("/admin/applications/{$application->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('membership_applications', [
            'id' => 'cand-delete123',
        ]);
    }

    public function test_candidate_can_submit_application_with_cni_avatar_and_payment_details(): void
    {
        $payload = [
            'civility' => 'M.',
            'first_name' => 'Kouamé',
            'last_name' => 'Koffi',
            'phone' => '+225 07 99 88 77 66',
            'profession' => 'Avocat',
            'tier_name' => 'Membre Titulaire',
            'tier_price' => 150000,
            'cni' => 'CI001928374',
            'cni_url' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            'avatar_url' => 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
            'payment_method' => 'Wave Côte d\'Ivoire',
            'payment_reference' => 'WAVE-TXN-902184',
            'payment_receipt_url' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        ];

        $response = $this->postJson('/membership-applications', $payload);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('membership_applications', [
            'first_name' => 'Kouamé',
            'last_name' => 'Koffi',
            'cni' => 'CI001928374',
            'payment_method' => 'Wave Côte d\'Ivoire',
            'payment_reference' => 'WAVE-TXN-902184',
            'payment_status' => 'pending',
        ]);
    }

    public function test_admin_can_update_application_cni_avatar_and_payment_fields(): void
    {
        $user = User::factory()->create();

        $application = MembershipApplication::create([
            'id' => 'cand-update-fields',
            'application_number' => 'DJ-2026-9999',
            'tier_name' => 'Membre Titulaire',
            'civility' => 'M.',
            'first_name' => 'Jean',
            'last_name' => 'Kouassi',
            'email' => 'jean.kouassi@test.ci',
            'profession' => 'Magistrat',
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);

        $response = $this->actingAs($user)->post("/admin/applications/{$application->id}/admin-fields", [
            'cni' => 'CI-NEW-123456',
            'cni_url' => 'data:image/png;base64,fake-cni-url',
            'avatar_url' => 'data:image/jpeg;base64,fake-avatar-url',
            'payment_method' => 'Virement SGCI',
            'payment_reference' => 'VIR-SGCI-8472',
            'payment_receipt_url' => 'data:image/png;base64,fake-receipt-url',
            'payment_status' => 'verified',
        ]);

        $response->assertRedirect();

        $application->refresh();
        $this->assertEquals('CI-NEW-123456', $application->cni);
        $this->assertEquals('data:image/png;base64,fake-cni-url', $application->cni_url);
        $this->assertEquals('data:image/jpeg;base64,fake-avatar-url', $application->avatar_url);
        $this->assertEquals('Virement SGCI', $application->payment_method);
        $this->assertEquals('VIR-SGCI-8472', $application->payment_reference);
        $this->assertEquals('verified', $application->payment_status);
        $this->assertNotNull($application->payment_verified_at);
    }

    public function test_admin_can_verify_payment_directly(): void
    {
        $user = User::factory()->create();

        $application = MembershipApplication::create([
            'id' => 'cand-verify-pay',
            'application_number' => 'DJ-2026-6666',
            'tier_name' => 'Membre Titulaire',
            'civility' => 'M.',
            'first_name' => 'Paul',
            'last_name' => 'Konan',
            'profession' => 'Avocat',
            'status' => 'pending',
            'payment_method' => 'Orange Money',
            'payment_reference' => 'OM-883921',
            'payment_status' => 'pending',
        ]);

        $response = $this->actingAs($user)->post("/admin/applications/{$application->id}/verify-payment", [
            'payment_status' => 'verified',
        ]);

        $response->assertRedirect();

        $application->refresh();
        $this->assertEquals('verified', $application->payment_status);
        $this->assertNotNull($application->payment_verified_at);
    }

    public function test_admin_can_save_payment_accounts(): void
    {
        $user = User::factory()->create();

        $accounts = [
            [
                'id' => 'acc-1',
                'type' => 'bank',
                'name' => 'Compte SGCI Principal',
                'bank_name' => 'SGCI',
                'account_holder' => 'Association Droit & Justice',
                'account_number' => 'CI034 000 000 00',
                'active' => true,
            ],
            [
                'id' => 'acc-2',
                'type' => 'mobile',
                'name' => 'Wave Trésorerie',
                'account_holder' => 'Association Droit & Justice',
                'phone_number' => '+225 07 00 00 00 00',
                'active' => true,
            ],
        ];

        $response = $this->actingAs($user)->post('/admin/payment-accounts', [
            'accounts' => $accounts,
        ]);

        $response->assertRedirect();
    }
}
