<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LegalText;

class LegalTextSeeder extends Seeder
{
    public function run(): void
    {
        $docs = [
            [
                'id' => 'statuts',
                'title' => 'Statuts Constitutifs de l\'Association',
                'titleEn' => 'Constitutive Bylaws of the Association',
                'subtitle' => 'Association régie par la loi du 1er juillet 1901 et reconnue d\'intérêt général',
                'subtitleEn' => 'Non-profit association governed by the Law of July 1, 1901 and recognized as a public-interest entity',
                'date' => 'Version consolidée au 12 décembre 2023',
                'dateEn' => 'Consolidated version as of December 12, 2023',
                'reference' => 'RNA W751239847 • Préfecture de Police de Paris',
                'referenceEn' => 'RNA W751239847 • Paris Police Prefecture',
                'category' => 'Texte Officiel',
                'summary' => 'Statuts de l\'association Droit & Justice.',
                'sections' => [
                    [
                        'title' => 'Titre I — Dénomination, Objet, Siège et Durée',
                        'titleEn' => 'Title I — Name, Object, Registered Office and Duration',
                        'articles' => [
                            [
                                'num' => 'Article 1',
                                'title' => 'Dénomination',
                                'titleEn' => 'Name',
                                'content' => 'Il est fondé entre les adhérents aux présents statuts une association régie par la loi du 1er juillet 1901...',
                                'contentEn' => 'An association governed by the French Law of July 1, 1901...'
                            ]
                        ]
                    ]
                ]
            ],
            [
                'id' => 'reglement',
                'title' => 'Règlement Intérieur de l\'Institution',
                'titleEn' => 'Internal Rules & Operating Procedures',
                'subtitle' => 'Modalités pratiques de fonctionnement des commissions et des activités',
                'subtitleEn' => 'Practical rules for the operation of committees and institutional activities',
                'date' => 'Adopté par l\'Assemblée Générale du 15 mai 2022',
                'dateEn' => 'Adopted by the General Assembly on May 15, 2022',
                'reference' => 'Document interne d\'application des Statuts (Art. 22)',
                'referenceEn' => 'Internal Bylaws Application Document (Art. 22)',
                'category' => 'Texte Officiel',
                'summary' => 'Règlement intérieur de l\'institution.',
                'sections' => [
                    [
                        'title' => 'Section I — Commissions Scientifiques',
                        'titleEn' => 'Section I — Scientific Committees',
                        'articles' => [
                            [
                                'num' => 'Article R.1',
                                'title' => 'Missions',
                                'titleEn' => 'Missions',
                                'content' => 'Les commissions sont chargées de...',
                                'contentEn' => 'The committees are in charge of...'
                            ]
                        ]
                    ]
                ]
            ],
            [
                'id' => 'charte',
                'title' => 'Charte Déontologique & d\'Indépendance',
                'titleEn' => 'Ethical Charter & Declaration of Independence',
                'subtitle' => 'Engagements moraux et scientifiques souscrits par tous les membres',
                'subtitleEn' => 'Moral and scientific commitments subscribed to by all members',
                'date' => 'Adoptée solennellement le 14 octobre 1998',
                'dateEn' => 'Solemnly adopted on October 14, 1998',
                'reference' => 'Charte d\'Honneur de l\'Association Droit & Justice',
                'referenceEn' => 'Charter of Honor of the Law & Justice Association',
                'category' => 'Texte Officiel',
                'summary' => 'Charte déontologique.',
                'sections' => [
                    [
                        'title' => 'Chapitre I — Indépendance',
                        'titleEn' => 'Chapter I — Independence',
                        'articles' => [
                            [
                                'num' => 'Principe 1',
                                'title' => 'Indépendance Politique',
                                'titleEn' => 'Political Independence',
                                'content' => 'L\'association ne saurait soutenir...',
                                'contentEn' => 'The association shall not support...'
                            ]
                        ]
                    ]
                ]
            ]
        ];
        foreach($docs as $doc) {
            LegalText::updateOrCreate(['id' => $doc['id']], $doc);
        }
    }
}
