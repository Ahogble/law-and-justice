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
            ],
        ]);
    }
}
