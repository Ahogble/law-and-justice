import React from 'react';
import { Plus, X, Save, Edit, Trash2, FolderTree, Search, Tag } from 'lucide-react';

export default function MembersManager({
  memberSubTab,
  members,
  categoriesList,
  memberForm,
  setMemberForm,
  isEditing,
  setIsEditing,
  handleSaveMember,
  handleDeleteMember,
  newCatName,
  setNewCatName,
  newCatNameEn,
  setNewCatNameEn,
  handleAddCategory,
  handleDeleteCategory,
  subcategorySearchQuery,
  setSubcategorySearchQuery,
  filteredSubcategoriesList,
  handleAddSubcategory,
  handleDeleteSubcategory,
  subcatInputs,
  setSubcatInputs
}: {
  memberSubTab: string;
  members: any[];
  categoriesList: any[];
  memberForm: any;
  setMemberForm: (val: any) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  handleSaveMember: (e: React.FormEvent) => void;
  handleDeleteMember: (id: string | number) => void;
  newCatName: string;
  setNewCatName: (val: string) => void;
  newCatNameEn: string;
  setNewCatNameEn: (val: string) => void;
  handleAddCategory: (e: React.FormEvent) => void;
  handleDeleteCategory: (id: string | number) => void;
  subcategorySearchQuery: string;
  setSubcategorySearchQuery: (val: string) => void;
  filteredSubcategoriesList: any[];
  handleAddSubcategory: (catId: string | number, e: React.FormEvent) => void;
  handleDeleteSubcategory: (catId: string | number, subId: string | number) => void;
  subcatInputs: any;
  setSubcatInputs: (val: any) => void;
}) {
  return (
    <>
      {memberSubTab === 'list' && (
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">Gestion des Membres</h2>
              <p className="text-xs text-slate-500">Gérez les fiches des dirigeants et membres titulaires.</p>
            </div>
            <button
              onClick={() => {
                const firstCat = categoriesList[0];
                setMemberForm({ id: '', name: '', role: '', organization: '', category: firstCat?.name || "Conseil d'Administration", subcategory: firstCat?.subcategories[0]?.name || '', bio: '', email: '' });
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Membre</span>
            </button>
          </div>

          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <h3 className="font-semibold text-amber-700 text-lg">
                    {memberForm.id ? 'Modifier le membre' : 'Ajouter un membre'}
                  </h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSaveMember} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nom complet</label>
                      <input
                        type="text"
                        required
                        value={memberForm.name}
                        onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle / Titre</label>
                      <input
                        type="text"
                        required
                        value={memberForm.role}
                        onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Organisation / Institution</label>
                      <input
                        type="text"
                        value={memberForm.organization}
                        onChange={e => setMemberForm({ ...memberForm, organization: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie Principale</label>
                      <select
                        value={memberForm.category}
                        onChange={e => {
                          const selectedCatName = e.target.value;
                          const foundCat = categoriesList.find(c => c.name === selectedCatName);
                          setMemberForm({
                            ...memberForm,
                            category: selectedCatName,
                            subcategory: foundCat?.subcategories[0]?.name || ''
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                      >
                        {categoriesList.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Sous-catégorie</label>
                      <select
                        value={memberForm.subcategory || ''}
                        onChange={e => setMemberForm({ ...memberForm, subcategory: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                      >
                        <option value="">-- Aucune --</option>
                        {(categoriesList.find(c => c.name === memberForm.category)?.subcategories || []).map((sub: any) => (
                          <option key={sub.id} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Biographie</label>
                    <textarea
                      rows={4}
                      value={memberForm.bio}
                      onChange={e => setMemberForm({ ...memberForm, bio: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-6">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                      Annuler
                    </button>
                    <button type="submit" className="px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-colors cursor-pointer">
                      <Save className="w-4 h-4" /> Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((mem: any) => (
              <div key={mem.id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    {mem.category} {mem.subcategory ? `• ${mem.subcategory}` : ''}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base">{mem.name}</h4>
                  <p className="text-xs text-slate-600">{mem.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setMemberForm(mem); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-200/60 rounded-lg"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteMember(mem.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {memberSubTab === 'categories' && (
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">Catégories de Membres</h2>
              <p className="text-xs text-slate-500">Configurez les catégories principales (ex: Conseil d'Administration).</p>
            </div>
          </div>

          {/* Add New Category Form */}
          <form onSubmit={handleAddCategory} className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-8 space-y-4 shadow-xs">
            <h3 className="font-semibold text-amber-700 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Ajouter une Catégorie Principale
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom (Français)</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Conseil d'Administration"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom (Anglais)</label>
                <input
                  type="text"
                  placeholder="ex: Board of Directors"
                  value={newCatNameEn}
                  onChange={e => setNewCatNameEn(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" /> Créer la Catégorie
              </button>
            </div>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-4">
            {categoriesList.map(cat => (
              <div key={cat.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <FolderTree className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{cat.name}</h4>
                    <p className="text-xs text-slate-500">Anglais : {cat.nameEn || cat.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Supprimer la catégorie"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {memberSubTab === 'subcategories' && (
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">Sous-catégories de Membres</h2>
              <p className="text-xs text-slate-500">Gérez les sous-catégories attachées à chaque catégorie principale.</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher une sous-catégorie ou catégorie..."
                value={subcategorySearchQuery}
                onChange={(e) => setSubcategorySearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredSubcategoriesList.length === 0 ? (
              <div className="text-center py-10 bg-white border border-slate-200 rounded-xl">
                <p className="text-slate-500 text-sm">Aucun résultat trouvé pour "{subcategorySearchQuery}".</p>
              </div>
            ) : (
              filteredSubcategoriesList.map(cat => (
              <div key={cat.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-2">
                   <FolderTree className="w-4 h-4 text-amber-600" />
                   <h3 className="font-bold text-slate-900">{cat.name}</h3>
                </div>

                <div>
                  {cat.subcategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cat.subcategories.map((sub: any) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-800 text-xs px-3 py-1.5 rounded-lg shadow-2xs"
                        >
                          <Tag className="w-3 h-3 text-amber-600" />
                          <span className="font-semibold">{sub.name}</span>
                          <span className="text-[10px] text-slate-500">({sub.nameEn || sub.name})</span>
                          <button
                            onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1 font-bold"
                            title="Supprimer la sous-catégorie"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic mb-4">Aucune sous-catégorie configurée pour cette catégorie.</p>
                  )}

                  <form
                    onSubmit={e => handleAddSubcategory(cat.id, e)}
                    className="flex flex-col sm:flex-row items-center gap-2 bg-white p-3 rounded-lg border border-slate-200"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Nom (FR) ex: National"
                      value={subcatInputs[cat.id]?.name || ''}
                      onChange={e => setSubcatInputs({
                        ...subcatInputs,
                        [cat.id]: { ...(subcatInputs[cat.id] || { nameEn: '' }), name: e.target.value }
                      })}
                      className="w-full sm:w-48 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Nom (EN) ex: National"
                      value={subcatInputs[cat.id]?.nameEn || ''}
                      onChange={e => setSubcatInputs({
                        ...subcatInputs,
                        [cat.id]: { ...(subcatInputs[cat.id] || { name: '' }), nameEn: e.target.value }
                      })}
                      className="w-full sm:w-48 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300/60 rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ml-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter sous-catégorie</span>
                    </button>
                  </form>
                </div>
              </div>
            )))}
          </div>
        </div>
      )}
    </>
  );
}
