import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Users, FolderGit2, Calendar, ArrowRight } from 'lucide-react';
import { NavTab, Article, Member, Project, Activity } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  articles?: Article[];
  members?: Member[];
  projects?: Project[];
  activities?: Activity[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  articles = [],
  members = [],
  projects = [],
  activities = []
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const matchedArticles = query
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.summary.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedMembers = query
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.role.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedProjects = query
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedActivities = query
    ? activities.filter(
        (act) =>
          act.title.toLowerCase().includes(query.toLowerCase()) ||
          act.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const totalResults =
    matchedArticles.length +
    matchedMembers.length +
    matchedProjects.length +
    matchedActivities.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-[#c5c6ce] flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e2e2e2] flex items-center gap-3 bg-[#f9f9f9] relative">
          <Search className="w-5 h-5 text-[#C5A059] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article, un membre, un litige, une activité..."
            className="w-full text-base bg-transparent border-none outline-none text-[#031632] placeholder-slate-400 font-sans"
          />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!query.trim() && (
            <div className="text-center py-8 text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Saisissez un terme de recherche ci-dessus.</p>
            </div>
          )}

          {query.trim() && totalResults === 0 && (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm font-semibold">Aucun résultat trouvé pour "{query}"</p>
              <p className="text-xs mt-1">Vérifiez l'orthographe ou tentez un autre mot-clé.</p>
            </div>
          )}

          {/* Articles */}
          {matchedArticles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-3">
                <BookOpen className="w-4 h-4" />
                <span>Publications &amp; Blog ({matchedArticles.length})</span>
              </div>
              <div className="space-y-2">
                {matchedArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onNavigate('blog');
                      onClose();
                    }}
                    className="p-3 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#031632] group-hover:text-[#C5A059] transition-colors">
                        {art.title}
                      </div>
                      <div className="text-[11px] text-[#75777e] line-clamp-1">{art.summary}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          {matchedMembers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-3">
                <Users className="w-4 h-4" />
                <span>Membres &amp; Intervenants ({matchedMembers.length})</span>
              </div>
              <div className="space-y-2">
                {matchedMembers.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onNavigate('members');
                      onClose();
                    }}
                    className="p-3 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#031632] group-hover:text-[#C5A059] transition-colors">
                        {m.name}
                      </div>
                      <div className="text-[11px] text-[#75777e]">{m.role} • {m.organization}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects / Litiges */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-3">
                <FolderGit2 className="w-4 h-4" />
                <span>Projets &amp; Litiges ({matchedProjects.length})</span>
              </div>
              <div className="space-y-2">
                {matchedProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onNavigate('projects');
                      onClose();
                    }}
                    className="p-3 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#031632] group-hover:text-[#C5A059] transition-colors">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-[#75777e] line-clamp-1">{p.shortDescription}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {matchedActivities.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-3">
                <Calendar className="w-4 h-4" />
                <span>Activités &amp; Agenda ({matchedActivities.length})</span>
              </div>
              <div className="space-y-2">
                {matchedActivities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => {
                      onNavigate('activities');
                      onClose();
                    }}
                    className="p-3 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#031632] group-hover:text-[#C5A059] transition-colors">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-[#75777e]">{act.date} • {act.location}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
