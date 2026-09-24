import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, Check, Copy, Share2, Scale } from 'lucide-react';
import { NavTab } from '../types';

interface LegalModalProps {
  type: 'sitemap' | 'legal' | 'contact' | 'privacy' | null;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, onNavigate }) => {
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-[#c5c6ce] animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#031632] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 cursor-pointer rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#C5A059] mb-1">
            <Scale className="w-4 h-4 stroke-[2.2]" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Droit &amp; Justice
            </span>
          </div>
          <h3 className="font-playfair text-2xl font-bold text-white">
            {type === 'sitemap' && 'Plan du site'}
            {type === 'legal' && 'Mentions Légales & Statuts'}
            {type === 'contact' && 'Contacter le Secrétariat Général'}
            {type === 'privacy' && 'Politique de Confidentialité & RGPD'}
          </h3>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-4 text-sm text-[#333333] leading-relaxed">
          {type === 'sitemap' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-playfair font-bold text-[#031632] mb-2">Sections Principales</h4>
                <ul className="space-y-1 text-xs">
                  <li><button onClick={() => { onNavigate('home'); onClose(); }} className="hover:text-[#C5A059] underline">Accueil</button></li>
                  <li><button onClick={() => { onNavigate('history'); onClose(); }} className="hover:text-[#C5A059] underline">Association : Histoire &amp; Fondations</button></li>
                  <li><button onClick={() => { onNavigate('texts'); onClose(); }} className="hover:text-[#C5A059] underline">Association : Textes &amp; Statuts</button></li>
                  <li><button onClick={() => { onNavigate('members'); onClose(); }} className="hover:text-[#C5A059] underline">Annuaire du Collège des Membres</button></li>
                  <li><button onClick={() => { onNavigate('projects'); onClose(); }} className="hover:text-[#C5A059] underline">Observatoire &amp; Projets de Réforme</button></li>
                  <li><button onClick={() => { onNavigate('activities'); onClose(); }} className="hover:text-[#C5A059] underline">Activités, Colloques &amp; Formations</button></li>
                  <li><button onClick={() => { onNavigate('blog'); onClose(); }} className="hover:text-[#C5A059] underline">Blog Doctrinal &amp; Chroniques</button></li>
                  <li><button onClick={() => { onNavigate('contact'); onClose(); }} className="hover:text-[#C5A059] underline">Contact &amp; Secrétariat Général</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-playfair font-bold text-[#031632] mb-2">Dispositifs &amp; Services</h4>
                <ul className="space-y-1 text-xs text-[#75777e]">
                  <li>• Clinique Juridique &amp; Permanences Gratuites</li>
                  <li>• Adhésion des Membres et Cotisations</li>
                  <li>• Formation Continue Validée CNB / ENM</li>
                  <li>• Téléchargement des Livres Blancs</li>
                </ul>
              </div>
            </div>
          )}

          {type === 'legal' && (
            <div className="space-y-3 text-xs sm:text-sm">
              <p><strong>Éditeur de la plateforme :</strong> Association Droit &amp; Justice (Loi 1901)</p>
              <p><strong>Siège social :</strong> 12 rue Royale, 75008 Paris, France</p>
              <p><strong>Directeur de la publication :</strong> Hélène de Saint-Maur, Présidente de l'Association</p>
              <p><strong>Comité Scientifique :</strong> Présidé par le Professeur émérite Jean-Marc Vallery</p>
              <p><strong>Hébergement :</strong> Serveurs sécurisés sur territoire européen conformes aux exigences de souveraineté des données de justice.</p>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-3 text-xs sm:text-sm">
              <p>Droit &amp; Justice accorde une importance capitale au secret professionnel et à la confidentialité des données personnelles.</p>
              <p>Les données collectées dans le cadre des demandes d'adhésion ou des inscriptions aux colloques sont strictement réservées à la gestion associative et ne font l'objet d'aucune cession commerciale.</p>
              <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression en écrivant à : <em>dpo@droit-justice.asso.fr</em>.</p>
            </div>
          )}

          {type === 'contact' && (
            <div>
              {!contactSent ? (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-[#333333] block mb-1">Votre Nom *</label>
                      <input
                        type="text"
                        required
                        placeholder="Me / M. / Mme ..."
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full border border-[#c5c6ce] rounded p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-[#333333] block mb-1">Courriel *</label>
                      <input
                        type="email"
                        required
                        placeholder="contact@domaine.fr"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full border border-[#c5c6ce] rounded p-2 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-[#333333] block mb-1">Objet</label>
                    <input
                      type="text"
                      placeholder="Question sur l'adhésion, invitation à un colloque..."
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full border border-[#c5c6ce] rounded p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-[#333333] block mb-1">Message *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Votre message au secrétariat de l'association..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full border border-[#c5c6ce] rounded p-2 text-xs"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-[#031632] text-white text-xs font-semibold px-6 py-2.5 rounded hover:bg-[#1A2B48] flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer la demande</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-[#031632]">Message Reçu</h4>
                  <p className="text-xs text-[#75777e]">
                    Le secrétariat général de Droit &amp; Justice accusera réception sous 48 heures ouvrées.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-[#031632] text-white text-xs font-semibold px-5 py-2 rounded hover:bg-[#1A2B48]"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const url = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-[#c5c6ce] animate-in zoom-in-95 duration-200">
        <div className="bg-[#031632] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 cursor-pointer rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#C5A059] mb-1">
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Partager</span>
          </div>
          <h3 className="font-playfair text-xl font-bold text-white">
            Diffuser Droit &amp; Justice
          </h3>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[#75777e]">
            Partagez le portail institutionnel de l'association auprès de vos confrères et consoeurs.
          </p>

          <div className="flex items-center gap-2 bg-[#f9f9f9] p-2.5 rounded border border-[#e2e2e2]">
            <input
              type="text"
              readOnly
              value={url}
              className="bg-transparent text-xs text-[#031632] w-full focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="bg-[#031632] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#1A2B48] shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#031632] px-4 py-2 hover:underline"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
