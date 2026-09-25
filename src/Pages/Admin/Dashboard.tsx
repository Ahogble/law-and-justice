import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
  Shield,
  LogOut,
  FileText,
  Users,
  Briefcase,
  Calendar,
  BookOpen,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  ExternalLink,
  Save,
  Globe,
  Tag,
  FolderTree,
  Scale,
  Gavel,
  Handshake,
  Lock,
  Unlock,
  UserCheck,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  UserPlus,
  SlidersHorizontal,
  Mail,
  Award
} from 'lucide-react';
import { MemberCategory, MemberSubcategory } from '../../types';

const FALLBACK_CATEGORIES: MemberCategory[] = [
  {
    id: 'cat-1',
    name: "Conseil d'Administration",
    nameEn: "Board of Directors",
    subcategories: [
      { id: 'sub-1-1', name: 'National', nameEn: 'National' },
      { id: 'sub-1-2', name: 'Local', nameEn: 'Local' }
    ]
  }
];

interface Props {
  articles: any[];
  members: any[];
  projects: any[];
  activities: any[];
  legalTexts: any[];
  disputeOfficers?: any[];
  disputeCases?: any[];
  disputeStages?: any[];
  memberCategories?: MemberCategory[];
  settings: {
    hero_title: string;
    hero_subtitle: string;
    about_mission: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
  };
}

const DEFAULT_DISPUTE_STAGES_FALLBACK = [
  {
    id: 'stage-1',
    key: 'conciliation',
    stepNumber: 'Étape 1',
    title: 'Étape 1 : La Conciliation Interne',
    subtitle: 'Prévention et négociation amiable directe',
    description: "La conciliation interne constitue le premier degré de résolution des différends au sein de l'institution. Guidée par un conciliateur impartial désigné par la Commission de Déontologie, elle vise à restaurer le dialogue et à formaliser un accord transactionnel confidentiel sans recours aux tribunaux.",
    legalBasis: 'Article 12 du Règlement Intérieur - Charte de Conciliation 2024',
    confidentiality: 'Confidentialité absolue garantie par l\'article 226-13 du Code Pénal',
    officersTitle: 'Les Conciliateurs Assermentés'
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
    officersTitle: 'Les Médiateurs Certifiés'
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
    officersTitle: 'Les Arbitres Titulaires'
  }
];

export default function Dashboard({
  articles = [],
  members = [],
  projects = [],
  activities = [],
  legalTexts = [],
  disputeOfficers = [],
  disputeCases = [],
  disputeStages = [],
  memberCategories = [],
  settings
}: Props) {
  const { flash } = usePage().props as any;
  const [activeTab, setActiveTab] = useState<'articles' | 'members' | 'categories' | 'projects' | 'activities' | 'texts' | 'disputes' | 'settings'>('articles');
  const [disputeSubTab, setDisputeSubTab] = useState<'officers' | 'cases' | 'stages'>('officers');
  const [isDisputesMenuOpen, setIsDisputesMenuOpen] = useState(true);

  // Officers Search, Filter & Sorting state
  const [officerSearchQuery, setOfficerSearchQuery] = useState('');
  const [officerRoleFilter, setOfficerRoleFilter] = useState('all');
  const [officerAvailabilityFilter, setOfficerAvailabilityFilter] = useState('all');
  const [officerSortBy, setOfficerSortBy] = useState('name-asc');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initialCategories: MemberCategory[] = (memberCategories && memberCategories.length > 0)
    ? memberCategories
    : FALLBACK_CATEGORIES;

  const [categoriesList, setCategoriesList] = useState<MemberCategory[]>(initialCategories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');

  // Form state for creating a new subcategory for each category
  const [subcatInputs, setSubcatInputs] = useState<Record<string, { name: string; nameEn: string }>>({});

  // --- Modal Form State ---
  const [articleForm, setArticleForm] = useState({ id: '', title: '', category: 'Doctrine', excerpt: '', content: '', author_name: 'Hélène de Saint-Maur', author_role: 'Avocate', read_time: '5 min' });
  const [memberForm, setMemberForm] = useState({ id: '', name: '', role: '', organization: '', category: initialCategories[0]?.name || "Conseil d'Administration", subcategory: initialCategories[0]?.subcategories[0]?.name || '', bio: '', email: '' });
  const [projectForm, setProjectForm] = useState({ id: '', title: '', category: 'Réforme', status: 'En cours', description: '', lead: '', progress: 50 });
  const [activityForm, setActivityForm] = useState({ id: '', title: '', type: 'Colloque', status: 'À venir', date: '', location: '', description: '' });
  const [legalTextForm, setLegalTextForm] = useState({ id: '', title: '', reference: '', category: 'Doctrine', date: '', summary: '' });
  
  // Dispute Forms State
  const [disputeOfficerForm, setDisputeOfficerForm] = useState({
    id: '',
    name: '',
    title: 'Médiateur Certifié',
    role: 'Médiateur',
    stage: 'mediation',
    category: 'interne',
    specialties: '',
    experience_years: 10,
    cases_handled: 5,
    avatar_url: '',
    email: '',
    availability: 'Disponible'
  });

  const [disputeCaseForm, setDisputeCaseForm] = useState({
    id: '',
    case_number: '',
    title: '',
    category: 'interne',
    stage: 'conciliation',
    is_public: true,
    status: 'En cours',
    date_submitted: '',
    summary: '',
    parties: '',
    assigned_officer: '',
    confidentiality_note: '',
    resolution_timeframe: '30 jours'
  });

  // Stages List & Form State
  const initialDisputeStages = (disputeStages && disputeStages.length > 0) ? disputeStages : DEFAULT_DISPUTE_STAGES_FALLBACK;
  const [stagesList, setStagesList] = useState<any[]>(initialDisputeStages);
  const [disputeStageForm, setDisputeStageForm] = useState({
    id: '',
    key: '',
    stepNumber: '',
    title: '',
    subtitle: '',
    description: '',
    legalBasis: '',
    confidentiality: '',
    officersTitle: ''
  });
  
  // Settings Form State
  const [siteSettings, setSiteSettings] = useState(settings || {
    hero_title: '',
    hero_subtitle: '',
    about_mission: '',
    contact_email: '',
    contact_phone: '',
    contact_address: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const saveCategoryStructure = (newList: MemberCategory[]) => {
    setCategoriesList(newList);
    router.post('/admin/member-categories', { categories: newList });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: MemberCategory = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      nameEn: newCatNameEn.trim() || newCatName.trim(),
      subcategories: []
    };
    const updated = [...categoriesList, newCat];
    saveCategoryStructure(updated);
    setNewCatName('');
    setNewCatNameEn('');
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('Voulez-vous supprimer cette catégorie et ses sous-catégories ?')) {
      const updated = categoriesList.filter(c => c.id !== catId);
      saveCategoryStructure(updated);
    }
  };

  const handleAddSubcategory = (catId: string, e: React.FormEvent) => {
    e.preventDefault();
    const input = subcatInputs[catId];
    if (!input || !input.name.trim()) return;
    const updated = categoriesList.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          subcategories: [
            ...cat.subcategories,
            {
              id: 'sub-' + Date.now(),
              name: input.name.trim(),
              nameEn: input.nameEn.trim() || input.name.trim()
            }
          ]
        };
      }
      return cat;
    });
    saveCategoryStructure(updated);
    setSubcatInputs({ ...subcatInputs, [catId]: { name: '', nameEn: '' } });
  };

  const handleDeleteSubcategory = (catId: string, subId: string) => {
    if (confirm('Supprimer cette sous-catégorie ?')) {
      const updated = categoriesList.map(cat => {
        if (cat.id === catId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(s => s.id !== subId)
          };
        }
        return cat;
      });
      saveCategoryStructure(updated);
    }
  };

  const handleLogout = () => {
    router.post('/logout');
  };

  // --- Article submit ---
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/admin/articles', articleForm, {
      onSuccess: () => {
        setIsEditing(false);
        setArticleForm({ id: '', title: '', category: 'Doctrine', excerpt: '', content: '', author_name: 'Hélène de Saint-Maur', author_role: 'Avocate', read_time: '5 min' });
      }
    });
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      router.delete(`/admin/articles/${id}`);
    }
  };

  // --- Member submit ---
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/admin/members', memberForm, {
      onSuccess: () => {
        setIsEditing(false);
        setMemberForm({ id: '', name: '', role: '', organization: '', category: categoriesList[0]?.name || "Conseil d'Administration", subcategory: categoriesList[0]?.subcategories[0]?.name || '', bio: '', email: '' });
      }
    });
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Supprimer ce membre ?')) {
      router.delete(`/admin/members/${id}`);
    }
  };

  // --- Project submit ---
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/admin/projects', projectForm, {
      onSuccess: () => {
        setIsEditing(false);
        setProjectForm({ id: '', title: '', category: 'Réforme', status: 'En cours', description: '', lead: '', progress: 50 });
      }
    });
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Supprimer ce projet ?')) {
      router.delete(`/admin/projects/${id}`);
    }
  };

  // --- Activity submit ---
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/admin/activities', activityForm, {
      onSuccess: () => {
        setIsEditing(false);
        setActivityForm({ id: '', title: '', type: 'Colloque', status: 'À venir', date: '', location: '', description: '' });
      }
    });
  };

  const handleDeleteActivity = (id: string) => {
    if (confirm('Supprimer cette activité ?')) {
      router.delete(`/admin/activities/${id}`);
    }
  };

  // --- Legal Text submit ---
  const handleSaveLegalText = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/admin/legal-texts', legalTextForm, {
      onSuccess: () => {
        setIsEditing(false);
        setLegalTextForm({ id: '', title: '', reference: '', category: 'Doctrine', date: '', summary: '' });
      }
    });
  };

  const handleDeleteLegalText = (id: string) => {
    if (confirm('Supprimer ce texte juridique ?')) {
      router.delete(`/admin/legal-texts/${id}`);
    }
  };

  // --- Dispute Officers submit ---
  const handleSaveDisputeOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    const savedName = disputeOfficerForm.name;
    router.post('/admin/dispute-officers', disputeOfficerForm, {
      onSuccess: () => {
        setIsEditing(false);
        setSuccessMessage(`L'intervenant "${savedName}" a été enregistré avec succès !`);
        setDisputeOfficerForm({
          id: '',
          name: '',
          title: 'Médiateur Certifié',
          role: 'Médiateur',
          stage: 'mediation',
          category: 'interne',
          specialties: '',
          experience_years: 10,
          cases_handled: 5,
          avatar_url: '',
          email: '',
          availability: 'Disponible'
        });
      }
    });
  };

  const handleDeleteDisputeOfficer = (id: string) => {
    if (confirm('Supprimer cet officiel de litige ?')) {
      router.delete(`/admin/dispute-officers/${id}`);
    }
  };

  // --- Dispute Cases submit ---
  const handleSaveDisputeCase = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/admin/dispute-cases', disputeCaseForm, {
      onSuccess: () => {
        setIsEditing(false);
        setDisputeCaseForm({
          id: '',
          case_number: '',
          title: '',
          category: 'interne',
          stage: 'conciliation',
          is_public: true,
          status: 'En cours',
          date_submitted: '',
          summary: '',
          parties: '',
          assigned_officer: '',
          confidentiality_note: '',
          resolution_timeframe: '30 jours'
        });
      }
    });
  };

  const handleDeleteDisputeCase = (id: string) => {
    if (confirm('Supprimer cette affaire de litige ?')) {
      router.delete(`/admin/dispute-cases/${id}`);
    }
  };

  // --- Dispute Stages submit ---
  const saveDisputeStagesStructure = (newList: any[]) => {
    setStagesList(newList);
    router.post('/admin/dispute-stages', { stages: newList });
  };

  const handleAddOrUpdateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeStageForm.title.trim()) return;

    let updated: any[];
    if (disputeStageForm.id) {
      updated = stagesList.map(s => s.id === disputeStageForm.id ? disputeStageForm : s);
    } else {
      const generatedKey = disputeStageForm.key || disputeStageForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || `stage-${Date.now()}`;
      const newStage = {
        ...disputeStageForm,
        id: 'stage-' + Date.now(),
        key: generatedKey,
        stepNumber: disputeStageForm.stepNumber || `Étape ${stagesList.length + 1}`
      };
      updated = [...stagesList, newStage];
    }

    saveDisputeStagesStructure(updated);
    setIsEditing(false);
    setDisputeStageForm({
      id: '',
      key: '',
      stepNumber: '',
      title: '',
      subtitle: '',
      description: '',
      legalBasis: '',
      confidentiality: '',
      officersTitle: ''
    });
  };

  const handleDeleteStage = (id: string) => {
    if (confirm('Voulez-vous supprimer cette étape de litige interne ?')) {
      const updated = stagesList.filter(s => s.id !== id);
      saveDisputeStagesStructure(updated);
    }
  };

  // --- Settings submit ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/admin/settings', siteSettings);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans selection:bg-amber-500 selection:text-white flex flex-col">
      <Head title="Tableau de Bord Back-Office — Droit & Justice" />
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 font-bold">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
              Droit & Justice <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/60 font-semibold">Back-Office</span>
            </h1>
            <p className="text-xs text-slate-500">Système de gestion des contenus publics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 text-xs text-slate-700 hover:text-amber-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/70 rounded-xl transition-all flex items-center gap-2 font-medium"
          >
            <Globe className="w-4 h-4" />
            <span>Voir le site public</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 rounded-xl transition-all flex items-center gap-2 cursor-pointer font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Gestion des Rubriques</div>
          
          <button
            onClick={() => { setActiveTab('articles'); setIsEditing(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'articles' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-semibold' : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Articles (Blog)</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === 'articles' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{articles.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('members'); setIsEditing(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'members' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-semibold' : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Membres</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === 'members' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{members.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('categories'); setIsEditing(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'categories' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-semibold' : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Catégories Membres</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === 'categories' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{categoriesList.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('projects'); setIsEditing(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'projects' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-semibold' : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Projets</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{projects.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('activities'); setIsEditing(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'activities' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-semibold' : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Activités & Agenda</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === 'activities' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{activities.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('texts'); setIsEditing(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'texts' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-semibold' : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Textes Juridiques</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === 'texts' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{legalTexts.length}</span>
          </button>

          {/* Submenu group for Litiges & Procédures */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setIsDisputesMenuOpen(!isDisputesMenuOpen);
                if (!isDisputesMenuOpen && activeTab !== 'disputes') {
                  setActiveTab('disputes');
                  setDisputeSubTab('officers');
                }
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'disputes'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>Litiges & Procédures</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-amber-800 font-bold border border-amber-300/50">
                  {disputeOfficers.length + disputeCases.length}
                </span>
                {isDisputesMenuOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {/* Submenus List */}
            {isDisputesMenuOpen && (
              <div className="ml-3 pl-3 border-l-2 border-slate-200 space-y-1 pt-1">
                {/* Submenu 1: Enregistrer les conciliateurs/médiateurs/Arbitre */}
                <button
                  onClick={() => {
                    setActiveTab('disputes');
                    setDisputeSubTab('officers');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'disputes' && disputeSubTab === 'officers'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Enregistrer les conciliateurs/médiateurs/Arbitre</span>
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'disputes' && disputeSubTab === 'officers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{disputeOfficers.length}</span>
                </button>

                {/* Submenu 2: Dossiers & Affaires Litigieuses */}
                <button
                  onClick={() => {
                    setActiveTab('disputes');
                    setDisputeSubTab('cases');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'disputes' && disputeSubTab === 'cases'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Dossiers & Affaires Litigieuses</span>
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'disputes' && disputeSubTab === 'cases' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{disputeCases.length}</span>
                </button>

                {/* Submenu 3: Étapes des Litiges Internes */}
                <button
                  onClick={() => {
                    setActiveTab('disputes');
                    setDisputeSubTab('stages');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'disputes' && disputeSubTab === 'stages'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Étapes des Litiges Internes</span>
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'disputes' && disputeSubTab === 'stages' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{stagesList.length}</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => { setActiveTab('settings'); setIsEditing(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'settings' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-semibold' : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Textes des Pages</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          {flash?.message && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{flash.message}</span>
            </div>
          )}

          {/* TAB 1: ARTICLES */}
          {activeTab === 'articles' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">Articles & Publications</h2>
                  <p className="text-xs text-slate-500">Gérez les articles de doctrine et les actualités publiées.</p>
                </div>
                <button
                  onClick={() => {
                    setArticleForm({ id: '', title: '', category: 'Doctrine', excerpt: '', content: '', author_name: 'Hélène de Saint-Maur', author_role: 'Avocate', read_time: '5 min' });
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvel Article</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveArticle} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-xs">
                  <h3 className="font-semibold text-amber-700 text-sm mb-2">{articleForm.id ? 'Modifier l\'article' : 'Créer un nouvel article'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Titre</label>
                      <input
                        type="text"
                        required
                        value={articleForm.title}
                        onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                      <select
                        value={articleForm.category}
                        onChange={e => setArticleForm({ ...articleForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      >
                        <option value="Doctrine">Doctrine</option>
                        <option value="Jurisprudence">Jurisprudence</option>
                        <option value="Actualité">Actualité</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Résumé (Chapeau)</label>
                    <textarea
                      required
                      rows={2}
                      value={articleForm.excerpt}
                      onChange={e => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contenu complet</label>
                    <textarea
                      required
                      rows={5}
                      value={articleForm.content}
                      onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Auteur</label>
                      <input
                        type="text"
                        value={articleForm.author_name}
                        onChange={e => setArticleForm({ ...articleForm, author_name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Temps de lecture</label>
                      <input
                        type="text"
                        value={articleForm.read_time}
                        onChange={e => setArticleForm({ ...articleForm, read_time: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Enregistrer
                    </button>
                  </div>
                </form>
              ) : null}

              <div className="space-y-3">
                {articles.map((art: any) => (
                  <div key={art.id} className="p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4 shadow-2xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{art.category}</span>
                        <span className="text-xs text-slate-500">{art.published_at}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{art.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{art.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setArticleForm(art);
                          setIsEditing(true);
                        }}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MEMBERS */}
          {activeTab === 'members' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">Gestion des Membres</h2>
                  <p className="text-xs text-slate-500">Gérez les fiches des dirigeants et membres titulaires.</p>
                </div>
                <button
                  onClick={() => {
                    const firstCat = categoriesList[0];
                    setMemberForm({ id: '', name: '', role: '', organization: '', category: firstCat?.name || "Conseil d'Administration", subcategory: firstCat?.subcategories[0]?.name || '', bio: '', email: '' });
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Membre</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveMember} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-xs">
                  <h3 className="font-semibold text-amber-700 text-sm mb-2">{memberForm.id ? 'Modifier le membre' : 'Ajouter un membre'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nom complet</label>
                      <input
                        type="text"
                        required
                        value={memberForm.name}
                        onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle / Titre</label>
                      <input
                        type="text"
                        required
                        value={memberForm.role}
                        onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Organisation / Institution</label>
                      <input
                        type="text"
                        value={memberForm.organization}
                        onChange={e => setMemberForm({ ...memberForm, organization: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie Principale</label>
                      <select
                        value={memberForm.category}
                        onChange={e => {
                          const selectedCatName = e.target.value;
                          const foundCat = categoriesList.find(c => c.name === selectedCatName);
                          setMemberForm({
                            ...memberForm,
                            category: selectedCatName,
                            subcategory: foundCat?.subcategories[0]?.name || ''
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      >
                        {categoriesList.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Sous-catégorie</label>
                      <select
                        value={memberForm.subcategory || ''}
                        onChange={e => setMemberForm({ ...memberForm, subcategory: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      >
                        <option value="">-- Aucune --</option>
                        {(categoriesList.find(c => c.name === memberForm.category)?.subcategories || []).map(sub => (
                          <option key={sub.id} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Biographie</label>
                    <textarea
                      rows={3}
                      value={memberForm.bio}
                      onChange={e => setMemberForm({ ...memberForm, bio: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/20"><Save className="w-4 h-4" /> Enregistrer</button>
                  </div>
                </form>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((mem: any) => (
                  <div key={mem.id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        {mem.category} {mem.subcategory ? `• ${mem.subcategory}` : ''}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base">{mem.name}</h4>
                      <p className="text-xs text-slate-600">{mem.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setMemberForm(mem); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-200/60 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteMember(mem.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES & SUBCATEGORIES */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">Catégories & Sous-catégories de Membres</h2>
                  <p className="text-xs text-slate-500">Configurez les catégories principales et leurs sous-catégories (ex: Conseil d'Administration → National / Local).</p>
                </div>
              </div>

              {/* Add New Category Form */}
              <form onSubmit={handleAddCategory} className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-8 space-y-4 shadow-xs">
                <h3 className="font-semibold text-amber-700 text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Ajouter une Catégorie Principale
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom (Français)</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Conseil d'Administration"
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom (Anglais)</label>
                    <input
                      type="text"
                      placeholder="ex: Board of Directors"
                      value={newCatNameEn}
                      onChange={e => setNewCatNameEn(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" /> Créer la Catégorie
                  </button>
                </div>
              </form>

              {/* Existing Categories List */}
              <div className="space-y-6">
                {categoriesList.map(cat => (
                  <div key={cat.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-3">
                        <FolderTree className="w-5 h-5 text-amber-600" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{cat.name}</h4>
                          <p className="text-xs text-slate-500">Anglais : {cat.nameEn || cat.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer la catégorie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subcategories */}
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Sous-catégories ({cat.subcategories.length})
                      </div>
                      {cat.subcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {cat.subcategories.map(sub => (
                            <span
                              key={sub.id}
                              className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-800 text-xs px-3 py-1.5 rounded-lg shadow-2xs"
                            >
                              <Tag className="w-3 h-3 text-amber-600" />
                              <span className="font-semibold">{sub.name}</span>
                              <span className="text-[10px] text-slate-500">({sub.nameEn || sub.name})</span>
                              <button
                                onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                                className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1 font-bold"
                                title="Supprimer la sous-catégorie"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic mb-4">Aucune sous-catégorie configurée pour cette catégorie.</p>
                      )}

                      {/* Add Subcategory Inline Form */}
                      <form
                        onSubmit={e => handleAddSubcategory(cat.id, e)}
                        className="flex flex-col sm:flex-row items-center gap-2 bg-white p-3 rounded-lg border border-slate-200"
                      >
                        <input
                          type="text"
                          required
                          placeholder="Nom (FR) ex: National"
                          value={subcatInputs[cat.id]?.name || ''}
                          onChange={e => setSubcatInputs({
                            ...subcatInputs,
                            [cat.id]: { ...(subcatInputs[cat.id] || { nameEn: '' }), name: e.target.value }
                          })}
                          className="w-full sm:w-48 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                        />
                        <input
                          type="text"
                          placeholder="Nom (EN) ex: National"
                          value={subcatInputs[cat.id]?.nameEn || ''}
                          onChange={e => setSubcatInputs({
                            ...subcatInputs,
                            [cat.id]: { ...(subcatInputs[cat.id] || { name: '' }), nameEn: e.target.value }
                          })}
                          className="w-full sm:w-48 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                        />
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300/60 rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ml-auto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter sous-catégorie</span>
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">Projets & Groupes de Travail</h2>
                  <p className="text-xs text-slate-500">Gérez les réformes et projets en cours.</p>
                </div>
                <button
                  onClick={() => {
                    setProjectForm({ id: '', title: '', category: 'Réforme', status: 'En cours', description: '', lead: '', progress: 50 });
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Projet</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProject} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-xs">
                  <h3 className="font-semibold text-amber-700 text-sm mb-2">{projectForm.id ? 'Modifier le projet' : 'Ajouter un projet'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Titre</label>
                      <input type="text" required value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Statut</label>
                      <select value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900">
                        <option value="En cours">En cours</option>
                        <option value="Publié">Publié</option>
                        <option value="Consultation">Consultation</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                    <textarea rows={3} required value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/20"><Save className="w-4 h-4" /> Enregistrer</button>
                  </div>
                </form>
              ) : null}

              <div className="space-y-3">
                {projects.map((proj: any) => (
                  <div key={proj.id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">{proj.status}</span>
                      <h4 className="font-bold text-slate-900 text-base">{proj.title}</h4>
                      <p className="text-xs text-slate-600">{proj.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setProjectForm(proj); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-200/60 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteProject(proj.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITIES */}
          {activeTab === 'activities' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">Activités & Agenda</h2>
                  <p className="text-xs text-slate-500">Gérez les colloques, webinaires et événements.</p>
                </div>
                <button
                  onClick={() => {
                    setActivityForm({ id: '', title: '', type: 'Colloque', status: 'À venir', date: '', location: '', description: '' });
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Activité</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveActivity} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-xs">
                  <h3 className="font-semibold text-amber-700 text-sm mb-2">{activityForm.id ? 'Modifier l\'activité' : 'Ajouter une activité'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Titre</label>
                      <input type="text" required value={activityForm.title} onChange={e => setActivityForm({ ...activityForm, title: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                      <select value={activityForm.type} onChange={e => setActivityForm({ ...activityForm, type: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900">
                        <option value="Colloque">Colloque</option>
                        <option value="Webinaire">Webinaire</option>
                        <option value="Table Ronde">Table Ronde</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                    <textarea rows={3} required value={activityForm.description} onChange={e => setActivityForm({ ...activityForm, description: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/20"><Save className="w-4 h-4" /> Enregistrer</button>
                  </div>
                </form>
              ) : null}

              <div className="space-y-3">
                {activities.map((act: any) => (
                  <div key={act.id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">{act.type} • {act.status}</span>
                      <h4 className="font-bold text-slate-900 text-base">{act.title}</h4>
                      <p className="text-xs text-slate-600">{act.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setActivityForm(act); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-200/60 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteActivity(act.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LEGAL TEXTS */}
          {activeTab === 'texts' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">Textes Juridiques</h2>
                  <p className="text-xs text-slate-500">Gérez la revue de doctrine et la bibliothèque juridique.</p>
                </div>
                <button
                  onClick={() => {
                    setLegalTextForm({ id: '', title: '', reference: '', category: 'Doctrine', date: '', summary: '' });
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Texte</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveLegalText} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-xs">
                  <h3 className="font-semibold text-amber-700 text-sm mb-2">{legalTextForm.id ? 'Modifier le texte' : 'Ajouter un texte'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Titre</label>
                      <input type="text" required value={legalTextForm.title} onChange={e => setLegalTextForm({ ...legalTextForm, title: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Référence / ISSN</label>
                      <input type="text" value={legalTextForm.reference} onChange={e => setLegalTextForm({ ...legalTextForm, reference: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Résumé</label>
                    <textarea rows={3} required value={legalTextForm.summary} onChange={e => setLegalTextForm({ ...legalTextForm, summary: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/20"><Save className="w-4 h-4" /> Enregistrer</button>
                  </div>
                </form>
              ) : null}

              <div className="space-y-3">
                {legalTexts.map((lt: any) => (
                  <div key={lt.id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">{lt.category} • {lt.reference}</span>
                      <h4 className="font-bold text-slate-900 text-base">{lt.title}</h4>
                      <p className="text-xs text-slate-600">{lt.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setLegalTextForm(lt); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-200/60 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteLegalText(lt.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DISPUTES & PROCEDURES */}
          {activeTab === 'disputes' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200 gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-600" />
                    <span>Gestion des Litiges & Procédures</span>
                  </h2>
                  <p className="text-xs text-slate-500">Configurez les intervenants neutres (Conciliateurs, Médiateurs, Arbitres) et les dossiers de litiges internes & externes.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (disputeSubTab === 'officers') {
                        setDisputeOfficerForm({
                          id: '',
                          name: '',
                          title: 'Médiateur Certifié',
                          role: 'Médiateur',
                          stage: 'mediation',
                          category: 'interne',
                          specialties: '',
                          experience_years: 10,
                          cases_handled: 5,
                          avatar_url: '',
                          email: '',
                          availability: 'Disponible'
                        });
                      } else if (disputeSubTab === 'cases') {
                        setDisputeCaseForm({
                          id: '',
                          case_number: `LIT-2026-${Math.floor(100 + Math.random() * 900)}`,
                          title: '',
                          category: 'interne',
                          stage: 'conciliation',
                          is_public: true,
                          status: 'En cours',
                          date_submitted: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                          summary: '',
                          parties: '',
                          assigned_officer: '',
                          confidentiality_note: '',
                          resolution_timeframe: '30 jours'
                        });
                      } else {
                        setDisputeStageForm({
                          id: '',
                          key: '',
                          stepNumber: `Étape ${stagesList.length + 1}`,
                          title: '',
                          subtitle: '',
                          description: '',
                          legalBasis: '',
                          confidentiality: '',
                          officersTitle: ''
                        });
                      }
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{disputeSubTab === 'officers' ? 'Nouvel Intervenant' : disputeSubTab === 'cases' ? 'Nouveau Dossier' : 'Nouvelle Étape'}</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs header */}
              <div className="flex items-center gap-2 mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => { setDisputeSubTab('officers'); setIsEditing(false); }}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    disputeSubTab === 'officers'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Intervenants & Officiels Neutres</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${disputeSubTab === 'officers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{disputeOfficers.length}</span>
                </button>

                <button
                  onClick={() => { setDisputeSubTab('cases'); setIsEditing(false); }}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    disputeSubTab === 'cases'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Dossiers & Affaires Litigieuses</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${disputeSubTab === 'cases' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{disputeCases.length}</span>
                </button>

                <button
                  onClick={() => { setDisputeSubTab('stages'); setIsEditing(false); }}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    disputeSubTab === 'stages'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Étapes des Litiges Internes</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${disputeSubTab === 'stages' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{stagesList.length}</span>
                </button>
              </div>

              {/* SUB-TAB 1: OFFICERS (Enregistrer les conciliateurs/médiateurs/Arbitre) */}
              {disputeSubTab === 'officers' && (() => {
                const filteredOfficers = disputeOfficers.filter((off: any) => {
                  let matchesSearch = true;
                  if (officerSearchQuery.trim()) {
                    const q = officerSearchQuery.toLowerCase();
                    const specs = Array.isArray(off.specialties)
                      ? off.specialties.join(' ').toLowerCase()
                      : (off.specialties || '').toLowerCase();
                    matchesSearch =
                      (off.name && off.name.toLowerCase().includes(q)) ||
                      (off.title && off.title.toLowerCase().includes(q)) ||
                      (off.role && off.role.toLowerCase().includes(q)) ||
                      (off.email && off.email.toLowerCase().includes(q)) ||
                      specs.includes(q);
                  }

                  let matchesRole = true;
                  if (officerRoleFilter !== 'all') {
                    const r = officerRoleFilter.toLowerCase();
                    const offRole = (off.role || '').toLowerCase();
                    const offTitle = (off.title || '').toLowerCase();
                    matchesRole = offRole.includes(r) || offTitle.includes(r);
                  }

                  let matchesAvailability = true;
                  if (officerAvailabilityFilter !== 'all') {
                    matchesAvailability = (off.availability || 'Disponible') === officerAvailabilityFilter;
                  }

                  return matchesSearch && matchesRole && matchesAvailability;
                }).sort((a: any, b: any) => {
                  if (officerSortBy === 'name-asc') {
                    return (a.name || '').localeCompare(b.name || '');
                  } else if (officerSortBy === 'name-desc') {
                    return (b.name || '').localeCompare(a.name || '');
                  } else if (officerSortBy === 'experience') {
                    return (b.experience_years ?? b.experienceYears ?? 0) - (a.experience_years ?? a.experienceYears ?? 0);
                  } else if (officerSortBy === 'cases') {
                    return (b.cases_handled ?? b.casesHandled ?? 0) - (a.cases_handled ?? a.casesHandled ?? 0);
                  }
                  return 0;
                });

                return (
                  <div className="space-y-6">
                    {/* Success Confirmation Alert Banner */}
                    {successMessage && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between gap-3 shadow-md">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span>{successMessage}</span>
                        </div>
                        <button
                          onClick={() => setSuccessMessage(null)}
                          className="text-emerald-400 hover:text-white text-xs cursor-pointer font-bold px-2 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30"
                        >
                          ✕ Fermer
                        </button>
                      </div>
                    )}

                    {/* Filtering & Sorting Controls Bar */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Rechercher par nom, rôle, email, spécialités..."
                            value={officerSearchQuery}
                            onChange={e => setOfficerSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                          />
                          {officerSearchQuery && (
                            <button
                              onClick={() => setOfficerSearchQuery('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Filter by Role */}
                        <div className="flex items-center gap-2">
                          <Filter className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <select
                            value={officerRoleFilter}
                            onChange={e => setOfficerRoleFilter(e.target.value)}
                            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="all">Tous les rôles (Conciliateur, Médiateur, Arbitre)</option>
                            <option value="Conciliateur">Conciliateurs</option>
                            <option value="Médiateur">Médiateurs</option>
                            <option value="Arbitre">Arbitres</option>
                          </select>
                        </div>

                        {/* Filter by Availability */}
                        <select
                          value={officerAvailabilityFilter}
                          onChange={e => setOfficerAvailabilityFilter(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="all">Toutes disponibilités</option>
                          <option value="Disponible">Disponible</option>
                          <option value="Sur RDV">Sur RDV</option>
                          <option value="En audience">En audience</option>
                          <option value="En mission">En mission</option>
                          <option value="Indisponible">Indisponible</option>
                        </select>

                        {/* Sorting Select */}
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <select
                            value={officerSortBy}
                            onChange={e => setOfficerSortBy(e.target.value)}
                            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
                          >
                            <option value="name-asc">Tri : Nom (A → Z)</option>
                            <option value="name-desc">Tri : Nom (Z → A)</option>
                            <option value="experience">Tri : Expérience (+ élevée)</option>
                            <option value="cases">Tri : Affaires traitées (+ élevé)</option>
                          </select>
                        </div>
                      </div>

                      {/* Active filter counter */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        <span>Affichage de <strong className="text-amber-700">{filteredOfficers.length}</strong> sur <strong>{disputeOfficers.length}</strong> intervenants enregistrés</span>
                        {(officerSearchQuery || officerRoleFilter !== 'all' || officerAvailabilityFilter !== 'all') && (
                          <button
                            onClick={() => {
                              setOfficerSearchQuery('');
                              setOfficerRoleFilter('all');
                              setOfficerAvailabilityFilter('all');
                            }}
                            className="text-amber-700 hover:underline cursor-pointer font-medium"
                          >
                            Réinitialiser les filtres
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Registration / Editing Form */}
                    {isEditing ? (
                      <form onSubmit={handleSaveDisputeOfficer} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-amber-300/80 mb-6 shadow-md">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <h3 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-amber-600" />
                            <span>{disputeOfficerForm.id ? 'Modifier l\'officiel' : 'Enregistrer un Conciliateur / Médiateur / Arbitre'}</span>
                          </h3>
                          <span className="text-[11px] text-slate-500">Formulaire complet (Conforme Image 2)</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nom complet (ex: Me Gabriel Leroy)</label>
                            <input
                              type="text"
                              required
                              placeholder="ex: Me Gabriel Leroy"
                              value={disputeOfficerForm.name}
                              onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, name: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé du Titre / Badge Status (ex: CONCILIATEUR SENIOR)</label>
                            <input
                              type="text"
                              required
                              placeholder="ex: CONCILIATEUR SENIOR"
                              value={disputeOfficerForm.title}
                              onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, title: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Fonction Principale</label>
                            <select
                              value={disputeOfficerForm.role}
                              onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, role: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                            >
                              <option value="Conciliateur">Conciliateur</option>
                              <option value="Médiateur">Médiateur</option>
                              <option value="Arbitre">Arbitre</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Étape Procédurale</label>
                            <select
                              value={disputeOfficerForm.stage}
                              onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, stage: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                            >
                              {stagesList.map((s, idx) => (
                                <option key={s.id || s.key || idx} value={s.key}>
                                  {s.stepNumber ? `${s.stepNumber} : ` : ''}{s.title ? s.title.replace(/^Étape \d+\s*:\s*/i, '') : s.key}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Statut Disponibilité</label>
                            <select
                              value={disputeOfficerForm.availability}
                              onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, availability: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-emerald-700 font-semibold focus:outline-none focus:border-amber-500"
                            >
                              <option value="Disponible">Disponible</option>
                              <option value="Sur RDV">Sur RDV</option>
                              <option value="En audience">En audience</option>
                              <option value="En mission">En mission</option>
                              <option value="Indisponible">Indisponible</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Description du Rôle / Barreau / Mandat (ex: Avocat au Barreau de Paris & Membre de la Commission d'Éthique)</label>
                          <input
                            type="text"
                            placeholder="ex: Avocat au Barreau de Paris & Membre de la Commission d'Éthique"
                            value={disputeOfficerForm.role}
                            onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, role: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Expérience (années de pratique)</label>
                            <input
                              type="number"
                              min="0"
                              value={disputeOfficerForm.experience_years}
                              onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, experience_years: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Dossiers traités (nombre d'affaires)</label>
                            <input
                              type="number"
                              min="0"
                              value={disputeOfficerForm.cases_handled}
                              onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, cases_handled: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Email professionnel</label>
                            <input
                              type="email"
                              placeholder="ex: g.leroy@droit-justice.asso.fr"
                              value={disputeOfficerForm.email}
                              onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, email: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Spécialités / Domaines d'intervention (séparés par des virgules)</label>
                            <input
                              type="text"
                              placeholder="ex: Droit Associatif, Différends d'Honneur, Statuts & Gouvernance"
                              value={typeof disputeOfficerForm.specialties === 'string' ? disputeOfficerForm.specialties : (disputeOfficerForm.specialties || []).join(', ')}
                              onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, specialties: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">URL Photo / Avatar</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={disputeOfficerForm.avatar_url}
                              onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, avatar_url: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-3 border-t border-slate-200">
                          <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors">Annuler</button>
                          <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all"><Save className="w-4 h-4" /> Enregistrer l'Intervenant</button>
                        </div>
                      </form>
                    ) : null}

                    {/* Officers Grid matching Image 2 design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filteredOfficers.map((off: any) => {
                        const rawSpecs = off.specialties;
                        const specList: string[] = Array.isArray(rawSpecs)
                          ? rawSpecs
                          : (typeof rawSpecs === 'string' && rawSpecs.trim().length > 0)
                          ? rawSpecs.split(',')
                          : ['Droit Associatif', 'Différends d\'Honneur', 'Statuts & Gouvernance'];

                        return (
                          <div
                            key={off.id}
                            className="bg-white text-slate-900 border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              {/* Header Profile Section */}
                              <div className="flex items-start gap-4">
                                <img
                                  src={off.avatar_url || off.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                                  alt={off.name}
                                  className="w-16 h-16 rounded-xl object-cover border-2 border-amber-300/80 shadow-sm shrink-0"
                                />

                                <div className="min-w-0 flex-1">
                                  {/* Badges Row */}
                                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-0.5 rounded-md">
                                      {off.title || 'CONCILIATEUR SENIOR'}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                                      (off.availability || 'Disponible') === 'Disponible'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {off.availability || 'Disponible'}
                                    </span>
                                  </div>

                                  {/* Name */}
                                  <h3 className="font-serif font-bold text-xl text-[#031632] leading-tight truncate">
                                    {off.name}
                                  </h3>

                                  {/* Subtitle / Description */}
                                  <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-2">
                                    {off.role}
                                  </p>
                                </div>
                              </div>

                              {/* Gray Box for Stats matching Image 2 */}
                              <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3.5 my-4 space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 font-medium">Expérience :</span>
                                  <span className="font-bold text-[#031632]">
                                    {off.experience_years ?? off.experienceYears ?? 18} ans de pratique
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 font-medium">Dossiers traités :</span>
                                  <span className="font-bold text-[#031632]">
                                    {off.cases_handled ?? off.casesHandled ?? 45} affaires
                                  </span>
                                </div>
                              </div>

                              {/* Specialization Tags matching Image 2 */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {specList.map((tag: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-200/60"
                                  >
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Footer Row matching Image 2 */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                              <span className="text-xs text-slate-500 truncate font-medium">
                                {off.email || 'g.leroy@droit-justice.asso.fr'}
                              </span>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => {
                                    setDisputeOfficerForm({
                                      id: off.id,
                                      name: off.name,
                                      title: off.title,
                                      role: off.role,
                                      stage: off.stage,
                                      category: off.category,
                                      specialties: Array.isArray(off.specialties) ? off.specialties.join(', ') : (off.specialties || ''),
                                      experience_years: off.experience_years ?? off.experienceYears ?? 10,
                                      cases_handled: off.cases_handled ?? off.casesHandled ?? 0,
                                      avatar_url: off.avatar_url || off.avatarUrl || '',
                                      email: off.email || '',
                                      availability: off.availability || 'Disponible'
                                    });
                                    setIsEditing(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                  title="Modifier"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteDisputeOfficer(off.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>

                                <button className="bg-[#031632] hover:bg-[#0b2447] text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ml-1">
                                  <span>Saisir cet officiel</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* SUB-TAB 2: CASES */}
              {disputeSubTab === 'cases' && (
                <div>
                  {isEditing ? (
                    <form onSubmit={handleSaveDisputeCase} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-xs">
                      <h3 className="font-semibold text-amber-700 text-sm mb-2">{disputeCaseForm.id ? 'Modifier l\'affaire' : 'Créer une affaire de litige'}</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">N° de Dossier / Référence</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: LIT-2026-001"
                            value={disputeCaseForm.case_number}
                            onChange={e => setDisputeCaseForm({ ...disputeCaseForm, case_number: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé de l'Affaire</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: Contestation d'interprétation statutaire"
                            value={disputeCaseForm.title}
                            onChange={e => setDisputeCaseForm({ ...disputeCaseForm, title: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                          <select
                            value={disputeCaseForm.category}
                            onChange={e => setDisputeCaseForm({ ...disputeCaseForm, category: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          >
                            <option value="interne">Litiges Internes</option>
                            <option value="externe">Litiges Externes</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Étape Procédurale</label>
                          <select
                            value={disputeCaseForm.stage}
                            onChange={e => setDisputeCaseForm({ ...disputeCaseForm, stage: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          >
                            {stagesList.map((s, idx) => (
                              <option key={s.id || s.key || idx} value={s.key}>
                                {s.stepNumber ? `${s.stepNumber} : ` : ''}{s.title ? s.title.replace(/^Étape \d+\s*:\s*/i, '') : s.key}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Visibilité Publique / Confidentielle</label>
                          <select
                            value={disputeCaseForm.is_public ? 'true' : 'false'}
                            onChange={e => setDisputeCaseForm({ ...disputeCaseForm, is_public: e.target.value === 'true' })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-medium"
                          >
                            <option value="true">Publique (Visible par tous)</option>
                            <option value="false">Non Publique (Confidentielle)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Statut Procédural</label>
                          <select
                            value={disputeCaseForm.status}
                            onChange={e => setDisputeCaseForm({ ...disputeCaseForm, status: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          >
                            <option value="En cours">En cours</option>
                            <option value="En instruction">En instruction</option>
                            <option value="Accord Homologué">Accord Homologué</option>
                            <option value="Sentence Arbitrale">Sentence Arbitrale</option>
                            <option value="Clôturé">Clôturé</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Parties impliquées</label>
                          <input
                            type="text"
                            placeholder="ex: Partie A c/ Partie B"
                            value={disputeCaseForm.parties}
                            onChange={e => setDisputeCaseForm({ ...disputeCaseForm, parties: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Officiel Assigné</label>
                          <input
                            type="text"
                            placeholder="ex: Maître Hélène de Saint-Maur"
                            value={disputeCaseForm.assigned_officer}
                            onChange={e => setDisputeCaseForm({ ...disputeCaseForm, assigned_officer: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Synthèse / Résumé du Litige</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Description succincte des faits et prétentions..."
                          value={disputeCaseForm.summary}
                          onChange={e => setDisputeCaseForm({ ...disputeCaseForm, summary: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Notice de Confidentialité (Pour affaires non publiques)</label>
                        <input
                          type="text"
                          placeholder="Notice affichée si l'affaire est confidentielle..."
                          value={disputeCaseForm.confidentiality_note}
                          onChange={e => setDisputeCaseForm({ ...disputeCaseForm, confidentiality_note: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"><Save className="w-4 h-4" /> Enregistrer le Dossier</button>
                      </div>
                    </form>
                  ) : null}

                  <div className="space-y-3">
                    {disputeCases.map((c: any) => {
                      const isPub = c.is_public === true || c.is_public === 1 || c.isPublic === true;
                      return (
                        <div key={c.id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{c.case_number || c.caseNumber || c.id}</span>
                              <span className="text-[10px] uppercase font-bold text-slate-500">{c.category} • {c.stage}</span>
                              {isPub ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1"><Unlock className="w-3 h-3" /> Publique</span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1"><Lock className="w-3 h-3" /> Confidentielle</span>
                              )}
                              <span className="text-xs text-slate-500 ml-2">{c.status}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-base">{c.title}</h4>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.summary}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setDisputeCaseForm({
                                  id: c.id,
                                  case_number: c.case_number || c.caseNumber || '',
                                  title: c.title,
                                  category: c.category,
                                  stage: c.stage,
                                  is_public: isPub,
                                  status: c.status,
                                  date_submitted: c.date_submitted || c.dateSubmitted || '',
                                  summary: c.summary,
                                  parties: c.parties || '',
                                  assigned_officer: c.assigned_officer || c.assignedOfficer || '',
                                  confidentiality_note: c.confidentiality_note || c.confidentialityNote || '',
                                  resolution_timeframe: c.resolution_timeframe || c.resolutionTimeframe || '30 jours'
                                });
                                setIsEditing(true);
                              }}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDisputeCase(c.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: STAGES */}
              {disputeSubTab === 'stages' && (
                <div>
                  {isEditing ? (
                    <form onSubmit={handleAddOrUpdateStage} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-xs">
                      <h3 className="font-semibold text-amber-700 text-sm mb-2">{disputeStageForm.id ? 'Modifier l\'étape' : 'Créer une nouvelle étape de litige'}</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro d'Étape (ex: Étape 1)</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: Étape 1"
                            value={disputeStageForm.stepNumber}
                            onChange={e => setDisputeStageForm({ ...disputeStageForm, stepNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Clé identifiante (ex: conciliation)</label>
                          <input
                            type="text"
                            placeholder="ex: conciliation"
                            value={disputeStageForm.key}
                            onChange={e => setDisputeStageForm({ ...disputeStageForm, key: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé des Intervenants</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: Les Conciliateurs Assermentés"
                            value={disputeStageForm.officersTitle}
                            onChange={e => setDisputeStageForm({ ...disputeStageForm, officersTitle: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de l'étape (Cadre Réglementaire)</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: Étape 1 : La Conciliation Interne"
                            value={disputeStageForm.title}
                            onChange={e => setDisputeStageForm({ ...disputeStageForm, title: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Sous-titre / Court descriptif</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: Prévention et négociation amiable directe"
                            value={disputeStageForm.subtitle}
                            onChange={e => setDisputeStageForm({ ...disputeStageForm, subtitle: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Description détaillée (Procédure Officielle)</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Explication complète du déroulement de l'étape..."
                          value={disputeStageForm.description}
                          onChange={e => setDisputeStageForm({ ...disputeStageForm, description: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Base juridique</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: Article 12 du Règlement Intérieur"
                            value={disputeStageForm.legalBasis}
                            onChange={e => setDisputeStageForm({ ...disputeStageForm, legalBasis: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Garantie de confidentialité</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: Confidentialité absolue garantie par..."
                            value={disputeStageForm.confidentiality}
                            onChange={e => setDisputeStageForm({ ...disputeStageForm, confidentiality: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"><Save className="w-4 h-4" /> Enregistrer l'Étape</button>
                      </div>
                    </form>
                  ) : null}

                  <div className="space-y-4">
                    {stagesList.map((stg: any) => (
                      <div key={stg.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-300/60">
                              {stg.stepNumber}
                            </span>
                            <div>
                              <h4 className="font-bold text-slate-900 text-base">{stg.title}</h4>
                              <p className="text-xs text-slate-500">{stg.subtitle}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setDisputeStageForm({
                                  id: stg.id,
                                  key: stg.key || '',
                                  stepNumber: stg.stepNumber || '',
                                  title: stg.title || '',
                                  subtitle: stg.subtitle || '',
                                  description: stg.description || '',
                                  legalBasis: stg.legalBasis || '',
                                  confidentiality: stg.confidentiality || '',
                                  officersTitle: stg.officersTitle || ''
                                });
                                setIsEditing(true);
                              }}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStage(stg.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                          {stg.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-slate-500 block font-medium">Base juridique</span>
                            <span className="text-slate-800 font-semibold">{stg.legalBasis}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-slate-500 block font-medium">Confidentialité</span>
                            <span className="text-slate-800 font-semibold">{stg.confidentiality}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-slate-500 block font-medium">Titre des Intervenants</span>
                            <span className="text-amber-700 font-semibold">{stg.officersTitle}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SETTINGS (Contenu des Pages) */}
          {activeTab === 'settings' && (
            <div>
              <div className="mb-6 pb-4 border-b border-slate-200">
                <h2 className="text-xl font-serif font-bold text-slate-900">Éditer les Textes des Pages Publiques</h2>
                <p className="text-xs text-slate-500">Modifiez instantanément le titre principal, les présentations et les coordonnées du site.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                  <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Page d'Accueil (Section Héro)
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Titre principal (Hero Title)</label>
                    <input
                      type="text"
                      value={siteSettings.hero_title}
                      onChange={e => setSiteSettings({ ...siteSettings, hero_title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sous-titre explicatif (Hero Subtitle)</label>
                    <textarea
                      rows={2}
                      value={siteSettings.hero_subtitle}
                      onChange={e => setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                  <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Section À Propos & Mission
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Texte de Présentation de l'Association</label>
                    <textarea
                      rows={3}
                      value={siteSettings.about_mission}
                      onChange={e => setSiteSettings({ ...siteSettings, about_mission: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                  <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Coordonnées de Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Officiel</label>
                      <input
                        type="text"
                        value={siteSettings.contact_email}
                        onChange={e => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone</label>
                      <input
                        type="text"
                        value={siteSettings.contact_phone}
                        onChange={e => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Siège</label>
                      <input
                        type="text"
                        value={siteSettings.contact_address}
                        onChange={e => setSiteSettings({ ...siteSettings, contact_address: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="w-5 h-5" /> Enregistrer les Textes du Site
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
