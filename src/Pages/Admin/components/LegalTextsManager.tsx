import React from 'react';
import { Plus, Save, Edit, Trash2 } from 'lucide-react';

interface LegalTextsManagerProps {
  legalTexts: any[];
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  legalTextForm: any;
  setLegalTextForm: (val: any) => void;
  handleSaveLegalText: (e: React.FormEvent) => void;
  handleDeleteLegalText: (id: string) => void;
}

export const LegalTextsManager: React.FC<LegalTextsManagerProps> = ({
  legalTexts,
  isEditing,
  setIsEditing,
  legalTextForm,
  setLegalTextForm,
  handleSaveLegalText,
  handleDeleteLegalText
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Textes Juridiques</h2>
          <p className="text-xs text-slate-500">Gérez la revue de doctrine et la bibliothèque juridique.</p>
        </div>
        <button
          onClick={() => {
            setLegalTextForm({ id: '', title: '', titleEn: '', subtitle: '', subtitleEn: '', reference: '', referenceEn: '', category: 'Texte Officiel', date: '', dateEn: '', summary: '', sections: [] });
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Texte</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSaveLegalText} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-xs">
          <h3 className="font-semibold text-amber-700 text-sm mb-2">{legalTextForm.id ? 'Modifier le texte' : 'Ajouter un texte'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre (FR)</label>
                <input type="text" required value={legalTextForm.title || ''} onChange={e => setLegalTextForm({ ...legalTextForm, title: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre (EN)</label>
                <input type="text" value={legalTextForm.titleEn || ''} onChange={e => setLegalTextForm({ ...legalTextForm, titleEn: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sous-titre (FR)</label>
                <input type="text" value={legalTextForm.subtitle || ''} onChange={e => setLegalTextForm({ ...legalTextForm, subtitle: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sous-titre (EN)</label>
                <input type="text" value={legalTextForm.subtitleEn || ''} onChange={e => setLegalTextForm({ ...legalTextForm, subtitleEn: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Référence / ISSN (FR)</label>
                <input type="text" value={legalTextForm.reference || ''} onChange={e => setLegalTextForm({ ...legalTextForm, reference: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Référence (EN)</label>
                <input type="text" value={legalTextForm.referenceEn || ''} onChange={e => setLegalTextForm({ ...legalTextForm, referenceEn: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date (FR)</label>
                <input type="text" value={legalTextForm.date || ''} onChange={e => setLegalTextForm({ ...legalTextForm, date: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date (EN)</label>
                <input type="text" value={legalTextForm.dateEn || ''} onChange={e => setLegalTextForm({ ...legalTextForm, dateEn: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
              <select value={legalTextForm.category || 'Texte Officiel'} onChange={e => setLegalTextForm({ ...legalTextForm, category: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900">
                <option value="Texte Officiel">Texte Officiel</option>
                <option value="Doctrine">Doctrine</option>
                <option value="Jurisprudence">Jurisprudence</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Résumé / Description courte</label>
              <textarea rows={2} required value={legalTextForm.summary || ''} onChange={e => setLegalTextForm({ ...legalTextForm, summary: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sections / Articles (Format JSON pour les textes complexes)</label>
              <p className="text-[10px] text-slate-500 mb-1">{"Renseignez ce champ avec un tableau JSON de type : `[ { title, titleEn, articles: [ { num, title, titleEn, content, contentEn } ] } ]`. Laissez vide ou formellement vide pour les textes simples."}</p>
              <textarea rows={8} value={typeof legalTextForm.sections === 'string' ? legalTextForm.sections : JSON.stringify(legalTextForm.sections || [], null, 2)} onChange={e => {
                let val = e.target.value;
                setLegalTextForm({ ...legalTextForm, sections: val });
              }} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800" placeholder="[{ ... }]" />
            </div>
            <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"><Save className="w-4 h-4" /> Enregistrer</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {legalTexts.map((lt: any) => (
          <div key={lt.id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1 w-full max-w-xl">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900">{lt.title}</h4>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-full">{lt.category} • {lt.reference}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{lt.summary}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button onClick={() => { setLegalTextForm(lt); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer transition-colors"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteLegalText(lt.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
