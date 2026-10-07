import React from 'react';
import { Plus, X, Save, Edit, Trash2, ShieldCheck, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { MembershipTier } from '../../../types';

export default function MembershipTiersManager({
  membershipTiersState,
  setMembershipTiersState,
  handleSaveMembershipTiers
}: {
  membershipTiersState: any[];
  setMembershipTiersState: (val: any[]) => void;
  handleSaveMembershipTiers: () => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tierForm, setTierForm] = React.useState<any>({
    id: '',
    name: '',
    nameEn: '',
    price: 0,
    period: '/ an',
    periodEn: '/ yr',
    targetAudience: '',
    targetAudienceEn: '',
    popular: false,
    benefits: [],
    benefitsEn: []
  });

  const [benefitInput, setBenefitInput] = React.useState('');
  const [benefitEnInput, setBenefitEnInput] = React.useState('');

  const handleAddBenefit = () => {
    if (!benefitInput.trim()) return;
    setTierForm({
      ...tierForm,
      benefits: [...(tierForm.benefits || []), benefitInput.trim()],
      benefitsEn: [...(tierForm.benefitsEn || []), benefitEnInput.trim() || benefitInput.trim()]
    });
    setBenefitInput('');
    setBenefitEnInput('');
  };

  const handleRemoveBenefit = (index: number) => {
    const updatedBenefits = [...(tierForm.benefits || [])];
    const updatedBenefitsEn = [...(tierForm.benefitsEn || [])];
    updatedBenefits.splice(index, 1);
    updatedBenefitsEn.splice(index, 1);
    setTierForm({
      ...tierForm,
      benefits: updatedBenefits,
      benefitsEn: updatedBenefitsEn
    });
  };

  const handleSaveTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (tierForm.id) {
      setMembershipTiersState(membershipTiersState.map(t => t.id === tierForm.id ? tierForm : t));
    } else {
      setMembershipTiersState([...membershipTiersState, { ...tierForm, id: 'tier-' + Date.now() }]);
    }
    setIsEditing(false);
  };

  const handleDeleteTier = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce statut ?')) {
      setMembershipTiersState(membershipTiersState.filter(t => t.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Tarification & Statuts</h2>
          <p className="text-xs text-slate-500">Gérez les différents statuts de membres, leurs prix et avantages.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setTierForm({
                id: '',
                name: '',
                nameEn: '',
                price: 0,
                period: '/ an',
                periodEn: '/ yr',
                targetAudience: '',
                targetAudienceEn: '',
                popular: false,
                benefits: [],
                benefitsEn: []
              });
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Statut</span>
          </button>
          <button
            onClick={handleSaveMembershipTiers}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer la configuration</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {membershipTiersState.map((tier) => (
          <div key={tier.id} className={`bg-white rounded-xl border ${tier.popular ? 'border-amber-400 shadow-md shadow-amber-400/10' : 'border-slate-200'} p-6 flex flex-col relative`}>
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#031632] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Recommandé
              </span>
            )}
            
            <div className="flex justify-end gap-2 mb-2">
              <button onClick={() => { setTierForm(tier); setIsEditing(true); }} className="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDeleteTier(tier.id)} className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-playfair font-bold text-xl text-[#031632] text-center">{tier.name}</h3>
            
            <div className="text-center mt-4 mb-6">
              <span className="text-4xl font-bold text-[#031632]">{tier.price.toLocaleString('fr-FR')} FCFA</span>
              <span className="text-sm text-[#75777e] ml-1">{tier.period}</span>
            </div>

            <p className="text-xs text-[#44474d] text-center mb-6 leading-relaxed flex-grow">
              {tier.targetAudience}
            </p>

            <ul className="space-y-3 mb-6">
              {(tier.benefits || []).map((benefit: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#44474d]">
                  <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-amber-700 text-lg">
                {tierForm.id ? 'Modifier le statut' : 'Nouveau statut'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveTier} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* French Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox" 
                      checked={tierForm.popular}
                      onChange={e => setTierForm({ ...tierForm, popular: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">Mettre en avant (Recommandé)</span>
                  </label>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">Version Française</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du statut *</label>
                    <input
                      type="text"
                      required
                      value={tierForm.name}
                      onChange={e => setTierForm({ ...tierForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Prix (FCFA) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={tierForm.price}
                        onChange={e => setTierForm({ ...tierForm, price: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Période (ex: / an) *</label>
                      <input
                        type="text"
                        required
                        value={tierForm.period}
                        onChange={e => setTierForm({ ...tierForm, period: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cible / Description courte *</label>
                    <textarea
                      required
                      rows={3}
                      value={tierForm.targetAudience}
                      onChange={e => setTierForm({ ...tierForm, targetAudience: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">English Version</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status Name</label>
                    <input
                      type="text"
                      value={tierForm.nameEn || ''}
                      onChange={e => setTierForm({ ...tierForm, nameEn: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-start-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Period (e.g. / yr)</label>
                      <input
                        type="text"
                        value={tierForm.periodEn || ''}
                        onChange={e => setTierForm({ ...tierForm, periodEn: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target / Short Description</label>
                    <textarea
                      rows={3}
                      value={tierForm.targetAudienceEn || ''}
                      onChange={e => setTierForm({ ...tierForm, targetAudienceEn: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Avantages du statut</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nouvel avantage (FR)..."
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddBenefit();
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="New benefit (EN)..."
                      value={benefitEnInput}
                      onChange={(e) => setBenefitEnInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddBenefit();
                        }
                      }}
                    />
                    <button type="button" onClick={handleAddBenefit} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-600 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(tierForm.benefits || []).map((b: string, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <span className="font-medium text-slate-700">{b}</span>
                        <span className="text-slate-500 italic">{tierForm.benefitsEn?.[i] || ''}</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveBenefit(i)} className="text-slate-400 hover:text-rose-500 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Appliquer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
