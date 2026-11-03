import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Trash2, 
  FileText, 
  Building2, 
  Mail, 
  Phone, 
  Briefcase, 
  Award, 
  Calendar, 
  MessageSquare, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  FolderTree,
  MapPin,
  Heart,
  Home,
  Camera,
  Upload,
  Save,
  Shield,
  Loader2,
  CreditCard,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { MembershipApplication, MemberCategory } from '../../../types';
import { generateAdhesionPdfBlobUrl } from '../../../utils/generateAdhesionPdf';
import { PdfStreamModal } from '../../../components/PdfStreamModal';

interface MembershipApplicationsManagerProps {
  applications: MembershipApplication[];
  categoriesList: MemberCategory[];
  onOpenMemberCases?: (app: MembershipApplication) => void;
  onOpenMemberAffectation?: (app: MembershipApplication) => void;
  onOpenMemberProfile?: (app: MembershipApplication) => void;
  onOpenAssociativeLife?: (app: MembershipApplication) => void;
  requestConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}

export default function MembershipApplicationsManager({
  applications = [],
  categoriesList = [],
  onOpenMemberCases,
  onOpenMemberAffectation,
  onOpenMemberProfile,
  onOpenAssociativeLife,
  requestConfirmation,
}: MembershipApplicationsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  
  // Modal states
  const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [adminCni, setAdminCni] = useState('');
  const [adminCniUrl, setAdminCniUrl] = useState('');
  const [adminAvatarUrl, setAdminAvatarUrl] = useState('');
  const [adminPaymentMethod, setAdminPaymentMethod] = useState('');
  const [adminPaymentReference, setAdminPaymentReference] = useState('');
  const [adminPaymentReceiptUrl, setAdminPaymentReceiptUrl] = useState('');
  const [adminPaymentStatus, setAdminPaymentStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ isOpen: boolean; title: string; url: string } | null>(null);
  const [isSavingAdminFields, setIsSavingAdminFields] = useState(false);
  const [adminFieldsSavedMessage, setAdminFieldsSavedMessage] = useState<string | null>(null);
  
  // Approval Modal State
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [appToApprove, setAppToApprove] = useState<MembershipApplication | null>(null);
  const [approvalCategory, setApprovalCategory] = useState<string>(
    categoriesList[0]?.name || "Conseil d'Administration"
  );
  const [approvalSubcategory, setApprovalSubcategory] = useState<string>('');
  const [createMemberProfile, setCreateMemberProfile] = useState<boolean>(true);
  const [approvalNote, setApprovalNote] = useState<string>('');

  // Rejection Modal State
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [appToReject, setAppToReject] = useState<MembershipApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Keep selectedApp updated when applications prop changes
  useEffect(() => {
    if (selectedApp) {
      const updated = applications.find(a => a.id === selectedApp.id);
      if (updated) {
        setSelectedApp(updated);
        setAdminCni(updated.cni || '');
        setAdminCniUrl(updated.cni_url || '');
        setAdminAvatarUrl(updated.avatar_url || '');
        setAdminPaymentMethod(updated.payment_method || '');
        setAdminPaymentReference(updated.payment_reference || '');
        setAdminPaymentReceiptUrl(updated.payment_receipt_url || '');
        setAdminPaymentStatus(updated.payment_status || 'pending');
      }
    }
  }, [applications]);

  const handleOpenDetail = (app: MembershipApplication) => {
    setSelectedApp(app);
    setAdminCni(app.cni || '');
    setAdminCniUrl(app.cni_url || '');
    setAdminAvatarUrl(app.avatar_url || '');
    setAdminPaymentMethod(app.payment_method || '');
    setAdminPaymentReference(app.payment_reference || '');
    setAdminPaymentReceiptUrl(app.payment_receipt_url || '');
    setAdminPaymentStatus(app.payment_status || 'pending');
    setAdminFieldsSavedMessage(null);
    setDetailModalOpen(true);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 500;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAdminAvatarUrl(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCniFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdminCniUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdminPaymentReceiptUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAdminFields = () => {
    if (!selectedApp) return;
    setIsSavingAdminFields(true);
    setAdminFieldsSavedMessage(null);

    router.post(`/admin/applications/${selectedApp.id}/admin-fields`, {
      cni: adminCni,
      cni_url: adminCniUrl,
      avatar_url: adminAvatarUrl,
      payment_method: adminPaymentMethod,
      payment_reference: adminPaymentReference,
      payment_receipt_url: adminPaymentReceiptUrl,
      payment_status: adminPaymentStatus,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSavingAdminFields(false);
        setAdminFieldsSavedMessage('CNI, photo et informations de versement enregistrées avec succès !');
        setTimeout(() => setAdminFieldsSavedMessage(null), 4000);
      },
      onError: () => {
        setIsSavingAdminFields(false);
      }
    });
  };

  const handleVerifyPayment = (status: 'verified' | 'pending' | 'rejected') => {
    if (!selectedApp) return;
    setIsVerifyingPayment(true);

    router.post(`/admin/applications/${selectedApp.id}/verify-payment`, {
      payment_status: status,
      payment_reference: adminPaymentReference,
      payment_method: adminPaymentMethod,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsVerifyingPayment(false);
        setAdminPaymentStatus(status);
        setAdminFieldsSavedMessage(
          status === 'verified'
            ? 'Versement validé et confirmé avec succès !'
            : (status === 'rejected' ? 'Versement marqué comme rejeté.' : 'Statut du versement remis en attente.')
        );
        setTimeout(() => setAdminFieldsSavedMessage(null), 4000);
      },
      onError: () => {
        setIsVerifyingPayment(false);
      }
    });
  };

  const handleCopyText = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  // PDF Preview State
  const [pdfStreamOpen, setPdfStreamOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<any>(null);

  // Stats calculation
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  // Filter options for Tiers
  const uniqueTiers = Array.from(new Set(applications.map(a => a.tier_name))).filter(Boolean);

  // Filtered List
  const filteredApplications = applications.filter(app => {
    const q = searchQuery.toLowerCase().trim();
    const fullName = `${app.civility || ''} ${app.first_name || ''} ${app.last_name || ''}`.toLowerCase();
    const matchesSearch = !q || (
      fullName.includes(q) ||
      (app.email && app.email.toLowerCase().includes(q)) ||
      (app.application_number && app.application_number.toLowerCase().includes(q)) ||
      (app.profession && app.profession.toLowerCase().includes(q)) ||
      (app.institution && app.institution.toLowerCase().includes(q))
    );

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesTier = tierFilter === 'all' || app.tier_name === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const handleOpenPdf = (app: MembershipApplication) => {
    const data = {
      memberNumber: app.application_number || `DJ-${new Date().getFullYear()}-0000`,
      civility: app.civility || 'M.',
      firstName: app.first_name || '',
      lastName: app.last_name || '',
      profession: app.profession || 'Juriste',
      institution: app.institution || '',
      email: app.email || '',
      phone: app.phone || '',
      whatsapp: app.whatsapp || '',
      secondaryPhone: app.secondary_phone || '',
      birthDate: app.birth_date,
      birthPlace: app.birth_place,
      maritalStatus: app.marital_status,
      address: app.address,
      country: app.country,
      region: app.region,
      department: app.department,
      locality: app.locality,
      tierName: app.tier_name,
      tierPrice: app.tier_price
    };
    const url = generateAdhesionPdfBlobUrl(data);
    setPdfData(data);
    setPdfBlobUrl(url);
    setPdfStreamOpen(true);
  };

  const handleDirectApprove = (app: MembershipApplication) => {
    requestConfirmation(
      'Valider la Candidature',
      `Confirmer la validation de la demande d'adhésion de ${app.civility || ''} ${app.first_name} ${app.last_name} (${app.tier_name}) ? Le candidat sera agréé et son profil membre activé dans l'annuaire.`,
      () => {
        router.post(`/admin/applications/${app.id}/approve`, {
          create_member: true,
          category: categoriesList[0]?.name || "Conseil d'Administration",
          subcategory: categoriesList[0]?.subcategories?.[0]?.name || '',
          cni: app.cni,
          cni_url: app.cni_url,
          avatar_url: app.avatar_url,
        }, {
          preserveScroll: true,
          onSuccess: () => {
            if (detailModalOpen && selectedApp?.id === app.id) {
              setDetailModalOpen(false);
            }
          }
        });
      },
      'Valider la candidature',
      'Annuler'
    );
  };

  const handleOpenApprovalModal = (app: MembershipApplication) => {
    setAppToApprove(app);
    const defaultCat = categoriesList[0]?.name || 'Membres Titulaires';
    setApprovalCategory(defaultCat);
    const firstSub = categoriesList[0]?.subcategories?.[0]?.name || '';
    setApprovalSubcategory(firstSub);
    setApprovalNote(app.admin_notes || '');
    setCreateMemberProfile(true);
    setApprovalModalOpen(true);
  };

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appToApprove) return;

    router.post(`/admin/applications/${appToApprove.id}/approve`, {
      category: approvalCategory,
      subcategory: approvalSubcategory,
      create_member: createMemberProfile,
      admin_notes: approvalNote,
      cni: adminCni || appToApprove.cni,
      cni_url: adminCniUrl || appToApprove.cni_url,
      avatar_url: adminAvatarUrl || appToApprove.avatar_url
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setApprovalModalOpen(false);
        setAppToApprove(null);
        if (detailModalOpen && selectedApp?.id === appToApprove.id) {
          setDetailModalOpen(false);
        }
      }
    });
  };

  const handleOpenRejectionModal = (app: MembershipApplication) => {
    setAppToReject(app);
    setRejectionReason(app.admin_notes || '');
    setRejectionModalOpen(true);
  };

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appToReject) return;

    router.post(`/admin/applications/${appToReject.id}/reject`, {
      admin_notes: rejectionReason
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setRejectionModalOpen(false);
        setAppToReject(null);
        if (detailModalOpen && selectedApp?.id === appToReject.id) {
          setDetailModalOpen(false);
        }
      }
    });
  };

  const handleDeleteApplication = (id: string, appNumber: string) => {
    requestConfirmation(
      "Supprimer le dossier de candidature",
      `Êtes-vous certain de vouloir supprimer définitivement le dossier ${appNumber} ? Cette action est irréversible.`,
      () => {
        router.delete(`/admin/applications/${id}`, {
          preserveScroll: true,
          onSuccess: () => {
            if (detailModalOpen && selectedApp?.id === id) {
              setDetailModalOpen(false);
            }
          }
        });
      }
    );
  };

  const currentCategoryObj = categoriesList.find(c => c.name === approvalCategory);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Validation des Candidatures &amp; Adhésions
            </h2>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full animate-pulse shadow-xs">
                {pendingCount} en attente
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Examinez les dossiers d'adhésion reçus via le formulaire public et agrémentez les nouveaux membres.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold opacity-80">Total Dossiers</span>
            <FileText className={`w-4 h-4 ${statusFilter === 'all' ? 'text-amber-400' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-bold mt-2 font-serif">{totalCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold opacity-80">En Attente d'Agrément</span>
            <Clock className={`w-4 h-4 ${statusFilter === 'pending' ? 'text-white' : 'text-amber-500'}`} />
          </div>
          <div className="text-2xl font-bold mt-2 font-serif">{pendingCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'approved'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold opacity-80">Candidatures Validées</span>
            <CheckCircle2 className={`w-4 h-4 ${statusFilter === 'approved' ? 'text-white' : 'text-emerald-500'}`} />
          </div>
          <div className="text-2xl font-bold mt-2 font-serif">{approvedCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'rejected'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-rose-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold opacity-80">Dossiers Rejetés</span>
            <XCircle className={`w-4 h-4 ${statusFilter === 'rejected' ? 'text-white' : 'text-rose-500'}`} />
          </div>
          <div className="text-2xl font-bold mt-2 font-serif">{rejectedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, n° dossier, profession..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-slate-900"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'pending' ? 'bg-amber-500 text-white shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>En attente</span>
              {pendingCount > 0 && <span className="text-[10px] bg-amber-700/50 text-white px-1.5 py-0.2 rounded-full font-bold">{pendingCount}</span>}
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === 'approved' ? 'bg-emerald-600 text-white shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Validées
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === 'rejected' ? 'bg-rose-600 text-white shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejetées
            </button>
          </div>

          {/* Tier Select */}
          {uniqueTiers.length > 0 && (
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
            >
              <option value="all">Toutes les formules</option>
              {uniqueTiers.map((tierName, idx) => (
                <option key={idx} value={tierName}>{tierName}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-base text-slate-800 mb-1">
            Aucun dossier de candidature trouvé
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || tierFilter !== 'all'
              ? 'Aucune demande ne correspond à vos critères de recherche ou de filtre.'
              : 'Les candidatures soumises par les visiteurs via le portail public apparaîtront automatiquement ici pour validation.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Réf. Dossier</th>
                  <th className="py-3 px-4">Candidat &amp; CNI</th>
                  <th className="py-3 px-4">Profession &amp; Institution</th>
                  <th className="py-3 px-4">Formule</th>
                  <th className="py-3 px-4">Règlement &amp; Versement</th>
                  <th className="py-3 px-4">Date de Dépôt</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Reference */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 text-[11px]">
                        {app.application_number}
                      </span>
                    </td>

                    {/* Candidate Identity with Avatar & CNI */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
                          {app.avatar_url ? (
                            <img
                              src={app.avatar_url}
                              alt=""
                              className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                              onClick={() => setPreviewDoc({
                                isOpen: true,
                                title: `Photo — ${app.first_name} ${app.last_name}`,
                                url: app.avatar_url!,
                              })}
                            />
                          ) : (
                            <UserCheck className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{app.civility} {app.first_name} {app.last_name}</span>
                          </div>
                          <div className="text-slate-500 text-[11px] flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{app.email || '—'}</span>
                            {app.phone && (
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{app.phone}</span>
                            )}
                          </div>
                          {/* CNI Badge */}
                          <div className="flex items-center gap-1.5 mt-1">
                            {app.cni ? (
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                                CNI: {app.cni}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">CNI non saisie</span>
                            )}
                            {app.cni_url && (
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({
                                  isOpen: true,
                                  title: `Scan CNI — ${app.first_name} ${app.last_name}`,
                                  url: app.cni_url!,
                                })}
                                className="text-[10px] text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-0.5 cursor-pointer bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200"
                              >
                                <FileText className="w-2.5 h-2.5 text-amber-700" /> Scan CNI
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Profession & Institution */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-medium text-slate-900">{app.profession}</div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{app.institution || 'Non spécifié'}</span>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{app.tier_name}</div>
                      <div className="text-amber-700 font-medium text-[11px]">
                        {app.tier_price ? `${app.tier_price.toLocaleString('fr-FR')} FCFA` : 'Standard'}
                      </div>
                    </td>

                    {/* Payment & Transfer Reference */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 text-[11px]">
                            {app.payment_method || 'Mode non précisé'}
                          </span>
                          {app.payment_receipt_url && (
                            <button
                              type="button"
                              onClick={() => setPreviewDoc({
                                isOpen: true,
                                title: `Reçu de versement — ${app.application_number}`,
                                url: app.payment_receipt_url!,
                              })}
                              className="text-[10px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5 cursor-pointer"
                              title="Voir le reçu de versement"
                            >
                              <FileText className="w-2.5 h-2.5" /> Reçu
                            </button>
                          )}
                        </div>

                        {app.payment_reference ? (
                          <div className="text-[11px] font-mono font-semibold text-amber-900 flex items-center gap-1">
                            <span className="text-[10px] font-sans text-slate-500">N° :</span>
                            <span className="bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 select-all">{app.payment_reference}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic">Aucun N° renseigné</div>
                        )}

                        <div>
                          {app.payment_status === 'verified' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Versement validé
                            </span>
                          ) : app.payment_status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              <XCircle className="w-2.5 h-2.5 text-rose-600" /> Versement rejeté
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              <Clock className="w-2.5 h-2.5 text-amber-600" /> Versement à vérifier
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {app.created_at ? new Date(app.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : '—'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {app.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300/80 px-2.5 py-1 rounded-full font-semibold text-[11px]">
                          <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                          En attente
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Validée
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full font-semibold text-[11px]">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Rejetée
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Details Button */}
                        <button
                          onClick={() => handleOpenDetail(app)}
                          title="Examiner le dossier complet"
                          className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* PDF Preview Button */}
                        <button
                          onClick={() => handleOpenPdf(app)}
                          title="Aperçu de l'attestation PDF"
                          className="p-1.5 text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Member Cases / Fiche Affaires Button */}
                        {app.status === 'approved' && onOpenMemberCases && (
                          <button
                            onClick={() => onOpenMemberCases(app)}
                            title="Fiche du Membre & Dossier des Affaires"
                            className="p-1.5 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                            <span className="hidden xl:inline">Affaires</span>
                            {app.cases && app.cases.length > 0 && (
                              <span className="bg-blue-600 text-white px-1.5 py-0.2 rounded-full text-[9px] font-bold">
                                {app.cases.length}
                              </span>
                            )}
                          </button>
                        )}

                        {/* Approved Candidate: Profil Membre Button (Replaces Affectation button) */}
                        {app.status === 'approved' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenMemberProfile ? onOpenMemberProfile(app) : (onOpenMemberAffectation ? onOpenMemberAffectation(app) : handleOpenApprovalModal(app))}
                              title="Consulter le profil officiel du membre agréé"
                              className="p-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-[11px]"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Profil</span>
                            </button>

                            {onOpenAssociativeLife && (
                              <button
                                type="button"
                                onClick={() => onOpenAssociativeLife(app)}
                                title="Consulter et gérer la vie associative du membre"
                                className="p-1.5 text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-[11px]"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                <span>Vie Assoc.</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Direct Approve Button for Pending Candidates */}
                        {app.status !== 'approved' && (
                          <button
                            onClick={() => handleDirectApprove(app)}
                            title="Valider la candidature"
                            className="p-1.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs font-semibold"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        )}

                        {/* Reject Button */}
                        {app.status !== 'rejected' && (
                          <button
                            onClick={() => handleOpenRejectionModal(app)}
                            title="Rejeter la candidature"
                            className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteApplication(app.id, app.application_number)}
                          title="Supprimer définitivement"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Detail View of Candidature */}
      {detailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold overflow-hidden shrink-0">
                  {adminAvatarUrl ? (
                    <img src={adminAvatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <UserCheck className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-400">{selectedApp.application_number}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                      selectedApp.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                      selectedApp.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                    }`}>
                      {selectedApp.status === 'pending' ? 'En attente' : selectedApp.status === 'approved' ? 'Validée' : 'Rejetée'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    Dossier de {selectedApp.civility} {selectedApp.first_name} {selectedApp.last_name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800 text-xs leading-relaxed">
              {/* Formula & Status Info */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider block">Collège &amp; Formule sollicitée</span>
                  <span className="text-sm font-bold text-slate-900 font-serif">{selectedApp.tier_name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider block">Cotisation annuelle</span>
                  <span className="text-sm font-bold text-amber-900">{selectedApp.tier_price ? `${selectedApp.tier_price} € / an` : 'Standard'}</span>
                </div>
              </div>

              {/* Member Cases Callout banner if approved */}
              {selectedApp.status === 'approved' && onOpenMemberCases && (
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-4 shadow-md flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>Fiche Membre &amp; Dossiers Contentieux</span>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                          {selectedApp.cases?.length || 0} affaire(s)
                        </span>
                      </h4>
                      <p className="text-[11px] text-blue-100">
                        Consultez ou enregistrez les affaires, fixez des renvois d'audience et joignez des pièces de procédure.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDetailModalOpen(false);
                      onOpenMemberCases(selectedApp);
                    }}
                    className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-105 shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Gérer les Affaires</span>
                  </button>
                </div>
              )}

              {/* État Civil & Identité */}
              <div>
                <span className="text-slate-500 block text-[11px] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" /> État Civil &amp; Identité
                </span>
                <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Civilité &amp; Nom complet</span>
                    <span className="font-semibold text-slate-900 text-sm">
                      {selectedApp.civility} {selectedApp.first_name} {selectedApp.last_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Statut Matrimonial</span>
                    <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                      <Heart className="w-3 h-3 text-rose-500" /> {selectedApp.marital_status || 'Non précisé'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date &amp; Lieu de naissance</span>
                    <span className="font-medium text-slate-700 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {selectedApp.birth_date ? new Date(selectedApp.birth_date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      }) : 'Non renseignée'}
                      {selectedApp.birth_place ? ` à ${selectedApp.birth_place}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date de soumission</span>
                    <span className="font-medium text-slate-700">
                      {selectedApp.created_at ? new Date(selectedApp.created_at).toLocaleString('fr-FR') : 'Non renseignée'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: PIÈCES ADMINISTRATIVES & IDENTIFICATION DU MEMBRE (CNI & PHOTO DE PROFIL) */}
              <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 p-4 rounded-xl border-2 border-amber-300/80 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                      Pièces &amp; Identification du Membre (Photo de Profil &amp; CNI)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500 text-slate-900 px-2 py-0.5 rounded-full">
                    Consultation &amp; Modification Administrateur
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Champ 1: Photo de Profil */}
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold text-slate-700 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-amber-600" /> Photo de Profil
                      </label>
                      {adminAvatarUrl && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc({
                              isOpen: true,
                              title: `Photo de Profil — ${selectedApp.first_name} ${selectedApp.last_name}`,
                              url: adminAvatarUrl,
                            })}
                            className="text-[10px] text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" /> Agrandir
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminAvatarUrl('')}
                            className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative group shrink-0">
                        {adminAvatarUrl ? (
                          <img
                            src={adminAvatarUrl}
                            alt="Aperçu du profil"
                            className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-sm cursor-pointer hover:opacity-90"
                            onClick={() => setPreviewDoc({
                              isOpen: true,
                              title: `Photo de Profil — ${selectedApp.first_name} ${selectedApp.last_name}`,
                              url: adminAvatarUrl,
                            })}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                            <Camera className="w-6 h-6 stroke-[1.5]" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-amber-700" />
                          <span>{adminAvatarUrl ? 'Remplacer la photo' : 'Choisir une photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="block text-[10px] text-slate-500">
                          Format JPG, PNG, WEBP. Intégrée automatiquement au profil membre lors de la validation.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Champ 2: CNI */}
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold text-slate-700 flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-amber-600" /> Carte Nationale d'Identité (CNI) / Passeport
                      </label>
                      {adminCniUrl && (
                        <button
                          type="button"
                          onClick={() => setAdminCniUrl('')}
                          className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                        >
                          Supprimer scan
                        </button>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Numéro de pièce d'identité :</span>
                      <input
                        type="text"
                        placeholder="Ex : CI002938482 ou N° CNI / Passeport..."
                        value={adminCni}
                        onChange={(e) => setAdminCni(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors font-mono"
                      />
                    </div>

                    {/* Scan preview & actions */}
                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      {adminCniUrl ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc({
                              isOpen: true,
                              title: `Scan CNI — ${selectedApp.first_name} ${selectedApp.last_name}`,
                              url: adminCniUrl,
                            })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-md font-bold text-[11px] cursor-pointer shadow-2xs transition-colors"
                          >
                            <Eye className="w-3 h-3 text-amber-700" />
                            <span>Consulter le scan CNI</span>
                          </button>
                          <label className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer">
                            <span>Remplacer</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleCniFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Joindre le scan / document CNI</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleCniFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: RÈGLEMENT DE LA COTISATION & VÉRIFICATION DU VERSEMENT */}
              <div className="bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 p-4 rounded-xl border-2 border-indigo-200 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-indigo-200 pb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-700" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-950">
                      Règlement de la Cotisation &amp; Vérification du Versement
                    </span>
                  </div>

                  {/* Payment Verification Status Badge */}
                  <div>
                    {adminPaymentStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-xs">
                        <CheckCircle2 className="w-3 h-3" /> Versement Validé &amp; Confirmé
                      </span>
                    ) : adminPaymentStatus === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-xs">
                        <XCircle className="w-3 h-3" /> Versement Rejeté / Non Reçu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-bold text-[11px] animate-pulse shadow-xs">
                        <Clock className="w-3 h-3" /> En attente de vérification bancaire / opérateur
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left: Payment Method & Reference */}
                  <div className="space-y-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Montant Cotisation</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {selectedApp.tier_price ? `${selectedApp.tier_price.toLocaleString('fr-FR')} FCFA` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Mode de Règlement</span>
                        <input
                          type="text"
                          placeholder="Ex : Wave, Orange Money, Virement..."
                          value={adminPaymentMethod}
                          onChange={(e) => setAdminPaymentMethod(e.target.value)}
                          className="w-full bg-slate-50 px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-md outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-slate-700 uppercase">
                          Numéro de versement / Référence de transaction *
                        </label>
                        {adminPaymentReference && (
                          <button
                            type="button"
                            onClick={() => handleCopyText(adminPaymentReference)}
                            className="text-[10px] text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedRef ? 'Copié !' : 'Copier'}</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Ex : ID Transaction Wave, Réf virement, N° reçu..."
                        value={adminPaymentReference}
                        onChange={(e) => setAdminPaymentReference(e.target.value)}
                        className="w-full bg-indigo-50/50 hover:bg-white focus:bg-white px-3 py-2 text-xs font-mono font-bold text-indigo-950 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      />
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Vérifiez ce numéro sur votre relevé bancaire ou application opérateur avant validation.
                      </span>
                    </div>
                  </div>

                  {/* Right: Receipt & Verification Actions */}
                  <div className="space-y-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1">
                          <FileText className="w-3 h-3 text-indigo-600" /> Reçu / Justificatif de Versement
                        </label>
                        {adminPaymentReceiptUrl && (
                          <button
                            type="button"
                            onClick={() => setAdminPaymentReceiptUrl('')}
                            className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>

                      {adminPaymentReceiptUrl ? (
                        <div className="flex items-center justify-between p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-200">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-700 shrink-0" />
                            <span className="font-semibold text-indigo-950 text-xs">Justificatif de versement joint</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc({
                                isOpen: true,
                                title: `Justificatif de versement — ${selectedApp.application_number}`,
                                url: adminPaymentReceiptUrl,
                              })}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-bold text-[11px] cursor-pointer shadow-xs flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Consulter le reçu</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center">
                          <span className="block text-[11px] text-slate-500 mb-1.5">Aucun reçu téléversé par le candidat.</span>
                          <label className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-md font-semibold text-[11px] cursor-pointer shadow-2xs transition-colors">
                            <Upload className="w-3 h-3" />
                            <span>Joindre reçu de banque</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleReceiptFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Instant Payment Verification Buttons */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                        Action de vérification du versement :
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleVerifyPayment('verified')}
                          disabled={isVerifyingPayment}
                          className="flex-1 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Confirmer le versement</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerifyPayment('rejected')}
                          disabled={isVerifyingPayment}
                          className="py-1.5 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Rejeter</span>
                        </button>
                        {adminPaymentStatus !== 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleVerifyPayment('pending')}
                            disabled={isVerifyingPayment}
                            className="py-1.5 px-2 text-slate-500 hover:text-slate-800 text-[11px] font-semibold underline cursor-pointer"
                          >
                            Remettre en attente
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save All Admin Fields Bar */}
                <div className="pt-2 border-t border-indigo-200/80 flex items-center justify-between">
                  {adminFieldsSavedMessage ? (
                    <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {adminFieldsSavedMessage}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">
                      Modifiez les données administratives (CNI, photo, versement) puis cliquez pour sauvegarder.
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveAdminFields}
                    disabled={isSavingAdminFields}
                    className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-[#031632] hover:bg-[#1A2B48] text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-60 transition-colors"
                  >
                    {isSavingAdminFields ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : (
                      <Save className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{isSavingAdminFields ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                  </button>
                </div>
              </div>

              {/* Coordonnées & Localisation */}
              <div>
                <span className="text-slate-500 block text-[11px] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> Coordonnées &amp; Localisation
                </span>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Adresse Courriel</span>
                      {selectedApp.email ? (
                        <a href={`mailto:${selectedApp.email}`} className="text-amber-700 font-medium hover:underline flex items-center gap-1 mt-0.5">
                          <Mail className="w-3.5 h-3.5" /> {selectedApp.email}
                        </a>
                      ) : (
                        <span className="text-slate-500 italic flex items-center gap-1 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> Non communiquée
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Téléphone Principal</span>
                      <span className="text-slate-700 font-medium flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5" /> {selectedApp.phone || 'Non communiqué'}
                      </span>
                    </div>
                  </div>

                  {(selectedApp.whatsapp || selectedApp.secondary_phone) && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Numéro WhatsApp</span>
                        <span className="text-slate-700 font-medium flex items-center gap-1 mt-0.5">
                          {selectedApp.whatsapp || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Second Numéro de Téléphone</span>
                        <span className="text-slate-700 font-medium flex items-center gap-1 mt-0.5">
                          {selectedApp.secondary_phone || '—'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Adresse complète</span>
                    <span className="font-medium text-slate-800 flex items-start gap-1 mt-0.5">
                      <Home className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{selectedApp.address || 'Non communiquée'}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Localité / Ville</span>
                      <span className="font-semibold text-slate-900">{selectedApp.locality || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Département</span>
                      <span className="font-medium text-slate-700">{selectedApp.department || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Région</span>
                      <span className="font-medium text-slate-700">{selectedApp.region || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pays</span>
                      <span className="font-bold text-slate-900">{selectedApp.country || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profil Professionnel */}
              <div>
                <span className="text-slate-500 block text-[11px] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-600" /> Profil Professionnel &amp; Rattachement
                </span>
                <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Profession / Titre</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" /> {selectedApp.profession}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Barreau / Faculté / Entreprise</span>
                    <span className="font-medium text-slate-700 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" /> {selectedApp.institution || 'Non spécifié'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Motivations */}
              <div>
                <span className="text-slate-500 block text-[11px] uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" /> Motivations ou commissions d'intérêt exprimées
                </span>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 text-xs italic leading-relaxed whitespace-pre-wrap">
                  {selectedApp.motivation || 'Aucun message de motivation particulier n\'a été formulé lors de la soumission.'}
                </div>
              </div>

              {/* Admin Internal Notes */}
              {selectedApp.admin_notes && (
                <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3 text-rose-900">
                  <span className="font-bold block text-[11px] mb-1">Notes internes / Motifs :</span>
                  <p className="text-xs">{selectedApp.admin_notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenPdf(selectedApp)}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Flux PDF d'attestation</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {selectedApp.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleOpenRejectionModal(selectedApp);
                    }}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Rejeter
                  </button>
                )}
                {selectedApp.status !== 'approved' ? (
                  <button
                    type="button"
                    onClick={() => handleDirectApprove(selectedApp)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Valider la candidature</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDetailModalOpen(false);
                      if (onOpenMemberProfile) {
                        onOpenMemberProfile(selectedApp);
                      } else if (onOpenMemberAffectation) {
                        onOpenMemberAffectation(selectedApp);
                      } else {
                        handleOpenApprovalModal(selectedApp);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Consulter le profil membre</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Approval Confirmation & Directory Integration */}
      {approvalModalOpen && appToApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-emerald-200" />
                <h3 className="font-serif font-bold text-base text-white">
                  {appToApprove.status === 'approved' ? 'Affectation Institutionnelle & Agrément du Membre' : 'Valider la Candidature & Agréer le Membre'}
                </h3>
              </div>
              <button
                onClick={() => setApprovalModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApproval} className="p-6 space-y-4 text-xs text-slate-700">
              <p className="text-slate-600">
                Vous êtes sur le point de valider la demande d'adhésion de <strong>{appToApprove.civility} {appToApprove.first_name} {appToApprove.last_name}</strong> pour la formule <strong>{appToApprove.tier_name}</strong>.
              </p>

              {/* Payment Status Notice */}
              {appToApprove.payment_status === 'verified' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Versement vérifié et confirmé sous la référence <strong>{appToApprove.payment_reference || 'Confirmé'}</strong> ({appToApprove.payment_method || 'Mode validé'}).</span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Versement en attente de validation</span>
                    <span className="text-[11px] text-amber-800/90 block mt-0.5">
                      Réf. versement déclarée : <strong>{appToApprove.payment_reference || 'Aucun numéro saisi'}</strong> ({appToApprove.payment_method || 'Non précisé'}). Vous pouvez valider l'adhésion si le paiement a été constaté.
                    </span>
                  </div>
                </div>
              )}

              {/* Checkbox to add directly to directory */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createMemberProfile}
                    onChange={(e) => setCreateMemberProfile(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Créer automatiquement la fiche dans l'annuaire des membres
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Le candidat figurera immédiatement dans la section Membres avec sa profession et son institution.
                    </span>
                  </div>
                </label>

                {createMemberProfile && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Catégorie d'affectation
                      </label>
                      <select
                        value={approvalCategory}
                        onChange={(e) => {
                          setApprovalCategory(e.target.value);
                          const target = categoriesList.find(c => c.name === e.target.value);
                          setApprovalSubcategory(target?.subcategories?.[0]?.name || '');
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Sous-catégorie
                      </label>
                      <select
                        value={approvalSubcategory}
                        onChange={(e) => setApprovalSubcategory(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                      >
                        <option value="">Aucune</option>
                        {currentCategoryObj?.subcategories?.map((sub) => (
                          <option key={sub.id} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Note interne ou mention de délibération (optionnelle)</label>
                <textarea
                  rows={2}
                  placeholder="Ex : Validé en réunion de bureau du 12 octobre..."
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setApprovalModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{appToApprove.status === 'approved' ? 'Enregistrer l\'affectation' : 'Confirmer la validation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Rejection Modal */}
      {rejectionModalOpen && appToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-200" />
                <h3 className="font-serif font-bold text-base text-white">
                  Rejeter la Demande d'Adhésion
                </h3>
              </div>
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRejection} className="p-6 space-y-4 text-xs text-slate-700">
              <p className="text-slate-600">
                Êtes-vous sûr de vouloir marquer le dossier de <strong>{appToReject.civility} {appToReject.first_name} {appToReject.last_name}</strong> comme rejeté ?
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Motif du refus ou observation interne</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex : Dossier incomplet, critères statutaires non réunis..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRejectionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
                >
                  Confirmer le rejet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded PDF Stream Viewer Modal */}
      {pdfStreamOpen && pdfData && (
        <PdfStreamModal
          isOpen={pdfStreamOpen}
          onClose={() => setPdfStreamOpen(false)}
          pdfBlobUrl={pdfBlobUrl}
          data={pdfData}
        />
      )}

      {/* Document / Photo / CNI Full Preview Modal */}
      {previewDoc && previewDoc.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-sm text-white truncate max-w-md">
                  {previewDoc.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.url}
                  download="document"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ouvrir / Télécharger
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Display */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/50 min-h-[300px]">
              {previewDoc.url.startsWith('data:application/pdf') ? (
                <iframe
                  src={previewDoc.url}
                  title={previewDoc.title}
                  className="w-full h-[70vh] rounded-lg border border-slate-800"
                />
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg border border-slate-800"
                />
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-400">
              <span>Aperçu haute résolution du document transmis</span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
