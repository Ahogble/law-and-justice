import React, { useState } from 'react';
import { X, Check, Scale, Shield, Award, ArrowRight, ArrowLeft, Download, Eye, FileText } from 'lucide-react';
import { MembershipTier } from '../types';
import { generateAdhesionPdfBlobUrl } from '../utils/generateAdhesionPdf';
import { PdfStreamModal } from './PdfStreamModal';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipTiers?: MembershipTier[];
}

const DEFAULT_MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'student',
    name: 'Membre Étudiant & Auditeur',
    price: 35,
    period: '/ an',
    targetAudience: 'Étudiants en Master de droit, élèves-avocats et auditeurs de justice.',
    benefits: [
      'Accès libre à tous les colloques et webinaires de l’association',
      'Réception trimestrielle de la Revue de Doctrine Juridique',
      'Possibilité de contribuer à la Clinique Juridique & Accès au Droit',
      'Accompagnement et mentorat par un praticien chevronné'
    ]
  },
  {
    id: 'titular',
    name: 'Membre Titulaire',
    price: 150,
    period: '/ an',
    targetAudience: 'Avocats, magistrats, universitaires, notaires et juristes d’entreprise.',
    popular: true,
    benefits: [
      'Droit de vote à l’Assemblée Générale annuelle',
      'Participation aux Groupes de Travail et comités de réforme',
      'Publication prioritaire dans le Blog & Bulletin de Doctrine',
      'Accès à l’annuaire exclusif des membres et au réseau professionnel',
      'Validation de 12 heures de formation continue annuelle (CNB / ENM)'
    ]
  },
  {
    id: 'benefactor',
    name: 'Membre Bienfaiteur',
    price: 450,
    period: '/ an',
    targetAudience: 'Cabinets, institutions, mécènes et personnalités souhaitant soutenir activement l’État de droit.',
    benefits: [
      'Tous les avantages du Membre Titulaire',
      'Invitation VIP au Dîner de Gala annuel de la Justice',
      'Mention honorifique dans le Rapport Annuel d’Activité',
      'Défiscalisation du don (reçu fiscal émis automatiquement)',
      'Accès réservé au Cercle des Présidents et Débats d’Orientation'
    ]
  }
];

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, membershipTiers = DEFAULT_MEMBERSHIP_TIERS }) => {
  const tiersToUse = membershipTiers.length > 0 ? membershipTiers : DEFAULT_MEMBERSHIP_TIERS;
  const [step, setStep] = useState<'tier' | 'form' | 'success'>('tier');
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(tiersToUse[1] || tiersToUse[0]);
  const [formData, setFormData] = useState({
    civility: 'Me',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: 'Avocat',
    institution: '',
    motivation: ''
  });
  const [memberNumber, setMemberNumber] = useState<string>('');
  const [pdfStreamOpen, setPdfStreamOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOpenPdfStream = () => {
    const currentMemberId = memberNumber || `DJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!memberNumber) {
      setMemberNumber(currentMemberId);
    }
    const url = generateAdhesionPdfBlobUrl({
      memberNumber: currentMemberId,
      civility: formData.civility || 'Me',
      firstName: formData.firstName || 'Jean',
      lastName: formData.lastName || 'Dupont',
      profession: formData.profession || 'Avocat au Barreau de Paris',
      institution: formData.institution || 'Barreau de Paris',
      email: formData.email || 'j.dupont@cabinet.fr',
      phone: formData.phone || '+33 1 42 68 00 00',
      tierName: selectedTier.name,
      tierPrice: selectedTier.price
    });
    setPdfBlobUrl(url);
    setPdfStreamOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `DJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setMemberNumber(generatedId);
    setStep('success');
  };

  const handleResetAndClose = () => {
    setStep('tier');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-[#c5c6ce] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#031632] text-white p-6 md:p-8 relative shrink-0">
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
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white">
            Demande d'Adhésion Institutionnelle
          </h2>
          <p className="text-xs sm:text-sm text-[#8293b5] mt-1">
            Rejoignez notre collège de juristes et participez activement à la défense de l'État de droit.
          </p>

          {/* Stepper indicator */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#1A2B48] text-xs">
            <span className={`px-2.5 py-1 rounded font-semibold ${step === 'tier' ? 'bg-[#C5A059] text-[#031632]' : 'bg-[#1A2B48] text-white/70'}`}>
              1. Collège &amp; Cotisation
            </span>
            <span className="text-white/40">&rarr;</span>
            <span className={`px-2.5 py-1 rounded font-semibold ${step === 'form' ? 'bg-[#C5A059] text-[#031632]' : 'bg-[#1A2B48] text-white/70'}`}>
              2. Informations du candidat
            </span>
            <span className="text-white/40">&rarr;</span>
            <span className={`px-2.5 py-1 rounded font-semibold ${step === 'success' ? 'bg-[#C5A059] text-[#031632]' : 'bg-[#1A2B48] text-white/70'}`}>
              3. Confirmation
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
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
                            Recommandé
                          </span>
                        )}
                        <h4 className="font-playfair text-base font-bold text-[#031632] mb-1">
                          {tier.name}
                        </h4>
                        <div className="text-2xl font-bold text-[#031632] mb-2">
                          {tier.price} € <span className="text-xs text-[#75777e] font-normal">{tier.period}</span>
                        </div>
                        <p className="text-[11px] text-[#44474d] mb-4">
                          {tier.targetAudience}
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#333333]">
                          {tier.benefits.map((b, i) => (
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

          {/* STEP 2: Fill Form */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between bg-[#f9f9f9] p-3 rounded border border-[#e2e2e2] text-xs">
                <div>
                  <span className="text-[#75777e]">Formule sélectionnée : </span>
                  <strong className="text-[#031632]">{selectedTier.name} ({selectedTier.price} €/an)</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('tier')}
                  className="text-[#C5A059] hover:underline font-semibold"
                >
                  Changer de formule
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                    Titre
                  </label>
                  <select
                    value={formData.civility}
                    onChange={(e) => setFormData({ ...formData, civility: e.target.value })}
                    className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059]"
                  >
                    <option value="Me">Me (Maître)</option>
                    <option value="Prof.">Prof. (Professeur)</option>
                    <option value="Dr.">Dr. (Docteur)</option>
                    <option value="M.">M.</option>
                    <option value="Mme">Mme</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                    Adresse Courriel Professionnelle *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="j.dupont@cabinet.fr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                    Numéro de Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="+33 1 42 68 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059]"
                  />
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
                    placeholder="Avocat au Barreau de Paris / Magistrat"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                    Barreau / Faculté / Entreprise
                  </label>
                  <input
                    type="text"
                    placeholder="Barreau de Paris / Université Panthéon-Assas"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                  Motivations ou commissions d'intérêt
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex : Intérêt pour la commission Éthique & IA, participation aux permanences juridiques..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('tier')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#75777e] hover:text-[#333333]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
                <button
                  type="submit"
                  className="bg-[#031632] text-white text-xs font-semibold px-6 py-3 rounded hover:bg-[#1A2B48] border-b-2 border-[#C5A059] transition-all cursor-pointer shadow-sm"
                >
                  Transmettre la candidature au Bureau
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-1">
                  Enregistrement Effectué
                </span>
                <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#031632]">
                  Bienvenue au sein de Droit &amp; Justice
                </h3>
                <p className="text-xs sm:text-sm text-[#44474d] max-w-md mx-auto mt-2">
                  Votre dossier d'adhésion pour la qualité de <strong>{selectedTier.name}</strong> a été validé avec succès.
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
                    N° {memberNumber}
                  </span>
                </div>
                <div className="text-lg font-playfair font-bold text-white mb-0.5">
                  {formData.civility} {formData.firstName} {formData.lastName}
                </div>
                <div className="text-xs text-[#8293b5] mb-4">
                  {formData.profession} • {formData.institution || 'Barreau'}
                </div>
                <div className="flex justify-between items-end border-t border-white/10 pt-3 text-[11px] text-white/70">
                  <span>Année d'exercice : {new Date().getFullYear()}</span>
                  <span className="text-[#C5A059] font-semibold">Membre Actif</span>
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
          civility: formData.civility || 'Me',
          firstName: formData.firstName || 'Jean',
          lastName: formData.lastName || 'Dupont',
          profession: formData.profession || 'Avocat',
          institution: formData.institution || 'Barreau de Paris',
          email: formData.email || 'j.dupont@cabinet.fr',
          phone: formData.phone,
          tierName: selectedTier.name,
          tierPrice: selectedTier.price
        }}
      />
    </div>
  );
};
