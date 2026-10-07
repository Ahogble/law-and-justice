import React from 'react';
import { UserPlus, Search, Filter, SlidersHorizontal, CheckCircle2, X, Save, Edit, Trash2, ArrowRight, Upload } from 'lucide-react';

interface DisputeOfficersManagerProps {
  disputeOfficers: any[];
  stagesList: any[];
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  officerSearchQuery: string;
  setOfficerSearchQuery: (val: string) => void;
  officerRoleFilter: string;
  setOfficerRoleFilter: (val: string) => void;
  officerAvailabilityFilter: string;
  setOfficerAvailabilityFilter: (val: string) => void;
  officerSortBy: string;
  setOfficerSortBy: (val: string) => void;
  successMessage: string | null;
  setSuccessMessage: (val: string | null) => void;
  disputeOfficerForm: any;
  setDisputeOfficerForm: (val: any) => void;
  handleSaveDisputeOfficer: (e: React.FormEvent) => void;
  handleDeleteDisputeOfficer: (id: string, name: string) => void;
  officerAvatarInputRef: React.RefObject<HTMLInputElement>;
  handleOfficerAvatarFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DisputeOfficersManager: React.FC<DisputeOfficersManagerProps> = ({
  disputeOfficers,
  stagesList,
  isEditing,
  setIsEditing,
  officerSearchQuery,
  setOfficerSearchQuery,
  officerRoleFilter,
  setOfficerRoleFilter,
  officerAvailabilityFilter,
  setOfficerAvailabilityFilter,
  officerSortBy,
  setOfficerSortBy,
  successMessage,
  setSuccessMessage,
  disputeOfficerForm,
  setDisputeOfficerForm,
  handleSaveDisputeOfficer,
  handleDeleteDisputeOfficer,
  officerAvatarInputRef,
  handleOfficerAvatarFileUpload
}) => {
  const filteredOfficers = disputeOfficers.filter((off: any) => {
    let matchesSearch = true;
    if (officerSearchQuery.trim()) {
      const q = officerSearchQuery.toLowerCase();
      const specs = Array.isArray(off.specialties)
        ? off.specialties.join(' ').toLowerCase()
        : (off.specialties || '').toLowerCase();
      matchesSearch =
        (off.name && off.name.toLowerCase().includes(q)) ||
        (off.title && off.title.toLowerCase().includes(q)) ||
        (off.role && off.role.toLowerCase().includes(q)) ||
        (off.email && off.email.toLowerCase().includes(q)) ||
        specs.includes(q);
    }

    let matchesRole = true;
    if (officerRoleFilter !== 'all') {
      const r = officerRoleFilter.toLowerCase();
      const offRole = (off.role || '').toLowerCase();
      const offTitle = (off.title || '').toLowerCase();
      matchesRole = offRole.includes(r) || offTitle.includes(r);
    }

    let matchesAvailability = true;
    if (officerAvailabilityFilter !== 'all') {
      matchesAvailability = (off.availability || 'Disponible') === officerAvailabilityFilter;
    }

    return matchesSearch && matchesRole && matchesAvailability;
  }).sort((a: any, b: any) => {
    if (officerSortBy === 'name-asc') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (officerSortBy === 'name-desc') {
      return (b.name || '').localeCompare(a.name || '');
    } else if (officerSortBy === 'experience') {
      return (b.experience_years ?? b.experienceYears ?? 0) - (a.experience_years ?? a.experienceYears ?? 0);
    } else if (officerSortBy === 'cases') {
      return (b.cases_handled ?? b.casesHandled ?? 0) - (a.cases_handled ?? a.casesHandled ?? 0);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Success Confirmation Alert Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-white text-xs cursor-pointer font-bold px-2 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30"
          >
            ✕ Fermer
          </button>
        </div>
      )}

      {/* Filtering & Sorting Controls Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, rôle, email, spécialités..."
              value={officerSearchQuery}
              onChange={e => setOfficerSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            {officerSearchQuery && (
              <button
                onClick={() => setOfficerSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter by Role */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <select
              value={officerRoleFilter}
              onChange={e => setOfficerRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">Tous les rôles (Conciliateur, Médiateur, Arbitre)</option>
              <option value="Conciliateur">Conciliateurs</option>
              <option value="Médiateur">Médiateurs</option>
              <option value="Arbitre">Arbitres</option>
            </select>
          </div>

          {/* Filter by Availability */}
          <select
            value={officerAvailabilityFilter}
            onChange={e => setOfficerAvailabilityFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Toutes disponibilités</option>
            <option value="Disponible">Disponible</option>
            <option value="Sur RDV">Sur RDV</option>
            <option value="En audience">En audience</option>
            <option value="En mission">En mission</option>
            <option value="Indisponible">Indisponible</option>
          </select>

          {/* Sorting Select */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <select
              value={officerSortBy}
              onChange={e => setOfficerSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
            >
              <option value="name-asc">Tri : Nom (A → Z)</option>
              <option value="name-desc">Tri : Nom (Z → A)</option>
              <option value="experience">Tri : Expérience (+ élevée)</option>
              <option value="cases">Tri : Affaires traitées (+ élevé)</option>
            </select>
          </div>
        </div>

        {/* Active filter counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
          <span>Affichage de <strong className="text-amber-700">{filteredOfficers.length}</strong> sur <strong>{disputeOfficers.length}</strong> intervenants enregistrés</span>
          {(officerSearchQuery || officerRoleFilter !== 'all' || officerAvailabilityFilter !== 'all') && (
            <button
              onClick={() => {
                setOfficerSearchQuery('');
                setOfficerRoleFilter('all');
                setOfficerAvailabilityFilter('all');
              }}
              className="text-amber-700 hover:underline cursor-pointer font-medium"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Registration / Editing Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto transform transition-all">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-amber-500/10 via-slate-50 to-white border-b border-slate-200/90 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg md:text-xl flex items-center gap-2">
                    <span>{disputeOfficerForm.id ? 'Modifier l\'intervenant' : 'Enregistrer un Conciliateur / Médiateur / Arbitre'}</span>
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5">Renseignez les détails complets du profil de l'officiel neutre</p>
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
            <form onSubmit={handleSaveDisputeOfficer}>
              <div className="p-8 space-y-6 max-h-[78vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nom complet (ex: Me Gabriel Leroy)</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Me Gabriel Leroy"
                      value={disputeOfficerForm.name}
                      onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Intitulé du Titre / Badge Status (ex: CONCILIATEUR SENIOR)</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: CONCILIATEUR SENIOR"
                      value={disputeOfficerForm.title}
                      onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Fonction Principale</label>
                    <select
                      value={disputeOfficerForm.role}
                      onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, role: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer shadow-2xs"
                    >
                      <option value="Conciliateur">Conciliateur</option>
                      <option value="Médiateur">Médiateur</option>
                      <option value="Arbitre">Arbitre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Étape Procédurale</label>
                    <select
                      value={disputeOfficerForm.stage}
                      onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, stage: e.target.value })}
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
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Statut Disponibilité</label>
                    <select
                      value={disputeOfficerForm.availability}
                      onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, availability: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-emerald-700 font-bold focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer shadow-2xs"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Sur RDV">Sur RDV</option>
                      <option value="En audience">En audience</option>
                      <option value="En mission">En mission</option>
                      <option value="Indisponible">Indisponible</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Expérience (années)</label>
                    <input
                      type="number"
                      min="0"
                      value={disputeOfficerForm.experience_years}
                      onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, experience_years: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Dossiers traités (nombre)</label>
                    <input
                      type="number"
                      min="0"
                      value={disputeOfficerForm.cases_handled}
                      onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, cases_handled: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email professionnel</label>
                    <input
                      type="email"
                      placeholder="ex: g.leroy@droit-justice.asso.fr"
                      value={disputeOfficerForm.email}
                      onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Spécialités / Domaines d'intervention (séparés par virgules)</label>
                    <input
                      type="text"
                      placeholder="ex: Droit Associatif, Différends d'Honneur, Statuts & Gouvernance"
                      value={typeof disputeOfficerForm.specialties === 'string' ? disputeOfficerForm.specialties : (disputeOfficerForm.specialties || []).join(', ')}
                      onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, specialties: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Photo de Profil / Avatar</label>
                    <input
                      type="file"
                      ref={officerAvatarInputRef}
                      accept="image/*"
                      onChange={handleOfficerAvatarFileUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-300 shadow-2xs">
                      <img
                        src={disputeOfficerForm.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                        alt="Aperçu photo"
                        className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400 shadow-xs shrink-0"
                      />
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => officerAvatarInputRef.current?.click()}
                            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Choisir une photo...</span>
                          </button>
                          {disputeOfficerForm.avatar_url && (
                            <button
                              type="button"
                              onClick={() => setDisputeOfficerForm((prev: any) => ({ ...prev, avatar_url: '' }))}
                              className="px-3 py-2 bg-slate-200 hover:bg-rose-100 text-slate-600 hover:text-rose-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                            >
                              Réinitialiser
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Ou collez une URL d'image (https://...)"
                          value={disputeOfficerForm.avatar_url}
                          onChange={e => setDisputeOfficerForm({ ...disputeOfficerForm, avatar_url: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
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
                  <span>Enregistrer l'Intervenant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOfficers.map((off: any) => {
          const rawSpecs = off.specialties;
          const specList: string[] = Array.isArray(rawSpecs)
            ? rawSpecs
            : (typeof rawSpecs === 'string' && rawSpecs.trim().length > 0)
            ? rawSpecs.split(',')
            : ['Droit Associatif', 'Différends d\'Honneur', 'Statuts & Gouvernance'];

          return (
            <div
              key={off.id}
              className="bg-white text-slate-900 border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Profile Section */}
                <div className="flex items-start gap-4">
                  <img
                    src={off.avatar_url || off.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                    alt={off.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-amber-300/80 shadow-sm shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-0.5 rounded-md">
                        {off.title || 'CONCILIATEUR SENIOR'}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                        (off.availability || 'Disponible') === 'Disponible'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {off.availability || 'Disponible'}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-serif font-bold text-xl text-[#031632] leading-tight truncate">
                      {off.name}
                    </h3>

                    {/* Subtitle / Description */}
                    <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-2">
                      {off.role}
                    </p>
                  </div>
                </div>

                {/* Gray Box for Stats */}
                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3.5 my-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Expérience :</span>
                    <span className="font-bold text-[#031632]">
                      {off.experience_years ?? off.experienceYears ?? 18} ans de pratique
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Dossiers traités :</span>
                    <span className="font-bold text-[#031632]">
                      {off.cases_handled ?? off.casesHandled ?? 45} affaires
                    </span>
                  </div>
                </div>

                {/* Specialization Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {specList.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-200/60"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 truncate font-medium">
                  {off.email || 'g.leroy@droit-justice.asso.fr'}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setDisputeOfficerForm({
                        id: off.id,
                        name: off.name,
                        title: off.title,
                        role: off.role,
                        stage: off.stage,
                        category: off.category,
                        specialties: Array.isArray(off.specialties) ? off.specialties.join(', ') : (off.specialties || ''),
                        experience_years: off.experience_years ?? off.experienceYears ?? 10,
                        cases_handled: off.cases_handled ?? off.casesHandled ?? 0,
                        avatar_url: off.avatar_url || off.avatarUrl || '',
                        email: off.email || '',
                        availability: off.availability || 'Disponible'
                      });
                      setIsEditing(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteDisputeOfficer(off.id, off.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button className="bg-[#031632] hover:bg-[#0b2447] text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ml-1">
                    <span>Saisir cet officiel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
