import React from 'react';
import { Plus, Save, Edit, Trash2, CheckCircle, Activity, Briefcase } from 'lucide-react';

interface ProjectsManagerProps {
  projects: any[];
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  projectForm: any;
  setProjectForm: (val: any) => void;
  handleSaveProject: (e: React.FormEvent) => void;
  handleDeleteProject: (id: string) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  isEditing,
  setIsEditing,
  projectForm,
  setProjectForm,
  handleSaveProject,
  handleDeleteProject
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Projets & Groupes de Travail</h2>
          <p className="text-xs text-slate-500">Gérez les réformes et projets en cours.</p>
        </div>
        <button
          onClick={() => {
            setProjectForm({ id: '', title: '', category: 'Réforme', status: 'En cours', description: '', lead: '', progress: 50 });
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Projet</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSaveProject} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-xs">
          <h3 className="font-semibold text-amber-700 text-sm mb-2">{projectForm.id ? 'Modifier le projet' : 'Ajouter un projet'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Titre</label>
              <input type="text" required value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Statut</label>
              <select value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900">
                <option value="En cours">En cours</option>
                <option value="Publié">Publié</option>
                <option value="Consultation">Consultation</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea rows={3} required value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900" />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"><Save className="w-4 h-4" /> Enregistrer</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {projects.map((proj: any) => (
          <div key={proj.id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1 w-full max-w-xl">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900">{proj.title}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  proj.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                  proj.status === 'Publié' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {proj.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{proj.description}</p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button onClick={() => { setProjectForm(proj); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer transition-colors"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteProject(proj.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
