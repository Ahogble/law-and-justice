<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Article;
use App\Models\DisputeCase;
use App\Models\DisputeOfficer;
use App\Models\LegalText;
use App\Models\Member;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@droit-justice.asso.fr'],
            [
                'name' => 'Administrateur Droit & Justice',
                'password' => Hash::make('Admin2026!'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Members
        $members = [
            [
                'id' => 'm1',
                'name' => 'Hélène de Saint-Maur',
                'role' => 'Présidente de l’Association & Avocate au Barreau de Paris',
                'organization' => 'Cabinet Saint-Maur & Associés / Ancienne Membre du CNB',
                'category' => 'Conseil d\'Administration',
                'subcategory' => 'National',
                'bio' => 'Ancienne Secrétaire de la Conférence et spécialiste reconnue en libertés publiques et contentieux constitutionnel. Hélène préside Droit & Justice depuis 2021 avec la volonté d’ancrer le débat juridique au cœur de la cité.',
                'avatar_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
                'specialties' => ['Droit Constitutionnel', 'Libertés Publiques', 'Contentieux Stratégique'],
                'publication_count' => 24,
                'email' => 'h.desaintmaur@droit-justice.asso.fr',
                'joined_year' => 2018,
            ],
            [
                'id' => 'm2',
                'name' => 'Prof. Jean-Marc Vallery',
                'role' => 'Vice-Président & Professeur émérite de Droit Privé',
                'organization' => 'Université Paris-Panthéon-Assas',
                'category' => 'Universitaire',
                'subcategory' => 'Droit Privé',
                'bio' => 'Auteur de traités de référence sur la responsabilité civile et l’obligation contractuelle, il préside le Comité Scientifique de Droit & Justice et coordonne les études doctrinales.',
                'avatar_url' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
                'specialties' => ['Droit Civil', 'Théorie du Droit', 'Éthique Juridique'],
                'publication_count' => 52,
                'email' => 'jm.vallery@droit-justice.asso.fr',
                'joined_year' => 2016,
            ],
            [
                'id' => 'm3',
                'name' => 'Claire Beauchamp',
                'role' => 'Secrétaire Générale & Magistrate honoraire',
                'organization' => 'Cour d’Appel de Paris (Honoraire)',
                'category' => 'Magistrat',
                'subcategory' => 'Siège',
                'bio' => 'Ayant exercé pendant plus de trente ans au siège pénal et civil, Claire apporte une vision concrète et rigoureuse des besoins de l’institution judiciaire et du statut des justiciables.',
                'avatar_url' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
                'specialties' => ['Procédure Pénale', 'Organisation Judiciaire', 'Déontologie'],
                'publication_count' => 16,
                'email' => 'c.beauchamp@droit-justice.asso.fr',
                'joined_year' => 2019,
            ],
            [
                'id' => 'm4',
                'name' => 'Alexandre Fontaine',
                'role' => 'Trésorier & Directeur Juridique Groupe',
                'organization' => 'Alliance Énergie & Industrie',
                'category' => 'Juriste d\'Entreprise',
                'subcategory' => 'Conformité & RSE',
                'bio' => 'Spécialiste de la conformité, de la gouvernance d’entreprise et du droit économique européen. Alexandre anime la commission "Droit des affaires et transition régulatoire".',
                'avatar_url' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
                'specialties' => ['Droit des Affaires', 'Compliance & RSE', 'Droit Européen'],
                'publication_count' => 11,
                'email' => 'a.fontaine@droit-justice.asso.fr',
                'joined_year' => 2020,
            ],
            [
                'id' => 'm5',
                'name' => 'Dr. Soraya Benali',
                'role' => 'Directrice des Programmes de Recherche & Avocate',
                'organization' => 'Barreau de Lyon & Chercheuse associée au CNRS',
                'category' => 'Avocat',
                'subcategory' => 'Barreaux Régionaux',
                'bio' => 'Pionnière des réflexions sur l’encadrement de l’intelligence artificielle appliquée à la justice et la protection des données sensibles des justiciables.',
                'avatar_url' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
                'specialties' => ['Droit du Numérique', 'IA & Justice Prédictive', 'Données Personnelles'],
                'publication_count' => 19,
                'email' => 's.benali@droit-justice.asso.fr',
                'joined_year' => 2021,
            ],
            [
                'id' => 'm6',
                'name' => 'Gabriel Leroy',
                'role' => 'Coordinateur de la Clinique Juridique',
                'organization' => 'Barreau de Paris',
                'category' => 'Avocat',
                'subcategory' => 'Barreau de Paris',
                'bio' => 'Avocat engagé en droit des étrangers et droit d’asile, il pilote le réseau de 120 bénévoles assurant des permanences juridiques hebdomadaires gratuites.',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
                'specialties' => ['Droit d’Asile', 'Accès au Droit', 'Droits de l’Homme'],
                'publication_count' => 8,
                'email' => 'g.leroy@droit-justice.asso.fr',
                'joined_year' => 2022,
            ],
        ];

        foreach ($members as $mem) {
            Member::updateOrCreate(['id' => $mem['id']], $mem);
        }

        // 3. Articles
        $articles = [
            [
                'id' => 'art1',
                'title' => 'L’impératif de motivation des décisions de justice à l’ère des algorithmes',
                'slug' => 'imperatif-motivation-decisions-justice-algorithmes',
                'excerpt' => 'La transparence du raisonnement judiciaire demeure le premier rempart contre l’arbitraire. L’introduction d’outils d’aide à la décision ne saurait dispenser le juge d’une motivation humaine et personnalisée.',
                'content' => "L'exigence démocratique d'une justice rendue au nom du peuple impose que chaque justiciable comprenne précisément les motifs de droit et de fait qui fondent la sentence. À l'heure où les algorithmes prédictifs et les modèles statistiques s'immiscent dans l'analyse de jurisprudence, une vigilance redoublée s'impose.\n\n## Le principe séculaire de la motivation humaine\n\nDepuis l'article 455 du Code de procédure civile et les stipulations de l'article 6 § 1 de la Convention européenne des droits de l'homme, le juge a l'obligation légale de répondre à l'ensemble des moyens opérants soulevés par les parties. Une décision automatisée ou quasi-automatisée méconnaîtrait la singularité de chaque litige.\n\n## Les risques d'une justice probabiliste\n\nL'utilisation d'outils probabilistes présente le péril d'un figement jurisprudentiel (\"jurisprudence fossilisée\"). Si les décisions passées dictent mécaniquement les jugements futurs par le truchement de la donnée, toute capacité d'évolution prétorienne se trouve étouffée.\n\n> \"Le droit n'est pas un calcul de probabilités, il est la recherche continue du juste et du proportionné.\"\n\n## Recommandations de l'Association\n\n1. Consécration d'un droit d'accès à l'explicabilité de tout traitement algorithmique employé dans l'instruction.\n2. Interdiction formelle du profilage judiciaire des magistrats.\n3. Sanction d'annulation pour tout jugement reposant sur un motif non corroboré par l'office souverain du magistrat.",
                'category' => 'Doctrine',
                'author_name' => 'Prof. Jean-Marc Vallery',
                'author_role' => 'Professeur émérite, Université Paris-Panthéon-Assas',
                'published_at' => '12 Octobre 2024',
                'read_time' => '8 min de lecture',
                'image_url' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
                'tags' => ['Procédure', 'Doctrine', 'IA', 'Motivation des actes'],
                'pdf_url' => '#',
            ],
            [
                'id' => 'art2',
                'title' => 'Aide Juridictionnelle : Diagnostic d’un service public en surchauffe',
                'slug' => 'aide-juridictionnelle-diagnostic-service-public',
                'excerpt' => 'Sans un financement pérenne de la défense des plus démunis, le principe d’égalité devant la justice devient une promesse constitutionnelle inachevée.',
                'content' => "L'accès effectif au juge constitue la clé de voûte de notre édifice républicain. Pourtant, le barème de rétribution de l'Unité de Valeur (UV) allouée aux avocats commis d'office ou désignés au titre de l'aide juridictionnelle ne couvre plus les coûts réels d'un cabinet moderne.\n\nNotre association formule trois propositions concrètes pour revaloriser l'aide juridictionnelle sans alourdir indûment les finances de l'État : l'élargissement de l'assiette de la taxe sur les actes juridiques payants et la création d'un fonds de dotation universel de la justice.",
                'category' => 'Libertés Fondamentales',
                'author_name' => 'Hélène de Saint-Maur',
                'author_role' => 'Présidente de l’Association',
                'published_at' => '28 Septembre 2024',
                'read_time' => '6 min de lecture',
                'image_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
                'tags' => ['Aide Juridictionnelle', 'Barreau', 'Égalité', 'Budget'],
                'pdf_url' => '#',
            ],
            [
                'id' => 'art3',
                'title' => 'La conciliation et la médiation : véritables alternatives ou justice au rabais ?',
                'slug' => 'conciliation-mediation-alternatives-justice-rabais',
                'excerpt' => 'L’engorgement des prétoires a conduit le législateur à rendre la tentative préalable de règlement amiable obligatoire pour certains litiges. Bilan pratique après 3 ans d’application.',
                'content' => 'Si le dialogue entre les parties est vertueux, l\'obligation systématique de recourir à un tiers conciliateur ne doit pas se transformer en course d\'obstacles privant les citoyens d\'un examen rapide par leur juge naturel.',
                'category' => 'Jurisprudence',
                'author_name' => 'Claire Beauchamp',
                'author_role' => 'Secrétaire Générale, Magistrate honoraire',
                'published_at' => '15 Septembre 2024',
                'read_time' => '5 min de lecture',
                'image_url' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
                'tags' => ['MARD', 'Médiation', 'Procédure Civile'],
                'pdf_url' => '#',
            ],
            [
                'id' => 'art4',
                'title' => 'Secret professionnel de l’avocat : Rappel des lignes rouges',
                'slug' => 'secret-professionnel-avocat-rappel-lignes-rouges',
                'excerpt' => 'La protection du secret professionnel est la garantie du citoyen, non un privilège de l’homme de loi. Synthèse des récentes décisions du Conseil constitutionnel.',
                'content' => 'Le secret professionnel ne saurait être considéré comme une entrave aux enquêtes, mais comme la condition sine qua non de la confiance du justiciable lorsqu\'il confie ses vérités les plus intimes à son conseil.',
                'category' => 'Actualités Institutionnelles',
                'author_name' => 'Dr. Soraya Benali',
                'author_role' => 'Avocate & Chercheuse',
                'published_at' => '02 Septembre 2024',
                'read_time' => '7 min de lecture',
                'image_url' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
                'tags' => ['Déontologie', 'Secret Professionnel', 'Conseil Constitutionnel'],
                'pdf_url' => '#',
            ],
        ];

        foreach ($articles as $art) {
            Article::updateOrCreate(['id' => $art['id']], $art);
        }

        // 4. Projects
        $projects = [
            [
                'id' => 'p1',
                'title' => 'Observatoire National de l’État de Droit',
                'status' => 'En cours',
                'category' => 'Observatoire',
                'description' => 'Un baromètre annuel indépendant évaluant l’indépendance judiciaire, l’effectivité des recours et la qualité de la législation en France.',
                'lead' => 'Prof. Jean-Marc Vallery',
                'start_date' => '2024',
                'target_date' => '2026',
                'deliverables' => ['Rapport annuel complet en libre accès', 'Tableau de bord interactif des délais de justice', 'Recommandations transmises aux commissions parlementaires'],
                'progress' => 70,
            ],
            [
                'id' => 'p2',
                'title' => 'Clinique Juridique & Permanences d’Accès au Droit',
                'status' => 'En cours',
                'category' => 'Clinique Juridique',
                'description' => 'Consultations juridiques gratuites et confidentielles délivrées par des avocats et étudiants pour les publics les plus vulnérables.',
                'lead' => 'Me Gabriel Leroy',
                'start_date' => 'En continu',
                'target_date' => 'Permanent',
                'deliverables' => ['Fiches pratiques simplifiées de vulgarisation juridique', 'Guide du justiciable face à la procédure civile', 'Permanences gratuites sans rendez-vous'],
                'progress' => 90,
            ],
            [
                'id' => 'p3',
                'title' => 'Livre Blanc : Régulation de l’IA dans l’Espace Judiciaire',
                'status' => 'Publié',
                'category' => 'Éthique & IA',
                'description' => 'Guide déontologique et propositions concrètes pour encadrer l’utilisation des algorithmes et modèles d’IA générative dans les prétoires.',
                'lead' => 'Dr. Soraya Benali',
                'start_date' => 'Janvier 2024',
                'target_date' => 'Publié',
                'deliverables' => ['Charte éthique téléchargeable pour les barreaux', 'Propositions législatives prêtes à l’emploi', 'Cycle de 4 conférences de formation continue'],
                'progress' => 100,
            ],
            [
                'id' => 'p4',
                'title' => 'Plaidoyer pour la Célérité et la Dignité Judiciaire',
                'status' => 'Concertation',
                'category' => 'Plaidoyer & Réforme',
                'description' => 'Plan d’action d’urgence pour réarmer les tribunaux judiciaires : effectifs, moyens informatiques et simplification procédurale.',
                'lead' => 'Claire Beauchamp & Hélène de Saint-Maur',
                'start_date' => 'Septembre 2024',
                'target_date' => '2025',
                'deliverables' => ['Mémoire en intervention devant les hautes cours', 'Simulateur d’impact budgétaire de la réforme de l’aide juridictionnelle'],
                'progress' => 45,
            ],
        ];

        foreach ($projects as $proj) {
            Project::updateOrCreate(['id' => $proj['id']], $proj);
        }

        // 5. Activities
        $activities = [
            [
                'id' => 'act1',
                'title' => 'Colloque Annuel : "L’État de Droit face aux Crises Contemporaines"',
                'type' => 'Colloque',
                'date' => '14 Novembre 2024 • 09h00 - 18h00',
                'location' => 'Grand Amphithéâtre de la Sorbonne, Paris & Retransmission Directe',
                'description' => 'Une journée de débats magistraux réunissant universitaires, hauts magistrats et avocats pour questionner la résilience de nos garanties constitutionnelles et démocratiques.',
                'speakers' => ['Hélène de Saint-Maur (Présidente)', 'Prof. Jean-Marc Vallery (Comité Scientifique)', 'Représentants de la Cour Européenne des Droits de l’Homme'],
                'status' => 'À venir',
                'registration_link' => '#',
            ],
            [
                'id' => 'act2',
                'title' => 'Table Ronde : "Intelligence Artificielle & Secrets Professionnels"',
                'type' => 'Table Ronde',
                'date' => '28 Novembre 2024 • 18h30 - 20h30',
                'location' => 'Maison du Barreau, Salle Gaston Monnerville, Paris',
                'description' => 'Analyse des risques de fuite de données et des obligations de vigilance lors de l’utilisation de grands modèles de langage (LLM) dans la pratique du conseil juridique.',
                'speakers' => ['Dr. Soraya Benali (Directrice de recherche)', 'Me Thomas Gauthier (Avocat spécialiste RGPD)', 'Membre de la CNIL'],
                'status' => 'À venir',
                'registration_link' => '#',
            ],
            [
                'id' => 'act3',
                'title' => 'Atelier Clinique : Formation au Contentieux de l’Urgence (Référés)',
                'type' => 'Atelier Pratique',
                'date' => '05 Décembre 2024 • 14h00 - 17h30',
                'location' => 'Siège de l’Association, 12 rue Royale, 75008 Paris',
                'description' => 'Session pratique intensive sur la rédaction d’assignations en référé-liberté et référé-suspension devant les juridictions administratives et judiciaires.',
                'speakers' => ['Me Gabriel Leroy', 'Claire Beauchamp'],
                'status' => 'À venir',
                'registration_link' => '#',
            ],
            [
                'id' => 'act4',
                'title' => 'Conférence Magistrale : "L’Évolution du Préjudice Écologique"',
                'type' => 'Conférence Magistrale',
                'date' => '18 Octobre 2024 • 18h00 - 20h00',
                'location' => 'Faculté de Droit de Lyon III & Replay disponible',
                'description' => 'Retour sur les grands arrêts de la Cour de cassation et perspectives d’harmonisation européenne du contentieux climatique.',
                'speakers' => ['Prof. Jean-Marc Vallery', 'Magistrats du Pôle Environnemental'],
                'status' => 'Passé',
                'registration_link' => '#',
            ],
        ];

        foreach ($activities as $act) {
            Activity::updateOrCreate(['id' => $act['id']], $act);
        }

        // 6. Legal Texts
        $legalTexts = [
            [
                'id' => 't1',
                'title' => 'Revue de Doctrine Juridique - N°42 : L\'État de Droit face aux Crises Numériques',
                'reference' => 'ISSN 2491-8832',
                'category' => 'Doctrine',
                'date' => 'Trimestre 2 - 2024',
                'summary' => 'Dossier spécial sur l\'encadrement des algorithmes de justice prédictive et la protection des libertés fondamentales en ligne.',
                'full_text' => 'Ce numéro rassemble les interventions des plus grands spécialistes du droit du numérique et du droit constitutionnel autour des garanties procédurales à l\'ère algorithmique.',
                'pdf_url' => '#',
            ],
        ];

        foreach ($legalTexts as $lt) {
            LegalText::updateOrCreate(['id' => $lt['id']], $lt);
        }

        // 7. Site Settings & Constants
        SiteSetting::setByKey('hero_title', 'Promouvoir la Rigueur du Droit & les Exigences de la Justice');
        SiteSetting::setByKey('hero_subtitle', 'Association indépendante réunissant juristes, universitaires, magistrats et avocats pour la défense de l’État de droit et l’évolution de la doctrine.');
        SiteSetting::setByKey('about_mission', 'Droit & Justice œuvre depuis plus de 20 ans pour l’excellence doctrinale, l’indépendance de la justice et l’accès effectif au droit pour tous.');
        SiteSetting::setByKey('contact_email', 'contact@droit-justice.asso.fr');
        SiteSetting::setByKey('contact_phone', '+33 (0)1 42 68 55 00');
        SiteSetting::setByKey('contact_address', '12, place Dauphine - 75001 Paris');

        SiteSetting::setByKey('key_figures', [
            ['value' => '1988', 'label' => 'Année de fondation', 'subtext' => 'Plus de 35 ans d’engagement'],
            ['value' => '1 250+', 'label' => 'Membres & Juristes', 'subtext' => 'Avocats, magistrats, professeurs'],
            ['value' => '2 850', 'label' => 'Consultations gratuites', 'subtext' => 'Délivrées chaque année'],
            ['value' => '48', 'label' => 'Rapports & Livres Blancs', 'subtext' => 'Remis aux pouvoirs publics'],
        ]);

        SiteSetting::setByKey('association_pillars', [
            [
                'id' => 'pil1',
                'title' => 'Défense de l’État de Droit',
                'description' => 'Veiller scrupuleusement au respect de la hiérarchie des normes, à l’indépendance de la magistrature et à la primauté des droits fondamentaux.',
                'iconName' => 'Scale',
            ],
            [
                'id' => 'pil2',
                'title' => 'Égalité d’Accès à la Justice',
                'description' => 'Abattre les obstacles géographiques, financiers et culturels qui éloignent les citoyens de leurs droits à travers nos permanences gratuites.',
                'iconName' => 'ShieldCheck',
            ],
            [
                'id' => 'pil3',
                'title' => 'Rigueur Doctrinale & Réflexion',
                'description' => 'Produire des études juridiques indépendantes et des propositions législatives rédigées par les plus éminents praticiens et universitaires.',
                'iconName' => 'BookOpen',
            ],
            [
                'id' => 'pil4',
                'title' => 'Éthique & Avenir Numérique',
                'description' => 'Anticiper les mutations technologiques et réguler l’usage des outils d’intelligence artificielle dans le strict respect de la dignité humaine.',
                'iconName' => 'Cpu',
            ],
        ]);

        SiteSetting::setByKey('membership_tiers', [
            [
                'id' => 'student',
                'name' => 'Membre Étudiant & Auditeur',
                'price' => 35,
                'period' => '/ an',
                'targetAudience' => 'Étudiants en Master de droit, élèves-avocats et auditeurs de justice.',
                'benefits' => [
                    'Accès libre à tous les colloques et webinaires de l’association',
                    'Réception trimestrielle de la Revue de Doctrine Juridique',
                    'Possibilité de contribuer à la Clinique Juridique & Accès au Droit',
                    'Accompagnement et mentorat par un praticien chevronné',
                ],
            ],
            [
                'id' => 'titular',
                'name' => 'Membre Titulaire',
                'price' => 150,
                'period' => '/ an',
                'targetAudience' => 'Avocats, magistrats, universitaires, notaires et juristes d’entreprise.',
                'popular' => true,
                'benefits' => [
                    'Droit de vote à l’Assemblée Générale annuelle',
                    'Participation aux Groupes de Travail et comités de réforme',
                    'Publication prioritaire dans le Blog & Bulletin de Doctrine',
                    'Accès à l’annuaire exclusif des membres et au réseau professionnel',
                    'Validation de 12 heures de formation continue annuelle (CNB / ENM)',
                ],
            ],
            [
                'id' => 'benefactor',
                'name' => 'Membre Bienfaiteur',
                'price' => 450,
                'period' => '/ an',
                'targetAudience' => 'Cabinets, institutions, mécènes et personnalités souhaitant soutenir activement l’État de droit.',
                'benefits' => [
                    'Tous les avantages du Membre Titulaire',
                    'Invitation VIP au Dîner de Gala annuel de la Justice',
                    'Mention honorifique dans le Rapport Annuel d’Activité',
                    'Défiscalisation du don (reçu fiscal émis automatiquement)',
                    'Accès réservé au Cercle des Présidents et Débats d’Orientation',
                ],
            ],
        ]);

        SiteSetting::setByKey('member_categories', [
            [
                'id' => 'cat-1',
                'name' => "Conseil d'Administration",
                'nameEn' => 'Board of Directors',
                'subcategories' => [
                    ['id' => 'sub-1-1', 'name' => 'National', 'nameEn' => 'National'],
                    ['id' => 'sub-1-2', 'name' => 'Local', 'nameEn' => 'Local'],
                ],
            ],
            [
                'id' => 'cat-2',
                'name' => 'Universitaire',
                'nameEn' => 'Academic',
                'subcategories' => [
                    ['id' => 'sub-2-1', 'name' => 'Droit Privé', 'nameEn' => 'Private Law'],
                    ['id' => 'sub-2-2', 'name' => 'Droit Public', 'nameEn' => 'Public Law'],
                ],
            ],
            [
                'id' => 'cat-3',
                'name' => 'Magistrat',
                'nameEn' => 'Magistrate',
                'subcategories' => [
                    ['id' => 'sub-3-1', 'name' => 'Siège', 'nameEn' => 'Bench'],
                    ['id' => 'sub-3-2', 'name' => 'Parquet', 'nameEn' => 'Prosecution'],
                ],
            ],
            [
                'id' => 'cat-4',
                'name' => 'Avocat',
                'nameEn' => 'Attorney',
                'subcategories' => [
                    ['id' => 'sub-4-1', 'name' => 'Barreau de Paris', 'nameEn' => 'Paris Bar'],
                    ['id' => 'sub-4-2', 'name' => 'Barreaux Régionaux', 'nameEn' => 'Regional Bars'],
                ],
            ],
            [
                'id' => 'cat-5',
                'name' => "Juriste d'Entreprise",
                'nameEn' => 'Corporate Counsel',
                'subcategories' => [
                    ['id' => 'sub-5-1', 'name' => 'Conformité & RSE', 'nameEn' => 'Compliance & CSR'],
                    ['id' => 'sub-5-2', 'name' => 'Droit des Affaires', 'nameEn' => 'Corporate Law'],
                ],
            ],
        ]);

        // 8. Dispute Officers
        $disputeOfficers = [
            [
                'id' => 'off-1',
                'name' => 'Me Gabriel Leroy',
                'title' => 'Conciliateur Senior',
                'role' => 'Avocat au Barreau de Paris & Membre de la Commission d\'Éthique',
                'stage' => 'conciliation',
                'category' => 'interne',
                'specialties' => ['Droit Associatif', 'Différends d\'Honneur', 'Statuts & Gouvernance'],
                'experience_years' => 18,
                'cases_handled' => 45,
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
                'email' => 'g.leroy@droit-justice.asso.fr',
                'availability' => 'Disponible',
            ],
            [
                'id' => 'off-2',
                'name' => 'Prof. Jean-Marc Vallery',
                'title' => 'Conciliateur Titulaire',
                'role' => 'Professeur émérite de Droit Privé',
                'stage' => 'conciliation',
                'category' => 'interne',
                'specialties' => ['Responsabilité Contractuelle', 'Éthique Professionnelle'],
                'experience_years' => 25,
                'cases_handled' => 62,
                'avatar_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
                'email' => 'jm.vallery@droit-justice.asso.fr',
                'availability' => 'Sur RDV',
            ],
            [
                'id' => 'off-3',
                'name' => 'Claire Beauchamp',
                'title' => 'Médiatrice Assermentée',
                'role' => 'Magistrate honoraire & Ancien Chef de Juridiction',
                'stage' => 'mediation',
                'category' => 'interne',
                'specialties' => ['Médiation Institutionnelle', 'Gestion des Conflits Réseau'],
                'experience_years' => 22,
                'cases_handled' => 88,
                'avatar_url' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
                'email' => 'c.beauchamp@droit-justice.asso.fr',
                'availability' => 'Disponible',
            ],
            [
                'id' => 'off-4',
                'name' => 'Dr. Soraya Benali',
                'title' => 'Médiatrice Certifiée',
                'role' => 'Avocate & Docteure en Droit des Affaires',
                'stage' => 'mediation',
                'category' => 'interne',
                'specialties' => ['Propriété Intellectuelle', 'Différends Numériques & IA'],
                'experience_years' => 14,
                'cases_handled' => 34,
                'avatar_url' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
                'email' => 's.benali@droit-justice.asso.fr',
                'availability' => 'En audience',
            ],
            [
                'id' => 'off-5',
                'name' => 'Président Henri Moreau',
                'title' => 'Président du Tribunal Arbitral Interne',
                'role' => 'Ancien Président de Chambre à la Cour d\'Appel',
                'stage' => 'arbitrage',
                'category' => 'interne',
                'specialties' => ['Arbitrage Institutionnel', 'Droit Disciplinaire', 'Litiges Complexes'],
                'experience_years' => 30,
                'cases_handled' => 110,
                'avatar_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
                'email' => 'h.moreau@droit-justice.asso.fr',
                'availability' => 'Sur RDV',
            ],
            [
                'id' => 'off-6',
                'name' => 'Hélène de Saint-Maur',
                'title' => 'Arbitre Titulaire',
                'role' => 'Avocate au Barreau de Paris & Présidente de l\'Association',
                'stage' => 'arbitrage',
                'category' => 'interne',
                'specialties' => ['Droit des Obligations', 'Arbitrage & Procédure Civile'],
                'experience_years' => 20,
                'cases_handled' => 52,
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
                'email' => 'h.saintmaur@droit-justice.asso.fr',
                'availability' => 'Disponible',
            ],
            [
                'id' => 'off-7',
                'name' => 'Me Antoine Dupont-Moret',
                'title' => 'Conseil en Contentieux Externe',
                'role' => 'Avocat aux Conseils (Cour de Cassation & Conseil d\'État)',
                'stage' => 'arbitrage',
                'category' => 'externe',
                'specialties' => ['Droit Public Contentieux', 'Recours Constitutionnel'],
                'experience_years' => 26,
                'cases_handled' => 74,
                'avatar_url' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
                'email' => 'a.dupont@cabinet-ad.fr',
                'availability' => 'Sur RDV',
            ],
        ];

        foreach ($disputeOfficers as $officer) {
            DisputeOfficer::updateOrCreate(['id' => $officer['id']], $officer);
        }

        // 9. Dispute Cases
        $disputeCases = [
            [
                'id' => 'case-101',
                'case_number' => 'LIT-CON-2026-001',
                'title' => 'Différend d\'interprétation de la convention de partenariat académique',
                'category' => 'interne',
                'stage' => 'conciliation',
                'is_public' => true,
                'status' => 'Accord Homologué',
                'date_submitted' => '12 Janvier 2026',
                'summary' => 'Règlement amiable concernant les modalités de partage des publications entre l\'Université partenaire et le Pôle de Recherche. Un protocole d\'accord co-signé a été formalisé avec succès.',
                'parties' => 'Comité de Recherche c/ Secrétariat Universitaire',
                'assigned_officer' => 'Me Gabriel Leroy',
                'resolution_timeframe' => '14 jours',
            ],
            [
                'id' => 'case-102',
                'case_number' => 'LIT-CON-2026-004',
                'title' => 'Procédure confidentielle d\'harmonisation de gouvernance interne',
                'category' => 'interne',
                'stage' => 'conciliation',
                'is_public' => false,
                'status' => 'En cours',
                'date_submitted' => '03 Février 2026',
                'summary' => 'Dossier soumis au secret professionnel absolu conformément à la Charte de Conciliation. Les débats concernent la répartition des compétences statutaires.',
                'parties' => '[Parties Confidentielles - Membres Titulaires]',
                'assigned_officer' => 'Prof. Jean-Marc Vallery',
                'confidentiality_note' => 'Accès restreint. Consultation réservée exclusivement aux membres habilités et au conciliateur désigné.',
                'resolution_timeframe' => 'En traitement (Phase finale)',
            ],
            [
                'id' => 'case-103',
                'case_number' => 'LIT-CON-2025-019',
                'title' => 'Litige relatif à l\'attribution d\'une bourse d\'étude doctrinale',
                'category' => 'interne',
                'stage' => 'conciliation',
                'is_public' => true,
                'status' => 'Clôturé',
                'date_submitted' => '15 Novembre 2025',
                'summary' => 'Examen amiable du recours déposé par un chercheur auditeur concernant la répartition du budget de recherche 2025. Révision transparente accordée à l\'unanimité.',
                'parties' => 'Auditeur B. N. c/ Commission Scientifique',
                'assigned_officer' => 'Me Gabriel Leroy',
                'resolution_timeframe' => '21 jours',
            ],
            [
                'id' => 'case-201',
                'case_number' => 'LIT-MED-2026-008',
                'title' => 'Médiation institutionnelle sur la charte d\'utilisation des outils IA',
                'category' => 'interne',
                'stage' => 'mediation',
                'is_public' => true,
                'status' => 'Accord Homologué',
                'date_submitted' => '20 Janvier 2026',
                'summary' => 'Négociation assistée concernant les critères de validation algorithmique des travaux d\'analyse juridique. Élaboration d\'un avenant déontologique validé par le Conseil.',
                'parties' => 'Groupe Éthique & IA c/ Comité de Rédaction',
                'assigned_officer' => 'Dr. Soraya Benali',
                'resolution_timeframe' => '28 jours',
            ],
            [
                'id' => 'case-202',
                'case_number' => 'LIT-MED-2026-012',
                'title' => 'Dossier disciplinaire confidentiel - Médiation de réseau régional',
                'category' => 'interne',
                'stage' => 'mediation',
                'is_public' => false,
                'status' => 'En instruction',
                'date_submitted' => '18 Février 2026',
                'summary' => 'Médiation sensible relative à un désaccord opérationnel entre deux délégations régionales de l\'association. Les débats se déroulent à huis clos.',
                'parties' => '[Confidentiel - Délégation Ouest c/ Délégation Île-de-France]',
                'assigned_officer' => 'Claire Beauchamp',
                'confidentiality_note' => 'Procédure couverte par l\'inviolabilité du secret de la médiation (Loi du 8 février 1995).',
                'resolution_timeframe' => '30 jours impartis',
            ],
            [
                'id' => 'case-301',
                'case_number' => 'LIT-ARB-2025-003',
                'title' => 'Sentence Arbitrale N° 42 - Litige sur la propriété de la marque institutionnelle',
                'category' => 'interne',
                'stage' => 'arbitrage',
                'is_public' => true,
                'status' => 'Sentence Arbitrale',
                'date_submitted' => '10 Octobre 2025',
                'summary' => 'Le Tribunal Arbitral a rendu une sentence motivée confirmant la titularité exclusive des droits de propriété intellectuelle du fonds documentaire au bénéfice du bureau central.',
                'parties' => 'Droit & Justice c/ Ancienne Antenne Partenaire',
                'assigned_officer' => 'Président Henri Moreau',
                'resolution_timeframe' => '60 jours',
            ],
            [
                'id' => 'case-302',
                'case_number' => 'LIT-ARB-2026-002',
                'title' => 'Arbitrage confidentiel sur la révision des statuts de la fondation',
                'category' => 'interne',
                'stage' => 'arbitrage',
                'is_public' => false,
                'status' => 'En cours',
                'date_submitted' => '01 Février 2026',
                'summary' => 'Instance arbitrale contradictoire relative au transfert d\'actifs et à l\'exécution du testament du fondateur. Instruction écrite et orale sous scellés.',
                'parties' => '[Parties Confidentielles - Collège des Fondateurs]',
                'assigned_officer' => 'Hélène de Saint-Maur',
                'confidentiality_note' => 'Sentence soumise à la clause de confidentialité intégrale de l\'article 40 du Règlement d\'Arbitrage.',
                'resolution_timeframe' => 'Audience fixée au 15 Avril 2026',
            ],
            [
                'id' => 'case-401',
                'case_number' => 'LIT-EXT-2025-011',
                'title' => 'Recours gracieux & contentieux contre le décret sur le tarif d\'aide juridictionnelle',
                'category' => 'externe',
                'stage' => 'arbitrage',
                'is_public' => true,
                'status' => 'En cours',
                'date_submitted' => '05 Décembre 2025',
                'summary' => 'Saisine du Conseil d\'État visant l\'annulation pour excès de pouvoir de la circulaire interministérielle portant modification de la rétribution des permanences.',
                'parties' => 'Association Droit & Justice c/ Ministère de la Justice',
                'assigned_officer' => 'Me Antoine Dupont-Moret',
                'resolution_timeframe' => 'En attente de décision d\'assemblée',
            ],
            [
                'id' => 'case-402',
                'case_number' => 'LIT-EXT-2026-005',
                'title' => 'Contentieux international de partenariat de recherche transfrontalier',
                'category' => 'externe',
                'stage' => 'arbitrage',
                'is_public' => false,
                'status' => 'En instruction',
                'date_submitted' => '28 Janvier 2026',
                'summary' => 'Procédure d\'arbitrage international engagée devant la Chambre de Commerce Internationale concernant une convention de subvention européenne.',
                'parties' => '[Droit & Justice c/ Consortium Européen X]',
                'assigned_officer' => 'Me Antoine Dupont-Moret',
                'confidentiality_note' => 'Règlement d\'arbitrage CCI - Secret des affaires et stricte confidentialité des mémoires déposés.',
                'resolution_timeframe' => 'Instruction arbitrale en cours',
            ],
        ];

        foreach ($disputeCases as $caseItem) {
            DisputeCase::updateOrCreate(['id' => $caseItem['id']], $caseItem);
        }
    }
}
