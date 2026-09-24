import React, { useState } from 'react';
import { Landmark, Calendar, Award, BookOpen, Scale, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HistoryViewProps {
  onJoinClick: () => void;
  onNavigateTexts?: () => void;
}

interface Milestone {
  year: string;
  period: string;
  periodEn: string;
  title: string;
  titleEn: string;
  tag: string;
  tagEn: string;
  summary: string;
  summaryEn: string;
  details: string[];
  detailsEn: string[];
  impact: string;
  impactEn: string;
}

const MILESTONES: Milestone[] = [
  {
    year: '1998',
    period: 'Automne 1998',
    periodEn: 'Fall 1998',
    title: 'Les Assises Fondatrices de la Sorbonne',
    titleEn: 'Founding Assembly at the Sorbonne',
    tag: 'Fondation',
    tagEn: 'Foundation',
    summary: 'À l\'initiative d\'un cercle d\'universitaires éminents, de magistrats de la Cour de cassation et de bâtonniers, l\'Association Droit & Justice est proclamée dans le grand amphithéâtre de la Sorbonne.',
    summaryEn: 'Initiated by prominent scholars, magistrates, and bar leaders, the Law & Justice Association was proclaimed in the grand amphitheater of the Sorbonne.',
    details: [
      'Adoption du Manifeste fondateur proclamant l\'indépendance absolue vis-à-vis des pouvoirs politiques et corporatifs.',
      'Dépôt des statuts initiaux en préfecture de police de Paris sous le régime de la loi du 1er juillet 1901.',
      'Création des trois premières commissions doctrinales : Droit constitutionnel, Procédure civile et Droits fondamentaux.'
    ],
    detailsEn: [
      'Adoption of the founding Manifesto declaring absolute independence from political and commercial interests.',
      'Filing of initial bylaws under French Law 1901 for non-profit organizations.',
      'Establishment of the first three doctrinal committees: Constitutional Law, Civil Procedure, and Fundamental Rights.'
    ],
    impact: 'Fondation d\'une tribune neutre de réflexion juridique transdisciplinaire.',
    impactEn: 'Establishing a neutral, cross-disciplinary legal reflection forum.'
  },
  {
    year: '2004',
    period: 'Printemps 2004',
    periodEn: 'Spring 2004',
    title: 'Création de la Clinique Juridique Populaire',
    titleEn: 'Creation of the Free Legal Clinic',
    tag: 'Accès au Droit',
    tagEn: 'Access to Justice',
    summary: 'Ouverture du premier pôle permanent de consultations gratuites pour les justiciables vulnérables, animé en binôme par des professeurs et de jeunes praticiens.',
    summaryEn: 'Opening of the first free legal aid center for vulnerable citizens, co-managed by law professors and young practitioners.',
    details: [
      'Permanences hebdomadaires sans condition de ressources dans les 8e et 18e arrondissements de Paris.',
      'Partenariat d\'application pratique avec les écoles d\'avocats et les facultés de droit.',
      'Plus de 1 200 dossiers de contentieux social et locatif instruits dès la première année.'
    ],
    detailsEn: [
      'Weekly consultations free of income requirements in Paris.',
      'Practical partnerships with bar schools and law faculties.',
      'Over 1,200 social and housing cases processed in the first year.'
    ],
    impact: 'Ancrage de l\'association dans la défense concrète des justiciables démunis.',
    impactEn: 'Anchoring the association in concrete legal aid for vulnerable populations.'
  },
  {
    year: '2010',
    period: 'Mars 2010',
    periodEn: 'March 2010',
    title: 'Premières Interventions QPC devant le Conseil Constitutionnel',
    titleEn: 'First Constitutional Briefs (QPC)',
    tag: 'Contentieux Stratégique',
    tagEn: 'Strategic Litigation',
    summary: 'Avec l\'entrée en vigueur de la Question Prioritaire de Constitutionnalité, l\'association se constitue en observateur qualifié en adressant des mémoires juridiques majeurs.',
    summaryEn: 'With the entry into force of the Constitutional Priority Question (QPC), the association acted as an expert observer submitting major amicus curiae briefs.',
    details: [
      'Mémoire amicus curiae dans la décision historique n° 2010-14/22 QPC relative à la garde à vue.',
      'Consécration prétorienne de la présence effective de l\'avocat dès la première heure d\'audition.',
      'Reconnaissance de l\'association comme interlocuteur doctrinal régulier par la rue de Montpensier.'
    ],
    detailsEn: [
      'Amicus curiae brief in the landmark police custody decision n° 2010-14/22 QPC.',
      'Establishment of the right to immediate legal representation during police custody.',
      'Recognition of the association as a key doctrinal contributor by the Constitutional Council.'
    ],
    impact: 'Consolidation des garanties procédurales fondamentales des citoyens.',
    impactEn: 'Consolidating fundamental procedural guarantees for citizens.'
  },
  {
    year: '2014',
    period: 'Novembre 2014',
    periodEn: 'November 2014',
    title: 'Reconnaissance d\'Intérêt Général & Agrément Scientifique',
    titleEn: 'Public Interest Recognition & Scientific Accreditation',
    tag: 'Institutionnel',
    tagEn: 'Institutional',
    summary: 'Au terme d\'un audit rigoureux de sa gouvernance, de ses comptes et de ses publications, Droit & Justice se voit confirmer le statut officiel d\'organisme d\'intérêt général.',
    summaryEn: 'Following a rigorous audit of its governance and research, Law & Justice was granted official public-interest entity status.',
    details: [
      'Droit d\'émettre des reçus fiscaux ouvrant droit aux réductions d\'impôt (CGI art. 200 et 238 bis).',
      'Création d\'un Comité Scientifique permanent doté d\'une évaluation par les pairs en double aveugle.',
      'Lancement de la Revue Annuelle de Jurisprudence Doctrinale diffusée dans toutes les cours d\'appel.'
    ],
    detailsEn: [
      'Authority to issue tax receipts for charitable donations.',
      'Creation of a permanent Scientific Committee with double-blind peer review.',
      'Launch of the Annual Doctrinal Review circulated across appellate courts.'
    ],
    impact: 'Indépendance financière durable garantie par la diversité de ses adhérents.',
    impactEn: 'Sustainable financial independence guaranteed by diverse membership.'
  },
  {
    year: '2019',
    period: 'Juin 2019',
    periodEn: 'June 2019',
    title: 'Création du Pôle Éthique & Justice Algorithmique',
    titleEn: 'Ethics & Algorithmic Justice Observatory',
    tag: 'Numérique & IA',
    tagEn: 'Digital & AI',
    summary: 'Face à l\'émergence de la justice prédictive et du traitement massif des données judiciaires, l\'association fonde un observatoire spécialisé d\'avant-garde.',
    summaryEn: 'In response to predictive justice and legal tech, the association launched an observatory on judicial data ethics.',
    details: [
      'Publication du Livre Blanc sur l\'interdiction du profilage systématique des magistrats.',
      'Avis d\'experts repris dans les débats préparatoires de la loi de programmation pour la justice.',
      'Élaboration d\'une Charte éthique pour l\'usage de l\'IA par les professions réglementées du droit.'
    ],
    detailsEn: [
      'Publication of the White Paper prohibiting systematic judicial profiling.',
      'Expert advice incorporated into parliamentary debates on justice reform.',
      'Drafting an Ethical Code for AI adoption by legal professionals.'
    ],
    impact: 'Pionnier européen de la régulation de l\'IA au service des libertés publiques.',
    impactEn: 'European pioneer in regulating AI for fundamental rights.'
  },
  {
    year: 'Aujourd\'hui',
    period: '2024 - 2026',
    periodEn: '2024 - 2026',
    title: 'Une Voix Incontournable pour la Justice du XXIe Siècle',
    titleEn: 'A Leading Voice for 21st-Century Justice',
    tag: 'Rayonnement',
    tagEn: 'Influence',
    summary: 'Forte de plus de 480 magistrats, professeurs, avocats et juristes d\'entreprise, l\'association continue d\'éclairer le débat parlementaire et international.',
    summaryEn: 'Uniting over 480 judges, professors, lawyers, and corporate counsel, the association continues to guide policy and international debates.',
    details: [
      'Plus de 15 colloques et tables rondes organisés chaque année.',
      'Partenariats actifs avec le Conseil National des Barreaux et la Conférence des Bâtonniers.',
      'Participation aux consultations de la Cour Européenne des Droits de l\'Homme à Strasbourg.'
    ],
    detailsEn: [
      'Over 15 annual conferences and roundtables.',
      'Active partnerships with the National Bar Council.',
      'Contributions to consultations at the European Court of Human Rights.'
    ],
    impact: 'Défense inaltérable de l\'État de droit et formation d\'une nouvelle génération de juristes.',
    impactEn: 'Steadfast defense of the rule of law and training future legal leaders.'
  }
];

export const HistoryView: React.FC<HistoryViewProps> = ({ onJoinClick, onNavigateTexts }) => {
  const { t, language } = useLanguage();
  const [selectedMilestone, setSelectedMilestone] = useState<number>(0);

  const isEn = language === 'en';

  return (
    <div className="pt-24 pb-28">
      {/* Header Banner */}
      <section className="bg-[#031632] text-white py-20 px-5 md:px-16 border-b border-[#1A2B48]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest">
              {isEn ? 'Association • History' : 'Association • Historique'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">1998 — 2026</span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            {isEn ? 'History of the Law & Justice Association' : 'Histoire de l\'Association Droit & Justice'}
          </h1>
          <p className="text-[#8293b5] text-lg max-w-3xl leading-relaxed">
            {isEn
              ? 'Born from the demand for legal independence, our association traces over a quarter century of civic engagement, doctrinal research, and advocacy for a fair, human, and protective justice system.'
              : 'Née de l\'exigence d\'indépendance de juristes renommés, notre association retrace plus d\'un quart de siècle d\'engagement civique, de combats doctrinaux et de plaidoyer pour une justice humaine, équitable et protectrice de chacun.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 mt-16 space-y-20">
        
        {/* Intro Manifesto */}
        <div className="bg-white rounded-xl p-8 md:p-12 border border-[#e2e2e2] shadow-sm grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block">
              {isEn ? 'Genesis & Mission' : 'Genèse & Vocation'}
            </span>
            <h2 className="font-playfair text-3xl font-semibold text-[#031632]">
              {isEn
                ? 'Over 25 years of intellectual independence serving the public good'
                : 'Plus de 25 ans d\'indépendance intellectuelle au service du bien public'}
            </h2>
            <p className="text-[#44474d] text-base leading-relaxed">
              {isEn
                ? 'In 1998, addressing the evolution of contemporary society and questions surrounding justice, a collective of legal scholars, judges, advocates, and law professors decided to break down professional silos.'
                : 'En 1998, face aux bouleversements de la société contemporaine et aux interrogations sur la place de la justice dans la République, un collectif de juristes issus de tous horizons — magistrats du siège et du parquet, avocats aux conseils, professeurs de droit privé et public — décide de rompre le cloisonnement des corps professionnels.'}
            </p>
            <p className="text-[#44474d] text-base leading-relaxed">
              {isEn
                ? 'Their shared conviction: the rule of law can only be guaranteed by a vibrant doctrine, free from political or financial ties, capable of proposing innovative solutions for citizens.'
                : 'Leur conviction commune : l\'État de droit ne peut être garanti que par une doctrine vivante, libre de toute attache politique ou financière, capable de formuler des propositions novatrices pour les justiciables.'}
            </p>
          </div>
          <div className="md:col-span-4 bg-[#f8f9fc] p-6 rounded-lg border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#031632] text-[#C5A059] flex items-center justify-center font-playfair font-bold text-lg">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-playfair font-bold text-lg text-[#031632]">
              {isEn ? '“Serve the Law without complacency or servility”' : '« Servir le Droit sans complaisance ni servilité »'}
            </h3>
            <p className="text-xs text-[#555] leading-relaxed italic">
              {isEn
                ? 'Motto inscribed at the head of our founding charter by the founders assembled on October 14, 1998 in Paris.'
                : 'Devise inscrite au frontispice de notre charte originelle par les fondateurs réunis le 14 octobre 1998 à Paris.'}
            </p>
            {onNavigateTexts && (
              <button
                onClick={onNavigateTexts}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#031632] hover:text-[#C5A059] transition-colors pt-2 cursor-pointer group"
              >
                <span>{isEn ? 'Consult founding documents' : 'Consulter les textes fondateurs'}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Timeline Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-2">
              {isEn ? 'Timeline' : 'Frise Chronologique'}
            </span>
            <h2 className="font-playfair text-3xl font-semibold text-[#031632]">
              {isEn ? 'Key Milestones of Our Trajectory' : 'Les Grands Jalons de Notre Trajectoire'}
            </h2>
            <p className="text-sm text-[#44474d] mt-2">
              {isEn
                ? 'Explore the decisive steps that built the reputation of Law & Justice.'
                : 'Explorez les étapes décisives qui ont forgé la réputation de rigueur et d\'engagement de Droit & Justice.'}
            </p>
          </div>

          {/* Timeline Selector Bar */}
          <div className="flex overflow-x-auto pb-4 gap-2 md:gap-3 border-b border-slate-200 mb-8 scrollbar-thin">
            {MILESTONES.map((m, idx) => {
              const isSelected = selectedMilestone === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedMilestone(idx)}
                  className={`flex-shrink-0 px-5 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#031632] text-white shadow-md'
                      : 'bg-white hover:bg-slate-50 text-[#333333] border border-slate-200'
                  }`}
                >
                  <span className={`text-xs block font-mono font-bold ${isSelected ? 'text-[#C5A059]' : 'text-slate-400'}`}>
                    {isEn && m.year === 'Aujourd\'hui' ? 'Today' : m.year}
                  </span>
                  <span className="text-sm font-semibold whitespace-nowrap block mt-0.5">
                    {isEn ? m.tagEn : m.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Milestone Detail Card */}
          {(() => {
            const current = MILESTONES[selectedMilestone];
            return (
              <div className="bg-white rounded-xl p-8 md:p-12 border border-[#e2e2e2] shadow-sm animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <span className="inline-block bg-[#031632]/5 text-[#031632] border border-[#031632]/15 px-3 py-1 rounded text-xs font-bold font-mono mr-3">
                      {isEn ? current.periodEn : current.period}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                      {isEn ? current.tagEn : current.tag}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {isEn ? `Milestone ${selectedMilestone + 1} of ${MILESTONES.length}` : `Jalon ${selectedMilestone + 1} sur ${MILESTONES.length}`}
                  </span>
                </div>

                <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#031632] mb-4">
                  {isEn ? current.titleEn : current.title}
                </h3>

                <p className="text-base text-[#44474d] leading-relaxed mb-8 max-w-4xl">
                  {isEn ? current.summaryEn : current.summary}
                </p>

                <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#031632] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                      <span>{isEn ? 'Key Actions and Achievements' : 'Actions et Réalisations Clés'}</span>
                    </h4>
                    <ul className="space-y-2.5">
                      {(isEn ? current.detailsEn : current.details).map((d, i) => (
                        <li key={i} className="text-xs sm:text-sm text-[#555] flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#fcfbf7] p-6 rounded-lg border border-[#e8dfc7] flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#C5A059]" />
                        <span>{isEn ? 'Lasting Impact' : 'Portée et Impact Pérenne'}</span>
                      </h4>
                      <p className="text-sm text-[#031632] font-semibold leading-relaxed">
                        {isEn ? current.impactEn : current.impact}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#e8dfc7]/60 text-xs text-slate-500">
                      {isEn ? 'Official archive stored in historical register.' : 'Archive officielle consignée au registre historique de l\'association.'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* The Founders' Heritage */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl border border-[#e2e2e2] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-[#f3f3f3] flex items-center justify-center text-[#C5A059] mb-4">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#031632] mb-3">
                {isEn ? 'Founders\' Heritage' : 'L\'Héritage des Fondateurs'}
              </h3>
              <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                {isEn
                  ? 'Driven by Dean Yves Guyon and key leaders of the Bar and judiciary, the association established a culture of rigorous debate.'
                  : 'Sous l\'impulsion du Doyen Yves Guyon et de figures majeures du Barreau et de la magistrature, l\'association a instauré une culture du débat rigoureux, refusant les simplifications populistes du droit.'}
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 italic">
              {isEn ? '“The legal scholar has a duty to think long-term in an immediate society.”' : '« Le juriste a le devoir de penser le temps long dans une société de l\'immédiateté. »'}
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-[#e2e2e2] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-[#f3f3f3] flex items-center justify-center text-[#C5A059] mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#031632] mb-3">
                {isEn ? 'Access to Justice' : 'Combat pour l\'Accès au Juge'}
              </h3>
              <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                {isEn
                  ? 'From free clinics to reports alerting on judicial delays, we work to ensure every citizen has their voice heard.'
                  : 'De la création de nos cliniques gratuites aux rapports alertant sur l\'encombrement judiciaire et les délais excessifs, nous œuvrons pour que chaque citoyen puisse voir sa cause entendue dignement.'}
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 italic">
              {isEn ? '“Overly slow or inaccessible justice is the first step toward relinquishing rights.”' : '« Une justice trop lente ou inaccessible est le premier pas vers le renoncement aux droits. »'}
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-[#e2e2e2] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-[#f3f3f3] flex items-center justify-center text-[#C5A059] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#031632] mb-3">
                {isEn ? 'Civil Liberties Protection' : 'Veille sur les Libertés Publiques'}
              </h3>
              <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                {isEn
                  ? 'Preserving institutional balance, proportionality, and defense of attorney-client privilege.'
                  : 'Préservation des équilibres institutionnels, proportionnalité des régimes d\'exception et défense inviolable du secret professionnel des avocats et de l\'indépendance de l\'autorité judiciaire.'}
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 italic">
              {isEn ? '“Freedom is never taken for granted; it relies on daily vigilance.”' : '« La liberté n\'est jamais acquise ; elle repose sur la vigilance quotidienne de ses sentinelles. »'}
            </div>
          </div>
        </div>

        {/* Join CTA banner */}
        <div className="bg-[#031632] text-white rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-[#C5A059]">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block">
              {isEn ? 'Partake in History' : 'Participez à l\'histoire'}
            </span>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold">
              {isEn ? 'Write the Next Chapter With Us' : 'Écrivez le prochain chapitre avec nous'}
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              {isEn
                ? 'Join over 480 professionals and academics dedicated to enriching legal thought and protecting the rule of law.'
                : 'Rejoignez plus de 480 professionnels et universitaires dévoués à l\'enrichissement de la pensée juridique et à la protection de l\'État de droit.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <button
              onClick={onJoinClick}
              className="bg-[#C5A059] hover:bg-[#d6b36e] text-[#031632] text-sm font-semibold px-6 py-3.5 rounded transition-all shadow-md cursor-pointer"
            >
              {t('nav.join')}
            </button>
            {onNavigateTexts && (
              <button
                onClick={onNavigateTexts}
                className="bg-transparent border border-white/30 hover:border-white text-white text-sm font-semibold px-6 py-3.5 rounded transition-all cursor-pointer"
              >
                {isEn ? 'Consult Documents' : 'Consulter les textes'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

