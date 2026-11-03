import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
  Briefcase,
  X,
  Plus,
  Calendar,
  Clock,
  FileText,
  Upload,
  Trash2,
  Edit,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Gavel,
  Scale,
  FolderOpen,
  User,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Download,
  Eye,
  FileCheck,
  Shield,
  Tag
} from 'lucide-react';
import { Member, MembershipApplication, MemberCase, MemberCaseStatus, MemberCaseDocument } from '../../../types';

interface MemberCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  application?: MembershipApplication | null;
  allCases?: MemberCase[];
}

const CASE_CATEGORIES = [
  'Civil',
  'Pénal',
  'Foncier & Immobilier',
  'Travail & Social',
  'Commercial & Affaires',
  'Contentieux Administratif',
  'Arbitrage & Médiation',
  'Famille & Successions',
  'Conseil Juridique'
];

const CASE_STATUSES: { key: MemberCaseStatus; label: string; color: string; badge: string; icon: any }[] = [
  { key: 'en_cours', label: 'En cours d\'instruction', color: 'emerald', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: Clock },
  { key: 'renvoyee', label: 'Affaire Renvoyée', color: 'amber', badge: 'bg-amber-50 text-amber-900 border-amber-300', icon: Calendar },
  { key: 'delibere', label: 'Mise en Délibéré', color: 'purple', badge: 'bg-purple-50 text-purple-900 border-purple-200', icon: Gavel },
  { key: 'jugement_rendu', label: 'Jugement / Décision rendue', color: 'blue', badge: 'bg-blue-50 text-blue-900 border-blue-200', icon: FileCheck },
  { key: 'cloturee', label: 'Dossier Clôturé', color: 'slate', badge: 'bg-slate-100 text-slate-800 border-slate-300', icon: CheckCircle2 },
  { key: 'archivee', label: 'Archivé', color: 'zinc', badge: 'bg-zinc-100 text-zinc-600 border-zinc-200', icon: Shield }
];

export const MemberCasesModal: React.FC<MemberCasesModalProps> = ({
  isOpen,
  onClose,
  member,
  application,
  allCases = []
}) => {
  if (!isOpen || (!member && !application)) return null;

  // Active view: 'list' | 'create' | 'edit' | 'detail' | 'quick_status'
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'detail'>('list');
  const [selectedCase, setSelectedCase] = useState<MemberCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for creating / editing a case
  const [formCaseId, setFormCaseId] = useState<string>('');
  const [formCaseNumber, setFormCaseNumber] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Civil');
  const [formJurisdiction, setFormJurisdiction] = useState('');
  const [formOpposingParty, setFormOpposingParty] = useState('');
  const [formStatus, setFormStatus] = useState<MemberCaseStatus>('en_cours');
  const [formHearingDate, setFormHearingDate] = useState('');
  const [formHearingReason, setFormHearingReason] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formDocumentTitle, setFormDocumentTitle] = useState('');
  const [formDocumentFile, setFormDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload document modal / sub-state
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocFile, setNewDocFile] = useState<File | null>(null);

  // Quick status change modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetCaseForStatus, setTargetCaseForStatus] = useState<MemberCase | null>(null);
  const [newStatus, setNewStatus] = useState<MemberCaseStatus>('renvoyee');
  const [newHearingDate, setNewHearingDate] = useState('');
  const [newHearingReason, setNewHearingReason] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  const docInputRef = useRef<HTMLInputElement | null>(null);
  const detailDocInputRef = useRef<HTMLInputElement | null>(null);

  // Identify member ID and application ID
  const effectiveMemberId = member?.id || application?.member_id || '';
  const effectiveAppName = member?.name || `${application?.civility || ''} ${application?.first_name || ''} ${application?.last_name || ''}`.trim();
  const effectiveAppNumber = application?.application_number || '';
  const effectiveRole = member?.role || application?.profession || 'Membre Adhérent';
  const effectiveOrg = member?.organization || application?.institution || '';
  const effectiveAvatar = member?.avatar_url || member?.avatarUrl || application?.avatar_url;

  // Filter cases specifically for this member
  const memberCases = allCases.filter((c: any) => {
    if (effectiveMemberId && c.member_id === effectiveMemberId) return true;
    if (application?.id && c.membership_application_id === application.id) return true;
    return false;
  });

  const filteredCases = memberCases.filter((c) => {
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = c.status === statusFilter;
    }
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch =
        (c.case_number && c.case_number.toLowerCase().includes(q)) ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.opposing_party && c.opposing_party.toLowerCase().includes(q)) ||
        (c.jurisdiction && c.jurisdiction.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q));
    }
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const totalCount = memberCases.length;
  const enCoursCount = memberCases.filter((c) => c.status === 'en_cours').length;
  const renvoyeeCount = memberCases.filter((c) => c.status === 'renvoyee').length;
  const delibereCount = memberCases.filter((c) => c.status === 'delibere').length;
  const clotureCount = memberCases.filter((c) => c.status === 'cloturee' || c.status === 'jugement_rendu').length;

  // Helpers
  const resetForm = () => {
    setFormCaseId('');
    setFormCaseNumber('');
    setFormTitle('');
    setFormCategory('Civil');
    setFormJurisdiction('');
    setFormOpposingParty('');
    setFormStatus('en_cours');
    setFormHearingDate('');
    setFormHearingReason('');
    setFormSummary('');
    setFormDocumentTitle('');
    setFormDocumentFile(null);
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const handleOpenCreate = () => {
    resetForm();
    setCurrentView('create');
  };

  const handleOpenEdit = (c: MemberCase) => {
    setFormCaseId(c.id);
    setFormCaseNumber(c.case_number || '');
    setFormTitle(c.title || '');
    setFormCategory(c.category || 'Civil');
    setFormJurisdiction(c.jurisdiction || '');
    setFormOpposingParty(c.opposing_party || '');
    setFormStatus(c.status || 'en_cours');
    setFormHearingDate(c.hearing_date ? c.hearing_date.toString().substring(0, 10) : '');
    setFormHearingReason(c.hearing_reason || '');
    setFormSummary(c.summary || '');
    setFormDocumentTitle('');
    setFormDocumentFile(null);
    setCurrentView('edit');
  };

  const handleOpenDetail = (c: MemberCase) => {
    // Refresh case from current list
    const found = memberCases.find((item) => item.id === c.id) || c;
    setSelectedCase(found);
    setCurrentView('detail');
  };

  // Submit Save Case
  const handleSubmitCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveMemberId) {
      alert("Erreur: le profil du membre n'a pas été identifié.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    if (formCaseId) formData.append('id', formCaseId);
    formData.append('member_id', effectiveMemberId);
    if (application?.id) formData.append('membership_application_id', application.id);
    if (formCaseNumber) formData.append('case_number', formCaseNumber);
    formData.append('title', formTitle);
    formData.append('category', formCategory);
    if (formJurisdiction) formData.append('jurisdiction', formJurisdiction);
    if (formOpposingParty) formData.append('opposing_party', formOpposingParty);
    formData.append('status', formStatus);
    if (formHearingDate) formData.append('hearing_date', formHearingDate);
    if (formHearingReason) formData.append('hearing_reason', formHearingReason);
    if (formSummary) formData.append('summary', formSummary);
    if (formDocumentTitle) formData.append('document_title', formDocumentTitle);
    if (formDocumentFile) formData.append('document_file', formDocumentFile);

    router.post('/admin/member-cases', formData, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        resetForm();
        setCurrentView('list');
      },
      onError: (err) => {
        setIsSubmitting(false);
        alert('Erreur lors de l\'enregistrement de l\'affaire : ' + JSON.stringify(err));
      }
    });
  };

  // Quick Status Change Modal Open
  const handleOpenQuickStatus = (c: MemberCase) => {
    setTargetCaseForStatus(c);
    setNewStatus(c.status === 'en_cours' ? 'renvoyee' : c.status);
    setNewHearingDate(c.hearing_date ? c.hearing_date.toString().substring(0, 10) : '');
    setNewHearingReason(c.hearing_reason || '');
    setStatusNotes('');
    setStatusModalOpen(true);
  };

  const handleConfirmQuickStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCaseForStatus) return;

    router.post(`/admin/member-cases/${targetCaseForStatus.id}/status`, {
      status: newStatus,
      hearing_date: newHearingDate || null,
      hearing_reason: newHearingReason || null,
      event_notes: statusNotes || null
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setStatusModalOpen(false);
        setTargetCaseForStatus(null);
        if (selectedCase && selectedCase.id === targetCaseForStatus.id) {
          const updated = memberCases.find((x) => x.id === targetCaseForStatus.id);
          if (updated) setSelectedCase(updated);
        }
      }
    });
  };

  // Upload Document into selected case
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newDocFile) return;

    const formData = new FormData();
    formData.append('title', newDocTitle || newDocFile.name);
    formData.append('document', newDocFile);

    setIsSubmitting(true);
    router.post(`/admin/member-cases/${selectedCase.id}/documents`, formData, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setIsUploadingDoc(false);
        setNewDocTitle('');
        setNewDocFile(null);
        if (detailDocInputRef.current) detailDocInputRef.current.value = '';
      },
      onError: () => {
        setIsSubmitting(false);
        alert('Erreur lors de l\'envoi du document.');
      }
    });
  };

  // Delete Document
  const handleDeleteDocument = (docId: string, docTitle: string) => {
    if (!confirm(`Supprimer la pièce "${docTitle}" ?`)) return;
    router.delete(`/admin/member-case-documents/${docId}`, {
      preserveScroll: true
    });
  };

  // Delete Case
  const handleDeleteCase = (caseId: string, caseTitle: string) => {
    if (!confirm(`Confirmer la suppression définitive de l'affaire "${caseTitle}" et de tous ses documents ?`)) return;
    router.delete(`/admin/member-cases/${caseId}`, {
      preserveScroll: true,
      onSuccess: () => {
        if (selectedCase?.id === caseId) {
          setCurrentView('list');
          setSelectedCase(null);
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-slate-900/65 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">

        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500/10 via-slate-50 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            {effectiveAvatar ? (
              <img
                src={effectiveAvatar}
                alt={effectiveAppName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0 text-xl font-bold">
                {effectiveAppName ? effectiveAppName.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                  Fiche du Membre
                </span>
                {effectiveAppNumber && (
                  <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                    Réf. {effectiveAppNumber}
                  </span>
                )}
                {member?.category && (
                  <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                    {member.category} {member.subcategory ? `• ${member.subcategory}` : ''}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <span>{effectiveAppName}</span>
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap mt-0.5">
                <span className="font-medium text-slate-700">{effectiveRole}</span>
                {effectiveOrg && <span>• {effectiveOrg}</span>}
                {application?.phone && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <Phone className="w-3 h-3 text-slate-400" /> {application.phone}
                  </span>
                )}
                {application?.email && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <Mail className="w-3 h-3 text-slate-400" /> {application.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {currentView === 'list' && (
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Nouvelle Affaire</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats & Navigation Bar */}
        <div className="px-6 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => { setCurrentView('list'); setStatusFilter('all'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'list' && statusFilter === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Toutes les affaires ({totalCount})</span>
            </button>
            <button
              onClick={() => { setCurrentView('list'); setStatusFilter('en_cours'); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'list' && statusFilter === 'en_cours'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>En cours ({enCoursCount})</span>
            </button>
            <button
              onClick={() => { setCurrentView('list'); setStatusFilter('renvoyee'); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'list' && statusFilter === 'renvoyee'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Calendar className="w-3 h-3 text-amber-600" />
              <span>Renvoyées ({renvoyeeCount})</span>
            </button>
            <button
              onClick={() => { setCurrentView('list'); setStatusFilter('delibere'); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'list' && statusFilter === 'delibere'
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <Gavel className="w-3 h-3 text-purple-600" />
              <span>En délibéré ({delibereCount})</span>
            </button>
            <button
              onClick={() => { setCurrentView('list'); setStatusFilter('cloturee'); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'list' && statusFilter === 'cloturee'
                  ? 'bg-slate-700 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-slate-500" />
              <span>Clôturées ({clotureCount})</span>
            </button>
          </div>

          {currentView !== 'list' && (
            <button
              onClick={() => setCurrentView('list')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la liste des affaires</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">

          {/* VIEW: LIST */}
          {currentView === 'list' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par titre, n° rôle, juridiction, partie adverse..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all"
                  />
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Cases List */}
              {filteredCases.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-slate-800 mb-1">
                    Aucune affaire enregistrée pour ce membre
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Aucune affaire ne correspond à vos critères de recherche.'
                      : 'Enregistrez les dossiers contentieux, affaires en justice ou procédures concernant ce membre adhérent.'}
                  </p>
                  <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Enregistrer la première affaire
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredCases.map((c) => {
                    const statusObj = CASE_STATUSES.find((s) => s.key === c.status) || CASE_STATUSES[0];
                    const docCount = c.documents ? c.documents.length : 0;
                    return (
                      <div
                        key={c.id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-400/70 hover:shadow-md transition-all group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
                                {c.case_number}
                              </span>
                              <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                                {c.category}
                              </span>
                              {/* Status Badge */}
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${statusObj.badge}`}>
                                <statusObj.icon className="w-3 h-3" />
                                {statusObj.label}
                              </span>
                            </div>

                            <h3
                              onClick={() => handleOpenDetail(c)}
                              className="text-base font-serif font-bold text-slate-900 group-hover:text-amber-700 transition-colors cursor-pointer"
                            >
                              {c.title}
                            </h3>

                            {/* Details meta */}
                            <div className="text-xs text-slate-600 flex items-center gap-4 flex-wrap pt-0.5">
                              {c.jurisdiction && (
                                <span className="flex items-center gap-1">
                                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="font-medium text-slate-700">Juridiction :</span> {c.jurisdiction}
                                </span>
                              )}
                              {c.opposing_party && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="font-medium text-slate-700">Partie adverse :</span> {c.opposing_party}
                                </span>
                              )}
                              {docCount > 0 && (
                                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-200">
                                  <FileText className="w-3 h-3" /> {docCount} document{docCount > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>

                            {/* Hearing / Renvoi Alert Banner */}
                            {c.hearing_date && (
                              <div className="mt-2 p-2.5 bg-amber-50/80 border border-amber-300 rounded-xl flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 text-amber-900">
                                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>
                                    <strong>
                                      {c.status === 'renvoyee' ? 'Affaire renvoyée au' : 'Prochaine audience le'} :{' '}
                                    </strong>
                                    <span className="font-bold underline decoration-amber-500">
                                      {new Date(c.hearing_date).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </span>
                                    {c.hearing_reason && (
                                      <span className="text-amber-800 ml-1.5 italic">
                                        (Motif : {c.hearing_reason})
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleOpenQuickStatus(c)}
                                  className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
                                >
                                  Mettre à jour
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => handleOpenQuickStatus(c)}
                              title="Changer le statut ou fixer un renvoi"
                              className="px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Calendar className="w-3.5 h-3.5 text-amber-600" />
                              <span>Statut / Renvoi</span>
                            </button>
                            <button
                              onClick={() => handleOpenDetail(c)}
                              title="Consulter le dossier complet & documents"
                              className="p-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(c)}
                              title="Modifier l'affaire"
                              className="p-1.5 text-slate-600 hover:text-amber-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCase(c.id, c.title)}
                              title="Supprimer l'affaire"
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW: CREATE / EDIT */}
          {(currentView === 'create' || currentView === 'edit') && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentView('list')}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-slate-900">
                      {currentView === 'create' ? 'Enregistrer une nouvelle affaire' : 'Modifier le dossier d\'affaire'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Renseignez les détails du contentieux, la juridiction et joignez les pièces de procédure.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitCase} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Case Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      N° Dossier / N° de Rôle
                    </label>
                    <input
                      type="text"
                      placeholder="ex: AFF-2026-0001 ou RG 24/0192"
                      value={formCaseNumber}
                      onChange={(e) => setFormCaseNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Laissez vide pour générer automatiquement.</p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Matière / Catégorie <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    >
                      {CASE_CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Statut de l'affaire <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as MemberCaseStatus)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    >
                      {CASE_STATUSES.map((st) => (
                        <option key={st.key} value={st.key}>{st.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Objet / Intitulé de l'affaire <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Litige foncier relatif à la parcelle N° 45 c/ Sté Immobilière..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Jurisdiction */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Juridiction saisie
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Tribunal de Première Instance, Cour d'Appel, Tribunal du Travail..."
                      value={formJurisdiction}
                      onChange={(e) => setFormJurisdiction(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>

                  {/* Opposing Party */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Partie adverse / Demandeur ou Défendeur
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Ministère Public, M. Jean Dupont, Société SAS XYZ..."
                      value={formOpposingParty}
                      onChange={(e) => setFormOpposingParty(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Hearing & Postponement Fields */}
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Audience / Renvoi de l'affaire</span>
                    {formStatus === 'renvoyee' && (
                      <span className="text-[10px] bg-amber-600 text-white px-2 py-0.2 rounded-full font-bold uppercase">
                        Affaire Renvoyée
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Date de l'audience ou de renvoi
                      </label>
                      <input
                        type="date"
                        value={formHearingDate}
                        onChange={(e) => setFormHearingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Motif du renvoi ou objet de l'audience
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Pour communication de pièces, Réplique, Plaidoirie, Délibéré..."
                        value={formHearingReason}
                        onChange={(e) => setFormHearingReason(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Previous Postponements / Hearing Events History if editing */}
                  {(() => {
                    const currentEditingCase = formCaseId ? memberCases.find((c) => c.id === formCaseId) : null;
                    if (!currentEditingCase?.events || currentEditingCase.events.length === 0) return null;
                    return (
                      <div className="pt-3 border-t border-amber-200/80">
                        <span className="text-[11px] font-bold text-amber-950 block mb-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Historique des renvois enregistrés ({currentEditingCase.events.length}) :</span>
                        </span>
                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {currentEditingCase.events.map((ev: any, idx: number) => (
                            <div key={ev.id || idx} className="text-[11px] p-2 bg-white/90 rounded-lg border border-amber-200 flex items-center justify-between gap-2 shadow-2xs">
                              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>
                                  {ev.next_hearing_date
                                    ? `Renvoyée au ${new Date(ev.next_hearing_date).toLocaleDateString('fr-FR')}`
                                    : `Audience du ${new Date(ev.event_date).toLocaleDateString('fr-FR')}`}
                                </span>
                              </div>
                              {ev.reason && (
                                <span className="text-slate-600 italic text-[10px] truncate max-w-[240px]">
                                  Motif : {ev.reason}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Summary / Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Résumé des faits & Prétentions du membre
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Synthèse du dossier, arguments clés, situation procédurale..."
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Document Attachment on Creation */}
                {currentView === 'create' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
                      <Upload className="w-4 h-4 text-amber-600" />
                      <span>Joindre un premier document (optionnel)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Intitulé de la pièce jointe
                        </label>
                        <input
                          type="text"
                          placeholder="ex: Assignation en justice, Conclusions..."
                          value={formDocumentTitle}
                          onChange={(e) => setFormDocumentTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Sélectionner le fichier (PDF, Word, Image - max 25 Mo)
                        </label>
                        <input
                          type="file"
                          ref={docInputRef}
                          onChange={(e) => setFormDocumentFile(e.target.files?.[0] || null)}
                          className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setCurrentView('list')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Enregistrement...' : currentView === 'create' ? 'Enregistrer l\'affaire' : 'Mettre à jour l\'affaire'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: DETAIL OF A CASE */}
          {currentView === 'detail' && selectedCase && (
            <div className="space-y-6">
              {/* Detail Header Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-mono font-bold text-xs bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md">
                        {selectedCase.case_number}
                      </span>
                      <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                        {selectedCase.category}
                      </span>
                      {(() => {
                        const st = CASE_STATUSES.find((s) => s.key === selectedCase.status) || CASE_STATUSES[0];
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-bold text-xs border ${st.badge}`}>
                            <st.icon className="w-3.5 h-3.5" />
                            {st.label}
                          </span>
                        );
                      })()}
                    </div>
                    <h2 className="text-xl font-serif font-bold text-slate-900">
                      {selectedCase.title}
                    </h2>
                    <div className="text-xs text-slate-600 flex items-center gap-4 flex-wrap mt-2">
                      {selectedCase.jurisdiction && (
                        <span><strong>Juridiction :</strong> {selectedCase.jurisdiction}</span>
                      )}
                      {selectedCase.opposing_party && (
                        <span><strong>Partie adverse :</strong> {selectedCase.opposing_party}</span>
                      )}
                      {selectedCase.opened_at && (
                        <span><strong>Ouverture :</strong> {new Date(selectedCase.opened_at).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenQuickStatus(selectedCase)}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Renvoyer / Statut</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit(selectedCase)}
                      className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>
                  </div>
                </div>

                {/* Hearing Alert if set */}
                {selectedCase.hearing_date && (
                  <div className="mt-4 p-3 bg-amber-100/70 border border-amber-300 rounded-xl flex items-center justify-between text-xs text-amber-950">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <strong>{selectedCase.status === 'renvoyee' ? 'Affaire Renvoyée au :' : 'Date d\'Audience :'}</strong>{' '}
                        <span className="font-bold underline">
                          {new Date(selectedCase.hearing_date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        {selectedCase.hearing_reason && (
                          <span className="ml-2 italic">— {selectedCase.hearing_reason}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {selectedCase.summary && (
                  <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-700">
                    <h4 className="font-semibold text-slate-900 mb-1">Résumé & Faits :</h4>
                    <p className="whitespace-pre-line leading-relaxed">{selectedCase.summary}</p>
                  </div>
                )}
              </div>

              {/* Two columns: Documents & Procedural Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* DOCUMENTS SECTION */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <h3 className="font-bold text-sm text-slate-900">
                        Pièces & Documents de Procédure
                      </h3>
                      <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.2 rounded-full font-bold">
                        {selectedCase.documents?.length || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsUploadingDoc(true)}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter un document</span>
                    </button>
                  </div>

                  {/* Upload document inline modal / form */}
                  {isUploadingDoc && (
                    <form onSubmit={handleUploadDocument} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Téléverser une pièce jointe</span>
                        <button
                          type="button"
                          onClick={() => setIsUploadingDoc(false)}
                          className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Nom / Libellé de la pièce <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Mémoire ampliatif, Conclusions récapitulatives..."
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Fichier (PDF, Word, JPG, PNG - max 25 Mo) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="file"
                          required
                          ref={detailDocInputRef}
                          onChange={(e) => setNewDocFile(e.target.files?.[0] || null)}
                          className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg cursor-pointer"
                        >
                          {isSubmitting ? 'Téléversement...' : 'Confirmer l\'ajout'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Documents List */}
                  {(!selectedCase.documents || selectedCase.documents.length === 0) ? (
                    <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Aucun document joint à cette affaire pour le moment.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedCase.documents.map((doc: MemberCaseDocument) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/70 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                              {doc.file_type || 'doc'}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-xs text-slate-900 truncate">
                                {doc.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 truncate">
                                {doc.file_name} {doc.file_size ? `• ${(doc.file_size / 1024).toFixed(0)} Ko` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={doc.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-600 hover:text-amber-700 bg-white border border-slate-200 rounded-lg hover:shadow-2xs transition-all"
                              title="Ouvrir / Télécharger"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeleteDocument(doc.id, doc.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer la pièce"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PROCEDURAL TIMELINE SECTION */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <h3 className="font-bold text-sm text-slate-900">
                        Historique & Journal des Audiences
                      </h3>
                    </div>
                  </div>

                  {(!selectedCase.events || selectedCase.events.length === 0) ? (
                    <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Aucun événement de procédure consigné.
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {selectedCase.events.map((ev: any, idx: number) => {
                        const st = CASE_STATUSES.find((s) => s.key === ev.status);
                        return (
                          <div key={ev.id || idx} className="relative group">
                            <div className="absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-2xs group-hover:scale-125 transition-transform" />
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="font-semibold text-xs text-slate-800">
                                  {new Date(ev.event_date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </span>
                                {st && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badge}`}>
                                    {st.label}
                                  </span>
                                )}
                              </div>
                              {ev.next_hearing_date && (
                                <p className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-amber-600" />
                                  <span>
                                    {ev.status === 'renvoyee' ? 'Renvoyée au :' : 'Prochaine audience :'} {new Date(ev.next_hearing_date).toLocaleDateString('fr-FR')}
                                  </span>
                                  {ev.reason && <span className="italic text-slate-600 font-normal">({ev.reason})</span>}
                                </p>
                              )}
                              {ev.notes && (
                                <p className="text-xs text-slate-600 italic">
                                  {ev.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* QUICK STATUS MODAL */}
      {statusModalOpen && targetCaseForStatus && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500/10 via-slate-50 to-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Mettre à jour le statut / Renvoyer l'affaire</span>
              </h3>
              <button
                onClick={() => setStatusModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmQuickStatus} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-mono font-bold text-slate-800 mr-2">{targetCaseForStatus.case_number}</span>
                <span className="font-semibold text-slate-900">{targetCaseForStatus.title}</span>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nouveau statut de l'affaire <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as MemberCaseStatus)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                >
                  {CASE_STATUSES.map((st) => (
                    <option key={st.key} value={st.key}>{st.label}</option>
                  ))}
                </select>
              </div>

              {/* Postponement date & reason (especially if renvoyee or delibere) */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-950 mb-1">
                    {newStatus === 'renvoyee' ? 'Date de renvoi (prochaine audience)' : 'Date de la prochaine échéance / délibéré'}
                  </label>
                  <input
                    type="date"
                    value={newHearingDate}
                    onChange={(e) => setNewHearingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-950 mb-1">
                    Motif du renvoi ou objet de la prochaine étape
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Pour communication des conclusions responsives..."
                    value={newHearingReason}
                    onChange={(e) => setNewHearingReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note d'audience / Observations (pour le journal chronologique)
                </label>
                <textarea
                  rows={2}
                  placeholder="ex: Renvoi contradictoire accordé à la demande du conseil de la défense..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Enregistrer l'état
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberCasesModal;
