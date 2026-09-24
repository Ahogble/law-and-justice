<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Article;
use App\Models\DisputeCase;
use App\Models\DisputeOfficer;
use App\Models\LegalText;
use App\Models\Member;
use App\Models\Project;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
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

    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'articles' => Article::orderBy('created_at', 'desc')->get(),
            'members' => Member::all(),
            'projects' => Project::all(),
            'activities' => Activity::all(),
            'legalTexts' => LegalText::all(),
            'disputeOfficers' => DisputeOfficer::all(),
            'disputeCases' => DisputeCase::orderBy('created_at', 'desc')->get(),
            'disputeStages' => SiteSetting::getByKey('dispute_stages', self::getDefaultDisputeStages()),
            'memberCategories' => SiteSetting::getByKey('member_categories', []),
            'settings' => [
                'hero_title' => SiteSetting::getByKey('hero_title', ''),
                'hero_subtitle' => SiteSetting::getByKey('hero_subtitle', ''),
                'about_mission' => SiteSetting::getByKey('about_mission', ''),
                'contact_email' => SiteSetting::getByKey('contact_email', ''),
                'contact_phone' => SiteSetting::getByKey('contact_phone', ''),
                'contact_address' => SiteSetting::getByKey('contact_address', ''),
            ],
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
            'reference' => 'nullable|string',
            'category' => 'required|string',
            'date' => 'nullable|string',
            'summary' => 'required|string',
            'full_text' => 'nullable|string',
            'pdf_url' => 'nullable|string',
        ]);

        $id = ! empty($data['id']) ? $data['id'] : ('text-'.Str::random(8));
        $data['id'] = $id;
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
}
