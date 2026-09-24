import React, { useState } from 'react';
import { BookOpen, FileText, Download, Scale, Search, ShieldCheck, ChevronDown, ChevronUp, Copy, Check, Printer } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface TextDocument {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  date: string;
  dateEn: string;
  reference: string;
  referenceEn: string;
  sections: {
    title: string;
    titleEn: string;
    articles: {
      num: string;
      title: string;
      titleEn: string;
      content: string;
      contentEn: string;
    }[];
  }[];
}

const DOCUMENTS: TextDocument[] = [
  {
    id: 'statuts',
    title: 'Statuts Constitutifs de l\'Association',
    titleEn: 'Constitutive Bylaws of the Association',
    subtitle: 'Association régie par la loi du 1er juillet 1901 et reconnue d\'intérêt général',
    subtitleEn: 'Non-profit association governed by the Law of July 1, 1901 and recognized as a public-interest entity',
    date: 'Version consolidée au 12 décembre 2023',
    dateEn: 'Consolidated version as of December 12, 2023',
    reference: 'RNA W751239847 • Préfecture de Police de Paris',
    referenceEn: 'RNA W751239847 • Paris Police Prefecture',
    sections: [
      {
        title: 'Titre I — Dénomination, Objet, Siège et Durée',
        titleEn: 'Title I — Name, Object, Registered Office and Duration',
        articles: [
          {
            num: 'Article 1',
            title: 'Dénomination',
            titleEn: 'Name',
            content: 'Il est fondé entre les adhérents aux présents statuts une association régie par la loi du 1er juillet 1901 et le décret du 16 août 1901, ayant pour titre : « DROIT & JUSTICE — Institution pour la Défense de l\'État de Droit et la Doctrine Juridique ».',
            contentEn: 'An association governed by the French Law of July 1, 1901 and the Decree of August 16, 1901 is established among the members subscribing to these bylaws, under the title: "LAW & JUSTICE — Institution for the Defense of the Rule of Law and Legal Doctrine".'
          },
          {
            num: 'Article 2',
            title: 'Objet et Buts Institutionnels',
            titleEn: 'Institutional Purpose and Goals',
            content: 'L\'association a pour objet exclusif, sur le territoire national et international : de promouvoir la primauté de l\'État de droit, de veiller à la garantie des libertés fondamentales, d\'éclairer le débat parlementaire et citoyen par une doctrine indépendante et rigoureuse, d\'animer des cliniques juridiques d\'accès universel au droit, et de concourir à la formation continue d\'excellence des juristes.',
            contentEn: 'The exclusive object of the association, nationally and internationally, is: to promote the primacy of the rule of law, safeguard fundamental freedoms, enlighten parliamentary and civic debate through independent and rigorous doctrine, operate free legal clinics for universal access to justice, and contribute to continuous legal education of excellence.'
          },
          {
            num: 'Article 3',
            title: 'Siège Social',
            titleEn: 'Registered Office',
            content: 'Le siège social de l\'association est fixé au 12, rue Royale, 75008 Paris. Il pourra être transféré en tout autre lieu du territoire métropolitain par simple délibération du Conseil d\'Administration, ratifiée par la plus proche Assemblée Générale Ordinaire.',
            contentEn: 'The registered office of the association is established at 12, rue Royale, 75008 Paris. It may be transferred to any other location in metropolitan France by simple resolution of the Board of Directors, ratified by the next Ordinary General Assembly.'
          },
          {
            num: 'Article 4',
            title: 'Durée',
            titleEn: 'Duration',
            content: 'La durée de l\'association est illimitée. L\'exercice social commence le 1er janvier et se termine le 31 décembre de chaque année civile.',
            contentEn: 'The duration of the association is unlimited. The fiscal year begins on January 1 and ends on December 31 of each calendar year.'
          }
        ]
      },
      {
        title: 'Titre II — Composition et Qualité des Membres',
        titleEn: 'Title II — Membership Categories and Status',
        articles: [
          {
            num: 'Article 5',
            title: 'Collèges de Membres',
            titleEn: 'Membership Colleges',
            content: 'L\'association se compose de : Membres Actifs (magistrats, avocats, professeurs, juristes), Membres Émérites désignés en raison de services exceptionnels rendus à la science du droit, Membres Associés (étudiants et élèves-avocats), et Membres Bienfaiteurs soutenant matériellement l\'œuvre de l\'institution.',
            contentEn: 'The association consists of: Active Members (judges, attorneys, professors, legal scholars), Emeritus Members appointed for exceptional services to legal science, Associate Members (law students and trainee advocates), and Benefactor Members supporting the institution financially or materially.'
          },
          {
            num: 'Article 6',
            title: 'Procédure d\'Agrément',
            titleEn: 'Admission Procedure',
            content: 'Pour être admis en qualité de Membre Titulaire ou Associé, le candidat doit adresser une demande formelle accompagnée de son curriculum vitae et de l\'engagement écrit de respecter la Charte Déontologique. Le Bureau statue souverainement sur les demandes lors de sa réunion trimestrielle.',
            contentEn: 'To be admitted as Full or Associate Member, applicants must submit a formal application accompanied by their resume and a written commitment to abide by the Ethical Charter. The Executive Board decides sovereignly on applications at its quarterly meetings.'
          },
          {
            num: 'Article 7',
            title: 'Perte de la Qualité de Membre',
            titleEn: 'Termination of Membership',
            content: 'La qualité de membre se perd par : démission notifiée par lettre recommandée avec accusé de réception ou courriel certifié, décès, ou radiation prononcée par le Conseil d\'Administration pour motif grave ou manquement constaté aux obligations déontologiques, après audition contradictoire préalable de l\'intéressé.',
            contentEn: 'Membership is terminated by: resignation submitted via registered mail or certified email, death, or expulsion ordered by the Board of Directors for serious grounds or ethical failure, following a prior adversary hearing.'
          }
        ]
      },
      {
        title: 'Titre III — Administration et Gouvernance',
        titleEn: 'Title III — Administration and Governance',
        articles: [
          {
            num: 'Article 8',
            title: 'Conseil d\'Administration',
            titleEn: 'Board of Directors',
            content: 'L\'association est administrée par un Conseil composé de 12 à 18 membres élus pour trois ans au scrutin secret par l\'Assemblée Générale. Le Conseil est renouvelable par tiers chaque année et veille à une représentation équilibrée des différentes branches de la communauté juridique (magistrature, barreau, université).',
            contentEn: 'The association is administered by a Board composed of 12 to 18 members elected for three years by secret ballot by the General Assembly. One-third of the Board is renewed annually, ensuring balanced representation across the judiciary, bar, and academia.'
          },
          {
            num: 'Article 9',
            title: 'Le Bureau de l\'Association',
            titleEn: 'Executive Board',
            content: 'Le Conseil d\'Administration élit parmi ses membres, pour une durée de trois ans, un Bureau composé au minimum d\'un Président, de deux Vice-Présidents, d\'un Secrétaire Général et d\'un Trésorier. Le Bureau assure la gestion courante et l\'exécution des délibérations.',
            contentEn: 'The Board of Directors elects from among its members, for a three-year term, an Executive Board consisting of at least a President, two Vice-Presidents, a General Secretary, and a Treasurer. The Executive Board handles day-to-day operations and executes board decisions.'
          }
        ]
      }
    ]
  },
  {
    id: 'reglement',
    title: 'Règlement Intérieur de l\'Institution',
    titleEn: 'Internal Rules & Operating Procedures',
    subtitle: 'Modalités pratiques de fonctionnement des commissions et des activités',
    subtitleEn: 'Practical rules for the operation of committees and institutional activities',
    date: 'Adopté par l\'Assemblée Générale du 15 mai 2022',
    dateEn: 'Adopted by the General Assembly on May 15, 2022',
    reference: 'Document interne d\'application des Statuts (Art. 22)',
    referenceEn: 'Internal Bylaws Application Document (Art. 22)',
    sections: [
      {
        title: 'Section I — Commissions Scientifiques & Doctrinales',
        titleEn: 'Section I — Scientific & Doctrinal Committees',
        articles: [
          {
            num: 'Article R.1',
            title: 'Missions des Commissions Permanentes',
            titleEn: 'Missions of Standing Committees',
            content: 'Chaque commission permanente est chargée de l\'instruction des questions soumises à l\'association dans son domaine de compétence. Elle est présidée par un rapporteur général désigné par le Conseil d\'Administration et se réunit au moins six fois l\'an.',
            contentEn: 'Each standing committee is tasked with examining legal issues submitted to the association in its field of expertise. It is chaired by a general rapporteur appointed by the Board of Directors and meets at least six times a year.'
          },
          {
            num: 'Article R.2',
            title: 'Publication des Avis et Rapports',
            titleEn: 'Publication of Opinions and Reports',
            content: 'Tout projet d\'avis doctrinal, de mémoire d\'amicus curiae ou de contribution législative doit faire l\'objet d\'une double relecture par les pairs au sein de la commission avant d\'être transmis au Bureau pour validation définitive et publication officielle.',
            contentEn: 'Any draft doctrinal opinion, amicus curiae brief, or legislative contribution must undergo double-blind peer review within the committee before being submitted to the Executive Board for final approval and official publication.'
          }
        ]
      },
      {
        title: 'Section II — Clinique Juridique & Consultations Publiques',
        titleEn: 'Section II — Legal Aid Clinic & Public Consultations',
        articles: [
          {
            num: 'Article R.3',
            title: 'Gratuité Absolue & Règle d\'Éthique',
            titleEn: 'Strict Pro Bono Policy & Ethical Rule',
            content: 'Les consultations délivrées au sein de la Clinique Juridique de Droit & Justice sont strictement gratuites. Aucun membre participant ne saurait, à titre direct ou indirect, solliciter d\'honoraires ou détourner la clientèle vers son cabinet personnel.',
            contentEn: 'Consultations provided within the Law & Justice Legal Aid Clinic are strictly free of charge. No participating member may directly or indirectly request fees or solicit clients for private practice.'
          },
          {
            num: 'Article R.4',
            title: 'Secret Professionnel et Anonymisation',
            titleEn: 'Professional Secrecy and Anonymization',
            content: 'Tous les dossiers confiés aux étudiants et encadrants de la clinique sont couverts par le secret le plus absolu. Toute étude de cas à vocation pédagogique ou statistique fait l\'objet d\'une anonymisation irréversible préalable.',
            contentEn: 'All cases entrusted to students and supervisors at the clinic are protected by strict professional secrecy. Any case study used for educational or statistical purposes undergoes irreversible prior anonymization.'
          }
        ]
      }
    ]
  },
  {
    id: 'charte',
    title: 'Charte Déontologique & d\'Indépendance',
    titleEn: 'Ethical Charter & Declaration of Independence',
    subtitle: 'Engagements moraux et scientifiques souscrits par tous les membres',
    subtitleEn: 'Moral and scientific commitments subscribed to by all members',
    date: 'Adoptée solennellement le 14 octobre 1998',
    dateEn: 'Solemnly adopted on October 14, 1998',
    reference: 'Charte d\'Honneur de l\'Association Droit & Justice',
    referenceEn: 'Charter of Honor of the Law & Justice Association',
    sections: [
      {
        title: 'Chapitre I — Indépendance & Devoir de Réserve',
        titleEn: 'Chapter I — Independence & Duty of Reserve',
        articles: [
          {
            num: 'Principe 1',
            title: 'Indépendance Politique et Syndicale',
            titleEn: 'Political and Trade Union Independence',
            content: 'L\'association ne saurait soutenir aucune formation partisane, ni prendre part à des joutes électorales. Ses prises de position sont guidées exclusivement par la méthode scientifique, l\'analyse des textes et la fidélité aux valeurs républicaines et conventionnelles.',
            contentEn: 'The association shall not support any political party or engage in electoral debates. Its positions are guided exclusively by scientific methodology, textual analysis, and fidelity to constitutional and international treaty principles.'
          },
          {
            num: 'Principe 2',
            title: 'Prévention des Conflits d\'Intérêts',
            titleEn: 'Prevention of Conflicts of Interest',
            content: 'Tout membre appelé à délibérer sur un projet de texte ou une prise de position dans laquelle lui-même, son cabinet ou son institution d\'attachement aurait un intérêt personnel direct a l\'obligation formelle de se déporter avant l\'ouverture des débats.',
            contentEn: 'Any member called upon to deliberate on a draft text or position paper in which they, their law firm, or affiliated institution has a direct personal interest is strictly required to recuse themselves prior to discussions.'
          }
        ]
      },
      {
        title: 'Chapitre II — Rigueur Doctrinale & Respect des Personnes',
        titleEn: 'Chapter II — Doctrinal Rigor & Mutual Respect',
        articles: [
          {
            num: 'Principe 3',
            title: 'Honnêteté Intellectuelle',
            titleEn: 'Intellectual Integrity',
            content: 'Les avis formulés doivent exposer de façon loyale l\'état du droit positif ainsi que les courants jurisprudentiels opposés avant de motiver la position retenue par l\'association.',
            contentEn: 'Legal opinions issued must objectively present existing positive law and conflicting judicial precedents before substantiating the position adopted by the association.'
          },
          {
            num: 'Principe 4',
            title: 'Dignité des Débats',
            titleEn: 'Dignity of Debate',
            content: 'Les controverses juridiques au sein de l\'association se déroulent dans une bienveillance confraternelle absolue, exempte de toute attaque personnelle, dans le respect mutuel des magistrats, avocats et universitaires.',
            contentEn: 'Legal controversies within the association shall take place in a spirit of collegiality and mutual respect, free from personal attacks, among judges, attorneys, and academics.'
          }
        ]
      }
    ]
  }
];

export const TextsView: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [selectedDocId, setSelectedDocId] = useState<string>('statuts');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [copiedArticle, setCopiedArticle] = useState<string | null>(null);

  const currentDoc = DOCUMENTS.find((d) => d.id === selectedDocId) || DOCUMENTS[0];

  const docTitle = isEn ? currentDoc.titleEn : currentDoc.title;
  const docSubtitle = isEn ? currentDoc.subtitleEn : currentDoc.subtitle;
  const docDate = isEn ? currentDoc.dateEn : currentDoc.date;
  const docRef = isEn ? currentDoc.referenceEn : currentDoc.reference;

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey] === false ? true : false
    }));
  };

  const copyArticleText = (articleNum: string, articleTitle: string, articleContent: string) => {
    const textToCopy = `${articleNum} - ${articleTitle}\n${articleContent}\n(Source : ${docTitle}, ${isEn ? 'Law & Justice' : 'Droit & Justice'})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedArticle(articleNum);
    setTimeout(() => setCopiedArticle(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter sections and articles based on search query
  const filteredSections = currentDoc.sections
    .map((section) => {
      const sTitle = isEn ? section.titleEn : section.title;
      const filteredArticles = section.articles.filter((art) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const aTitle = isEn ? art.titleEn : art.title;
        const aContent = isEn ? art.contentEn : art.content;
        return (
          art.num.toLowerCase().includes(q) ||
          aTitle.toLowerCase().includes(q) ||
          aContent.toLowerCase().includes(q)
        );
      });
      return {
        ...section,
        displayTitle: sTitle,
        articles: filteredArticles
      };
    })
    .filter((section) => section.articles.length > 0);

  return (
    <div className="pt-24 pb-28">
      {/* Header Banner */}
      <section className="bg-[#031632] text-white py-20 px-5 md:px-16 border-b border-[#1A2B48]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest">
              {isEn ? 'Association • Legal Framework' : 'Association • Cadre Juridique'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">
              {isEn ? 'Official Documents' : 'Textes Officiels'}
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            {isEn ? 'Official Documents of Law & Justice' : 'Textes de l\'Association Droit & Justice'}
          </h1>
          <p className="text-[#8293b5] text-lg max-w-3xl leading-relaxed">
            {isEn
              ? 'Access our founding bylaws, ethical code, committee operating procedures, and governance frameworks in full transparency.'
              : 'Consultez en libre accès les textes fondateurs qui régissent la gouvernance, les obligations déontologiques, le fonctionnement de nos commissions et l\'exercice de nos missions d\'intérêt général.'}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 mt-12 space-y-12">
        
        {/* Navigation & Document Selector Strip */}
        <div className="grid lg:grid-cols-3 gap-4">
          {DOCUMENTS.map((doc) => {
            const isSelected = selectedDocId === doc.id;
            const cardTitle = isEn ? doc.titleEn : doc.title;
            const cardSubtitle = isEn ? doc.subtitleEn : doc.subtitle;
            const cardDate = isEn ? doc.dateEn : doc.date;

            return (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDocId(doc.id);
                  setSearchQuery('');
                }}
                className={`p-6 rounded-xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#031632] text-white border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]'
                    : 'bg-white hover:bg-slate-50 text-[#333333] border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-[#C5A059] text-[#031632]' : 'bg-slate-100 text-[#031632]'
                      }`}
                    >
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        isSelected ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isEn ? 'Official Document' : 'Texte Officiel'}
                    </span>
                  </div>
                  <h3 className="font-playfair text-lg font-bold mb-1.5 leading-snug">
                    {cardTitle}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isSelected ? 'text-slate-300' : 'text-[#666]'}`}>
                    {cardSubtitle}
                  </p>
                </div>
                <div className={`mt-4 pt-3 border-t text-[11px] font-mono ${isSelected ? 'border-white/15 text-[#C5A059]' : 'border-slate-100 text-slate-500'}`}>
                  {cardDate}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action and Search Toolbar */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search in text */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search an article, keyword...' : 'Rechercher un article, un mot-clé...'}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-xs text-[#031632] placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                {isEn ? 'Clear' : 'Effacer'}
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#031632] text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              title={isEn ? 'Print this document' : 'Imprimer ce document'}
            >
              <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isEn ? 'Print' : 'Imprimer'}</span>
            </button>
            <button
              onClick={() => {
                alert(isEn ? `Downloading certified PDF version: ${docTitle}` : `Téléchargement de la version PDF certifiée : ${docTitle}`);
              }}
              className="inline-flex items-center gap-1.5 bg-[#031632] hover:bg-[#1A2B48] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isEn ? 'Download official PDF' : 'Télécharger le PDF officiel'}</span>
            </button>
          </div>
        </div>

        {/* Document Display Canvas */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 md:p-14">
          {/* Institutional Document Header */}
          <div className="border-b-2 border-slate-100 pb-8 mb-10 text-center max-w-3xl mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#031632] text-[#C5A059] flex items-center justify-center mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C5A059] block mb-2 font-mono">
              {docRef}
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#031632] mb-3">
              {docTitle}
            </h2>
            <p className="text-sm text-[#555] leading-relaxed mb-4">
              {docSubtitle}
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded text-xs text-slate-600 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{docDate}</span>
            </div>
          </div>

          {/* Search Result Feedback */}
          {searchQuery && (
            <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 mb-8 flex justify-between items-center">
              <span>
                {isEn
                  ? `Active filter for "${searchQuery}": ${filteredSections.reduce((acc, s) => acc + s.articles.length, 0)} article(s) found.`
                  : `Filtre actif pour « ${searchQuery} » : ${filteredSections.reduce((acc, s) => acc + s.articles.length, 0)} article(s) trouvé(s).`}
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="font-semibold underline cursor-pointer hover:text-amber-950"
              >
                {isEn ? 'Show full document' : 'Afficher tout le texte'}
              </button>
            </div>
          )}

          {/* Sections & Articles */}
          {filteredSections.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-playfair text-lg text-[#031632]">
                {isEn ? 'No article matches your search' : 'Aucun article ne correspond à votre recherche'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isEn ? 'Try another keyword or reset your search.' : 'Essayez un autre mot-clé ou réinitialisez la recherche.'}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredSections.map((section, sIdx) => {
                const isExpanded = expandedSections[section.displayTitle] !== false;
                return (
                  <div key={sIdx} className="border-b border-slate-100 pb-8 last:border-b-0">
                    <button
                      onClick={() => toggleSection(section.displayTitle)}
                      className="w-full flex items-center justify-between text-left py-3 border-b border-slate-200 group cursor-pointer"
                    >
                      <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#031632] group-hover:text-[#C5A059] transition-colors">
                        {section.displayTitle}
                      </h3>
                      <div className="p-1 rounded bg-slate-50 group-hover:bg-slate-100 text-slate-500">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-6 space-y-6">
                        {section.articles.map((art, aIdx) => {
                          const articleTitle = isEn ? art.titleEn : art.title;
                          const articleContent = isEn ? art.contentEn : art.content;

                          return (
                            <div
                              key={aIdx}
                              className="bg-[#fafafa] rounded-lg p-6 border border-slate-200/80 hover:border-slate-300 transition-colors relative group"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#C5A059] bg-[#031632] px-2.5 py-0.5 rounded">
                                    {art.num}
                                  </span>
                                  <h4 className="font-playfair font-bold text-base text-[#031632]">
                                    {articleTitle}
                                  </h4>
                                </div>

                                <button
                                  onClick={() => copyArticleText(art.num, articleTitle, articleContent)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-500 hover:text-[#031632] flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded border border-slate-200"
                                  title={isEn ? 'Copy article text' : 'Copier le texte de cet article'}
                                >
                                  {copiedArticle === art.num ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span className="text-emerald-600">{isEn ? 'Copied' : 'Copié'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>{isEn ? 'Copy article' : 'Copier l\'article'}</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <p className="text-sm text-[#333333] leading-relaxed">
                                {articleContent}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Document Footer Notice */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div>
              {isEn
                ? 'General Secretariat of Law & Justice • 12 rue Royale, 75008 Paris'
                : 'Secrétariat Général de Droit & Justice • 12 rue Royale, 75008 Paris'}
            </div>
            <div className="font-mono text-[11px]">
              {isEn ? 'Last certified update: December 12, 2023' : 'Dernière mise à jour certifiée conforme le 12/12/2023'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

