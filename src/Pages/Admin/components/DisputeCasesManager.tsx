import React from 'react';
import { Briefcase, Search, Filter, SlidersHorizontal, X, Save, Edit, Trash2, Tag, Calendar, Unlock, Lock } from 'lucide-react';

interface DisputeCasesManagerProps {
  disputeCases: any[];
  stagesList: any[];
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  caseSearchQuery: string;
  setCaseSearchQuery: (val: string) => void;
  caseCategoryFilter: string;
  setCaseCategoryFilter: (val: string) => void;
  caseStageFilter: string;
  setCaseStageFilter: (val: string) => void;
  caseStatusFilter: string;
  setCaseStatusFilter: (val: string) => void;
  caseSortBy: string;
  setCaseSortBy: (val: string) => void;
  disputeCaseForm: any;
  setDisputeCaseForm: (val: any) => void;
  handleSaveDisputeCase: (e: React.FormEvent) => void;
  handleDeleteDisputeCase: (id: string, name: string) => void;
}

export const DisputeCasesManager: React.FC<DisputeCasesManagerProps> = ({
  disputeCases,
  stagesList,
  isEditing,
  setIsEditing,
  caseSearchQuery,
  setCaseSearchQuery,
  caseCategoryFilter,
  setCaseCategoryFilter,
  caseStageFilter,
  setCaseStageFilter,
  caseStatusFilter,
  setCaseStatusFilter,
  caseSortBy,
  setCaseSortBy,
  disputeCaseForm,
  setDisputeCaseForm,
  handleSaveDisputeCase,
  handleDeleteDisputeCase
}) => {
  const filteredCases = disputeCases.filter((c: any) => {
    let matchesSearch = true;
    if (caseSearchQuery.trim()) {
      const q = caseSearchQuery.toLowerCase();
      matchesSearch =
        (c.case_number && c.case_number.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.summary && c.summary.toLowerCase().includes(q)) ||
        (c.parties && c.parties.toLowerCase().includes(q)) ||
        (c.assigned_officer && c.assigned_officer.toLowerCase().includes(q)) ||
        (c.date_submitted && c.date_submitted.toLowerCase().includes(q));
    }

    let matchesCategory = true;
    if (caseCategoryFilter !== 'all') {
      matchesCategory = (c.category || '').toLowerCase() === caseCategoryFilter.toLowerCase();
    }

    let matchesStage = true;
    if (caseStageFilter !== 'all') {
      matchesStage = (c.stage || '').toLowerCase() === caseStageFilter.toLowerCase();
    }

    let matchesStatus = true;
    if (caseStatusFilter !== 'all') {
      matchesStatus = (c.status || '').toLowerCase() === caseStatusFilter.toLowerCase();
    }

    return matchesSearch && matchesCategory && matchesStage && matchesStatus;
  }).sort((a: any, b: any) => {
    if (caseSortBy === 'date-desc') {
      return (new Date(b.created_at || b.date_submitted || 0).getTime() || 0) - (new Date(a.created_at || a.date_submitted || 0).getTime() || 0);
    } else if (caseSortBy === 'date-asc') {
      return (new Date(a.created_at || a.date_submitted || 0).getTime() || 0) - (new Date(b.created_at || b.date_submitted || 0).getTime() || 0);
    } else if (caseSortBy === 'code-asc') {
      return (a.case_number || a.id || '').localeCompare(b.case_number || b.id || '');
    } else if (caseSortBy === 'title-asc') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Dispute Case Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto transform transition-all">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-amber-500/10 via-slate-50 to-white border-b border-slate-200/90 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg md:text-xl flex items-center gap-2">
                    <span>{disputeCaseForm.id ? 'Modifier l\'affaire' : 'Créer une affaire de litige'}</span>
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5">Renseignez les détails du dossier, de la procédure et des parties</p>
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
            <form onSubmit={handleSaveDisputeCase}>
              <div className="p-8 space-y-6 max-h-[78vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">N° de Dossier / Référence</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: LIT-2026-001"
                      value={disputeCaseForm.case_number}
                      onChange={e => setDisputeCaseForm({ ...disputeCaseForm, case_number: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono shadow-2xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Intitulé de l'Affaire</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Contestation d'interprétation statutaire"
                      value={disputeCaseForm.title}
                      onChange={e => setDisputeCaseForm({ ...disputeCaseForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Catégorie</label>
                    <select
                      value={disputeCaseForm.category}
                      onChange={e => setDisputeCaseForm({ ...disputeCaseForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer shadow-2xs"
                    >
                      <option value="interne">Litiges Internes</option>
                      <option value="externe">Litiges Externes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Étape Procédurale</label>
                    <select
                      value={disputeCaseForm.stage}
                      onChange={e => setDisputeCaseForm({ ...disputeCaseForm, stage: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer shadow-2xs"
                    >
                      {stagesList.map((s, idx) => (
                        <option key={s.id || s.key || idx} value={s.key}>
                          {s.stepNumber ? `${s.stepNumber} : ` : ''}{s.title ? s.title.replace(/^Étape \d+\s*:\s*/i, '') : s.key}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Visibilité Publique / Confidentielle</label>
                    <select
                      value={disputeCaseForm.is_public ? 'true' : 'false'}
                      onChange={e => setDisputeCaseForm({ ...disputeCaseForm, is_public: e.target.value === 'true' })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer shadow-2xs"
                    >
                      <option value="true">Publique (Visible par tous)</option>
                      <option value="false">Non Publique (Confidentielle)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Statut Procédural</label>
                    <select
                      value={disputeCaseForm.status}
                      onChange={e => setDisputeCaseForm({ ...disputeCaseForm, status: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer shadow-2xs"
                    >
                      <option value="En cours">En cours</option>
                      <option value="En instruction">En instruction</option>
                      <option value="Accord Homologué">Accord Homologué</option>
                      <option value="Sentence Arbitrale">Sentence Arbitrale</option>
                      <option value="Clôturé">Clôturé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Parties impliquées</label>
                    <input
                      type="text"
                      placeholder="ex: Partie A c/ Partie B"
                      value={disputeCaseForm.parties}
                      onChange={e => setDisputeCaseForm({ ...disputeCaseForm, parties: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Officiel Assigné</label>
                    <input
                      type="text"
                      placeholder="ex: Maître Hélène de Saint-Maur"
                      value={disputeCaseForm.assigned_officer}
                      onChange={e => setDisputeCaseForm({ ...disputeCaseForm, assigned_officer: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Synthèse / Résumé du Litige</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Description succincte des faits et prétentions..."
                    value={disputeCaseForm.summary}
                    onChange={e => setDisputeCaseForm({ ...disputeCaseForm, summary: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Notice de Confidentialité (Pour affaires non publiques)</label>
                  <input
                    type="text"
                    placeholder="Notice affichée si l'affaire est confidentielle..."
                    value={disputeCaseForm.confidentiality_note}
                    onChange={e => setDisputeCaseForm({ ...disputeCaseForm, confidentiality_note: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/25 hover:shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer le Dossier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filtering Bar for Cases */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par N° de dossier (code), intitulé, résumé, parties, officiel..."
              value={caseSearchQuery}
              onChange={e => setCaseSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            {caseSearchQuery && (
              <button
                onClick={() => setCaseSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter by Category */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <select
              value={caseCategoryFilter}
              onChange={e => setCaseCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">Toutes catégories (Internes & Externes)</option>
              <option value="interne">Litiges Internes</option>
              <option value="externe">Litiges Externes</option>
            </select>
          </div>

          {/* Filter by Status */}
          <select
            value={caseStatusFilter}
            onChange={e => setCaseStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="En cours">En cours</option>
            <option value="En instruction">En instruction</option>
            <option value="Accord Homologué">Accord Homologué</option>
            <option value="Sentence Arbitrale">Sentence Arbitrale</option>
            <option value="Clôturé">Clôturé</option>
          </select>

          {/* Sorting Select */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <select
              value={caseSortBy}
              onChange={e => setCaseSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
            >
              <option value="date-desc">Tri : Récent en premier</option>
              <option value="date-asc">Tri : Ancien en premier</option>
              <option value="code-asc">Tri : N° Dossier (Code)</option>
              <option value="title-asc">Tri : Intitulé (A → Z)</option>
            </select>
          </div>
        </div>

        {/* Active filter counter line */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
          <span>Affichage de <strong className="text-amber-700">{filteredCases.length}</strong> sur <strong>{disputeCases.length}</strong> affaires enregistrées</span>
          {(caseSearchQuery || caseCategoryFilter !== 'all' || caseStatusFilter !== 'all') && (
            <button
              onClick={() => {
                setCaseSearchQuery('');
                setCaseCategoryFilter('all');
                setCaseStatusFilter('all');
              }}
              className="text-amber-700 hover:underline cursor-pointer font-medium"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Cases Cards List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-sm">
            Aucune affaire ne correspond à vos critères de recherche.
          </div>
        ) : (
          filteredCases.map((c: any) => {
            const isPub = c.is_public === true || c.is_public === 1 || c.isPublic === true;
            const codeDisplay = c.case_number || c.caseNumber || c.id;
            const dateDisplay = c.date_submitted || c.dateSubmitted || (c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '29 Septembre 2026');

            return (
              <div key={c.id} className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:shadow-md transition-all">
                <div className="space-y-2 flex-1">
                  {/* Header badges row with Code and Registration Date */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Code N° Dossier Badge */}
                    <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-700" />
                      <span>N° {codeDisplay}</span>
                    </span>

                    {/* Registration Date Badge */}
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Enregistré le {dateDisplay}</span>
                    </span>

                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {c.category} • {c.stage}
                    </span>

                    {isPub ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Publique
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Confidentielle
                      </span>
                    )}

                    <span className="text-xs font-bold text-amber-700 bg-amber-50/80 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                      {c.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-serif font-bold text-slate-900 text-lg">{c.title}</h4>

                  {/* Parties & Officer */}
                  {(c.parties || c.assigned_officer) && (
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                      {c.parties && <span><strong>Parties :</strong> {c.parties}</span>}
                      {c.assigned_officer && <span><strong>Officiel assigné :</strong> {c.assigned_officer}</span>}
                    </div>
                  )}

                  {/* Summary */}
                  <p className="text-xs text-slate-600 line-clamp-2">{c.summary}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => {
                      setDisputeCaseForm({
                        id: c.id,
                        case_number: c.case_number || c.caseNumber || '',
                        title: c.title,
                        category: c.category,
                        stage: c.stage,
                        is_public: isPub,
                        status: c.status,
                        date_submitted: c.date_submitted || c.dateSubmitted || '',
                        summary: c.summary,
                        parties: c.parties || '',
                        assigned_officer: c.assigned_officer || c.assignedOfficer || '',
                        confidentiality_note: c.confidentiality_note || c.confidentialityNote || '',
                        resolution_timeframe: c.resolution_timeframe || c.resolutionTimeframe || '30 jours'
                      });
                      setIsEditing(true);
                    }}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDisputeCase(c.id, c.case_number || c.title)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
