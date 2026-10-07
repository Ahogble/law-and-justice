import React from 'react';
import { Plus, ShieldCheck, X, Save, Edit, Trash2 } from 'lucide-react';

interface DisputeStagesManagerProps {
  stagesList: any[];
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  disputeStageForm: any;
  setDisputeStageForm: (val: any) => void;
  handleAddOrUpdateStage: (e: React.FormEvent) => void;
  handleDeleteStage: (id: string) => void;
}

export const DisputeStagesManager: React.FC<DisputeStagesManagerProps> = ({
  stagesList,
  isEditing,
  setIsEditing,
  disputeStageForm,
  setDisputeStageForm,
  handleAddOrUpdateStage,
  handleDeleteStage
}) => {
  return (
    <div className="space-y-6">
      {/* Dispute Stage Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto transform transition-all">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-amber-500/10 via-slate-50 to-white border-b border-slate-200/90 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg md:text-xl flex items-center gap-2">
                    <span>{disputeStageForm.id ? 'Modifier l\'étape de litige' : 'Créer une nouvelle étape de litige'}</span>
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5">Configurez le cadre réglementaire, l'intitulé et la garantie de confidentialité de cette étape</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-2xl transition-colors cursor-pointer"
                title="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAddOrUpdateStage}>
              <div className="p-8 space-y-6 max-h-[78vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Numéro d'Étape (ex: Étape 1)</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Étape 1"
                      value={disputeStageForm.stepNumber}
                      onChange={e => setDisputeStageForm({ ...disputeStageForm, stepNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Clé identifiante (ex: conciliation)</label>
                    <input
                      type="text"
                      placeholder="ex: conciliation"
                      value={disputeStageForm.key}
                      onChange={e => setDisputeStageForm({ ...disputeStageForm, key: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Intitulé des Intervenants</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Les Conciliateurs Assermentés"
                      value={disputeStageForm.officersTitle}
                      onChange={e => setDisputeStageForm({ ...disputeStageForm, officersTitle: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Titre de l'étape (Cadre Réglementaire)</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Étape 1 : La Conciliation Interne"
                      value={disputeStageForm.title}
                      onChange={e => setDisputeStageForm({ ...disputeStageForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sous-titre / Court descriptif</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Prévention et négociation amiable directe"
                      value={disputeStageForm.subtitle}
                      onChange={e => setDisputeStageForm({ ...disputeStageForm, subtitle: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description détaillée (Procédure Officielle)</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explication complète du déroulement de l'étape..."
                    value={disputeStageForm.description}
                    onChange={e => setDisputeStageForm({ ...disputeStageForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Base juridique</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Article 12 du Règlement Intérieur"
                      value={disputeStageForm.legalBasis}
                      onChange={e => setDisputeStageForm({ ...disputeStageForm, legalBasis: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Garantie de confidentialité</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Confidentialité absolue garantie par..."
                      value={disputeStageForm.confidentiality}
                      onChange={e => setDisputeStageForm({ ...disputeStageForm, confidentiality: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 bg-slate-50 border-t border-slate-200/90 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer l'Étape</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {stagesList.map((stg: any) => (
          <div key={stg.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-300/60">
                  {stg.stepNumber}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{stg.title}</h4>
                  <p className="text-xs text-slate-500">{stg.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setDisputeStageForm({
                      id: stg.id,
                      key: stg.key || '',
                      stepNumber: stg.stepNumber || '',
                      title: stg.title || '',
                      subtitle: stg.subtitle || '',
                      description: stg.description || '',
                      legalBasis: stg.legalBasis || '',
                      confidentiality: stg.confidentiality || '',
                      officersTitle: stg.officersTitle || ''
                    });
                    setIsEditing(true);
                  }}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteStage(stg.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
              {stg.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-medium">Base juridique</span>
                <span className="text-slate-800 font-semibold">{stg.legalBasis}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-medium">Confidentialité</span>
                <span className="text-slate-800 font-semibold">{stg.confidentiality}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-medium">Titre des Intervenants</span>
                <span className="text-amber-700 font-semibold">{stg.officersTitle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
