import React, { useState, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { ProjectsManager } from './components/ProjectsManager';
import { ActivitiesManager } from './components/ActivitiesManager';
import { LegalTextsManager } from './components/LegalTextsManager';
import ArticlesManager from './components/ArticlesManager';
import MembersManager from './components/MembersManager';
import { DisputesManager } from './components/DisputesManager';
import SettingsManager from './components/SettingsManager';
import ContactManager from './components/ContactManager';
import MembershipTiersManager from './components/MembershipTiersManager';
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
  Award,
  X,
  Upload,
  AlertTriangle,
  Building2
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
  membershipTiers?: any[];
  articleCategories?: any[];
  contactConfig?: { departments: any[]; faqs: any[] };
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
  membershipTiers = [],
  articleCategories = [],
  contactConfig = { departments: [], faqs: [] },
  settings
}: Props) {
  const { flash } = usePage().props as any;
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'articles' | 'members' | 'categories' | 'projects' | 'activities' | 'texts' | 'disputes' | 'settings' | 'contact'>('articles');
  
  const [contactSubTab, setContactSubTab] = useState<'departments' | 'faqs'>('departments');
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  
  const [articleSubTab, setArticleSubTab] = useState<'list' | 'categories'>('list');
  const [isArticlesMenuOpen, setIsArticlesMenuOpen] = useState(true);

  const [memberSubTab, setMemberSubTab] = useState<'list' | 'categories' | 'subcategories' | 'tiers'>('list');
  const [isMembersMenuOpen, setIsMembersMenuOpen] = useState(true);
  const [disputeSubTab, setDisputeSubTab] = useState<'officers' | 'cases' | 'stages'>('officers');
  const [isDisputesMenuOpen, setIsDisputesMenuOpen] = useState(true);

  // Officers Search, Filter & Sorting state
  const [officerSearchQuery, setOfficerSearchQuery] = useState('');
  const [officerRoleFilter, setOfficerRoleFilter] = useState('all');
  const [officerAvailabilityFilter, setOfficerAvailabilityFilter] = useState('all');
  const [officerSortBy, setOfficerSortBy] = useState('name-asc');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cases Search, Filter & Sorting state
  const [caseSearchQuery, setCaseSearchQuery] = useState('');
  const [caseCategoryFilter, setCaseCategoryFilter] = useState('all');
  const [caseStageFilter, setCaseStageFilter] = useState('all');
  const [caseStatusFilter, setCaseStatusFilter] = useState('all');
  const [caseSortBy, setCaseSortBy] = useState('date-desc');
  
  const [subcategorySearchQuery, setSubcategorySearchQuery] = useState('');

  const officerAvatarInputRef = useRef<HTMLInputElement | null>(null);

  const handleOfficerAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("La taille du fichier ne doit pas dépasser 10 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setDisputeOfficerForm(prev => ({
            ...prev,
            avatar_url: dataUrl
          }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom Confirmation Dialog State (SweetAlert style)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Oui, supprimer',
    cancelText: 'Annuler',
    onConfirm: () => {},
  });

  const requestConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Oui, supprimer',
    cancelText = 'Annuler'
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleExecuteConfirm = () => {
    confirmModal.onConfirm();
    closeConfirmModal();
  };

  const initialCategories: MemberCategory[] = (memberCategories && memberCategories.length > 0)
    ? memberCategories
    : FALLBACK_CATEGORIES;

  const [categoriesList, setCategoriesList] = useState<MemberCategory[]>(initialCategories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');

  const [articleCatList, setArticleCatList] = useState<any[]>(articleCategories || []);
  const [newArticleCatName, setNewArticleCatName] = useState('');
  const [newArticleCatNameEn, setNewArticleCatNameEn] = useState('');

  const handleAddArticleCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleCatName.trim()) return;
    const newCat = {
      id: `artcat-${Date.now()}`,
      name: newArticleCatName,
      nameEn: newArticleCatNameEn
    };
    const updated = [...articleCatList, newCat];
    setArticleCatList(updated);
    router.post('/admin/article-categories', { categories: updated }, {
      preserveScroll: true,
      onSuccess: () => {
        setNewArticleCatName('');
        setNewArticleCatNameEn('');
        setSuccessMessage('Catégorie d\'articles ajoutée avec succès.');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
  };

  const handleDeleteArticleCategory = (id: string) => {
    requestConfirmation(
      "Supprimer la catégorie d'articles",
      "Êtes-vous sûr de vouloir supprimer cette catégorie ? Les articles existants conserveront cette catégorie en texte simple.",
      () => {
        const updated = articleCatList.filter(c => c.id !== id);
        setArticleCatList(updated);
        router.post('/admin/article-categories', { categories: updated }, {
          preserveScroll: true,
          onSuccess: () => {
            setSuccessMessage('Catégorie d\'articles supprimée.');
            setTimeout(() => setSuccessMessage(null), 3000);
          }
        });
      }
    );
  };


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

  // Contact Configuration State
  const [contactDepartments, setContactDepartments] = useState<any[]>(contactConfig?.departments || []);
  const [contactFaqs, setContactFaqs] = useState<any[]>(contactConfig?.faqs || []);

  const handleSaveContactConfig = () => {
    router.post('/admin/contact-config', {
      departments: contactDepartments,
      faqs: contactFaqs
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setSuccessMessage('Configuration de la page Contact enregistrée avec succès.');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
  };

  const [membershipTiersState, setMembershipTiersState] = useState<any[]>(membershipTiers || []);

  const handleSaveMembershipTiers = () => {
    router.post('/admin/membership-tiers', { tiers: membershipTiersState }, {
      preserveScroll: true,
      onSuccess: () => {
        setSuccessMessage('Statuts des membres enregistrés avec succès.');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
  };

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
    requestConfirmation(
      'Supprimer la catégorie',
      'Voulez-vous vraiment supprimer cette catégorie et l\'ensemble de ses sous-catégories ?',
      () => {
        const updated = categoriesList.filter(c => c.id !== catId);
        saveCategoryStructure(updated);
      }
    );
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
    requestConfirmation(
      'Supprimer la sous-catégorie',
      'Voulez-vous vraiment supprimer cette sous-catégorie ?',
      () => {
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
    );
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
    requestConfirmation(
      'Supprimer cet article',
      'Êtes-vous sûr de vouloir supprimer définitivement cet article de la publication ?',
      () => {
        router.delete(`/admin/articles/${id}`);
      }
    );
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
    requestConfirmation(
      'Supprimer ce membre',
      'Voulez-vous vraiment retirer ce membre de l\'annuaire ?',
      () => {
        router.delete(`/admin/members/${id}`);
      }
    );
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
    requestConfirmation(
      'Supprimer ce projet',
      'Voulez-vous vraiment supprimer ce projet ?',
      () => {
        router.delete(`/admin/projects/${id}`);
      }
    );
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
    requestConfirmation(
      'Supprimer cette activité',
      'Voulez-vous vraiment supprimer cette activité de l\'agenda ?',
      () => {
        router.delete(`/admin/activities/${id}`);
      }
    );
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
    requestConfirmation(
      'Supprimer le texte juridique',
      'Voulez-vous vraiment supprimer ce texte juridique ?',
      () => {
        router.delete(`/admin/legal-texts/${id}`);
      }
    );
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

  const handleDeleteDisputeOfficer = (id: string, name?: string) => {
    requestConfirmation(
      'Supprimer l\'intervenant',
      `Voulez-vous vraiment supprimer ${name ? `l'officiel "${name}"` : 'cet officiel de litige'} du répertoire ? Cette action est irréversible.`,
      () => {
        router.delete(`/admin/dispute-officers/${id}`);
      }
    );
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

  const handleDeleteDisputeCase = (id: string, nameOrCode?: string) => {
    requestConfirmation(
      'Supprimer cette affaire',
      `Voulez-vous vraiment supprimer ${nameOrCode ? `l'affaire "${nameOrCode}"` : 'cette affaire de litige'} ? Cette action est irréversible.`,
      () => {
        router.delete(`/admin/dispute-cases/${id}`);
      }
    );
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

  const filteredSubcategoriesList = categoriesList.filter(cat => {
    const q = subcategorySearchQuery.toLowerCase().trim();
    if (!q) return true;
    if (cat.name.toLowerCase().includes(q)) return true;
    if (cat.nameEn && cat.nameEn.toLowerCase().includes(q)) return true;
    if (cat.subcategories.some(sub => 
      sub.name.toLowerCase().includes(q) || (sub.nameEn && sub.nameEn.toLowerCase().includes(q))
    )) return true;
    return false;
  });

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

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher partout..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full bg-slate-100 pl-10 pr-4 py-2 text-sm border border-transparent rounded-xl focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
            />
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
          
          <div className="space-y-1">
            <button
              onClick={() => {
                setIsArticlesMenuOpen(!isArticlesMenuOpen);
                if (!isArticlesMenuOpen && activeTab !== 'articles') {
                  setActiveTab('articles');
                  setArticleSubTab('list');
                }
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Articles (Blog)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-amber-800 font-bold border border-amber-300/50">
                  {articles.length + (articleCategories?.length || 0)}
                </span>
                {isArticlesMenuOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {isArticlesMenuOpen && (
              <div className="ml-3 pl-3 border-l-2 border-slate-200 space-y-1 pt-1">
                <button
                  onClick={() => {
                    setActiveTab('articles');
                    setArticleSubTab('list');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'articles' && articleSubTab === 'list'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-500 hover:text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  Liste des Articles
                </button>
                <button
                  onClick={() => {
                    setActiveTab('articles');
                    setArticleSubTab('categories');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'articles' && articleSubTab === 'categories'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-500 hover:text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" /> Catégories
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setIsMembersMenuOpen(!isMembersMenuOpen);
                if (!isMembersMenuOpen && activeTab !== 'members') {
                  setActiveTab('members');
                  setMemberSubTab('list');
                }
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Membres</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-amber-800 font-bold border border-amber-300/50">
                  {members.length + categoriesList.length}
                </span>
                {isMembersMenuOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {isMembersMenuOpen && (
              <div className="ml-3 pl-3 border-l-2 border-slate-200 space-y-1 pt-1">
                <button
                  onClick={() => {
                    setActiveTab('members');
                    setMemberSubTab('list');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'members' && memberSubTab === 'list'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Tous les membres</span>
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'members' && memberSubTab === 'list' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{members.length}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('members');
                    setMemberSubTab('categories');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'members' && memberSubTab === 'categories'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <FolderTree className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Catégories</span>
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'members' && memberSubTab === 'categories' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{categoriesList.length}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('members');
                    setMemberSubTab('subcategories');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'members' && memberSubTab === 'subcategories'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Sous-catégories</span>
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'members' && memberSubTab === 'subcategories' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{categoriesList.reduce((acc, cat) => acc + cat.subcategories.length, 0)}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('members');
                    setMemberSubTab('tiers');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'members' && memberSubTab === 'tiers'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Statuts & Tarification</span>
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'members' && memberSubTab === 'tiers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{membershipTiersState.length}</span>
                </button>
              </div>
            )}
          </div>

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

          {/* Contact Menu */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setIsContactMenuOpen(!isContactMenuOpen);
                if (!isContactMenuOpen && activeTab !== 'contact') {
                  setActiveTab('contact');
                  setContactSubTab('departments');
                }
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>Page Contact</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-amber-800 font-bold border border-amber-300/50">
                  {contactDepartments.length + contactFaqs.length}
                </span>
                {isContactMenuOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {isContactMenuOpen && (
              <div className="ml-3 pl-3 border-l-2 border-slate-200 space-y-1 pt-1">
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    setContactSubTab('departments');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'contact' && contactSubTab === 'departments'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Départements</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    setContactSubTab('faqs');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'contact' && contactSubTab === 'faqs'
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">FAQ Contact</span>
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
            <ArticlesManager
              articleSubTab={articleSubTab}
              articles={articles}
              articleCategories={articleCatList}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              articleForm={articleForm}
              setArticleForm={setArticleForm}
              handleSaveArticle={handleSaveArticle}
              handleDeleteArticle={handleDeleteArticle}
              newArticleCatName={newArticleCatName}
              setNewArticleCatName={setNewArticleCatName}
              newArticleCatNameEn={newArticleCatNameEn}
              setNewArticleCatNameEn={setNewArticleCatNameEn}
              handleAddArticleCategory={handleAddArticleCategory}
              handleDeleteArticleCategory={handleDeleteArticleCategory}
            />
          )}

          {/* TAB 2: MEMBERS */}
          {activeTab === 'members' && memberSubTab !== 'tiers' && (
            <MembersManager
              memberSubTab={memberSubTab}
              members={members}
              categoriesList={categoriesList}
              memberForm={memberForm}
              setMemberForm={setMemberForm}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleSaveMember={handleSaveMember}
              handleDeleteMember={handleDeleteMember}
              newCatName={newCatName}
              setNewCatName={setNewCatName}
              newCatNameEn={newCatNameEn}
              setNewCatNameEn={setNewCatNameEn}
              handleAddCategory={handleAddCategory}
              handleDeleteCategory={handleDeleteCategory}
              subcategorySearchQuery={subcategorySearchQuery}
              setSubcategorySearchQuery={setSubcategorySearchQuery}
              filteredSubcategoriesList={filteredSubcategoriesList}
              handleAddSubcategory={handleAddSubcategory}
              handleDeleteSubcategory={handleDeleteSubcategory}
              subcatInputs={subcatInputs}
              setSubcatInputs={setSubcatInputs}
            />
          )}
          
          {activeTab === 'members' && memberSubTab === 'tiers' && (
            <MembershipTiersManager
              membershipTiersState={membershipTiersState}
              setMembershipTiersState={setMembershipTiersState}
              handleSaveMembershipTiers={handleSaveMembershipTiers}
            />
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <ProjectsManager
              projects={projects}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              projectForm={projectForm}
              setProjectForm={setProjectForm}
              handleSaveProject={handleSaveProject}
              handleDeleteProject={handleDeleteProject}
            />
          )}

          {/* TAB 4: ACTIVITIES */}
          {activeTab === 'activities' && (
            <ActivitiesManager
              activities={activities}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              activityForm={activityForm}
              setActivityForm={setActivityForm}
              handleSaveActivity={handleSaveActivity}
              handleDeleteActivity={handleDeleteActivity}
            />
          )}

          {/* TAB 5: LEGAL TEXTS */}
          {activeTab === 'texts' && (
            <LegalTextsManager
              legalTexts={legalTexts}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              legalTextForm={legalTextForm}
              setLegalTextForm={setLegalTextForm}
              handleSaveLegalText={handleSaveLegalText}
              handleDeleteLegalText={handleDeleteLegalText}
            />
          )}

          {/* TAB 6: DISPUTES & PROCEDURES */}
          {activeTab === 'disputes' && (
            <DisputesManager
              disputeOfficers={disputeOfficers}
              disputeCases={disputeCases}
              stagesList={stagesList}
              disputeSubTab={disputeSubTab}
              setDisputeSubTab={setDisputeSubTab}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              officerSearchQuery={officerSearchQuery}
              setOfficerSearchQuery={setOfficerSearchQuery}
              officerRoleFilter={officerRoleFilter}
              setOfficerRoleFilter={setOfficerRoleFilter}
              officerAvailabilityFilter={officerAvailabilityFilter}
              setOfficerAvailabilityFilter={setOfficerAvailabilityFilter}
              officerSortBy={officerSortBy}
              setOfficerSortBy={setOfficerSortBy}
              successMessage={successMessage}
              setSuccessMessage={setSuccessMessage}
              disputeOfficerForm={disputeOfficerForm}
              setDisputeOfficerForm={setDisputeOfficerForm}
              handleSaveDisputeOfficer={handleSaveDisputeOfficer}
              handleDeleteDisputeOfficer={handleDeleteDisputeOfficer}
              officerAvatarInputRef={officerAvatarInputRef}
              handleOfficerAvatarFileUpload={handleOfficerAvatarFileUpload}
              caseSearchQuery={caseSearchQuery}
              setCaseSearchQuery={setCaseSearchQuery}
              caseCategoryFilter={caseCategoryFilter}
              setCaseCategoryFilter={setCaseCategoryFilter}
              caseStageFilter={caseStageFilter}
              setCaseStageFilter={setCaseStageFilter}
              caseStatusFilter={caseStatusFilter}
              setCaseStatusFilter={setCaseStatusFilter}
              caseSortBy={caseSortBy}
              setCaseSortBy={setCaseSortBy}
              disputeCaseForm={disputeCaseForm}
              setDisputeCaseForm={setDisputeCaseForm}
              handleSaveDisputeCase={handleSaveDisputeCase}
              handleDeleteDisputeCase={handleDeleteDisputeCase}
              disputeStageForm={disputeStageForm}
              setDisputeStageForm={setDisputeStageForm}
              handleAddOrUpdateStage={handleAddOrUpdateStage}
              handleDeleteStage={handleDeleteStage}
            />
          )}

          {/* TAB 7: SETTINGS (Contenu des Pages) */}
          {activeTab === 'settings' && (
            <SettingsManager
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              handleSaveSettings={handleSaveSettings}
            />
          )}

          {activeTab === 'contact' && (
            <ContactManager
              contactSubTab={contactSubTab}
              contactDepartments={contactDepartments}
              setContactDepartments={setContactDepartments}
              contactFaqs={contactFaqs}
              setContactFaqs={setContactFaqs}
              handleSaveContactConfig={handleSaveContactConfig}
            />
          )}
        </div>
      </div>

      {/* SweetAlert / Custom Delete Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-7 shadow-2xl border border-slate-200 overflow-hidden transform transition-all text-center">
            {/* Top Warning Icon */}
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">
              {confirmModal.title}
            </h3>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                {confirmModal.cancelText}
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirm}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 hover:shadow-rose-600/35 transition-all cursor-pointer"
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
