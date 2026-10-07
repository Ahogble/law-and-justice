import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Globe } from 'lucide-react';

export default function ArticlesManager({
  articles,
  isEditing,
  setIsEditing,
  articleForm,
  setArticleForm,
  handleSaveArticle,
  handleDeleteArticle,
  articleSubTab,
  articleCategories,
  newArticleCatName,
  setNewArticleCatName,
  newArticleCatNameEn,
  setNewArticleCatNameEn,
  handleAddArticleCategory,
  handleDeleteArticleCategory
}: {
  articles: any[];
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  articleForm: any;
  setArticleForm: (val: any) => void;
  handleSaveArticle: (e: React.FormEvent) => void;
  handleDeleteArticle: (id: string | number) => void;
  articleSubTab: 'list' | 'categories';
  articleCategories: any[];
  newArticleCatName: string;
  setNewArticleCatName: (v: string) => void;
  newArticleCatNameEn: string;
  setNewArticleCatNameEn: (v: string) => void;
  handleAddArticleCategory: (e: React.FormEvent) => void;
  handleDeleteArticleCategory: (id: string) => void;
}) {
  const [activeLangTab, setActiveLangTab] = useState<'fr'|'en'>('fr');

  if (articleSubTab === 'categories') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900">Catégories d'Articles</h2>
            <p className="text-xs text-slate-500">Gérez les catégories disponibles pour les articles du blog.</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 shadow-xs">
          <h3 className="font-semibold text-amber-700 text-sm mb-4">Ajouter une nouvelle catégorie</h3>
          <form onSubmit={handleAddArticleCategory} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nom (Français)</label>
              <input
                type="text"
                required
                value={newArticleCatName}
                onChange={e => setNewArticleCatName(e.target.value)}
                placeholder="Ex: Doctrine"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nom (Anglais)</label>
              <input
                type="text"
                value={newArticleCatNameEn}
                onChange={e => setNewArticleCatNameEn(e.target.value)}
                placeholder="Ex: Doctrine"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 h-[38px] bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {articleCategories.map((cat: any) => (
            <div key={cat.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs group hover:border-amber-200 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900">{cat.name}</h4>
                {cat.nameEn && <p className="text-xs text-slate-500 mt-0.5">EN: {cat.nameEn}</p>}
              </div>
              <button
                onClick={() => handleDeleteArticleCategory(cat.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Supprimer la catégorie"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {articleCategories.length === 0 && (
            <p className="text-sm text-slate-500 italic text-center py-8">Aucune catégorie n'a été créée.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Articles & Publications</h2>
          <p className="text-xs text-slate-500">Gérez les articles de doctrine et les actualités publiées.</p>
        </div>
        <button
          onClick={() => {
            setArticleForm({ id: '', title: '', title_en: '', category: 'Doctrine', excerpt: '', excerpt_en: '', content: '', content_en: '', author_name: 'Hélène de Saint-Maur', author_role: 'Avocate', read_time: '5 min' });
            setActiveLangTab('fr');
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel Article</span>
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-amber-700 text-lg">
                {articleForm.id ? 'Modifier l\'article' : 'Créer un nouvel article'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveArticle} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 mr-2">Langue de rédaction :</span>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('fr')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                    activeLangTab === 'fr' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  🇫🇷 Français
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                    activeLangTab === 'en' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  🇬🇧 Anglais
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Titre ({activeLangTab === 'fr' ? 'FR' : 'EN'})
                  </label>
                  <input
                    type="text"
                    required={activeLangTab === 'fr'}
                    value={activeLangTab === 'fr' ? articleForm.title : (articleForm.title_en || '')}
                    onChange={e => {
                      if (activeLangTab === 'fr') setArticleForm({ ...articleForm, title: e.target.value });
                      else setArticleForm({ ...articleForm, title_en: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={articleForm.category}
                    onChange={e => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    {articleCategories.map((cat: any) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    {articleCategories.length === 0 && (
                      <option value="Doctrine">Doctrine</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Résumé ({activeLangTab === 'fr' ? 'FR' : 'EN'})
                </label>
                <textarea
                  required={activeLangTab === 'fr'}
                  rows={2}
                  value={activeLangTab === 'fr' ? articleForm.excerpt : (articleForm.excerpt_en || '')}
                  onChange={e => {
                    if (activeLangTab === 'fr') setArticleForm({ ...articleForm, excerpt: e.target.value });
                    else setArticleForm({ ...articleForm, excerpt_en: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contenu complet ({activeLangTab === 'fr' ? 'FR' : 'EN'})
                </label>
                <textarea
                  required={activeLangTab === 'fr'}
                  rows={6}
                  value={activeLangTab === 'fr' ? articleForm.content : (articleForm.content_en || '')}
                  onChange={e => {
                    if (activeLangTab === 'fr') setArticleForm({ ...articleForm, content: e.target.value });
                    else setArticleForm({ ...articleForm, content_en: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Auteur</label>
                  <input
                    type="text"
                    value={articleForm.author_name}
                    onChange={e => setArticleForm({ ...articleForm, author_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Temps de lecture</label>
                  <input
                    type="text"
                    value={articleForm.read_time}
                    onChange={e => setArticleForm({ ...articleForm, read_time: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-5 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {articles.map((art: any) => (
          <div key={art.id} className="p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{art.category}</span>
                <span className="text-xs text-slate-500">{art.published_at}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">{art.title}</h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{art.excerpt}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setArticleForm(art);
                  setActiveLangTab('fr');
                  setIsEditing(true);
                }}
                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                title="Modifier"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteArticle(art.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
