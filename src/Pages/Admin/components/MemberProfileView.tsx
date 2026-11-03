import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  UserCheck,
  Award,
  Briefcase,
  FileText,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Eye,
  Camera,
  Upload,
  Save,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Scale,
  Sparkles
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { MembershipApplication, MemberCategory } from '../../../types';
import { generateAdhesionPdfBlobUrl } from '../../../utils/generateAdhesionPdf';
import { PdfStreamModal } from '../../../components/PdfStreamModal';

interface MemberProfileViewProps {
  application?: MembershipApplication | null;
  member?: any | null;
  allMembers?: any[];
  categoriesList: MemberCategory[];
  onBack: () => void;
  onOpenAffectationModal: (target: any) => void;
  onOpenMemberCases?: (target: any) => void;
  onOpenAssociativeLife?: (target: any) => void;
  requestConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}

export function MemberProfileView({
  application,
  member,
  allMembers = [],
  categoriesList = [],
  onBack,
  onOpenAffectationModal,
  onOpenMemberCases,
  onOpenAssociativeLife,
  requestConfirmation,
}: MemberProfileViewProps) {
  // Resolved member and application
  const app = application || null;
  const mem = member || (app?.member_id ? allMembers.find(m => m.id === app.member_id) : null);

  // Editable fields state
  const [adminCni, setAdminCni] = useState(app?.cni || '');
  const [adminCniUrl, setAdminCniUrl] = useState(app?.cni_url || '');
  const [adminAvatarUrl, setAdminAvatarUrl] = useState(app?.avatar_url || mem?.avatar_url || '');
  const [adminPaymentMethod, setAdminPaymentMethod] = useState(app?.payment_method || '');
  const [adminPaymentReference, setAdminPaymentReference] = useState(app?.payment_reference || '');
  const [adminPaymentReceiptUrl, setAdminPaymentReceiptUrl] = useState(app?.payment_receipt_url || '');
  const [adminPaymentStatus, setAdminPaymentStatus] = useState<'pending' | 'verified' | 'rejected'>(
    app?.payment_status || (app?.status === 'approved' ? 'verified' : 'pending')
  );
  const [adminNotes, setAdminNotes] = useState(app?.admin_notes || '');

  // Keep local state in sync when prop updates from server
  useEffect(() => {
    setAdminCni(app?.cni || '');
    setAdminCniUrl(app?.cni_url || '');
    setAdminAvatarUrl(app?.avatar_url || mem?.avatar_url || '');
    setAdminPaymentMethod(app?.payment_method || '');
    setAdminPaymentReference(app?.payment_reference || '');
    setAdminPaymentReceiptUrl(app?.payment_receipt_url || '');
    setAdminPaymentStatus(app?.payment_status || (app?.status === 'approved' ? 'verified' : 'pending'));
    setAdminNotes(app?.admin_notes || '');
  }, [
    app?.id,
    app?.status,
    app?.cni,
    app?.cni_url,
    app?.avatar_url,
    app?.payment_method,
    app?.payment_reference,
    app?.payment_receipt_url,
    app?.payment_status,
    app?.admin_notes,
    mem?.id,
    mem?.avatar_url,
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // PDF Preview State
  const [pdfStreamOpen, setPdfStreamOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<any>(null);

  // Document preview modal
  const [previewDoc, setPreviewDoc] = useState<{ isOpen: boolean; title: string; url: string } | null>(null);

  const fullName = app
    ? `${app.civility || ''} ${app.first_name || ''} ${app.last_name || ''}`.trim()
    : (mem?.name || 'Membre');

  const profession = app?.profession || mem?.role || 'Membre Titulaire';
  const institution = app?.institution || mem?.organization || 'Association Droit & Justice';
  const memberNumber = app?.application_number || `DJ-${new Date().getFullYear()}-0000`;
  const tierName = app?.tier_name || 'Membre Titulaire';
  const tierPrice = app?.tier_price || 150000;
  const currentCategory = mem?.category || 'Conseil d\'Administration';
  const currentSubcategory = mem?.subcategory || 'National';

  // File upload handlers
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

  const handleCopyText = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSaveAllFields = () => {
    if (!app) return;
    setIsSaving(true);
    setSaveMessage(null);

    router.post(`/admin/applications/${app.id}/admin-fields`, {
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
        setIsSaving(false);
        setSaveMessage('Profil et documents officiels enregistrés avec succès !');
        setTimeout(() => setSaveMessage(null), 4000);
      },
      onError: () => {
        setIsSaving(false);
      }
    });
  };

  const handleVerifyPaymentStatus = (status: 'verified' | 'pending' | 'rejected') => {
    if (!app) return;
    router.post(`/admin/applications/${app.id}/verify-payment`, {
      payment_status: status,
      payment_reference: adminPaymentReference,
      payment_method: adminPaymentMethod,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setAdminPaymentStatus(status);
        setSaveMessage(
          status === 'verified'
            ? 'Versement validé et confirmé avec succès !'
            : (status === 'rejected' ? 'Versement marqué comme rejeté.' : 'Statut remis en attente.')
        );
        setTimeout(() => setSaveMessage(null), 4000);
      }
    });
  };

  const handleOpenPdf = () => {
    const data = {
      memberNumber,
      civility: app?.civility || 'M.',
      firstName: app?.first_name || '',
      lastName: app?.last_name || '',
      profession: app?.profession || 'Juriste',
      institution: app?.institution || '',
      cni: adminCni || app?.cni,
      paymentMethod: adminPaymentMethod || app?.payment_method,
      paymentReference: adminPaymentReference || app?.payment_reference,
      email: app?.email || '',
      phone: app?.phone || '',
      whatsapp: app?.whatsapp || '',
      secondaryPhone: app?.secondary_phone || '',
      birthDate: app?.birth_date,
      birthPlace: app?.birth_place,
      maritalStatus: app?.marital_status,
      address: app?.address,
      country: app?.country,
      region: app?.region,
      department: app?.department,
      locality: app?.locality,
      tierName,
      tierPrice,
    };
    const url = generateAdhesionPdfBlobUrl(data);
    setPdfData(data);
    setPdfBlobUrl(url);
    setPdfStreamOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>Back-Office</span>
              <span>/</span>
              <span>Membres Agréés</span>
              <span>/</span>
              <span className="text-amber-800 font-bold">{fullName}</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-900 mt-0.5 flex items-center gap-2">
              <span>Profil Officiel du Membre</span>
              <span className="font-mono text-xs font-normal px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                {memberNumber}
              </span>
            </h2>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenAssociativeLife && (
            <button
              type="button"
              onClick={() => onOpenAssociativeLife(app || mem)}
              title="Consulter et gérer la vie associative du membre (mandats, commissions, distinctions...)"
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-[#C5A059] hover:from-amber-600 hover:to-[#B38F46] text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Vie Associative</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenAffectationModal(app || mem)}
            title="Affecter ce membre à une catégorie ou modifier son statut"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Award className="w-4 h-4 text-emerald-200" />
            <span>Affecter à une catégorie</span>
          </button>

          {onOpenMemberCases && (
            <button
              type="button"
              onClick={() => onOpenMemberCases(mem || app)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Dossier Affaires</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenPdf}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Attestation PDF</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Hero Profile Banner */}
      <div className="bg-gradient-to-r from-[#031632] via-[#0b2447] to-[#1A2B48] text-white rounded-2xl p-6 shadow-md border-b-4 border-[#C5A059] relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <Scale className="w-56 h-56 text-[#C5A059]" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar with Zoom / Change Action */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-[#C5A059] bg-white/10 shadow-xl flex items-center justify-center">
              {adminAvatarUrl ? (
                <img
                  src={adminAvatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setPreviewDoc({
                    isOpen: true,
                    title: `Photo d'Identité — ${fullName}`,
                    url: adminAvatarUrl,
                  })}
                />
              ) : (
                <UserCheck className="w-12 h-12 text-slate-300" />
              )}
            </div>

            <label
              className="absolute bottom-1 right-1 p-2 bg-[#031632] hover:bg-[#1A2B48] text-[#C5A059] rounded-xl border border-[#C5A059]/50 shadow-md cursor-pointer transition-colors"
              title="Changer la photo officielle"
            >
              <Camera className="w-3.5 h-3.5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Identity & Badges */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Membre Validé &amp; Agréé
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                {tierName}
              </span>
              <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/20">
                Catégorie : <strong className="text-white">{currentCategory}</strong> {currentSubcategory ? `• ${currentSubcategory}` : ''}
              </span>
              <button
                type="button"
                onClick={() => onOpenAffectationModal(app || mem)}
                title="Affecter ce membre à une catégorie de l'annuaire"
                className="text-[11px] font-bold px-3 py-1 rounded-lg bg-[#C5A059] hover:bg-[#d8b368] text-slate-950 flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Affecter à une catégorie</span>
              </button>

              {onOpenAssociativeLife && (
                <button
                  type="button"
                  onClick={() => onOpenAssociativeLife(app || mem)}
                  title="Consulter et gérer la vie associative du membre"
                  className="text-[11px] font-bold px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#C5A059] border border-[#C5A059]/40 flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Vie Associative</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-white tracking-tight">
              {fullName}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-semibold text-[#C5A059]">{profession}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {institution}
              </span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px] text-slate-400">
              {app?.cni && (
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded border border-white/10 text-white">
                  CNI : {app.cni}
                </span>
              )}
              {app?.email && (
                <span className="flex items-center gap-1 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  {app.email}
                </span>
              )}
              {app?.phone && (
                <span className="flex items-center gap-1 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                  {app.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): État Civil, Documents, Cotisation */}
        <div className="lg:col-span-8 space-y-6">
          {/* CARD 1: ÉTAT CIVIL & IDENTITÉ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#031632] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#C5A059]" /> 1. État Civil &amp; Identité Juridique
              </span>
              <span className="text-[11px] text-slate-400">Données déclarées</span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Nom Complet &amp; Titre</span>
                <span className="font-semibold text-slate-900 text-sm">{fullName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Statut Matrimonial</span>
                <span className="font-medium text-slate-800">{app?.marital_status || 'Non renseigné'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Date &amp; Lieu de Naissance</span>
                <span className="font-medium text-slate-800">
                  {app?.birth_date ? new Date(app.birth_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : '—'}
                  {app?.birth_place ? ` à ${app.birth_place}` : ''}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Profession &amp; Titre</span>
                <span className="font-medium text-slate-800">{profession}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Institution / Barreau / Faculté</span>
                <span className="font-medium text-slate-800">{institution}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Session d'Admission</span>
                <span className="font-medium text-slate-800">{new Date(app?.created_at || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* CARD 2: DOCUMENTS OFFICIELS (PHOTO & CNI) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#031632] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C5A059]" /> 2. Pièces d'Identité &amp; Documents Transmis
              </span>
              <span className="text-[11px] text-amber-800 font-semibold">Consultables &amp; Modifiables</span>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CNI Number & Edit */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-600 block">
                    Numéro CNI / Passeport Officiel
                  </label>
                  <input
                    type="text"
                    value={adminCni}
                    onChange={(e) => setAdminCni(e.target.value)}
                    placeholder="Ex : CI0123456789"
                    className="w-full bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Numéro d'immatriculation d'identité du titulaire.
                  </span>
                </div>

                {/* Scan CNI */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                      Scan de la Carte Nationale d'Identité
                    </label>
                    {adminCniUrl ? (
                      <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                          <span className="text-xs font-semibold text-amber-950 truncate">Scan CNI enregistré</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({
                            isOpen: true,
                            title: `Scan CNI — ${fullName}`,
                            url: adminCniUrl,
                          })}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Consulter</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic block">Aucun document joint</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                    <label className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1">
                      <Upload className="w-3 h-3 text-amber-600" />
                      <span>{adminCniUrl ? 'Remplacer le scan' : 'Téléverser le scan'}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleCniFileChange}
                        className="hidden"
                      />
                    </label>
                    {adminCniUrl && (
                      <button
                        type="button"
                        onClick={() => setAdminCniUrl('')}
                        className="text-xs text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: RÈGLEMENT DE LA COTISATION & VÉRIFICATION DU VERSEMENT */}
          <div className="bg-white rounded-2xl border-2 border-indigo-200/80 shadow-xs overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-5 py-3 border-b border-indigo-200 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-indigo-950 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-700" /> 3. Règlement de la Cotisation &amp; Vérification du Versement
              </span>
              <div>
                {adminPaymentStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-xs">
                    <CheckCircle2 className="w-3 h-3" /> Versement Validé &amp; Confirmé
                  </span>
                ) : adminPaymentStatus === 'rejected' ? (
                  <span className="inline-flex items-center gap-1 bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-xs">
                    <XCircle className="w-3 h-3" /> Versement Rejeté
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                    <Clock className="w-3 h-3" /> En attente de vérification
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Montant Annuel</span>
                  <div className="font-bold text-slate-900 text-lg font-mono">
                    {tierPrice.toLocaleString('fr-FR')} <span className="text-xs font-sans">FCFA</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{tierName}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Moyen de Règlement</span>
                  <input
                    type="text"
                    value={adminPaymentMethod}
                    onChange={(e) => setAdminPaymentMethod(e.target.value)}
                    placeholder="Ex : Wave, Orange Money, Virement..."
                    className="w-full bg-white px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-900">N° Versement / Réf</span>
                    {adminPaymentReference && (
                      <button
                        type="button"
                        onClick={() => handleCopyText(adminPaymentReference)}
                        className="text-[10px] text-indigo-700 hover:text-indigo-950 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedRef ? 'Copié !' : 'Copier'}</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={adminPaymentReference}
                    onChange={(e) => setAdminPaymentReference(e.target.value)}
                    placeholder="Ex : TXN-984210, Réf..."
                    className="w-full bg-white px-2.5 py-1.5 text-xs font-mono font-bold text-indigo-950 border border-indigo-300 rounded-lg outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Justificatif / Reçu de Versement */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">
                    Bordereau ou Reçu de Versement Transmis
                  </span>
                  <span className="text-xs text-slate-500">
                    {adminPaymentReceiptUrl ? 'Un justificatif de versement est disponible.' : 'Aucun justificatif téléversé.'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {adminPaymentReceiptUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewDoc({
                        isOpen: true,
                        title: `Reçu de versement — ${fullName}`,
                        url: adminPaymentReceiptUrl,
                      })}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Consulter le reçu</span>
                    </button>
                  )}

                  <label className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{adminPaymentReceiptUrl ? 'Remplacer' : 'Joindre un reçu'}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleReceiptFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Action Buttons for Verifying Payment */}
              {adminPaymentStatus === 'verified' ? (
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Règlement validé et acquitté par le Bureau</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleVerifyPaymentStatus('pending')}
                    className="text-[11px] text-slate-400 hover:text-slate-700 underline cursor-pointer"
                  >
                    Modifier le statut
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Validation comptable par le Bureau :
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleVerifyPaymentStatus('verified')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Valider le versement</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVerifyPaymentStatus('rejected')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Rejeter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SAVE BUTTON BAR */}
          <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-lg">
            <span className="text-xs text-slate-300">
              Enregistrez toutes les modifications apportées (CNI, photos, règlements).
            </span>
            <button
              type="button"
              onClick={handleSaveAllFields}
              disabled={isSaving}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2 transition-colors disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Coordonnées, Délibération, Affaires */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 4: COORDONNÉES & RÉSIDENCE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <span className="font-bold text-xs uppercase tracking-wider text-[#031632] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059]" /> Coordonnées &amp; Résidence
              </span>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Adresse Courriel</span>
                {app?.email ? (
                  <a href={`mailto:${app.email}`} className="text-amber-800 font-semibold hover:underline flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{app.email}</span>
                  </a>
                ) : (
                  <span className="text-slate-400 italic">Non renseignée</span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Téléphone Principal</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>{app?.phone || 'Non renseigné'}</span>
                </span>
              </div>

              {(app?.whatsapp || app?.secondary_phone) && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">WhatsApp</span>
                    <span className="font-medium text-slate-800">{app?.whatsapp || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Second Tél</span>
                    <span className="font-medium text-slate-800">{app?.secondary_phone || '—'}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Localité &amp; Domicile</span>
                <span className="font-medium text-slate-800 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{app?.address || 'Non spécifiée'}</span>
                </span>
                <div className="text-[11px] text-slate-500 mt-1 pl-5">
                  {[app?.locality, app?.department, app?.region, app?.country].filter(Boolean).join(', ') || 'Côte d\'Ivoire'}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 5: STATUT D'AFFECTATION & DÉLIBÉRATION */}
          <div className="bg-white rounded-2xl border-2 border-emerald-200/80 shadow-xs overflow-hidden">
            <div className="bg-emerald-50/70 px-5 py-3 border-b border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" /> Affectation à une Catégorie
              </span>
              <button
                type="button"
                onClick={() => onOpenAffectationModal(app || mem)}
                className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Modifier</span>
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Catégorie Attribuée</span>
                  <span className="font-bold text-slate-900 text-sm">{currentCategory}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Sous-catégorie</span>
                  <span className="font-semibold text-slate-700">{currentSubcategory || 'Aucune sous-catégorie'}</span>
                </div>
              </div>

              {/* Bouton pour affecter le membre à une catégorie */}
              <button
                type="button"
                onClick={() => onOpenAffectationModal(app || mem)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer transition-colors"
                title="Ouvrir la modale pour affecter ce membre à une catégorie"
              >
                <Award className="w-4 h-4 text-emerald-200" />
                <span>Affecter à une catégorie</span>
              </button>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Note Interne de Délibération</span>
                <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {app?.admin_notes || 'Aucune mention ou note particulière pour le moment.'}
                </p>
              </div>
            </div>
          </div>

          {/* CARD 6: DOSSIER CONTENTIEUX & AFFAIRES */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#031632] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#C5A059]" /> Affaires &amp; Contentieux
              </span>
              {onOpenMemberCases && (
                <button
                  type="button"
                  onClick={() => onOpenMemberCases(mem || app)}
                  className="text-xs text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  Gérer
                </button>
              )}
            </div>

            <div className="p-5 text-xs text-slate-600">
              {mem?.cases && mem.cases.length > 0 ? (
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 block">{mem.cases.length} affaire(s) enregistrée(s)</span>
                  <ul className="space-y-1.5">
                    {mem.cases.slice(0, 3).map((c: any) => (
                      <li key={c.id} className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-800">{c.case_number}</span>
                        <span className="text-slate-500 text-[11px] truncate max-w-[120px]">{c.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-3 text-slate-400">
                  <span>Aucun contentieux enregistré pour ce membre.</span>
                </div>
              )}
            </div>
          </div>

          {/* CARD 7: VIE ASSOCIATIVE & MANDATS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#031632] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" /> Vie Associative &amp; Activités
              </span>
              {onOpenAssociativeLife && (
                <button
                  type="button"
                  onClick={() => onOpenAssociativeLife(app || mem)}
                  className="text-xs text-amber-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Gérer</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="p-5 text-xs text-slate-600 space-y-3">
              <p className="text-[11px] text-slate-500">
                Consultez et complétez les mandats, participations aux commissions thématiques, missions d'assistance et distinctions honorifiques de ce membre.
              </p>

              {onOpenAssociativeLife && (
                <button
                  type="button"
                  onClick={() => onOpenAssociativeLife(app || mem)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#031632] to-[#1A2B48] hover:from-[#0b2447] hover:to-[#22395d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 cursor-pointer transition-colors border border-[#C5A059]/40"
                >
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Ouvrir la page Vie Associative</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded PDF Stream Viewer Modal */}
      {pdfStreamOpen && pdfData && (
        <PdfStreamModal
          isOpen={pdfStreamOpen}
          onClose={() => setPdfStreamOpen(false)}
          pdfBlobUrl={pdfBlobUrl}
          data={pdfData}
        />
      )}

      {/* Full Document Preview Modal */}
      {previewDoc && previewDoc.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
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

export default MemberProfileView;
