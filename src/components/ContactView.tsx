import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Check, Shield, Building2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ContactViewProps {
  contactDepartments?: any[];
  contactFaqs?: any[];
}

const DEPT_PALETTES: Record<string, { bg: string; border: string; badge: string; text: string; hoverBorder: string }> = {
  secretariat: {
    bg: 'bg-gradient-to-br from-amber-100 via-amber-200/70 to-yellow-100',
    border: 'border-amber-300',
    badge: 'bg-white/90 text-amber-950 border-amber-300',
    text: 'text-amber-950',
    hoverBorder: 'hover:border-amber-500'
  },
  clinique: {
    bg: 'bg-gradient-to-br from-blue-100 via-sky-200/70 to-blue-100',
    border: 'border-blue-300',
    badge: 'bg-white/90 text-blue-950 border-blue-300',
    text: 'text-blue-950',
    hoverBorder: 'hover:border-blue-500'
  },
  scientifique: {
    bg: 'bg-gradient-to-br from-emerald-100 via-teal-200/70 to-emerald-100',
    border: 'border-emerald-300',
    badge: 'bg-white/90 text-emerald-950 border-emerald-300',
    text: 'text-emerald-950',
    hoverBorder: 'hover:border-emerald-500'
  },
  presse: {
    bg: 'bg-gradient-to-br from-fuchsia-100 via-purple-200/70 to-pink-100',
    border: 'border-fuchsia-300',
    badge: 'bg-white/90 text-fuchsia-950 border-fuchsia-300',
    text: 'text-fuchsia-950',
    hoverBorder: 'hover:border-fuchsia-500'
  }
};

const getDeptPalette = (id: string, index: number) => {
  if (DEPT_PALETTES[id]) return DEPT_PALETTES[id];
  const keys = Object.keys(DEPT_PALETTES);
  return DEPT_PALETTES[keys[index % keys.length]];
};

export const ContactView: React.FC<ContactViewProps> = ({ contactDepartments, contactFaqs }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [formData, setFormData] = useState({
    civility: 'Me',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: 'Avocat',
    department: 'secretariat',
    subject: '',
    message: '',
    urgency: 'normal'
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedTicket = `DJ-REQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketNumber(generatedTicket);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const departments = contactDepartments && contactDepartments.length > 0 ? contactDepartments : [
    {
      id: 'secretariat',
      name: isEn ? 'General Secretariat' : 'Secrétariat Général',
      email: 'secretariat@droit-justice.asso.fr',
      desc: isEn ? 'Memberships, dues, governance, and general assemblies.' : 'Adhésions, cotisations, vie statutaire et assemblées générales.'
    },
    {
      id: 'clinique',
      name: isEn ? 'Legal Aid Clinic & Consultations' : 'Clinique Juridique & Permanences',
      email: 'clinique@droit-justice.asso.fr',
      desc: isEn ? 'Free consultations for citizens, volunteer recruitment.' : 'Consultations gratuites pour justiciables, saisine des bénévoles.'
    },
    {
      id: 'scientifique',
      name: isEn ? 'Scientific Committee & Doctrine' : 'Comité Scientifique & Doctrine',
      email: 'doctrine@droit-justice.asso.fr',
      desc: isEn ? 'Doctrinal article submissions, observatory, and research.' : 'Soumission d\'articles doctrinaux, observatoire et travaux de recherche.'
    },
    {
      id: 'presse',
      name: isEn ? 'Press & Communication' : 'Presse & Communication',
      email: 'presse@droit-justice.asso.fr',
      desc: isEn ? 'Spokesperson interviews, op-eds, and press releases.' : 'Interviews de nos porte-paroles, tribunes et communiqués institutionnels.'
    }
  ];

  const faqs = contactFaqs && contactFaqs.length > 0 ? contactFaqs : [
    {
      q: isEn ? 'How do I request a consultation at the Legal Aid Clinic?' : 'Comment solliciter une consultation auprès de la Clinique Juridique ?',
      a: isEn
        ? 'Free consultations take place every Thursday afternoon at the association headquarters or via secure video link. Appointments can be requested via this contact form by selecting the "Legal Aid Clinic" department.'
        : 'Les permanences gratuites ont lieu chaque jeudi après-midi au siège de l\'association ou en visioconférence sécurisée. La prise de rendez-vous s\'effectue via le formulaire de contact en sélectionnant le département « Clinique Juridique ».'
    },
    {
      q: isEn ? 'What is the standard response time from the secretariat?' : 'Quel est le délai de réponse habituel du secrétariat ?',
      a: isEn
        ? 'The Law & Justice General Secretariat acknowledges receipt within 24 to 48 business hours for all institutional and administrative requests.'
        : 'Le secrétariat général de Droit & Justice accuse réception sous 24 à 48 heures ouvrées pour l\'ensemble des demandes institutionnelles et administratives.'
    },
    {
      q: isEn ? 'Do training sessions and conferences qualify for continuing education credits?' : 'Les formations et colloques ouvrent-ils droit à des heures déontologiques ?',
      a: isEn
        ? 'Yes, all of our training cycles and annual conferences are accredited for mandatory continuing education requirements for attorneys (CNB) and judges (ENM).'
        : 'Oui, l\'ensemble de nos cycles de formation et de nos colloques annuels sont homologués et validés au titre de l\'obligation de formation continue des avocats (CNB) et des magistrats (ENM).'
    },
    {
      q: isEn ? 'Where is the headquarters located and how do I access it?' : 'Où se situe le siège et comment y accéder ?',
      a: isEn
        ? 'Our headquarters is located at 12 rue Royale in Paris (8th arr.), directly accessible via Madeleine metro (Lines 8, 12, 14) and Concorde metro (Lines 1, 8, 12).'
        : 'Notre hôtel particulier est situé au 12 rue Royale à Paris (8e arrondissement), accessible directement par les stations de métro Madeleine (lignes 8, 12, 14) et Concorde (lignes 1, 8, 12).'
    }
  ];

  return (
    <div id="contact-view-page" className="pt-20 pb-28">
      {/* Header Banner */}
      <section className="bg-[#031632] text-white py-16 px-5 md:px-16 border-b border-[#1A2B48]">
        <div className="max-w-[1280px] mx-auto">
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-2">
            {isEn ? 'Institutional Relations' : 'Relations Institutionnelles'}
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {isEn ? 'Contact & General Secretariat' : 'Contact & Secrétariat Général'}
          </h1>
          <p className="text-[#8293b5] text-base md:text-lg max-w-3xl leading-relaxed">
            {isEn
              ? 'Connect with board members, request assistance from the Legal Aid Clinic, or submit inquiries to our expert committees.'
              : 'Échangez avec les membres du bureau, sollicitez la Clinique Juridique ou déposez une demande auprès de nos commissions d\'experts.'}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 mt-12 space-y-16">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-200 p-6 rounded-2xl border-2 border-amber-300 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#031632] text-[#C5A059] flex items-center justify-center mb-4 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-[#031632] mb-1">
                {isEn ? 'Institutional Headquarters' : 'Siège Institutionnel'}
              </h3>
              <p className="text-xs font-semibold text-amber-900 mb-3">
                {isEn ? 'In the heart of the judicial district' : 'Au cœur du quartier judiciaire'}
              </p>
              <address className="not-italic text-xs text-slate-900 font-medium leading-relaxed">
                12 rue Royale<br />
                75008 Paris, France<br />
                Métro Madeleine / Concorde
              </address>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-300/80 text-[11px] font-semibold text-amber-950">
              {isEn ? 'Public reception by appointment' : 'Accueil du public sur RDV'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-200 via-sky-100 to-blue-200 p-6 rounded-2xl border-2 border-blue-300 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#031632] text-[#C5A059] flex items-center justify-center mb-4 shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-[#031632] mb-1">
                {isEn ? 'Direct Phone Line' : 'Ligne Directe'}
              </h3>
              <p className="text-xs font-semibold text-blue-900 mb-3">
                {isEn ? 'Duty Secretariat' : 'Secrétariat de permanence'}
              </p>
              <p className="text-xs font-bold text-[#031632] mb-1">
                +33 (0)1 42 68 00 00
              </p>
              <p className="text-[11px] font-medium text-slate-800">
                {isEn ? 'Line dedicated to members and colleagues' : 'Ligne dédiée aux membres et confrères'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-300/80 text-[11px] font-semibold text-blue-950">
              Fax : +33 (0)1 42 68 00 01
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-200 via-teal-100 to-emerald-200 p-6 rounded-2xl border-2 border-emerald-300 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#031632] text-[#C5A059] flex items-center justify-center mb-4 shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-[#031632] mb-1">
                {isEn ? 'Central Email' : 'Courriel Central'}
              </h3>
              <p className="text-xs font-semibold text-emerald-900 mb-3">
                {isEn ? 'Official correspondence' : 'Correspondance officielle'}
              </p>
              <a
                href="mailto:contact@droit-justice.asso.fr"
                className="text-xs font-bold text-[#031632] hover:text-emerald-950 transition-colors block mb-1 break-all underline decoration-emerald-400 decoration-2 underline-offset-2"
              >
                contact@droit-justice.asso.fr
              </a>
              <p className="text-[11px] font-medium text-slate-800">
                {isEn ? 'PGP encryption available upon request' : 'Chiffrage PGP disponible sur demande'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-300/80 text-[11px] font-semibold text-emerald-950">
              {isEn ? 'Response within 24h to 48h' : 'Réponse sous 24h à 48h'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-200 via-rose-100 to-amber-200 p-6 rounded-2xl border-2 border-orange-300 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#031632] text-[#C5A059] flex items-center justify-center mb-4 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-[#031632] mb-1">
                {isEn ? 'Opening Hours' : 'Horaires d\'Ouverture'}
              </h3>
              <p className="text-xs font-semibold text-orange-900 mb-3">
                {isEn ? 'Paris office hours' : 'Heures de bureau de Paris'}
              </p>
              <p className="text-xs text-slate-900 font-semibold leading-relaxed">
                {isEn ? 'Monday to Friday' : 'Du lundi au vendredi'}<br />
                09h00 – 12h30 &amp; 14h00 – 18h30
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-orange-300/80 text-[11px] font-semibold text-orange-950">
              {isEn ? 'Closed Saturdays and Sundays' : 'Fermé les samedis et dimanches'}
            </div>
          </div>
        </div>

        {/* Section: Form & Direct Department Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Container (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#e2e2e2] p-8 md:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-1">
                    {isEn ? 'Transmission Successful' : 'Transmission Réussie'}
                  </span>
                  <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#031632]">
                    {isEn ? 'Your message has been registered' : 'Votre message a été enregistré'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#44474d] max-w-md mx-auto mt-2">
                    {isEn
                      ? 'The General Secretariat of Law & Justice has received your transmission and will forward it to the appropriate department.'
                      : 'Le secrétariat général de Droit & Justice a bien reçu votre transmission et la transmettra au service compétent.'}
                  </p>
                </div>

                <div className="bg-[#f9f9f9] border border-[#e2e2e2] p-4 rounded-lg max-w-md mx-auto text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#75777e]">{isEn ? 'Case File ID:' : 'Identifiant de dossier :'}</span>
                    <strong className="text-[#031632] font-mono">{ticketNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75777e]">{isEn ? 'Sender:' : 'Émetteur :'}</span>
                    <span className="text-[#031632] font-medium">{formData.civility} {formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75777e]">{isEn ? 'Ack Email:' : 'Courriel d\'accusé :'}</span>
                    <span className="text-[#031632]">{formData.email}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        civility: 'Me',
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        userType: 'Avocat',
                        department: 'secretariat',
                        subject: '',
                        message: '',
                        urgency: 'normal'
                      });
                    }}
                    className="bg-[#031632] text-white text-xs font-semibold px-6 py-2.5 rounded hover:bg-[#1A2B48] transition-colors cursor-pointer"
                  >
                    {isEn ? 'Send another message' : 'Envoyer une autre transmission'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 pb-4 border-b border-[#e2e2e2]">
                  <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-1">
                    {isEn ? 'Institutional Form' : 'Formulaire Institutionnel'}
                  </span>
                  <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#031632]">
                    {isEn ? 'Submit Correspondence' : 'Transmettre une correspondance'}
                  </h2>
                  <p className="text-xs text-[#75777e] mt-1">
                    {isEn
                      ? 'Fields marked with an asterisk (*) are required for processing.'
                      : 'Les champs marqués d\'un astérisque (*) sont obligatoires pour le traitement du dossier.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                        {isEn ? 'Title *' : 'Civilité *'}
                      </label>
                      <select
                        value={formData.civility}
                        onChange={(e) => setFormData({ ...formData, civility: e.target.value })}
                        className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                      >
                        <option value="Me">Me (Maître)</option>
                        <option value="Prof.">Prof. (Professeur)</option>
                        <option value="Dr.">Dr. (Docteur)</option>
                        <option value="M.">M. / Mr</option>
                        <option value="Mme">Mme / Ms</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                        {isEn ? 'First Name *' : 'Prénom *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                        {isEn ? 'Last Name *' : 'Nom *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                        {isEn ? 'Professional Email *' : 'Courriel Professionnel *'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="j.dupont@cabinet.fr"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                        {isEn ? 'Phone Number' : 'Numéro de Téléphone'}
                      </label>
                      <input
                        type="tel"
                        placeholder="+33 1 42 68 00 00"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                        {isEn ? 'Your Status' : 'Votre Qualité'}
                      </label>
                      <select
                        value={formData.userType}
                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                        className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                      >
                        <option value="Avocat">{isEn ? 'Attorney / Judicial Auxiliary' : 'Avocat / Auxiliaire de justice'}</option>
                        <option value="Magistrat">{isEn ? 'Magistrate / Judge' : 'Magistrat'}</option>
                        <option value="Universitaire">{isEn ? 'Academic / Researcher' : 'Universitaire / Enseignant-chercheur'}</option>
                        <option value="Juriste">{isEn ? 'Corporate Counsel' : 'Juriste d\'entreprise'}</option>
                        <option value="Étudiant">{isEn ? 'Law Student' : 'Étudiant en droit'}</option>
                        <option value="Justiciable">{isEn ? 'Litigant / Individual' : 'Justiciable / Particulier'}</option>
                        <option value="Journaliste">{isEn ? 'Journalist / Media' : 'Journaliste / Média'}</option>
                        <option value="Autre">{isEn ? 'Other profession' : 'Autre profession'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                        {isEn ? 'Target Department *' : 'Pôle Destinataire *'}
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                      >
                        {departments.map((dept: any) => (
                          <option key={dept.id} value={dept.id}>
                            {isEn ? (dept.nameEn || dept.name) : dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      {isEn ? 'Subject of Correspondence *' : 'Objet de la correspondance *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isEn ? 'E.g.: Legal clinic appointment request / Article submission' : 'Ex : Demande de rendez-vous clinique juridique / Proposition d\'article'}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                      {isEn ? 'Detailed Message *' : 'Message détaillé *'}
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder={isEn ? 'Please describe your request precisely to facilitate routing by the secretariat...' : 'Décrivez votre demande avec précision afin de faciliter l\'orientation par le secrétariat...'}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white px-3 py-2 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                    <span className="text-[11px] text-[#75777e] flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                      {isEn ? 'Secure confidential transmission' : 'Transmission confidentielle sécurisée'}
                    </span>
                    <button
                      type="submit"
                      className="bg-[#031632] hover:bg-[#1A2B48] text-white text-xs font-semibold px-6 py-3 rounded border-b-2 border-[#C5A059] transition-all duration-200 shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#C5A059]" />
                      <span>{isEn ? 'Send to Secretariat' : 'Envoyer au secrétariat'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Direct Department Routing & Practical Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Department contacts */}
            <div className="bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] p-6 space-y-4">
              <h3 className="font-playfair text-xl font-bold text-[#031632]">
                {isEn ? 'Direct Department Contacts' : 'Pôles de Contact Directs'}
              </h3>
              <p className="text-xs text-[#75777e]">
                {isEn ? 'You may also write directly to the relevant department:' : 'Vous pouvez également écrire directement au pôle concerné :'}
              </p>

              <div className="space-y-3">
                {departments.map((dept: any, index: number) => {
                  const palette = getDeptPalette(dept.id, index);
                  return (
                    <div
                      key={dept.id}
                      className={`${palette.bg} p-4 rounded-xl border-2 ${palette.border} ${palette.hoverBorder} shadow-xs hover:shadow-md transition-all duration-200`}
                    >
                      <h4 className="text-xs font-bold text-[#031632] flex items-center justify-between">
                        <span>{isEn ? (dept.nameEn || dept.name) : dept.name}</span>
                        <span className={`text-[10px] ${palette.badge} border uppercase font-bold px-2 py-0.5 rounded shadow-2xs`}>
                          Direct
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-800 font-medium mt-1 mb-2 leading-relaxed">
                        {isEn ? (dept.descEn || dept.desc) : dept.desc}
                      </p>
                      <a
                        href={`mailto:${dept.email}`}
                        className={`text-xs ${palette.text} font-bold hover:underline flex items-center gap-1.5`}
                      >
                        <Mail className="w-3.5 h-3.5 text-[#031632]" />
                        <span>{dept.email}</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Access & Transports */}
            <div className="bg-gradient-to-br from-indigo-100 via-sky-100 to-violet-100 rounded-2xl border-2 border-indigo-300 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-playfair text-lg font-bold text-[#031632] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-800" />
                {isEn ? 'Access & Transport' : 'Accès & Transports'}
              </h3>
              <div className="text-xs text-slate-800 space-y-2 leading-relaxed font-medium">
                <p>
                  <strong className="text-indigo-950">{isEn ? 'Metro:' : 'Métro :'}</strong> Madeleine ({isEn ? 'Lines' : 'Lignes'} 8, 12, 14) {isEn ? 'or' : 'ou'} Concorde ({isEn ? 'Lines' : 'Lignes'} 1, 8, 12).
                </p>
                <p>
                  <strong className="text-indigo-950">{isEn ? 'RATP Bus:' : 'Bus RATP :'}</strong> {isEn ? 'Lines' : 'Lignes'} 24, 42, 52, 72, 73, 84, 94.
                </p>
                <p>
                  <strong className="text-indigo-950">{isEn ? 'Public Parking:' : 'Parking public :'}</strong> Parking Indigo Madeleine-Tronchet ({isEn ? '150m away' : 'à 150m'}).
                </p>
                <p>
                  <strong className="text-indigo-950">{isEn ? 'Disability Access:' : 'Accessibilité PMR :'}</strong> {isEn ? 'Access ramp and elevator serving hearing and conference rooms.' : 'Rampe d\'accès et ascenseur desservant les salles d\'audience et de conférence.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section FAQ */}
        <div className="bg-white rounded-xl border border-[#e2e2e2] p-8 md:p-10 shadow-sm">
          <div className="mb-6 pb-4 border-b border-[#e2e2e2]">
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-1">
              {isEn ? 'Frequently Asked Questions' : 'Foire Aux Questions'}
            </span>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#031632]">
              {isEn ? 'Frequently Asked Questions' : 'Questions Fréquentes'}
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#e2e2e2] rounded-lg overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 bg-[#f9f9f9] hover:bg-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-[#031632] cursor-pointer"
                  >
                    <span>{isEn ? (faq.qEn || faq.q) : faq.q}</span>
                    <span className="text-lg text-[#C5A059] font-mono leading-none">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 text-xs sm:text-sm text-[#44474d] leading-relaxed bg-white border-t border-[#e2e2e2] animate-in fade-in duration-150">
                      {isEn ? (faq.aEn || faq.a) : faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

