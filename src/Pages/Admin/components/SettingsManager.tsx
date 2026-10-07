import React from 'react';
import { Globe, FileText, Users, Save } from 'lucide-react';

export default function SettingsManager({
  siteSettings,
  setSiteSettings,
  handleSaveSettings
}: {
  siteSettings: any;
  setSiteSettings: any;
  handleSaveSettings: any;
}) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-slate-200">
        <h2 className="text-xl font-serif font-bold text-slate-900">Éditer les Textes des Pages Publiques</h2>
        <p className="text-xs text-slate-500">Modifiez instantanément le titre principal, les présentations et les coordonnées du site.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2">
            <Globe className="w-4 h-4" /> Page d'Accueil (Section Héro)
          </h3>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titre principal (Hero Title)</label>
            <input
              type="text"
              value={siteSettings.hero_title}
              onChange={e => setSiteSettings({ ...siteSettings, hero_title: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sous-titre explicatif (Hero Subtitle)</label>
            <textarea
              rows={2}
              value={siteSettings.hero_subtitle}
              onChange={e => setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Section À Propos & Mission
          </h3>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Texte de Présentation de l'Association</label>
            <textarea
              rows={3}
              value={siteSettings.about_mission}
              onChange={e => setSiteSettings({ ...siteSettings, about_mission: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2">
            <Users className="w-4 h-4" /> Coordonnées de Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Officiel</label>
              <input
                type="text"
                value={siteSettings.contact_email}
                onChange={e => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={siteSettings.contact_phone}
                onChange={e => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Siège</label>
              <input
                type="text"
                value={siteSettings.contact_address}
                onChange={e => setSiteSettings({ ...siteSettings, contact_address: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-5 h-5" /> Enregistrer les Textes du Site
          </button>
        </div>
      </form>
    </div>
  );
}
