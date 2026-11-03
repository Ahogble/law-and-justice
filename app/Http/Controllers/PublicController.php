<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Article;
use App\Models\DisputeCase;
use App\Models\DisputeOfficer;
use App\Models\LegalText;
use App\Models\Member;
use App\Models\MembershipApplication;
use App\Models\Project;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function index()
    {
        return Inertia::render('App', [
            'initialArticles' => Article::orderBy('created_at', 'desc')->get(),
            'initialMembers' => Member::all(),
            'initialProjects' => Project::all(),
            'initialActivities' => Activity::all(),
            'initialLegalTexts' => LegalText::all(),
            'initialDisputeOfficers' => DisputeOfficer::all(),
            'initialDisputeCases' => DisputeCase::all(),
            'initialDisputeStages' => SiteSetting::getByKey('dispute_stages', AdminController::getDefaultDisputeStages()),
            'siteSettings' => [
                'hero_title' => SiteSetting::getByKey('hero_title', 'Promouvoir la Rigueur du Droit & les Exigences de la Justice'),
                'hero_subtitle' => SiteSetting::getByKey('hero_subtitle', 'Association indépendante réunissant juristes, universitaires, magistrats et avocats pour la défense de l’État de droit et l’évolution de la doctrine.'),
                'about_mission' => SiteSetting::getByKey('about_mission', 'Droit & Justice œuvre depuis plus de 20 ans pour l’excellence doctrinale, l’indépendance de la justice et l’accès effectif au droit pour tous.'),
                'contact_email' => SiteSetting::getByKey('contact_email', 'contact@droit-justice.asso.fr'),
                'contact_phone' => SiteSetting::getByKey('contact_phone', '+33 (0)1 42 68 55 00'),
                'contact_address' => SiteSetting::getByKey('contact_address', '12, place Dauphine - 75001 Paris'),
                'key_figures' => SiteSetting::getByKey('key_figures', []),
                'association_pillars' => SiteSetting::getByKey('association_pillars', []),
                'membership_tiers' => SiteSetting::getByKey('membership_tiers', []),
                'member_categories' => SiteSetting::getByKey('member_categories', []),
                'article_categories' => SiteSetting::getByKey('article_categories', [
                    ['id' => 'artcat-1', 'name' => 'Doctrine', 'nameEn' => 'Doctrine'],
                    ['id' => 'artcat-2', 'name' => 'Jurisprudence', 'nameEn' => 'Case Law'],
                    ['id' => 'artcat-3', 'name' => 'Libertés Fondamentales', 'nameEn' => 'Fundamental Freedoms'],
                    ['id' => 'artcat-4', 'name' => 'Droit & Numérique', 'nameEn' => 'Digital & Law'],
                    ['id' => 'artcat-5', 'name' => 'Actualités Institutionnelles', 'nameEn' => 'Institutional News'],
                ]),
                'contact_departments' => SiteSetting::getByKey('contact_departments', []),
                'contact_faqs' => SiteSetting::getByKey('contact_faqs', []),
                'payment_accounts' => SiteSetting::getByKey('payment_accounts', AdminController::getDefaultPaymentAccounts()),
            ],
        ]);
    }

    public function submitMembershipApplication(Request $request)
    {
        $validated = $request->validate([
            'civility' => 'nullable|string|max:20',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string|max:150',
            'marital_status' => 'nullable|string|max:50',
            'cni' => 'nullable|string|max:100',
            'cni_url' => 'nullable|string',
            'avatar_url' => 'nullable|string',
            'email' => 'nullable|email|max:150',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'secondary_phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:100',
            'region' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
            'locality' => 'nullable|string|max:150',
            'profession' => 'required|string|max:100',
            'institution' => 'nullable|string|max:150',
            'motivation' => 'nullable|string|max:3000',
            'tier_id' => 'nullable|string|max:50',
            'tier_name' => 'required|string|max:100',
            'tier_price' => 'nullable|numeric',
            'payment_method' => 'nullable|string|max:100',
            'payment_reference' => 'nullable|string|max:150',
            'payment_receipt_url' => 'nullable|string',
        ]);

        $year = date('Y');
        $randomNum = rand(1000, 9999);
        $appNumber = "DJ-{$year}-{$randomNum}";

        while (MembershipApplication::where('application_number', $appNumber)->exists()) {
            $randomNum = rand(1000, 9999);
            $appNumber = "DJ-{$year}-{$randomNum}";
        }

        $application = MembershipApplication::create([
            'id' => 'cand-'.Str::random(10),
            'application_number' => $appNumber,
            'tier_id' => $validated['tier_id'] ?? null,
            'tier_name' => $validated['tier_name'],
            'tier_price' => (int) ($validated['tier_price'] ?? 0),
            'civility' => $validated['civility'] ?? 'M.',
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'birth_date' => $validated['birth_date'] ?? null,
            'birth_place' => $validated['birth_place'] ?? null,
            'marital_status' => $validated['marital_status'] ?? null,
            'cni' => $validated['cni'] ?? null,
            'cni_url' => $validated['cni_url'] ?? null,
            'avatar_url' => $validated['avatar_url'] ?? null,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'whatsapp' => $validated['whatsapp'] ?? null,
            'secondary_phone' => $validated['secondary_phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'country' => $validated['country'] ?? null,
            'region' => $validated['region'] ?? null,
            'department' => $validated['department'] ?? null,
            'locality' => $validated['locality'] ?? null,
            'profession' => $validated['profession'],
            'institution' => $validated['institution'] ?? null,
            'motivation' => $validated['motivation'] ?? null,
            'payment_method' => $validated['payment_method'] ?? null,
            'payment_reference' => $validated['payment_reference'] ?? null,
            'payment_receipt_url' => $validated['payment_receipt_url'] ?? null,
            'payment_status' => 'pending',
            'status' => 'pending',
        ]);

        if ($request->wantsJson() || $request->isJson()) {
            return response()->json([
                'success' => true,
                'application' => $application,
                'memberNumber' => $appNumber,
                'message' => 'Votre candidature a été transmise avec succès au Bureau.',
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Votre candidature a été transmise avec succès au Bureau.',
            'memberNumber' => $appNumber,
        ]);
    }
}
