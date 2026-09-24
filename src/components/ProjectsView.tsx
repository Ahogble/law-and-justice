import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Users, 
  FileText, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Gavel, 
  Handshake, 
  Filter, 
  Search, 
  Calendar, 
  PlusCircle, 
  UserCheck, 
  Building2,
  Clock,
  Briefcase
} from 'lucide-react';
import { DisputeCategory, DisputeStage, DisputeOfficer, DisputeCase, DisputeStageConfig } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

const DEFAULT_DISPUTE_STAGES: DisputeStageConfig[] = [
  {
    id: 'stage-1',
    key: 'conciliation',
    stepNumber: 'Étape 1',
    title: 'Étape 1 : La Conciliation Interne',
    subtitle: 'Prévention et négociation amiable directe',
    description: "La conciliation interne constitue le premier degré de résolution des différends au sein de l'institution. Guidée par un conciliateur impartial désigné par la Commission de Déontologie, elle vise à restaurer le dialogue et à formaliser un accord transactionnel confidentiel sans recours aux tribunaux.",
    legalBasis: 'Article 12 du Règlement Intérieur - Charte de Conciliation 2024',
    confidentiality: 'Confidentialité absolue garantie par l\'article 226-13 du Code Pénal',
    officersTitle: 'Les Conciliateurs Assermentés',
    keyMetrics: [
      { label: "Taux d'accord amiable", value: "82%" },
      { label: "Délai moyen de traitement", value: "18 jours" },
      { label: "Conciliateurs assermentés", value: "8 juristes" }
    ]
  },
  {
    id: 'stage-2',
    key: 'mediation',
    stepNumber: 'Étape 2',
    title: 'Étape 2 : La Médiation Institutionnalisée',
    subtitle: 'Accompagnement méthodique par un tiers neutre et qualifié',
    description: "Lorsque la conciliation n'aboutit pas ou pour des litiges d'une complexité statutaire supérieure, la médiation intervient. Le médiateur indépendant aide les parties à dégager une solution mutuellement acceptable en s'appuyant sur les principes d'équité et de bonne foi.",
    legalBasis: "Articles 21 à 25 de la Charte d'Éthique & Ordonnance n° 2011-1540",
    confidentiality: 'Secret professionnel renforcé & Inopposabilité des échanges',
    officersTitle: 'Les Médiateurs Certifiés',
    keyMetrics: [
      { label: "Médiations réussies", value: "75%" },
      { label: "Durée moyenne", value: "35 jours" },
      { label: "Médiateurs certifiés", value: "6 experts" }
    ]
  },
  {
    id: 'stage-3',
    key: 'arbitrage',
    stepNumber: 'Étape 3',
    title: "Étape 3 : L'Arbitrage Interne & Tribunal Arbitral",
    subtitle: 'Juridiction arbitrale privée à sentence exécutoire',
    description: "L'arbitrage interne est l'ultime instance contentieuse propre à l'institution. Un collège d'arbitres indépendants instruit le dossier sous le sceau du secret, entend les parties et rend une sentence arbitrale ayant autorité de la chose jugée.",
    legalBasis: "Code de Procédure Civile (Livre IV) & Règlement d'Arbitrage Inst. Art. 40",
    confidentiality: 'Sentence confidentielle ou publique sur demande expresse des parties',
    officersTitle: 'Les Arbitres Titulaires',
    keyMetrics: [
      { label: "Sentences rendues", value: "100% exécutoires" },
      { label: "Délai moyen de sentence", value: "65 jours" },
      { label: "Arbitres titulaires", value: "5 magistrats" }
    ]
  }
];

const EXTERNAL_DISPUTE_TEXT = {
  title: "Litiges Externes & Recours Institutionnels",
  subtitle: "Gestion des contentieux avec des entités tierces, partenaires et instances internationales",
  description: "Le pôle Litiges Externes assure la défense des intérêts de l'institution, le suivi des contentieux juridictionnels externes (tribunaux administratifs, commerciaux, civils) et les saisines auprès des commissions d'arbitrage international ou des instances partenaires.",
  legalBasis: "Règlement du Contentieux Externe & Conventions de Partenariat Internationales",
  confidentiality: "Régime mixte selon le caractère public de la juridiction saisie",
  officersTitle: "Les Conseils & Intervenants Externes",
  keyMetrics: [
    { label: "Affaires externes suivies", value: "14 dossiers" },
    { label: "Règlement amiable externe", value: "60%" },
    { label: "Conseils extérieurs associés", value: "12 avocats" }
  ]
};

interface ProjectsViewProps {
  disputeOfficers?: DisputeOfficer[];
  disputeCases?: DisputeCase[];
  disputeStages?: DisputeStageConfig[];
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  disputeOfficers = [],
  disputeCases = [],
  disputeStages = []
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const internalStages: DisputeStageConfig[] = (disputeStages && disputeStages.length > 0)
    ? disputeStages
    : DEFAULT_DISPUTE_STAGES;

  // Primary tab: Interne vs Externe
  const [activeCategory, setActiveCategory] = useState<DisputeCategory>('interne');

  // Secondary sub-tab for Litiges Internes
  const [activeStage, setActiveStage] = useState<string>(internalStages[0]?.key || 'conciliation');

  // Filters for Cases
  const [caseFilter, setCaseFilter] = useState<'all' | 'public' | 'confidential'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedCase, setSelectedCase] = useState<DisputeCase | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<DisputeOfficer | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form submission state for new dispute
  const [submitForm, setSubmitForm] = useState({
    title: '',
    category: 'interne' as DisputeCategory,
    stage: 'conciliation' as DisputeStage,
    isPublic: true,
    parties: '',
    summary: '',
    email: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Normalize officers (handling snake_case DB columns and camelCase)
  const normalizedOfficers: DisputeOfficer[] = disputeOfficers.map((off: any) => ({
    id: off.id,
    name: off.name,
    title: off.title,
    role: off.role,
    stage: off.stage,
    category: off.category,
    specialties: typeof off.specialties === 'string' ? JSON.parse(off.specialties) : (off.specialties || []),
    experienceYears: off.experienceYears ?? off.experience_years ?? 10,
    casesHandled: off.casesHandled ?? off.cases_handled ?? 0,
    avatarUrl: off.avatarUrl || off.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    email: off.email,
    availability: off.availability || 'Disponible'
  }));

  // Normalize cases (handling snake_case DB columns and camelCase)
  const normalizedCases: DisputeCase[] = disputeCases.map((c: any) => ({
    id: c.id,
    caseNumber: c.caseNumber || c.case_number || c.id,
    title: c.title,
    category: c.category,
    stage: c.stage,
    isPublic: c.isPublic ?? (c.is_public === 1 || c.is_public === true || c.is_public === '1'),
    status: c.status,
    dateSubmitted: c.dateSubmitted || c.date_submitted || '',
    summary: c.summary,
    parties: c.parties,
    assignedOfficer: c.assignedOfficer || c.assigned_officer,
    confidentialityNote: c.confidentialityNote || c.confidentiality_note,
    resolutionTimeframe: c.resolutionTimeframe || c.resolution_timeframe
  }));

  // Filter officers based on current view
  const currentOfficers = normalizedOfficers.filter((off) => {
    if (activeCategory === 'externe') {
      return off.category === 'externe';
    }
    return off.category === 'interne' && off.stage === activeStage;
  });

  // Filter cases based on current view
  const currentCases = normalizedCases.filter((c) => {
    const matchesCategory = c.category === activeCategory;
    const matchesStage = activeCategory === 'externe' ? true : c.stage === activeStage;

    let matchesVisibility = true;
    if (caseFilter === 'public') matchesVisibility = c.isPublic;
    if (caseFilter === 'confidential') matchesVisibility = !c.isPublic;

    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch = 
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        (c.parties && c.parties.toLowerCase().includes(q)) ||
        c.summary.toLowerCase().includes(q);
    }

    return matchesCategory && matchesStage && matchesVisibility && matchesSearch;
  });

  // Stage stage texts
  const currentStageObj = internalStages.find(s => s.key === activeStage) || internalStages[0];

  const currentStageText = activeCategory === 'interne' 
    ? {
        title: currentStageObj?.title || 'Étape du litige',
        subtitle: currentStageObj?.subtitle || '',
        description: currentStageObj?.description || '',
        legalBasis: currentStageObj?.legalBasis || '',
        confidentiality: currentStageObj?.confidentiality || '',
        officersTitle: currentStageObj?.officersTitle || 'Les Intervenants & Officiels Neutres',
        keyMetrics: currentStageObj?.keyMetrics || []
      }
    : EXTERNAL_DISPUTE_TEXT;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setSubmitForm({
        title: '',
        category: 'interne',
        stage: 'conciliation',
        isPublic: true,
        parties: '',
        summary: '',
        email: ''
      });
    }, 2000);
  };

  const getStatusBadge = (status: DisputeCase['status']) => {
    switch (status) {
      case 'Accord Homologué':
        return <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {status}</span>;
      case 'Sentence Arbitrale':
        return <span className="bg-indigo-500/10 text-indigo-700 border border-indigo-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Gavel className="w-3 h-3" /> {status}</span>;
      case 'En cours':
        return <span className="bg-amber-500/10 text-amber-700 border border-amber-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> {status}</span>;
      case 'En instruction':
        return <span className="bg-blue-500/10 text-blue-700 border border-blue-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Briefcase className="w-3 h-3" /> {status}</span>;
      case 'Clôturé':
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="pt-24 pb-28 min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="bg-[#031632] text-white py-16 px-5 md:px-16 border-b border-[#1A2B48] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/20 mb-3">
                <Scale className="w-3.5 h-3.5" />
                {isEn ? 'Institutional Resolution & Arbitration' : 'Prévention, Conciliation & Arbitrage'}
              </span>
              <h1 className="font-playfair text-3xl md:text-5xl font-bold tracking-tight mb-3 text-white">
                {isEn ? 'Dispute Resolution Center' : 'Gestion & Règlement des Litiges'}
              </h1>
              <p className="text-[#8293b5] text-base md:text-lg max-w-3xl leading-relaxed">
                {isEn
                  ? 'Independent institutional framework dedicated to internal dispute resolution (conciliation, mediation, arbitration) and external litigation.'
                  : 'Cadre institutionnel indépendant dédié au traitement méthodique des litiges internes (conciliation, médiation, arbitrage) et au suivi des contentieux extérieurs.'}
              </p>
            </div>
            
            <div className="shrink-0">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#b08e4c] hover:to-[#C5A059] text-[#031632] font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-[#C5A059]/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>{isEn ? 'Submit a Dispute Case' : 'Soumettre un Litige'}</span>
              </button>
            </div>
          </div>

          {/* Primary Tabs Switcher: Litiges Internes vs Litiges Externes */}
          <div className="flex items-center gap-3 mt-10 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setActiveCategory('interne');
                setCaseFilter('all');
              }}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 cursor-pointer ${
                activeCategory === 'interne'
                  ? 'bg-white text-[#031632] shadow-md shadow-black/20'
                  : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white border border-white/10'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#C5A059]" />
              <span>{isEn ? 'Internal Disputes' : 'Litiges Internes'}</span>
            </button>

            <button
              onClick={() => {
                setActiveCategory('externe');
                setCaseFilter('all');
              }}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 cursor-pointer ${
                activeCategory === 'externe'
                  ? 'bg-white text-[#031632] shadow-md shadow-black/20'
                  : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white border border-white/10'
              }`}
            >
              <Users className="w-4 h-4 text-[#C5A059]" />
              <span>{isEn ? 'External Disputes & Recourse' : 'Litiges Externes'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 mt-8 space-y-10">

        {/* ------------------------------------------------------------- */}
        {/* LITIGES INTERNES STAGES SUB-NAV (Conciliation / Médiation / Arbitrage) */}
        {/* ------------------------------------------------------------- */}
        {activeCategory === 'interne' && (
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>{isEn ? 'Phases of Internal Dispute Resolution:' : 'Étapes du Règlement des Litiges Internes :'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {internalStages.map((stg, idx) => (
                <button
                  key={stg.id || stg.key || idx}
                  onClick={() => setActiveStage(stg.key)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    activeStage === stg.key
                      ? 'bg-gradient-to-br from-[#031632] to-[#0b2447] text-white border-[#031632] shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      activeStage === stg.key ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {stg.stepNumber || `Étape ${idx + 1}`}
                    </span>
                    <Handshake className={`w-5 h-5 ${activeStage === stg.key ? 'text-[#C5A059]' : 'text-slate-400'}`} />
                  </div>
                  <h3 className="font-playfair font-bold text-lg leading-snug">{stg.title ? stg.title.replace(/^Étape \d+\s*:\s*/i, '') : stg.key}</h3>
                  <p className={`text-xs mt-1 ${activeStage === stg.key ? 'text-slate-300' : 'text-slate-500'}`}>
                    {stg.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: LE TEXTE EXPLICATIF DE L'ÉTAPE / DE LA CATEGORIE */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
          <div className="border-l-4 border-[#C5A059] pl-6 py-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] block mb-1">
              Cadre Réglementaire & Procédure Officielle
            </span>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#031632]">
              {currentStageText.title}
            </h2>
            <p className="text-sm font-semibold text-slate-500 mt-0.5">
              {currentStageText.subtitle}
            </p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed mt-5">
            {currentStageText.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <FileText className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Base juridique</span>
                <span className="text-xs font-semibold text-[#031632]">{currentStageText.legalBasis}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Garantie de confidentialité</span>
                <span className="text-xs font-semibold text-[#031632]">{currentStageText.confidentiality}</span>
              </div>
            </div>
          </div>

          {/* Key indicators */}
          {currentStageText.keyMetrics && currentStageText.keyMetrics.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6 bg-[#031632]/5 p-4 rounded-xl border border-[#031632]/10">
              {currentStageText.keyMetrics.map((m, idx) => (
                <div key={idx} className="text-center">
                  <div className="font-playfair text-lg md:text-xl font-bold text-[#031632]">{m.value}</div>
                  <div className="text-[11px] text-[#031632]/80 font-medium">{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: LES INTERVENANTS (Conciliateurs / Médiateurs / Arbitres) */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-[#031632] flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#C5A059]" />
                {activeCategory === 'interne' ? (
                  currentStageText.officersTitle || 'Les Intervenants Assermentés'
                ) : 'Les Conseils & Intervenants Externes'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Officiels indépendants chargés d'instruire les procédures et de guider les parties.
              </p>
            </div>

            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
              {currentOfficers.length} officiels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentOfficers.map((officer) => (
              <div
                key={officer.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={officer.avatarUrl}
                      alt={officer.name}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-[#C5A059]/40 shadow-sm shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded border border-[#C5A059]/20">
                          {officer.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          officer.availability === 'Disponible' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : officer.availability === 'En audience'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {officer.availability}
                        </span>
                      </div>
                      <h3 className="font-playfair text-xl font-bold text-[#031632] mt-1">{officer.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{officer.role}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Expérience :</span>
                      <span className="font-bold text-[#031632]">{officer.experienceYears} ans de pratique</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Dossiers traités :</span>
                      <span className="font-bold text-[#031632]">{officer.casesHandled} affaires</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {officer.specialties.map((spec, i) => (
                      <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 truncate">{officer.email}</span>
                  <button
                    onClick={() => setSelectedOfficer(officer)}
                    className="bg-[#031632] hover:bg-[#1A2B48] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <span>Saisir cet officiel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: LES AFFAIRES PROPREMENT DITES (DOSSIERS DE LITIGES) */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-[#031632] flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-[#C5A059]" />
                {isEn ? 'Registered Dispute Cases' : 'Les Affaires & Dossiers de Litiges'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rôles des affaires en cours et décisions homologuées (Publiques ou Confidentielles).
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher une affaire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C5A059] w-48 sm:w-60 shadow-xs"
                />
              </div>

              {/* Visibility filters */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                <button
                  onClick={() => setCaseFilter('all')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    caseFilter === 'all' ? 'bg-[#031632] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setCaseFilter('public')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    caseFilter === 'public' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Unlock className="w-3 h-3" />
                  Publiques
                </button>
                <button
                  onClick={() => setCaseFilter('confidential')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    caseFilter === 'confidential' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  Confidentielles
                </button>
              </div>
            </div>
          </div>

          {/* Cases Grid */}
          {currentCases.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-60" />
              <h3 className="font-playfair font-bold text-lg text-slate-800">Aucune affaire ne correspond à ces critères</h3>
              <p className="text-xs text-slate-500 mt-1">
                Essayez de modifier votre recherche ou d'afficher toutes les affaires publiques et confidentielles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentCases.map((dispute) => (
                <div
                  key={dispute.id}
                  onClick={() => setSelectedCase(dispute)}
                  className={`rounded-2xl border p-6 shadow-sm transition-all cursor-pointer flex flex-col justify-between group ${
                    dispute.isPublic
                      ? 'bg-white border-slate-200 hover:border-[#C5A059]'
                      : 'bg-slate-950 text-white border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  <div>
                    {/* Header line: Case Number + Public/Confidential Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded ${
                          dispute.isPublic ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {dispute.caseNumber}
                        </span>

                        {dispute.isPublic ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded">
                            <Unlock className="w-3 h-3" />
                            Publique
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                            <Lock className="w-3 h-3 text-amber-400" />
                            Non Publique (Confidentielle)
                          </span>
                        )}
                      </div>

                      {getStatusBadge(dispute.status)}
                    </div>

                    {/* Title */}
                    <h3 className={`font-playfair text-xl font-bold mb-3 transition-colors ${
                      dispute.isPublic 
                        ? 'text-[#031632] group-hover:text-[#C5A059]' 
                        : 'text-slate-100 group-hover:text-amber-400'
                    }`}>
                      {dispute.title}
                    </h3>

                    {/* Summary (Blur if non public) */}
                    {dispute.isPublic ? (
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {dispute.summary}
                      </p>
                    ) : (
                      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl mb-4 relative overflow-hidden">
                        <p className="text-xs text-slate-400 blur-[2.5px] select-none pointer-events-none">
                          {dispute.summary}
                        </p>
                        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 text-center">
                          <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                            Contenu réservé aux parties habilitées
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Parties info */}
                    <div className={`p-3 rounded-xl border text-xs mb-4 ${
                      dispute.isPublic 
                        ? 'bg-slate-50 border-slate-100 text-slate-700' 
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Parties concernées :</span>
                        <span className="font-semibold">{dispute.parties || 'Non divulguées'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                    dispute.isPublic ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      Saisi le : {dispute.dateSubmitted}
                    </span>

                    <span className="font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[#C5A059]">
                      Consulter la fiche <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: CONSULTATION D'UNE AFFAIRE (DOSSIER) */}
      {/* ------------------------------------------------------------- */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className={`p-6 relative text-white ${selectedCase.isPublic ? 'bg-[#031632]' : 'bg-slate-950 border-b border-slate-800'}`}>
              <button
                onClick={() => setSelectedCase(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded text-white">
                  {selectedCase.caseNumber}
                </span>
                {selectedCase.isPublic ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Affaire Publique
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Affaire Confidentielle
                  </span>
                )}
              </div>

              <h2 className="font-playfair text-2xl font-bold text-white pr-8">
                {selectedCase.title}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Statut de la procédure</span>
                  <div className="mt-1">{getStatusBadge(selectedCase.status)}</div>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Officiel en charge</span>
                  <span className="font-bold text-[#031632] block mt-1">{selectedCase.assignedOfficer || 'Non assigné'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Date de saisine</span>
                  <span className="font-semibold text-slate-700 block mt-0.5">{selectedCase.dateSubmitted}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Délai prévisionnel</span>
                  <span className="font-semibold text-slate-700 block mt-0.5">{selectedCase.resolutionTimeframe || 'En cours'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Synthèse du dossier
                </h4>
                {selectedCase.isPublic ? (
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedCase.summary}
                  </p>
                ) : (
                  <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                      <Lock className="w-4 h-4" />
                      Notice de Confidentialité Absolue
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedCase.confidentialityNote || "Les détails de cette affaire sont protégés par le secret professionnel et le statut confidentiel des procédures arbitrales et de médiation."}
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      Seules les parties régulièrement inscrites à la procédure et leurs conseils juridiques désignés peuvent solliciter l'accès au registre des pièces.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Parties & Qualité des intervenants
                </h4>
                <div className="text-sm font-semibold text-[#031632] bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {selectedCase.parties || 'Confidentiel'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Extrait du Registre Officiel des Litiges
              </span>
              <button
                onClick={() => setSelectedCase(null)}
                className="bg-[#031632] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#1A2B48] transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: SAISIR UN INTERVENANT / CONTACTER UN CONCILIATEUR */}
      {/* ------------------------------------------------------------- */}
      {selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#031632] text-white p-6 relative">
              <button
                onClick={() => setSelectedOfficer(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={selectedOfficer.avatarUrl}
                  alt={selectedOfficer.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#C5A059]"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                    Demande de Saisine / Consultation
                  </span>
                  <h3 className="font-playfair text-xl font-bold text-white">{selectedOfficer.name}</h3>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Vous souhaitez solliciter <strong>{selectedOfficer.name}</strong> ({selectedOfficer.title}) pour une procédure de <strong>{selectedOfficer.stage}</strong>. Veuillez indiquer vos coordonnées ci-dessous.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Votre Nom complet & Organisme</label>
                  <input
                    type="text"
                    placeholder="ex: Jean Dupont - Membre Titulaire"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Votre Adresse Email</label>
                  <input
                    type="email"
                    placeholder="jean.dupont@email.fr"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Objet synthétique du litige</label>
                  <textarea
                    rows={3}
                    placeholder="Décrivez brièvement la nature de votre différend..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Votre demande sera transmise sous pli confidentiel au Secrétariat de la Commission d'Éthique.</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedOfficer(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  alert(`Demande de saisine transmise avec succès à ${selectedOfficer.name}. Vous recevrez un accusé de réception confidentiel.`);
                  setSelectedOfficer(null);
                }}
                className="bg-[#031632] hover:bg-[#1A2B48] text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Envoyer la Demande
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: SOUMETTRE UN NOUVEAU LITIGE (FORMULAIRE COMPLET) */}
      {/* ------------------------------------------------------------- */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#031632] text-white p-6 relative">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest block mb-1">
                Formulaire Officiel de Saisine
              </span>
              <h2 className="font-playfair text-2xl font-bold text-white">
                Soumission d'une Demande de Litige
              </h2>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                <h3 className="font-playfair font-bold text-xl text-[#031632]">Demande Enregistrée avec Succès</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Votre dossier de litige a été transmis de manière confidentielle au Secrétariat Général. Un numéro de dossier provisoire vous sera communiqué par email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie du litige</label>
                    <select
                      value={submitForm.category}
                      onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value as DisputeCategory })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="interne">Litige Interne</option>
                      <option value="externe">Litige Externe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phase souhaitée</label>
                    <select
                      value={submitForm.stage}
                      onChange={(e) => setSubmitForm({ ...submitForm, stage: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C5A059]"
                    >
                      {internalStages.map((stg, idx) => (
                        <option key={stg.id || stg.key || idx} value={stg.key}>
                          {stg.stepNumber ? `${stg.stepNumber} : ` : ''}{stg.title ? stg.title.replace(/^Étape \d+\s*:\s*/i, '') : stg.key}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Intitulé du différend</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Contestation de la répartition des droits de publication..."
                    value={submitForm.title}
                    onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parties impliquées</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Demandeur X c/ Partie Y"
                    value={submitForm.parties}
                    onChange={(e) => setSubmitForm({ ...submitForm, parties: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exposé des faits & Synthèse</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Détaillez les circonstances, les textes applicables et les demandes..."
                    value={submitForm.summary}
                    onChange={(e) => setSubmitForm({ ...submitForm, summary: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut de diffusion souhaité</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="isPublic"
                        checked={submitForm.isPublic}
                        onChange={() => setSubmitForm({ ...submitForm, isPublic: true })}
                        className="accent-[#C5A059]"
                      />
                      Publique (Fiche synthétique publique)
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="isPublic"
                        checked={!submitForm.isPublic}
                        onChange={() => setSubmitForm({ ...submitForm, isPublic: false })}
                        className="accent-[#C5A059]"
                      />
                      Confidentielle (Huis clos absolu)
                    </label>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                  En soumettant cette saisine, vous confirmez l'exactitude des renseignements et acceptez le règlement de procédure de l'institution.
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-[#031632] hover:bg-[#1A2B48] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Déposer la Saisine Officielle
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
