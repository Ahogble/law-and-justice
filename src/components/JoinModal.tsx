import React, { useState, useRef } from 'react';
import {
  X, Check, Scale, Shield, Award, ArrowRight, ArrowLeft, Eye,
  FileText, Loader2, AlertCircle, Edit3, ShieldCheck, UserCheck, MapPin,
  Phone, Mail, Camera, Upload, Trash2, Smartphone, Landmark, CreditCard,
  Copy, CheckCircle2, Image as ImageIcon, AlertTriangle
} from 'lucide-react';
import { MembershipTier, PaymentAccount } from '../types';
import { generateAdhesionPdfBlobUrl } from '../utils/generateAdhesionPdf';
import { PdfStreamModal } from './PdfStreamModal';
import { useLanguage } from '../i18n/LanguageContext';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipTiers?: MembershipTier[];
  paymentAccounts?: PaymentAccount[];
}

const DEFAULT_MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'student',
    name: 'Membre Étudiant & Auditeur',
    nameEn: 'Student & Auditor Member',
    price: 35000,
    period: '/ an',
    periodEn: '/ yr',
    targetAudience: 'Étudiants en Master de droit, élèves-avocats et auditeurs de justice.',
    targetAudienceEn: 'Law Master students, student lawyers, and judicial auditors.',
    benefits: [
      'Accès libre à tous les colloques et webinaires de l’association',
      'Réception trimestrielle de la Revue de Doctrine Juridique',
      'Possibilité de contribuer à la Clinique Juridique & Accès au Droit',
      'Accompagnement et mentorat par un praticien chevronné'
    ],
    benefitsEn: [
      'Free access to all association symposiums and webinars',
      'Quarterly receipt of the Legal Doctrine Review',
      'Opportunity to contribute to the Legal Clinic & Access to Law',
      'Support and mentoring by an experienced practitioner'
    ]
  },
  {
    id: 'titular',
    name: 'Membre Titulaire',
    nameEn: 'Titular Member',
    price: 150000,
    period: '/ an',
    periodEn: '/ yr',
    targetAudience: 'Avocats, magistrats, universitaires, notaires et juristes d’entreprise.',
    targetAudienceEn: 'Lawyers, magistrates, academics, notaries, and corporate counsels.',
    popular: true,
    benefits: [
      'Droit de vote à l’Assemblée Générale annuelle',
      'Participation aux Groupes de Travail et comités de réforme',
      'Publication prioritaire dans le Blog & Bulletin de Doctrine',
      'Accès à l’annuaire exclusif des membres et au réseau professionnel',
      'Validation de 12 heures de formation continue annuelle (CNB / ENM)'
    ],
    benefitsEn: [
      'Voting rights at the annual General Assembly',
      'Participation in Working Groups and reform committees',
      'Priority publication in the Blog & Doctrine Bulletin',
      'Access to the exclusive members directory and professional network',
      'Validation of 12 hours of annual continuing education (CNB / ENM)'
    ]
  },
  {
    id: 'benefactor',
    name: 'Membre Bienfaiteur',
    nameEn: 'Benefactor Member',
    price: 450000,
    period: '/ an',
    periodEn: '/ yr',
    targetAudience: 'Cabinets, institutions, mécènes et personnalités souhaitant soutenir activement l’État de droit.',
    targetAudienceEn: 'Firms, institutions, patrons, and personalities wishing to actively support the rule of law.',
    benefits: [
      'Tous les avantages du Membre Titulaire',
      'Invitation VIP au Dîner de Gala annuel de la Justice',
      'Mention honorifique dans le Rapport Annuel d’Activité',
      'Défiscalisation du don (reçu fiscal émis automatiquement)',
      'Accès réservé au Cercle des Présidents et Débats d’Orientation'
    ],
    benefitsEn: [
      'All the benefits of the Titular Member',
      'VIP invitation to the annual Justice Gala Dinner',
      'Honorable mention in the Annual Activity Report',
      'Tax deduction of the donation (tax receipt issued automatically)',
      'Reserved access to the Presidents Circle and Orientation Debates'
    ]
  }
];

const DEFAULT_PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    id: 'sgci-rib',
    type: 'bank',
    name: 'Virement Bancaire (Société Générale)',
    bank_name: 'SGCI Côte d\'Ivoire',
    account_holder: 'ASSOCIATION DROIT & JUSTICE',
    account_number: 'CI034 01001 01234567890 45',
    iban: 'CI93 CI03 4010 0101 2345 6789 0045',
    swift: 'SGCICIABXXX',
    instructions: 'Mentionnez impérativement votre Nom et Prénom en motif de l\'opération.',
    active: true,
  },
  {
    id: 'wave-ci',
    type: 'mobile',
    name: 'Wave Côte d\'Ivoire',
    account_holder: 'ASSOCIATION DROIT & JUSTICE',
    phone_number: '+225 07 00 11 22 33',
    instructions: 'Paiement sans frais via Wave. Notez votre Nom en référence.',
    active: true,
  },
  {
    id: 'om-ci',
    type: 'mobile',
    name: 'Orange Money (OM)',
    account_holder: 'ASSOCIATION DROIT & JUSTICE',
    phone_number: '+225 07 44 55 66 77',
    instructions: 'Composez *144# ou via l\'application Orange Money.',
    active: true,
  },
  {
    id: 'momo-ci',
    type: 'mobile',
    name: 'MTN Mobile Money (MoMo)',
    account_holder: 'ASSOCIATION DROIT & JUSTICE',
    phone_number: '+225 05 88 99 00 11',
    instructions: 'Composez *133# ou utilisez l\'application MoMo.',
    active: true,
  },
  {
    id: 'moov-ci',
    type: 'mobile',
    name: 'Moov Money (Flooz)',
    account_holder: 'ASSOCIATION DROIT & JUSTICE',
    phone_number: '+225 01 22 33 44 55',
    instructions: 'Composez *155# ou utilisez l\'application Moov Money.',
    active: true,
  },
];

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  membershipTiers = DEFAULT_MEMBERSHIP_TIERS,
  paymentAccounts = DEFAULT_PAYMENT_ACCOUNTS,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const tiersToUse = membershipTiers.length > 0 ? membershipTiers : DEFAULT_MEMBERSHIP_TIERS;
  const accountsToUse = paymentAccounts && paymentAccounts.length > 0 ? paymentAccounts.filter(a => a.active) : DEFAULT_PAYMENT_ACCOUNTS;

  const [step, setStep] = useState<'tier' | 'form' | 'review' | 'success'>('tier');
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(tiersToUse[1] || tiersToUse[0]);

  // Form state
  const [formData, setFormData] = useState({
    civility: 'M.',
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    maritalStatus: 'Célibataire',
    cni: '',
    email: '',
    phone: '',
    whatsapp: '',
    secondaryPhone: '',
    address: '',
    country: '',
    region: '',
    department: '',
    locality: '',
    profession: 'Avocat',
    institution: '',
    motivation: ''
  });

  // Documents state
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [cniUrl, setCniUrl] = useState<string>('');
  const [cniFileName, setCniFileName] = useState<string>('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<string>('Wave Côte d\'Ivoire');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [paymentReceiptUrl, setPaymentReceiptUrl] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null);

  // File input refs
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const cniInputRef = useRef<HTMLInputElement | null>(null);
  const receiptInputRef = useRef<HTMLInputElement | null>(null);

  const [memberNumber, setMemberNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pdfStreamOpen, setPdfStreamOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Photo upload with compression
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).');
      return;
    }

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
        setAvatarUrl(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle CNI upload
  const handleCniFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale recommandée : 5 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCniUrl(reader.result as string);
      setCniFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Handle Payment Receipt upload
  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale recommandée : 5 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPaymentReceiptUrl(reader.result as string);
      setReceiptFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyAccount = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccountId(id);
    setTimeout(() => setCopiedAccountId(null), 2500);
  };

  const handleOpenPdfStream = () => {
    const currentMemberId = memberNumber || `DJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!memberNumber) {
      setMemberNumber(currentMemberId);
    }
    const url = generateAdhesionPdfBlobUrl({
      memberNumber: currentMemberId,
      civility: formData.civility || 'M.',
      firstName: formData.firstName || 'Jean',
      lastName: formData.lastName || 'Dupont',
      birthDate: formData.birthDate,
      birthPlace: formData.birthPlace,
      maritalStatus: formData.maritalStatus,
      cni: formData.cni,
      paymentMethod: paymentMethod,
      paymentReference: paymentReference,
      address: formData.address,
      country: formData.country,
      region: formData.region,
      department: formData.department,
      locality: formData.locality,
      profession: formData.profession || 'Avocat',
      institution: formData.institution || '',
      email: formData.email || '',
      phone: formData.phone || '',
      whatsapp: formData.whatsapp || '',
      secondaryPhone: formData.secondaryPhone || '',
      tierName: selectedTier.name,
      tierPrice: selectedTier.price
    });
    setPdfBlobUrl(url);
    setPdfStreamOpen(true);
  };

  const handleValidateFormStep = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setStep('review');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitError(null);

    if (!paymentReference.trim()) {
      setSubmitError('Veuillez obligatoirement renseigner le numéro de versement ou la référence de transaction pour que l\'administrateur puisse vérifier votre règlement.');
      return;
    }

    setIsSubmitting(true);

    try {
      const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
      const response = await fetch('/membership-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          tier_id: selectedTier.id,
          tier_name: selectedTier.name,
          tier_price: selectedTier.price,
          civility: formData.civility,
          first_name: formData.firstName,
          last_name: formData.lastName,
          birth_date: formData.birthDate || null,
          birth_place: formData.birthPlace || null,
          marital_status: formData.maritalStatus || null,
          cni: formData.cni || null,
          cni_url: cniUrl || null,
          avatar_url: avatarUrl || null,
          payment_method: paymentMethod || null,
          payment_reference: paymentReference.trim(),
          payment_receipt_url: paymentReceiptUrl || null,
          email: formData.email || null,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          secondary_phone: formData.secondaryPhone || null,
          address: formData.address || null,
          country: formData.country || null,
          region: formData.region || null,
          department: formData.department || null,
          locality: formData.locality || null,
          profession: formData.profession,
          institution: formData.institution || null,
          motivation: formData.motivation || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Une erreur est survenue lors de l\'enregistrement de votre dossier.');
      }

      const data = await response.json();
      const generatedId = data.memberNumber || `DJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setMemberNumber(generatedId);
      setStep('success');
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setSubmitError(err.message || 'Erreur lors de la transmission. Veuillez vérifier vos informations.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep('tier');
    setSubmitError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-[#c5c6ce] animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#031632] text-white p-5 sm:p-7 relative shrink-0">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 cursor-pointer rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#C5A059] mb-1">
            <Scale className="w-5 h-5 stroke-[2.2]" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Association Droit &amp; Justice
            </span>
          </div>
          <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Demande d'Adhésion Institutionnelle
          </h2>
          <p className="text-xs sm:text-sm text-[#8293b5] mt-1">
            Rejoignez notre collège de juristes et participez activement à la défense de l'État de droit.
          </p>

          {/* Stepper indicator */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-[#1A2B48] text-[11px] sm:text-xs">
            <span className={`px-2.5 py-1 rounded font-semibold transition-colors ${step === 'tier' ? 'bg-[#C5A059] text-[#031632]' : 'bg-[#1A2B48] text-white/70'}`}>
              1. Collège &amp; Cotisation
            </span>
            <span className="text-white/40">&rarr;</span>
            <span className={`px-2.5 py-1 rounded font-semibold transition-colors ${step === 'form' ? 'bg-[#C5A059] text-[#031632]' : 'bg-[#1A2B48] text-white/70'}`}>
              2. Candidat &amp; Pièces
            </span>
            <span className="text-white/40">&rarr;</span>
            <span className={`px-2.5 py-1 rounded font-semibold transition-colors ${step === 'review' ? 'bg-[#C5A059] text-[#031632]' : 'bg-[#1A2B48] text-white/70'}`}>
              3. Règlement &amp; Vérification
            </span>
            <span className="text-white/40">&rarr;</span>
            <span className={`px-2.5 py-1 rounded font-semibold transition-colors ${step === 'success' ? 'bg-[#C5A059] text-[#031632]' : 'bg-[#1A2B48] text-white/70'}`}>
              4. Confirmation
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          {/* STEP 1: Select Tier */}
          {step === 'tier' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-playfair text-xl font-bold text-[#031632] mb-1">
                  Choisissez votre statut de membre
                </h3>
                <p className="text-xs text-[#75777e]">
                  Les cotisations ouvrent droit aux déductions fiscales et financent directement la Clinique Juridique.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tiersToUse.map((tier) => {
                  const isSelected = selectedTier.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-5 rounded-lg border-2 flex flex-col justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#C5A059] bg-[#f9f9f9] shadow-md'
                          : 'border-[#e2e2e2] bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        {tier.popular && (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-[#031632] text-white px-2 py-0.5 rounded inline-block mb-2">
                            {isEn ? 'Recommended' : 'Recommandé'}
                          </span>
                        )}
                        <h4 className="font-playfair text-base font-bold text-[#031632] mb-1">
                          {isEn ? (tier.nameEn || tier.name) : tier.name}
                        </h4>
                        <div className="text-2xl font-bold text-[#031632] mb-2">
                          {tier.price.toLocaleString('fr-FR')} FCFA <span className="text-xs text-[#75777e] font-normal">{isEn ? (tier.periodEn || tier.period) : tier.period}</span>
                        </div>
                        <p className="text-[11px] text-[#44474d] mb-4">
                          {isEn ? (tier.targetAudienceEn || tier.targetAudience) : tier.targetAudience}
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#333333]">
                          {(isEn && tier.benefitsEn && tier.benefitsEn.length > 0 ? tier.benefitsEn : tier.benefits).map((b, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200">
                        <span className={`text-xs font-semibold flex items-center justify-center gap-1 ${
                          isSelected ? 'text-[#C5A059]' : 'text-[#75777e]'
                        }`}>
                          {isSelected ? 'Sélectionné' : 'Sélectionner'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep('form')}
                  className="inline-flex items-center gap-2 bg-[#031632] text-white text-xs font-semibold px-6 py-3 rounded hover:bg-[#1A2B48] border-b-2 border-[#C5A059] transition-all cursor-pointer shadow-sm"
                >
                  <span>Continuer avec {selectedTier.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Fill Form & Upload Documents */}
          {step === 'form' && (
            <form onSubmit={handleValidateFormStep} className="space-y-5">
              <div className="flex items-center justify-between bg-[#f9f9f9] p-3 rounded border border-[#e2e2e2] text-xs">
                <div>
                  <span className="text-[#75777e]">{isEn ? 'Selected Plan: ' : 'Formule sélectionnée : '}</span>
                  <strong className="text-[#031632]">{isEn ? (selectedTier.nameEn || selectedTier.name) : selectedTier.name} ({selectedTier.price.toLocaleString('fr-FR')} FCFA{isEn ? (selectedTier.periodEn || selectedTier.period) : selectedTier.period})</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('tier')}
                  className="text-[#C5A059] hover:underline font-semibold"
                >
                  {isEn ? 'Change plan' : 'Changer de formule'}
                </button>
              </div>

              {/* SECTION 1: ÉTAT CIVIL & IDENTITÉ */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] border-b border-slate-200 pb-1 flex items-center justify-between">
                  <span>1. État Civil &amp; Identité du Candidat</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">* champs obligatoires</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Titre *
                    </label>
                    <select
                      value={formData.civility}
                      onChange={(e) => setFormData({ ...formData, civility: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    >
                      <option value="M.">M.</option>
                      <option value="Mme">Mme</option>
                      <option value="Mlle">Mlle</option>
                    </select>
                  </div>
                  <div className="sm:col-span-5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dupont"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jean"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Date de Naissance *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Lieu de Naissance *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Abidjan, Cotonou, Paris..."
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Statut Matrimonial *
                    </label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    >
                      <option value="Célibataire">Célibataire</option>
                      <option value="Marié(e)">Marié(e)</option>
                      <option value="Veuf/Veuve">Veuf / Veuve</option>
                      <option value="Divorcé(e)">Divorcé(e)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Profession / Qualité *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Avocat, Magistrat, Juriste, Notaire..."
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Institution / Barreau / Entreprise
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Barreau de Côte d'Ivoire, Université..."
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PIÈCES D'IDENTITÉ & PHOTO DE PROFIL */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] border-b border-slate-200 pb-1 flex items-center justify-between">
                  <span>2. Pièces Justificatives (Photo &amp; CNI)</span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">Requis pour l'annuaire &amp; le dossier</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Photo de Profil */}
                  <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#031632] block mb-2">
                      Photo d'Identité / Profil
                    </label>

                    <div className="relative mb-2 group">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#C5A059] overflow-hidden bg-white shadow-xs flex items-center justify-center">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Photo profil" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <Camera className="w-6 h-6 stroke-[1.8]" />
                            <span className="text-[9px] mt-0.5">Photo</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-1.5 bg-[#031632] hover:bg-[#1A2B48] text-white rounded-full shadow-md transition-colors cursor-pointer"
                        title="Téléverser une photo"
                      >
                        <Upload className="w-3 h-3 text-[#C5A059]" />
                      </button>
                    </div>

                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="text-[11px] font-semibold text-[#031632] hover:text-[#C5A059] underline cursor-pointer"
                      >
                        {avatarUrl ? 'Changer la photo' : 'Ajouter une photo'}
                      </button>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl('')}
                          className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Format JPG, PNG (Max 5 Mo)</span>
                  </div>

                  {/* Numéro & Scan CNI */}
                  <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#031632] block mb-1">
                        Numéro CNI / Passeport *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : C0123456789 ou N° Passeport..."
                        value={formData.cni}
                        onChange={(e) => setFormData({ ...formData, cni: e.target.value })}
                        className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded font-mono focus:ring-2 focus:ring-[#C5A059] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#031632] block mb-1">
                        Scan ou Photo de la CNI (Recto/Verso)
                      </label>
                      <input
                        ref={cniInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleCniFileChange}
                      />

                      {cniUrl ? (
                        <div className="flex items-center justify-between p-2.5 bg-white border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="text-xs font-medium text-slate-800 truncate">
                              {cniFileName || 'Document CNI joint'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => cniInputRef.current?.click()}
                              className="text-[10px] text-amber-800 hover:underline font-semibold cursor-pointer"
                            >
                              Remplacer
                            </button>
                            <button
                              type="button"
                              onClick={() => { setCniUrl(''); setCniFileName(''); }}
                              className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                              title="Retirer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => cniInputRef.current?.click()}
                          className="w-full p-2.5 border border-dashed border-slate-300 hover:border-[#C5A059] bg-white rounded-lg flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-[#031632] transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4 text-[#C5A059]" />
                          <span>Sélectionner le scan (JPG, PNG ou PDF)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: LOCALITÉ GÉOGRAPHIQUE */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] border-b border-slate-200 pb-1">
                  3. Localité Géographique
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Pays *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Côte d'Ivoire, France..."
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Région *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Lagunes, Littoral..."
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Département
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Abidjan, Ouémé..."
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Localité / Ville *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Cocody, Cotonou..."
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: COORDONNÉES & ADRESSE */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] border-b border-slate-200 pb-1">
                  4. Coordonnées &amp; Adresse
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Adresse Courriel
                    </label>
                    <input
                      type="email"
                      placeholder="j.dupont@domaine.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Numéro de Téléphone Principal *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+225 07 00 00 00 00"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Numéro WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+225 07 00 00 00 00"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      Second Numéro de Téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="+225 01 00 00 00 00"
                      value={formData.secondaryPhone}
                      onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                    Adresse Complète (Domicile / Résidence) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rue, quartier, résidence, lot, porte, boîte postale..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] outline-none"
                  />
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('tier')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#75777e] hover:text-[#333333] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
                <button
                  type="submit"
                  className="bg-[#031632] text-white text-xs font-semibold px-6 py-3 rounded hover:bg-[#1A2B48] border-b-2 border-[#C5A059] transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <span>Continuer vers le Règlement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Payment Accounts & Verification */}
          {step === 'review' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Selected Tier & Amount Callout */}
              <div className="bg-gradient-to-r from-[#031632] to-[#1A2B48] text-white p-4 rounded-xl shadow-md border-l-4 border-[#C5A059] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-[#C5A059] uppercase tracking-wider font-bold">
                    Cotisation d'Adhésion Annuelle
                  </span>
                  <div className="text-base sm:text-lg font-playfair font-bold">
                    {selectedTier.name}
                  </div>
                  <div className="text-xs text-white/70">
                    Paiement requis avant la validation du dossier par l'administrateur
                  </div>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <div className="text-2xl sm:text-3xl font-bold text-[#C5A059] font-mono">
                    {selectedTier.price.toLocaleString('fr-FR')} <span className="text-sm font-sans text-white">FCFA</span>
                  </div>
                  <span className="text-[10px] text-white/60">Annuel (reçu fiscal émis)</span>
                </div>
              </div>

              {/* CARD: OFFICIAL PAYMENT ACCOUNTS */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#031632]">
                      Comptes Officiels de l'Association pour le Règlement
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    Copiez les coordonnées en un clic
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Veuillez effectuer le versement de votre cotisation (<strong>{selectedTier.price.toLocaleString('fr-FR')} FCFA</strong>) sur l'un des comptes officiels ci-dessous, puis saisissez le numéro de transaction ou référence de bordereau dans le formulaire plus bas.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {accountsToUse.map((acc) => {
                      const isBank = acc.type === 'bank';
                      const numberToCopy = isBank ? (acc.iban || acc.account_number || '') : (acc.phone_number || '');
                      const isCopied = copiedAccountId === acc.id;

                      return (
                        <div
                          key={acc.id}
                          className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  isBank ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {isBank ? <Landmark className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                                </div>
                                <div>
                                  <div className="font-bold text-xs text-slate-900 leading-tight">
                                    {acc.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    Titulaire : <span className="font-semibold text-slate-700">{acc.account_holder}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Account details */}
                            <div className="space-y-1 my-2 text-xs">
                              {isBank && acc.bank_name && (
                                <div className="text-[11px] text-slate-600">
                                  Banque : <span className="font-medium text-slate-900">{acc.bank_name}</span>
                                </div>
                              )}
                              {isBank && acc.account_number && (
                                <div className="text-[11px] text-slate-600">
                                  N° Compte : <span className="font-mono font-bold text-slate-800">{acc.account_number}</span>
                                </div>
                              )}
                              {isBank && acc.iban && (
                                <div className="text-[11px] text-slate-600">
                                  IBAN : <span className="font-mono text-slate-800 text-[10px]">{acc.iban}</span>
                                </div>
                              )}
                              {!isBank && acc.phone_number && (
                                <div className="text-xs">
                                  N° Téléphone : <span className="font-mono font-bold text-slate-900 text-sm">{acc.phone_number}</span>
                                </div>
                              )}
                              {acc.instructions && (
                                <div className="text-[10px] text-amber-800 bg-amber-50/70 p-1.5 rounded mt-1">
                                  {acc.instructions}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Copy button */}
                          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">
                              {isBank ? 'Coordonnées bancaires' : 'Mobile Money'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyAccount(numberToCopy, acc.id)}
                              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isCopied
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-white" />
                                  <span>Copié !</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-[#C5A059]" />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARD: CANDIDATE PAYMENT REFERENCE INPUT FORM */}
              <div className="bg-white rounded-xl border-2 border-amber-300/80 shadow-sm p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <CreditCard className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <h4 className="font-bold text-sm text-[#031632]">
                      Déclaration de votre Versement pour Vérification
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Renseignez la référence de la transaction afin que l'administrateur valide votre adhésion.
                    </p>
                  </div>
                </div>

                {/* Choose Payment Method */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#031632] block mb-1.5">
                    Mode de Versement Utilisé *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'Wave', label: 'Wave' },
                      { name: 'Orange Money', label: 'Orange Money' },
                      { name: 'MTN MoMo', label: 'MTN MoMo' },
                      { name: 'Moov Money', label: 'Moov Money' },
                      { name: 'Virement SGCI', label: 'Virement SGCI' },
                      { name: 'Autre Virement', label: 'Autre Banque' },
                      { name: 'Espèces / Chèque', label: 'Espèces / Chèque' },
                      { name: 'Autre', label: 'Autre Moyen' },
                    ].map((m) => {
                      const isSelected = paymentMethod === m.name;
                      return (
                        <button
                          key={m.name}
                          type="button"
                          onClick={() => setPaymentMethod(m.name)}
                          className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#031632] bg-[#031632] text-white shadow-xs font-semibold'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Transaction reference */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#031632] flex items-center justify-between">
                    <span>Numéro de Versement / Référence de Transaction *</span>
                    <span className="text-[10px] text-rose-600 font-normal lowercase">obligatoire pour vérification</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TXN-84920482, Réf bordereau 09482, ID Wave..."
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 text-xs sm:text-sm border-2 border-amber-300 rounded-lg font-mono focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/30 outline-none"
                  />
                  <p className="text-[10px] text-slate-500">
                    Saisissez l'identifiant reçu par SMS (Wave, Orange, MTN, Moov) ou le numéro inscrit sur le bordereau bancaire.
                  </p>
                </div>

                {/* Receipt Upload */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#031632] block mb-1">
                    Justificatif / Reçu de Versement (Capture d'écran ou scan du bordereau)
                  </label>
                  <input
                    ref={receiptInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleReceiptFileChange}
                  />

                  {paymentReceiptUrl ? (
                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-medium text-slate-800 truncate">
                          {receiptFileName || 'Reçu de versement joint'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => receiptInputRef.current?.click()}
                          className="text-[10px] text-amber-800 hover:underline font-semibold cursor-pointer"
                        >
                          Remplacer
                        </button>
                        <button
                          type="button"
                          onClick={() => { setPaymentReceiptUrl(''); setReceiptFileName(''); }}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                          title="Retirer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => receiptInputRef.current?.click()}
                      className="w-full p-3 border border-dashed border-slate-300 hover:border-[#C5A059] bg-slate-50 hover:bg-white rounded-lg flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-[#031632] transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-[#C5A059]" />
                      <span>Ajouter une capture du SMS ou photo du reçu (Facultatif mais recommandé)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* RECAP CARD: CANDIDATE INFO */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#031632] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" /> Récapitulatif du Candidat &amp; Documents
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C5A059] hover:text-[#031632] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Modifier</span>
                  </button>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
                  {/* Photo thumbnail */}
                  <div className="sm:col-span-3 flex flex-col items-center justify-center text-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white border border-slate-200 shadow-2xs mb-1.5 flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserCheck className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {avatarUrl ? 'Photo transmise' : 'Sans photo'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-700 mt-1 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      CNI: {formData.cni || 'Non renseignée'}
                    </span>
                  </div>

                  {/* Summary details */}
                  <div className="sm:col-span-9 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Candidat</span>
                        <span className="font-semibold text-slate-900 text-sm">
                          {formData.civility} {formData.lastName.toUpperCase()} {formData.firstName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Profession</span>
                        <span className="font-medium text-slate-800">
                          {formData.profession} {formData.institution ? `(${formData.institution})` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Téléphone</span>
                        <span className="text-slate-800 font-semibold">{formData.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Localité</span>
                        <span className="text-slate-800">{formData.locality}, {formData.country}</span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-600">
                      Scan CNI : <strong className="text-slate-800">{cniUrl ? 'Document joint' : 'Non fourni'}</strong>
                      {formData.email && <span> • Courriel : <strong className="text-slate-800">{formData.email}</strong></span>}
                    </div>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep('form')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#75777e] hover:text-[#333333] disabled:opacity-50 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Modifier mes informations</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#031632] text-white text-xs font-semibold px-6 py-3 rounded hover:bg-[#1A2B48] border-b-2 border-[#C5A059] transition-all cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />}
                  <span>{isSubmitting ? 'Transmission en cours...' : 'Confirmer et transmettre mon dossier d\'adhésion'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-6 animate-in fade-in duration-200">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200 shadow-sm">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-1">
                  Candidature &amp; Référence de Versement Enregistrées
                </span>
                <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#031632]">
                  Dossier Transmis pour Vérification
                </h3>
                <p className="text-xs sm:text-sm text-[#44474d] max-w-lg mx-auto mt-2 leading-relaxed">
                  Votre demande d'adhésion pour la formule <strong>{selectedTier.name}</strong> a été enregistrée avec succès sous la référence <strong>N° {memberNumber}</strong>.
                  Votre référence de versement <strong>{paymentReference}</strong> a été transmise à l'administrateur pour rapprochement bancaire et validation.
                </p>
              </div>

              {/* Digital Member Card */}
              <div className="bg-[#031632] text-white p-6 rounded-xl border-2 border-[#C5A059] max-w-md mx-auto text-left shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10">
                  <Scale className="w-44 h-44 text-[#C5A059]" />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#C5A059]" />
                    <span className="font-playfair text-sm font-bold tracking-tight text-white">
                      Droit &amp; Justice
                    </span>
                  </div>
                  <span className="text-[10px] text-[#C5A059] font-mono border border-[#C5A059]/40 px-2 py-0.5 rounded">
                    Réf. {memberNumber}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  {avatarUrl && (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C5A059] shrink-0">
                      <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="text-base font-playfair font-bold text-white leading-snug">
                      {formData.civility} {formData.firstName} {formData.lastName}
                    </div>
                    <div className="text-xs text-[#8293b5]">
                      {formData.profession} • {formData.institution || 'Membre Adhérent'}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#C5A059] mb-3 flex items-center justify-between">
                  <span>CNI : {formData.cni || 'Renseignée'}</span>
                  <span>Versement : <span className="font-mono text-white">{paymentReference}</span></span>
                </div>

                <div className="flex justify-between items-end border-t border-white/10 pt-3 text-[11px] text-white/70">
                  <span>Session : {new Date().getFullYear()}</span>
                  <span className="text-amber-300 font-semibold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40">
                    En attente de vérification
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  id="btn-stream-adhesion-pdf"
                  onClick={handleOpenPdfStream}
                  className="inline-flex items-center gap-2 bg-[#031632] hover:bg-[#1A2B48] text-white text-xs font-semibold px-5 py-2.5 rounded border border-[#C5A059] transition-all duration-200 shadow-md cursor-pointer group"
                >
                  <Eye className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
                  <span>Consulter le flux PDF de l'attestation</span>
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="bg-white text-[#031632] text-xs font-semibold px-6 py-2.5 rounded border border-[#c5c6ce] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded PDF Stream Viewer Modal */}
      <PdfStreamModal
        isOpen={pdfStreamOpen}
        onClose={() => setPdfStreamOpen(false)}
        pdfBlobUrl={pdfBlobUrl}
        data={{
          memberNumber: memberNumber || `DJ-${new Date().getFullYear()}-8492`,
          civility: formData.civility || 'M.',
          firstName: formData.firstName || 'Jean',
          lastName: formData.lastName || 'Dupont',
          birthDate: formData.birthDate,
          birthPlace: formData.birthPlace,
          maritalStatus: formData.maritalStatus,
          cni: formData.cni,
          paymentMethod: paymentMethod,
          paymentReference: paymentReference,
          address: formData.address,
          country: formData.country,
          region: formData.region,
          department: formData.department,
          locality: formData.locality,
          profession: formData.profession || 'Avocat',
          institution: formData.institution || '',
          email: formData.email || '',
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          secondaryPhone: formData.secondaryPhone,
          tierName: selectedTier.name,
          tierPrice: selectedTier.price
        }}
      />
    </div>
  );
};
export default JoinModal;
