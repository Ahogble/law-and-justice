import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Award,
  Sparkles,
  Users,
  Briefcase,
  Gavel,
  FileText,
  Clock,
  CheckCircle2,
  Building2,
  Search,
  Filter,
  ExternalLink,
  Upload,
  X,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { router } from '@inertiajs/react';
import {
  Member,
  MembershipApplication,
  MemberAssociativeActivity,
  MemberAssociativeType,
  MemberAssociativeStatus
} from '../../../types';

interface MemberAssociativeLifeViewProps {
  application?: MembershipApplication | null;
  member?: Member | null;
  allAssociativeActivities?: MemberAssociativeActivity[];
  onBack: () => void;
  requestConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}

const ACTIVITY_TYPES: { key: MemberAssociativeType; label: string; badge: string; icon: any; desc: string }[] = [
  {
    key: 'commission',
    label: 'Commission de travail',
    badge: 'bg-blue-50 text-blue-900 border-blue-200',
    icon: Users,
    desc: 'Comités thématiques, groupes de réflexion, réformes'
  },
  {
    key: 'mandat',
    label: 'Mandat & Responsabilité',
    badge: 'bg-amber-50 text-amber-900 border-amber-300',
    icon: Award,
    desc: 'Fonctions statutaires, délégations, bureau'
  },
  {
    key: 'evenement',
    label: 'Événement & Colloque',
    badge: 'bg-purple-50 text-purple-900 border-purple-200',
    icon: Calendar,
    desc: 'Participation, intervention ou animation d\'assemblées et séminaires'
  },
  {
    key: 'mission',
    label: 'Mission & Pro bono',
    badge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    icon: HeartHandshake,
    desc: 'Permanences juridiques d\'assistance, plaidoyer'
  },
  {
    key: 'distinction',
    label: 'Distinction & Honneur',
    badge: 'bg-amber-100 text-amber-950 border-[#C5A059]',
    icon: Sparkles,
    desc: 'Titres honorifiques, félicitations du Conseil'
  }
];

export function MemberAssociativeLifeView({
  application,
  member,
  allAssociativeActivities = [],
  onBack,
  requestConfirmation,
}: MemberAssociativeLifeViewProps) {
  const app = application || null;
  const mem = member || null;

  const effectiveMemberId = mem?.id || app?.member_id || '';
  const effectiveAppId = app?.id || '';

  const fullName = app
    ? `${app.civility || ''} ${app.first_name || ''} ${app.last_name || ''}`.trim()
    : (mem?.name || 'Membre');

  const profession = app?.profession || mem?.role || 'Membre Titulaire';
  const institution = app?.institution || mem?.organization || 'Association Droit & Justice';
  const memberNumber = app?.application_number || `DJ-${new Date().getFullYear()}-0000`;
  const avatarUrl = app?.avatar_url || mem?.avatar_url || mem?.avatarUrl;
  const tierName = app?.tier_name || 'Membre Agréé';

  // Filter activities for this member
  const memberActivities = allAssociativeActivities.filter((act) => {
    if (effectiveMemberId && act.member_id === effectiveMemberId) return true;
    if (effectiveAppId && act.membership_application_id === effectiveAppId) return true;
    return false;
  });

  // State: search, type filter, status filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form Mode: false | 'create' | 'edit'
  const [formMode, setFormMode] = useState<false | 'create' | 'edit'>(false);
  const [editingId, setEditingId] = useState<string>('');

  // Form Fields
  const [formType, setFormType] = useState<MemberAssociativeType>('commission');
  const [formTitle, setFormTitle] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formIsCurrent, setFormIsCurrent] = useState(true);
  const [formStatus, setFormStatus] = useState<MemberAssociativeStatus>('actif');
  const [formDescription, setFormDescription] = useState('');
  const [formDocFile, setFormDocFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormMode(false);
    setEditingId('');
    setFormType('commission');
    setFormTitle('');
    setFormRole('');
    setFormUnit('');
    setFormStartDate('');
    setFormEndDate('');
    setFormIsCurrent(true);
    setFormStatus('actif');
    setFormDescription('');
    setFormDocFile(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setFormMode('create');
  };

  const handleOpenEdit = (act: MemberAssociativeActivity) => {
    setEditingId(act.id);
    setFormType(act.type);
    setFormTitle(act.title || '');
    setFormRole(act.role || '');
    setFormUnit(act.organization_unit || '');
    setFormStartDate(act.start_date ? act.start_date.substring(0, 10) : '');
    setFormEndDate(act.end_date ? act.end_date.substring(0, 10) : '');
    setFormIsCurrent(act.is_current ?? true);
    setFormStatus(act.status || 'actif');
    setFormDescription(act.description || '');
    setFormDocFile(null);
    setFormMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    if (editingId) formData.append('id', editingId);
    if (effectiveMemberId) formData.append('member_id', effectiveMemberId);
    if (effectiveAppId) formData.append('membership_application_id', effectiveAppId);
    formData.append('type', formType);
    formData.append('title', formTitle);
    if (formRole) formData.append('role', formRole);
    if (formUnit) formData.append('organization_unit', formUnit);
    if (formStartDate) formData.append('start_date', formStartDate);
    if (formEndDate && !formIsCurrent) formData.append('end_date', formEndDate);
    formData.append('is_current', formIsCurrent ? '1' : '0');
    formData.append('status', formStatus);
    if (formDescription) formData.append('description', formDescription);
    if (formDocFile) formData.append('document_file', formDocFile);

    router.post('/admin/member-associative-activities', formData, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        resetForm();
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    requestConfirmation(
      "Supprimer l'activité associative",
      `Êtes-vous sûr de vouloir retirer "${title}" de la fiche de vie associative de ce membre ?`,
      () => {
        router.delete(`/admin/member-associative-activities/${id}`, {
          preserveScroll: true
        });
      }
    );
  };

  // Filtered list
  const filteredActivities = memberActivities.filter((act) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      act.title.toLowerCase().includes(q) ||
      (act.role && act.role.toLowerCase().includes(q)) ||
      (act.organization_unit && act.organization_unit.toLowerCase().includes(q)) ||
      (act.description && act.description.toLowerCase().includes(q))
    );
    const matchesType = typeFilter === 'all' || act.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || act.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // KPI calculations
  const totalCount = memberActivities.length;
  const activeMandats = memberActivities.filter(a => a.type === 'mandat' && a.status === 'actif').length;
  const commissionsCount = memberActivities.filter(a => a.type === 'commission').length;
  const eventsCount = memberActivities.filter(a => a.type === 'evenement').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au profil</span>
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>Back-Office</span>
              <span>/</span>
              <span>Membres Agréés</span>
              <span>/</span>
              <span className="text-amber-800 font-bold">{fullName}</span>
              <span>/</span>
              <span className="text-slate-800 font-bold">Vie Associative</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-900 mt-0.5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Vie Associative &amp; Activités du Membre</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!formMode && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer une activité</span>
            </button>
          )}
        </div>
      </div>

      {/* Member Hero Banner */}
      <div className="bg-gradient-to-r from-[#031632] via-[#0b2447] to-[#1A2B48] text-white rounded-2xl p-5 shadow-md border-b-4 border-[#C5A059] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#C5A059] bg-white/10 shrink-0 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Users className="w-8 h-8 text-slate-300" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Membre Agréé
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                {tierName}
              </span>
              <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-200">
                {memberNumber}
              </span>
            </div>
            <h3 className="text-xl font-bold font-serif text-white mt-1">{fullName}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
              <span className="text-[#C5A059] font-medium">{profession}</span>
              <span>•</span>
              <span>{institution}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Activités</span>
            <span className="font-mono font-bold text-xl text-[#C5A059]">{totalCount}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Enregistrements</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 mt-2">{totalCount}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Mandats &amp; Fonctions Actives</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 mt-2">{activeMandats}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Commissions Techniques</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 mt-2">{commissionsCount}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Événements &amp; AG</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 mt-2">{eventsCount}</div>
        </div>
      </div>

      {/* Form: Add or Edit Activity */}
      {formMode && (
        <div className="bg-white rounded-2xl border-2 border-amber-300/80 shadow-lg p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif font-bold text-base text-slate-900">
                {formMode === 'create' ? 'Enregistrer une nouvelle activité associative' : 'Modifier l\'activité associative'}
              </h3>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* 1. Type selector */}
            <div>
              <label className="block text-slate-700 font-bold mb-2">
                Type d'engagement associatif <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {ACTIVITY_TYPES.map((t) => {
                  const Icon = t.icon;
                  const isSelected = formType === t.key;
                  return (
                    <div
                      key={t.key}
                      onClick={() => setFormType(t.key)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{t.label}</span>
                        <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">{t.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Main details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Intitulé de l'activité / Commission / Événement <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex : Commission Réforme du Droit Pénal, Colloque National 2026..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rôle / Fonction exercée
                </label>
                <input
                  type="text"
                  placeholder="ex : Rapporteur, Président de séance, Conférencier, Délégué..."
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pôle / Section / Entité
                </label>
                <input
                  type="text"
                  placeholder="ex : Pôle Pénal, Section Régionale Abidjan Sud, Bureau Exécutif..."
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Date de début / Prise de fonction
                </label>
                <input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Statut de l'engagement
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as MemberAssociativeStatus)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold"
                >
                  <option value="actif">Actif / En cours d'exercice</option>
                  <option value="termine">Terminé / Mission achevée</option>
                  <option value="honoraire">Titre honoraire</option>
                </select>
              </div>
            </div>

            {/* Date de fin conditionnelle */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={formIsCurrent}
                  onChange={(e) => setFormIsCurrent(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Activité ou mandat actuellement en cours</span>
              </label>

              {!formIsCurrent && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Date de fin :</span>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}
            </div>

            {/* Description & Réalisations */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Description des réalisations, contributions &amp; bilan
              </label>
              <textarea
                rows={3}
                placeholder="Renseignez le détail des actions menées, interventions, rapports rédigés ou responsabilités concrètes..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Document / Justificatif */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-slate-800 block">Pièce justificative ou Attestation (optionnel)</span>
                <span className="text-[11px] text-slate-500 block">Lettre de mission, certificat de participation, attestation de fonction...</span>
              </div>
              <label className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                <span>{formDocFile ? formDocFile.name : 'Joindre un fichier'}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setFormDocFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Enregistrement...' : (formMode === 'create' ? 'Valider l\'activité' : 'Mettre à jour')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par commission, mandat, rôle, mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
          >
            <option value="all">Tous les types</option>
            <option value="commission">Commissions de travail</option>
            <option value="mandat">Mandats &amp; Fonctions</option>
            <option value="evenement">Événements &amp; AG</option>
            <option value="mission">Missions &amp; Pro bono</option>
            <option value="distinction">Distinctions</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif / En cours</option>
            <option value="termine">Terminé</option>
            <option value="honoraire">Honoraire</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3 text-amber-600">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-base text-slate-900 mb-1">
            Aucune activité associative enregistrée
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Aucun engagement ne correspond à vos filtres de recherche.'
              : 'Enregistrez les commissions, mandats, colloques animés et contributions de ce membre au sein de l\'association.'}
          </p>
          {!formMode && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer la première activité</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((act) => {
            const typeConfig = ACTIVITY_TYPES.find(t => t.key === act.type) || ACTIVITY_TYPES[0];
            const Icon = typeConfig.icon;

            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300/80 p-5 shadow-2xs hover:shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${typeConfig.badge}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${typeConfig.badge}`}>
                          {typeConfig.label}
                        </span>

                        {act.status === 'actif' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            En cours
                          </span>
                        ) : act.status === 'honoraire' ? (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                            Titre honoraire
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                            Terminé
                          </span>
                        )}

                        {act.organization_unit && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            • {act.organization_unit}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-base text-slate-900">{act.title}</h4>

                      {act.role && (
                        <p className="text-xs font-semibold text-amber-800">
                          Rôle : {act.role}
                        </p>
                      )}

                      <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {act.start_date ? new Date(act.start_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Date non spécifiée'}
                          {act.is_current ? ' — À ce jour (En cours)' : (act.end_date ? ` — ${new Date(act.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}` : '')}
                        </span>
                      </div>

                      {act.description && (
                        <p className="text-xs text-slate-600 pt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                          {act.description}
                        </p>
                      )}

                      {act.document_url && (
                        <div className="pt-2">
                          <a
                            href={act.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            <span>{act.document_name || 'Justificatif / Attestation de fonction'}</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(act)}
                      className="p-2 text-slate-500 hover:text-amber-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                      title="Modifier cette activité"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(act.id, act.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                      title="Supprimer cette activité"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MemberAssociativeLifeView;
