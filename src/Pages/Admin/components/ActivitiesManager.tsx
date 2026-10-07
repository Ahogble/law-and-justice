import React from 'react';
import { Plus, Save, Edit, Trash2 } from 'lucide-react';

interface ActivitiesManagerProps {
  activities: any[];
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  activityForm: any;
  setActivityForm: (val: any) => void;
  handleSaveActivity: (e: React.FormEvent) => void;
  handleDeleteActivity: (id: string) => void;
}

export const ActivitiesManager: React.FC<ActivitiesManagerProps> = ({
  activities,
  isEditing,
  setIsEditing,
  activityForm,
  setActivityForm,
  handleSaveActivity,
  handleDeleteActivity
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Activités & Agenda</h2>
          <p className="text-xs text-slate-500">Gérez les colloques, webinaires et événements.</p>
        </div>
        <button
          onClick={() => {
            setActivityForm({ id: '', title: '', type: 'Colloque', status: 'À venir', date: '', location: '', description: '' });
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Activité</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSaveActivity} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-xs">
          <h3 className="font-semibold text-amber-700 text-sm mb-2">{activityForm.id ? 'Modifier l\'activité' : 'Ajouter une activité'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Titre</label>
              <input type="text" required value={activityForm.title} onChange={e => setActivityForm({ ...activityForm, title: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
              <select value={activityForm.type} onChange={e => setActivityForm({ ...activityForm, type: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900">
                <option value="Colloque">Colloque</option>
                <option value="Webinaire">Webinaire</option>
                <option value="Table Ronde">Table Ronde</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea rows={3} required value={activityForm.description} onChange={e => setActivityForm({ ...activityForm, description: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"><Save className="w-4 h-4" /> Enregistrer</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {activities.map((act: any) => (
          <div key={act.id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1 w-full max-w-xl">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900">{act.title}</h4>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-full">{act.type}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{act.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button onClick={() => { setActivityForm(act); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer transition-colors"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteActivity(act.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
