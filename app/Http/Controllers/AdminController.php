<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Article;
use App\Models\DisputeCase;
use App\Models\DisputeOfficer;
use App\Models\LegalText;
use App\Models\Member;
use App\Models\MemberAssociativeActivity;
use App\Models\MemberCase;
use App\Models\MemberCaseDocument;
use App\Models\MemberCaseEvent;
use App\Models\MembershipApplication;
use App\Models\Project;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{
    public static function getDefaultDisputeStages()
    {
        return [
            [
                'id' => 'stage-1',
                'key' => 'conciliation',
                'stepNumber' => 'Étape 1',
                'title' => 'Étape 1 : La Conciliation Interne',
                'subtitle' => 'Prévention et négociation amiable directe',
                'description' => "La conciliation interne constitue le premier degré de résolution des différends au sein de l'institution. Guidée par un conciliateur impartial désigné par la Commission de Déontologie, elle vise à restaurer le dialogue et à formaliser un accord transactionnel confidentiel sans recours aux tribunals.",
                'legalBasis' => 'Article 12 du Règlement Intérieur - Charte de Conciliation 2024',
                'confidentiality' => 'Confidentialité absolue garantie par l\'article 226-13 du Code Pénal',
                'officersTitle' => 'Les Conciliateurs Assermentés',
                'keyMetrics' => [
                    ['label' => "Taux d'accord amiable", 'value' => '82%'],
                    ['label' => 'Délai moyen de traitement', 'value' => '18 jours'],
                    ['label' => 'Conciliateurs assermentés', 'value' => '8 juristes'],
                ],
            ],
            [
                'id' => 'stage-2',
                'key' => 'mediation',
                'stepNumber' => 'Étape 2',
                'title' => 'Étape 2 : La Médiation Institutionnalisée',
                'subtitle' => 'Accompagnement méthodique par un tiers neutre et qualifié',
                'description' => "Lorsque la conciliation n'aboutit pas ou pour des litiges d'une complexité statutaire supérieure, la médiation intervient. Le médiateur indépendant aide les parties à dégager une solution mutuellement acceptable en s'appuyant sur les principes d'équité et de bonne foi.",
                'legalBasis' => "Articles 21 à 25 de la Charte d'Éthique & Ordonnance n° 2011-1540",
                'confidentiality' => 'Secret professionnel renforcé & Inopposabilité des échanges',
                'officersTitle' => 'Les Médiateurs Certifiés',
                'keyMetrics' => [
                    ['label' => 'Médiations réussies', 'value' => '75%'],
                    ['label' => 'Durée moyenne', 'value' => '35 jours'],
                    ['label' => 'Médiateurs certifiés', 'value' => '6 experts'],
                ],
            ],
            [
                'id' => 'stage-3',
                'key' => 'arbitrage',
                'stepNumber' => 'Étape 3',
                'title' => "Étape 3 : L'Arbitrage Interne & Tribunal Arbitral",
                'subtitle' => 'Juridiction arbitrale privée à sentence exécutoire',
                'description' => "L'arbitrage interne est l'ultime instance contentieuse propre à l'institution. Un collège d'arbitres indépendants instruit le dossier sous le sceau du secret, entend les parties et rend une sentence arbitrale ayant autorité de la chose jugée.",
                'legalBasis' => "Code de Procédure Civile (Livre IV) & Règlement d'Arbitrage Inst. Art. 40",
                'confidentiality' => 'Sentence confidentielle ou publique sur demande expresse des parties',
                'officersTitle' => 'Les Arbitres Titulaires',
                'keyMetrics' => [
                    ['label' => 'Sentences rendues', 'value' => '100% exécutoires'],
                    ['label' => 'Délai moyen de sentence', 'value' => '65 jours'],
                    ['label' => 'Arbitres titulaires', 'value' => '5 magistrats'],
                ],
            ],
        ];
    }

    public static function getDefaultPaymentAccounts(): array
    {
        return [
            [
                'id' => 'virement',
                'type' => 'bank',
                'name' => 'Virement Bancaire (Compte Institutionnel)',
                'bank_name' => 'Société Générale (SGCI)',
                'account_holder' => 'Association Droit & Justice',
                'account_number' => 'CI092 01001 00293848201 45',
                'iban' => 'CI092 01001 00293848201 45',
                'swift' => 'SGCICIAB',
                'instructions' => 'Indiquez votre nom et prénom en libellé ou référence du virement bancaire.',
                'active' => true,
            ],
            [
                'id' => 'wave',
                'type' => 'mobile',
                'name' => 'Wave Côte d\'Ivoire',
                'account_holder' => 'Association Droit & Justice',
                'phone_number' => '+225 07 00 00 00 01',
                'instructions' => 'Effectuez le transfert vers ce numéro Wave, puis reportez le code de transaction reçu.',
                'active' => true,
            ],
            [
                'id' => 'orange_money',
                'type' => 'mobile',
                'name' => 'Orange Money (OM)',
                'account_holder' => 'Association Droit & Justice',
                'phone_number' => '+225 07 00 00 00 02',
                'instructions' => 'Envoyez le paiement via Orange Money et conservez le numéro d\'ID de transaction SMS.',
                'active' => true,
            ],
            [
                'id' => 'mtn_momo',
                'type' => 'mobile',
                'name' => 'MTN Mobile Money (MoMo)',
                'account_holder' => 'Association Droit & Justice',
                'phone_number' => '+225 05 00 00 00 03',
                'instructions' => 'Transférez la cotisation via MTN MoMo et saisissez l\'ID de versement généré.',
                'active' => true,
            ],
            [
                'id' => 'moov_money',
                'type' => 'mobile',
                'name' => 'Moov Money (Flooz)',
                'account_holder' => 'Association Droit & Justice',
                'phone_number' => '+225 01 00 00 00 04',
                'instructions' => 'Réglez via MoMo Flooz et notez la référence de validation transmise par SMS.',
                'active' => true,
            ],
        ];
    }

    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'articles' => Article::orderBy('created_at', 'desc')->get(),
            'members' => Member::with(['cases.documents', 'cases.events', 'associativeActivities'])->get(),
            'applications' => MembershipApplication::with(['cases.documents', 'cases.events', 'associativeActivities'])->orderBy('created_at', 'desc')->get(),
            'memberCases' => MemberCase::with(['member', 'documents', 'events'])->orderBy('created_at', 'desc')->get(),
            'memberAssociativeActivities' => MemberAssociativeActivity::with(['member', 'application'])->orderBy('start_date', 'desc')->get(),
            'projects' => Project::all(),
            'activities' => Activity::all(),
            'legalTexts' => LegalText::all(),
            'disputeOfficers' => DisputeOfficer::all(),
            'disputeCases' => DisputeCase::orderBy('created_at', 'desc')->get(),
            'disputeStages' => SiteSetting::getByKey('dispute_stages', self::getDefaultDisputeStages()),
            'memberCategories' => SiteSetting::getByKey('member_categories', []),
            'articleCategories' => SiteSetting::getByKey('article_categories', [
                ['id' => 'artcat-1', 'name' => 'Doctrine', 'nameEn' => 'Doctrine'],
                ['id' => 'artcat-2', 'name' => 'Jurisprudence', 'nameEn' => 'Case Law'],
                ['id' => 'artcat-3', 'name' => 'Libertés Fondamentales', 'nameEn' => 'Fundamental Freedoms'],
                ['id' => 'artcat-4', 'name' => 'Droit & Numérique', 'nameEn' => 'Digital & Law'],
                ['id' => 'artcat-5', 'name' => 'Actualités Institutionnelles', 'nameEn' => 'Institutional News'],
            ]),
            'settings' => [
                'hero_title' => SiteSetting::getByKey('hero_title', ''),
                'hero_subtitle' => SiteSetting::getByKey('hero_subtitle', ''),
                'about_mission' => SiteSetting::getByKey('about_mission', ''),
                'contact_email' => SiteSetting::getByKey('contact_email', ''),
                'contact_phone' => SiteSetting::getByKey('contact_phone', ''),
                'contact_address' => SiteSetting::getByKey('contact_address', ''),
            ],
            'contactConfig' => [
                'departments' => SiteSetting::getByKey('contact_departments', []),
                'faqs' => SiteSetting::getByKey('contact_faqs', []),
            ],
            'membershipTiers' => SiteSetting::getByKey('membership_tiers', []),
            'paymentAccounts' => SiteSetting::getByKey('payment_accounts', self::getDefaultPaymentAccounts()),
        ]);
    }

    // --- Articles ---
    public function saveArticle(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'title' => 'required|string',
            'category' => 'required|string',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'author_name' => 'required|string',
            'author_role' => 'nullable|string',
            'read_time' => 'nullable|string',
            'image_url' => 'nullable|string',
            'tags' => 'nullable|array',
        ]);

        $id = ! empty($data['id']) ? $data['id'] : ('art-'.Str::random(8));
        $data['id'] = $id;
        $data['slug'] = Str::slug($data['title']);
        $data['published_at'] = $data['published_at'] ?? now()->translatedFormat('d F Y');

        Article::updateOrCreate(['id' => $id], $data);

        return redirect()->back()->with('message', 'Article enregistré avec succès.');
    }

    public function deleteArticle($id)
    {
        Article::where('id', $id)->delete();

        return redirect()->back()->with('message', 'Article supprimé.');
    }

    public function saveArticleCategories(Request $request)
    {
        $categories = $request->input('categories', []);
        SiteSetting::setByKey('article_categories', $categories);

        return redirect()->back()->with('message', 'Catégories d\'articles enregistrées.');
    }

    // --- Members ---
    public function saveMember(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'name' => 'required|string',
            'role' => 'required|string',
            'organization' => 'nullable|string',
            'category' => 'required|string',
            'subcategory' => 'nullable|string',
            'bio' => 'nullable|string',
            'avatar_url' => 'nullable|string',
            'specialties' => 'nullable|array',
            'email' => 'nullable|string',
            'joined_year' => 'nullable|integer',
        ]);

        $id = ! empty($data['id']) ? $data['id'] : ('mem-'.Str::random(8));
        $data['id'] = $id;
        Member::updateOrCreate(['id' => $id], $data);

        return redirect()->back()->with('message', 'Membre enregistré.');
    }

    public function deleteMember($id)
    {
        Member::where('id', $id)->delete();

        return redirect()->back()->with('message', 'Membre supprimé.');
    }

    public function saveMemberCategories(Request $request)
    {
        $categories = $request->input('categories', []);
        SiteSetting::setByKey('member_categories', $categories);

        return redirect()->back()->with('message', 'Catégories et sous-catégories de membres enregistrées.');
    }

    // --- Membership Applications ---
    public function approveApplication(Request $request, $id)
    {
        $application = MembershipApplication::where('id', $id)->firstOrFail();

        $createMember = $request->boolean('create_member', true);
        $category = $request->input('category', 'Membres Titulaires');
        $subcategory = $request->input('subcategory');

        if ($request->filled('cni')) {
            $application->cni = $request->input('cni');
        }
        if ($request->filled('cni_url')) {
            $application->cni_url = $request->input('cni_url');
        }
        if ($request->filled('avatar_url')) {
            $application->avatar_url = $request->input('avatar_url');
        }

        if ($createMember && ! $application->member_id) {
            $memberId = 'mem-'.Str::random(8);
            $fullName = trim(($application->civility ? $application->civility.' ' : '').$application->first_name.' '.$application->last_name);

            Member::create([
                'id' => $memberId,
                'name' => $fullName,
                'role' => $application->profession ?: 'Membre Adhérent',
                'profession' => $application->profession ?: 'Membre Adhérent',
                'organization' => $application->institution ?: 'Membre Indépendant',
                'city' => $application->locality ?: ($application->country ?: 'Paris'),
                'category' => $category,
                'subcategory' => $subcategory,
                'bio' => $application->motivation,
                'email' => $application->email,
                'avatar_url' => $application->avatar_url,
                'joined_year' => (int) date('Y'),
                'publication_count' => 0,
            ]);

            $application->member_id = $memberId;
        } elseif ($application->member_id && $createMember) {
            $existingMember = Member::where('id', $application->member_id)->first();
            if ($existingMember) {
                $existingMember->update([
                    'category' => $category,
                    'subcategory' => $subcategory,
                    'role' => $application->profession ?: $existingMember->role,
                    'profession' => $application->profession ?: $existingMember->profession,
                    'organization' => $application->institution ?: $existingMember->organization,
                    'city' => $application->locality ?: ($application->country ?: $existingMember->city),
                    'avatar_url' => $application->avatar_url ?: $existingMember->avatar_url,
                ]);
            }
        } elseif (! $createMember && $application->member_id) {
            Member::where('id', $application->member_id)->delete();
            $application->member_id = null;
        }

        $application->status = 'approved';
        $application->reviewed_at = now();
        if ($application->payment_status !== 'verified') {
            $application->payment_status = 'verified';
            $application->payment_verified_at = now();
        }
        if ($request->has('admin_notes')) {
            $application->admin_notes = $request->input('admin_notes');
        }
        $application->save();

        return redirect()->back()->with('message', 'Affectation et profil du membre enregistrés avec succès.');
    }

    public function rejectApplication(Request $request, $id)
    {
        $application = MembershipApplication::where('id', $id)->firstOrFail();
        $application->status = 'rejected';
        $application->reviewed_at = now();
        if ($request->filled('admin_notes')) {
            $application->admin_notes = $request->input('admin_notes');
        }
        $application->save();

        return redirect()->back()->with('message', 'La candidature a été marquée comme rejetée.');
    }

    public function deleteApplication($id)
    {
        MembershipApplication::where('id', $id)->delete();

        return redirect()->back()->with('message', 'Dossier de candidature supprimé définitivement.');
    }

    public function updateApplicationNote(Request $request, $id)
    {
        $application = MembershipApplication::where('id', $id)->firstOrFail();
        $application->admin_notes = $request->input('admin_notes');
        $application->save();

        return redirect()->back()->with('message', 'Note interne mise à jour.');
    }

    public function updateApplicationAdminFields(Request $request, $id)
    {
        $application = MembershipApplication::where('id', $id)->firstOrFail();

        $validated = $request->validate([
            'cni' => 'nullable|string|max:100',
            'cni_url' => 'nullable|string',
            'avatar_url' => 'nullable|string',
            'payment_method' => 'nullable|string|max:100',
            'payment_reference' => 'nullable|string|max:150',
            'payment_receipt_url' => 'nullable|string',
            'payment_status' => 'nullable|string|in:pending,verified,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        if ($request->has('cni')) {
            $application->cni = $validated['cni'] ?? null;
        }
        if ($request->has('cni_url')) {
            $application->cni_url = $validated['cni_url'] ?? null;
        }
        if ($request->has('avatar_url')) {
            $application->avatar_url = $validated['avatar_url'] ?? null;
        }
        if ($request->has('payment_method')) {
            $application->payment_method = $validated['payment_method'] ?? null;
        }
        if ($request->has('payment_reference')) {
            $application->payment_reference = $validated['payment_reference'] ?? null;
        }
        if ($request->has('payment_receipt_url')) {
            $application->payment_receipt_url = $validated['payment_receipt_url'] ?? null;
        }
        if ($request->has('payment_status')) {
            $application->payment_status = $validated['payment_status'] ?? 'pending';
            $application->payment_verified_at = ($application->payment_status === 'verified') ? now() : null;
        }
        if ($request->has('admin_notes')) {
            $application->admin_notes = $validated['admin_notes'] ?? null;
        }

        $application->save();

        if ($application->member_id && $application->avatar_url) {
            Member::where('id', $application->member_id)->update([
                'avatar_url' => $application->avatar_url,
            ]);
        }

        return redirect()->back()->with('message', 'Informations administratives (CNI, photo et versement) enregistrées.');
    }

    public function verifyPayment(Request $request, $id)
    {
        $application = MembershipApplication::where('id', $id)->firstOrFail();
        $status = $request->input('payment_status', 'verified');

        $application->payment_status = $status;
        $application->payment_verified_at = ($status === 'verified') ? now() : null;

        if ($request->filled('payment_reference')) {
            $application->payment_reference = $request->input('payment_reference');
        }
        if ($request->filled('payment_method')) {
            $application->payment_method = $request->input('payment_method');
        }
        if ($request->filled('admin_notes')) {
            $application->admin_notes = $request->input('admin_notes');
        }

        $application->save();

        $msg = match ($status) {
            'verified' => 'Versement vérifié et confirmé avec succès.',
            'rejected' => 'Versement marqué comme invalide ou rejeté.',
            default => 'Statut du versement remis en attente de vérification.',
        };

        return redirect()->back()->with('message', $msg);
    }

    // --- Member Cases (Fiche du Membre & Gestion des Affaires) ---
    public function saveMemberCase(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'member_id' => 'required|string|exists:members,id',
            'membership_application_id' => 'nullable|string',
            'case_number' => 'nullable|string',
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'jurisdiction' => 'nullable|string|max:150',
            'opposing_party' => 'nullable|string|max:150',
            'status' => 'required|string|in:en_cours,renvoyee,delibere,jugement_rendu,cloturee,archivee',
            'hearing_date' => 'nullable|date',
            'hearing_reason' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'opened_at' => 'nullable|date',
            'closed_at' => 'nullable|date',
            'document_title' => 'nullable|string|max:255',
            'document_file' => 'nullable|file|max:25600',
        ]);

        $isNew = empty($data['id']);
        $id = ! empty($data['id']) ? $data['id'] : ('case-'.Str::random(10));
        $data['id'] = $id;

        if (empty($data['case_number'])) {
            $year = date('Y');
            $count = MemberCase::whereYear('created_at', $year)->count() + 1;
            $data['case_number'] = sprintf('AFF-%s-%04d', $year, $count);
        }

        if (empty($data['opened_at'])) {
            $data['opened_at'] = now()->toDateString();
        }

        if ($data['status'] === 'cloturee' && empty($data['closed_at'])) {
            $data['closed_at'] = now()->toDateString();
        }

        $documentFile = $request->file('document_file');
        $documentTitle = $request->input('document_title');
        unset($data['document_file'], $data['document_title']);

        $case = MemberCase::updateOrCreate(['id' => $id], $data);

        // Record event in timeline if postponed/hearing date or if newly created
        if (! empty($data['hearing_date']) || $data['status'] === 'renvoyee') {
            MemberCaseEvent::create([
                'id' => 'ev-'.Str::random(10),
                'member_case_id' => $id,
                'event_date' => now()->toDateString(),
                'status' => $data['status'],
                'next_hearing_date' => $data['hearing_date'] ?? null,
                'reason' => $data['hearing_reason'] ?? null,
                'notes' => $isNew ? 'Création de l\'affaire avec première audience / renvoi' : 'Mise à jour de l\'audience',
            ]);
        } elseif ($isNew) {
            MemberCaseEvent::create([
                'id' => 'ev-'.Str::random(10),
                'member_case_id' => $id,
                'event_date' => now()->toDateString(),
                'status' => $data['status'],
                'next_hearing_date' => null,
                'reason' => null,
                'notes' => 'Ouverture du dossier d\'affaire',
            ]);
        }

        // Attach document if provided
        if ($documentFile) {
            $ext = $documentFile->getClientOriginalExtension();
            $origName = $documentFile->getClientOriginalName();
            $path = $documentFile->store('member_cases/'.$id, 'public');

            MemberCaseDocument::create([
                'id' => 'doc-'.Str::random(10),
                'member_case_id' => $id,
                'title' => $documentTitle ?: pathinfo($origName, PATHINFO_FILENAME),
                'file_path' => Storage::url($path),
                'file_name' => $origName,
                'file_type' => strtolower($ext),
                'file_size' => $documentFile->getSize(),
            ]);
        }

        return redirect()->back()->with('message', 'Affaire enregistrée avec succès.');
    }

    public function updateMemberCaseStatus(Request $request, $id)
    {
        $case = MemberCase::where('id', $id)->firstOrFail();

        $validated = $request->validate([
            'status' => 'required|string|in:en_cours,renvoyee,delibere,jugement_rendu,cloturee,archivee',
            'hearing_date' => 'nullable|date',
            'hearing_reason' => 'nullable|string|max:255',
            'event_notes' => 'nullable|string',
        ]);

        $oldStatus = $case->status;
        $case->status = $validated['status'];
        $case->hearing_date = $validated['hearing_date'] ?? null;
        $case->hearing_reason = $validated['hearing_reason'] ?? null;

        if ($validated['status'] === 'cloturee' && empty($case->closed_at)) {
            $case->closed_at = now()->toDateString();
        }

        $case->save();

        // Add to timeline
        MemberCaseEvent::create([
            'id' => 'ev-'.Str::random(10),
            'member_case_id' => $id,
            'event_date' => now()->toDateString(),
            'status' => $validated['status'],
            'next_hearing_date' => $validated['hearing_date'] ?? null,
            'reason' => $validated['hearing_reason'] ?? null,
            'notes' => $validated['event_notes'] ?? sprintf('Changement d\'état du dossier : %s → %s', $oldStatus, $validated['status']),
        ]);

        return redirect()->back()->with('message', 'Statut du dossier mis à jour avec succès.');
    }

    public function uploadMemberCaseDocument(Request $request, $caseId)
    {
        $case = MemberCase::where('id', $caseId)->firstOrFail();

        $request->validate([
            'title' => 'required|string|max:255',
            'document' => 'required|file|max:25600',
        ]);

        $file = $request->file('document');
        $ext = $file->getClientOriginalExtension();
        $origName = $file->getClientOriginalName();
        $path = $file->store('member_cases/'.$caseId, 'public');

        MemberCaseDocument::create([
            'id' => 'doc-'.Str::random(10),
            'member_case_id' => $caseId,
            'title' => $request->input('title'),
            'file_path' => Storage::url($path),
            'file_name' => $origName,
            'file_type' => strtolower($ext),
            'file_size' => $file->getSize(),
        ]);

        return redirect()->back()->with('message', 'Document ajouté avec succès au dossier de l\'affaire.');
    }

    public function deleteMemberCaseDocument($id)
    {
        $doc = MemberCaseDocument::where('id', $id)->firstOrFail();

        $relative = str_replace('/storage/', '', $doc->file_path);
        Storage::disk('public')->delete($relative);

        $doc->delete();

        return redirect()->back()->with('message', 'Document supprimé.');
    }

    public function deleteMemberCase($id)
    {
        $case = MemberCase::where('id', $id)->firstOrFail();

        Storage::disk('public')->deleteDirectory('member_cases/'.$id);
        $case->delete();

        return redirect()->back()->with('message', 'Affaire supprimée définitivement.');
    }

    // --- Member Associative Life & Activities ---
    public function saveMemberAssociativeActivity(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'member_id' => 'nullable|string',
            'membership_application_id' => 'nullable|string',
            'type' => 'required|string|in:mandat,commission,evenement,mission,distinction',
            'title' => 'required|string|max:255',
            'role' => 'nullable|string|max:150',
            'organization_unit' => 'nullable|string|max:150',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_current' => 'nullable|boolean',
            'status' => 'required|string|in:actif,termine,honoraire',
            'description' => 'nullable|string',
            'document_file' => 'nullable|file|max:25600',
        ]);

        $id = ! empty($data['id']) ? $data['id'] : ('assoc-'.Str::random(10));
        $data['id'] = $id;
        $data['is_current'] = $request->boolean('is_current', true);

        $docFile = $request->file('document_file');
        unset($data['document_file']);

        if ($docFile) {
            $origName = $docFile->getClientOriginalName();
            $path = $docFile->store('member_associative/'.$id, 'public');
            $data['document_url'] = Storage::url($path);
            $data['document_name'] = $origName;
        }

        MemberAssociativeActivity::updateOrCreate(['id' => $id], $data);

        return redirect()->back()->with('message', 'Activité associative enregistrée avec succès.');
    }

    public function deleteMemberAssociativeActivity($id)
    {
        $activity = MemberAssociativeActivity::where('id', $id)->firstOrFail();
        if ($activity->document_url) {
            $relative = str_replace('/storage/', '', $activity->document_url);
            Storage::disk('public')->delete($relative);
        }
        $activity->delete();

        return redirect()->back()->with('message', 'Activité associative supprimée.');
    }

    // --- Projects ---
    public function saveProject(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'title' => 'required|string',
            'category' => 'required|string',
            'status' => 'required|string',
            'description' => 'required|string',
            'lead' => 'nullable|string',
            'start_date' => 'nullable|string',
            'target_date' => 'nullable|string',
            'progress' => 'nullable|integer',
            'deliverables' => 'nullable|array',
        ]);

        $id = ! empty($data['id']) ? $data['id'] : ('proj-'.Str::random(8));
        $data['id'] = $id;
        Project::updateOrCreate(['id' => $id], $data);

        return redirect()->back()->with('message', 'Projet enregistré.');
    }

    public function deleteProject($id)
    {
        Project::where('id', $id)->delete();

        return redirect()->back()->with('message', 'Projet supprimé.');
    }

    // --- Activities ---
    public function saveActivity(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'title' => 'required|string',
            'type' => 'required|string',
            'status' => 'required|string',
            'date' => 'nullable|string',
            'location' => 'nullable|string',
            'description' => 'required|string',
            'speakers' => 'nullable|array',
            'registration_link' => 'nullable|string',
        ]);

        $id = ! empty($data['id']) ? $data['id'] : ('act-'.Str::random(8));
        $data['id'] = $id;
        Activity::updateOrCreate(['id' => $id], $data);

        return redirect()->back()->with('message', 'Activité enregistrée.');
    }

    public function deleteActivity($id)
    {
        Activity::where('id', $id)->delete();

        return redirect()->back()->with('message', 'Activité supprimée.');
    }

    // --- Legal Texts ---
    public function saveLegalText(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'title' => 'required|string',
            'titleEn' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'subtitleEn' => 'nullable|string',
            'reference' => 'nullable|string',
            'referenceEn' => 'nullable|string',
            'category' => 'nullable|string',
            'date' => 'nullable|string',
            'dateEn' => 'nullable|string',
            'summary' => 'nullable|string',
            'full_text' => 'nullable|string',
            'pdf_url' => 'nullable|string',
            'sections' => 'nullable',
        ]);

        $id = ! empty($data['id']) ? $data['id'] : ('text-'.Str::random(8));
        $data['id'] = $id;

        if (isset($data['sections']) && is_string($data['sections'])) {
            $data['sections'] = json_decode($data['sections'], true);
        }

        LegalText::updateOrCreate(['id' => $id], $data);

        return redirect()->back()->with('message', 'Texte juridique enregistré.');
    }

    public function deleteLegalText($id)
    {
        LegalText::where('id', $id)->delete();

        return redirect()->back()->with('message', 'Texte supprimé.');
    }

    // --- Dispute Officers ---
    public function saveDisputeOfficer(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'name' => 'required|string',
            'title' => 'required|string',
            'role' => 'required|string',
            'stage' => 'required|string',
            'category' => 'required|string',
            'specialties' => 'nullable',
            'experience_years' => 'nullable|integer',
            'cases_handled' => 'nullable|integer',
            'avatar_url' => 'nullable|string',
            'email' => 'nullable|string',
            'availability' => 'nullable|string',
        ]);

        if (is_string($data['specialties'] ?? null)) {
            $data['specialties'] = array_filter(array_map('trim', explode(',', $data['specialties'])));
        }

        $id = ! empty($data['id']) ? $data['id'] : ('off-'.Str::random(8));
        $data['id'] = $id;
        DisputeOfficer::updateOrCreate(['id' => $id], $data);

        return redirect()->back()->with('message', 'Officiel de litiges enregistré.');
    }

    public function deleteDisputeOfficer($id)
    {
        DisputeOfficer::where('id', $id)->delete();

        return redirect()->back()->with('message', 'Officiel supprimé.');
    }

    // --- Dispute Cases ---
    public function saveDisputeCase(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'case_number' => 'required|string',
            'title' => 'required|string',
            'category' => 'required|string',
            'stage' => 'required|string',
            'is_public' => 'required|boolean',
            'status' => 'required|string',
            'date_submitted' => 'nullable|string',
            'summary' => 'required|string',
            'parties' => 'nullable|string',
            'assigned_officer' => 'nullable|string',
            'confidentiality_note' => 'nullable|string',
            'resolution_timeframe' => 'nullable|string',
        ]);

        $id = ! empty($data['id']) ? $data['id'] : ('case-'.Str::random(8));
        $data['id'] = $id;
        DisputeCase::updateOrCreate(['id' => $id], $data);

        return redirect()->back()->with('message', 'Affaire de litige enregistrée.');
    }

    public function deleteDisputeCase($id)
    {
        DisputeCase::where('id', $id)->delete();

        return redirect()->back()->with('message', 'Affaire supprimée.');
    }

    public function saveDisputeStages(Request $request)
    {
        $stages = $request->input('stages', []);
        SiteSetting::setByKey('dispute_stages', $stages);

        return redirect()->back()->with('message', 'Étapes des litiges internes enregistrées.');
    }

    // --- Settings ---
    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'hero_title' => 'nullable|string',
            'hero_subtitle' => 'nullable|string',
            'about_mission' => 'nullable|string',
            'contact_email' => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_address' => 'nullable|string',
        ]);

        foreach ($data as $key => $val) {
            SiteSetting::setByKey($key, $val);
        }

        return redirect()->back()->with('message', 'Paramètres du site mis à jour.');
    }

    public function saveContactConfig(Request $request)
    {
        if ($request->has('departments')) {
            SiteSetting::setByKey('contact_departments', $request->input('departments'));
        }
        if ($request->has('faqs')) {
            SiteSetting::setByKey('contact_faqs', $request->input('faqs'));
        }

        return redirect()->back()->with('message', 'Configuration de la page Contact mise à jour.');
    }

    public function saveMembershipTiers(Request $request)
    {
        $request->validate([
            'tiers' => 'required|array',
        ]);

        SiteSetting::setByKey('membership_tiers', $request->input('tiers'));

        return redirect()->back()->with('message', 'Statuts des membres mis à jour avec succès.');
    }

    public function savePaymentAccounts(Request $request)
    {
        $request->validate([
            'payment_accounts' => 'required|array',
        ]);

        SiteSetting::setByKey('payment_accounts', $request->input('payment_accounts'));

        return redirect()->back()->with('message', 'Comptes et coordonnées de paiement mis à jour avec succès.');
    }
}
