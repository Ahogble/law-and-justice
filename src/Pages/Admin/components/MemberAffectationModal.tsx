import React, { useState, useEffect } from 'react';
import { X, Check, CheckCircle2, AlertTriangle, ShieldCheck, UserCheck, Award } from 'lucide-react';
import { router } from '@inertiajs/react';
import { MembershipApplication, MemberCategory } from '../../../types';

interface MemberAffectationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application?: MembershipApplication | null;
  member?: any | null;
  categoriesList: MemberCategory[];
}

export function MemberAffectationModal({
  isOpen,
  onClose,
  application,
  member,
  categoriesList = [],
}: MemberAffectationModalProps) {
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [createMemberProfile, setCreateMemberProfile] = useState<boolean>(true);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initialCat = member?.category || categoriesList[0]?.name || "Conseil d'Administration";
      setCategory(initialCat);

      const catObj = categoriesList.find(c => c.name === initialCat);
      const initialSub = member?.subcategory || catObj?.subcategories?.[0]?.name || '';
      setSubcategory(initialSub);

      setCreateMemberProfile(application ? !!application.member_id || true : true);
      setAdminNotes(application?.admin_notes || '');
    }
  }, [isOpen, application, member, categoriesList]);

  if (!isOpen || (!application && !member)) return null;

  const currentCategoryObj = categoriesList.find(c => c.name === category);

  const displayName = application
    ? `${application.civility || ''} ${application.first_name || ''} ${application.last_name || ''}`.trim()
    : (member?.name || 'Membre');

  const displayRole = application
    ? `${application.profession || 'Juriste'}${application.institution ? ` (${application.institution})` : ''}`
    : (member?.role || 'Membre de l\'association');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (application) {
      router.post(`/admin/applications/${application.id}/approve`, {
        category,
        subcategory,
        create_member: createMemberProfile,
        admin_notes: adminNotes,
        cni: application.cni,
        cni_url: application.cni_url,
        avatar_url: application.avatar_url,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          onClose();
        },
        onError: () => {
          setIsSubmitting(false);
        }
      });
    } else if (member) {
      router.post('/admin/members', {
        ...member,
        category,
        subcategory,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          onClose();
        },
        onError: () => {
          setIsSubmitting(false);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-200" />
            <h3 className="font-serif font-bold text-base text-white">
              Affectation Institutionnelle &amp; Agrément du Membre
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Membre Concerné</span>
            <div className="font-bold text-slate-900 text-sm">{displayName}</div>
            <div className="text-slate-500 text-[11px] mt-0.5">{displayRole}</div>
            {application?.tier_name && (
              <div className="text-emerald-700 font-semibold text-[11px] mt-1">
                Formule : {application.tier_name} {application.tier_price ? `(${application.tier_price.toLocaleString('fr-FR')} FCFA)` : ''}
              </div>
            )}
          </div>

          {/* Payment info notice if application is available */}
          {application && (
            application.payment_status === 'verified' ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-900 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Versement vérifié et confirmé sous la référence <strong>{application.payment_reference || 'Confirmé'}</strong> ({application.payment_method || 'Mode validé'}).</span>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Versement en attente de vérification</span>
                  <span className="text-[11px] text-amber-800/90 block mt-0.5">
                    Réf. versement déclarée : <strong>{application.payment_reference || 'Non renseignée'}</strong> ({application.payment_method || 'Non précisé'}).
                  </span>
                </div>
              </div>
            )
          )}

          {/* Directory placement & categories */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            {application && (
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createMemberProfile}
                  onChange={(e) => setCreateMemberProfile(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Publier la fiche dans l'annuaire des membres
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Le membre figurera dans la section Membres du site public avec son titre et son institution.
                  </span>
                </div>
              </label>
            )}

            {(createMemberProfile || !application) && (
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${application ? 'pt-3 border-t border-slate-200' : ''}`}>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Catégorie d'affectation *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      const target = categoriesList.find(c => c.name === e.target.value);
                      setSubcategory(target?.subcategories?.[0]?.name || '');
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
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
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  >
                    <option value="">-- Aucune --</option>
                    {currentCategoryObj?.subcategories?.map((sub) => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Note interne ou mention de délibération (optionnelle)
            </label>
            <textarea
              rows={2}
              placeholder="Ex : Affecté en commission ou réunion de bureau du..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'affectation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MemberAffectationModal;
