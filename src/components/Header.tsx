import React, { useState, useEffect, useRef } from 'react';
import { Scale, Search, Menu, X, ChevronDown, Landmark, BookOpen } from 'lucide-react';
import { NavTab } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenJoin: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenJoin,
  onOpenSearch
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAssocOpen, setMobileAssocOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [assocMenuOpen, setAssocMenuOpen] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const assocButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (assocMenuOpen) {
        setAssocMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [assocMenuOpen]);

  const updateDropdownPosition = () => {
    if (assocButtonRef.current) {
      const rect = assocButtonRef.current.getBoundingClientRect();
      setDropdownCoords({
        left: rect.left,
        top: rect.bottom
      });
    }
  };

  const handleButtonMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    updateDropdownPosition();
    setAssocMenuOpen(true);
  };

  const handleButtonMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setAssocMenuOpen(false);
    }, 250);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setAssocMenuOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setAssocMenuOpen(false);
    }, 250);
  };

  const isAssocActive = activeTab === 'about' || activeTab === 'history' || activeTab === 'texts';

  return (
    <header
      id="main-header"
      className={`fixed top-0 w-full z-50 bg-[#FFFFFF] border-b border-[#c5c6ce] transition-all duration-300 ${
        scrolled ? 'shadow-md py-0' : 'shadow-sm'
      }`}
    >
      <div className="flex justify-between items-center h-20 px-5 md:px-16 max-w-[1280px] mx-auto">
        {/* Brand Logo */}
        <button
          id="header-brand-logo"
          onClick={() => {
            onTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-playfair text-2xl font-bold text-[#031632] flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <span className="flex items-center justify-center text-[#C5A059] transition-transform duration-300 group-hover:scale-105">
            <Scale className="w-6 h-6 stroke-[2.2]" />
          </span>
          <span className="tracking-tight">Droit &amp; Justice</span>
        </button>

        {/* Desktop Navigation */}
        <nav id="desktop-main-nav" className="hidden md:flex items-center gap-5 lg:gap-7">
          {/* Item 1: Accueil */}
          <button
            id="nav-link-home"
            onClick={() => {
              onTabChange('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[13px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer pb-1 ${
              activeTab === 'home'
                ? 'text-[#031632] border-b-2 border-[#C5A059]'
                : 'text-[#333333] hover:text-[#C5A059] border-b-2 border-transparent'
            }`}
          >
            {t('nav.home')}
          </button>

          {/* Item 2: Association with dropdown */}
          <button
            id="nav-link-about"
            ref={assocButtonRef}
            onClick={() => {
              updateDropdownPosition();
              setAssocMenuOpen((prev) => !prev);
            }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            aria-expanded={assocMenuOpen}
            aria-haspopup="true"
            className={`text-[13px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer pb-1 flex items-center gap-1 ${
              isAssocActive
                ? 'text-[#031632] border-b-2 border-[#C5A059]'
                : 'text-[#333333] hover:text-[#C5A059] border-b-2 border-transparent'
            }`}
          >
            <span>{t('nav.association')}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                assocMenuOpen ? 'rotate-180 text-[#C5A059]' : 'text-slate-400'
              }`}
            />
          </button>

          {/* Item 3: Activités */}
          <button
            id="nav-link-activities"
            onClick={() => {
              onTabChange('activities');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[13px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer pb-1 ${
              activeTab === 'activities'
                ? 'text-[#031632] border-b-2 border-[#C5A059]'
                : 'text-[#333333] hover:text-[#C5A059] border-b-2 border-transparent'
            }`}
          >
            {t('nav.activities')}
          </button>

          {/* Item 4: Litiges */}
          <button
            id="nav-link-projects"
            onClick={() => {
              onTabChange('projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[13px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer pb-1 ${
              activeTab === 'projects'
                ? 'text-[#031632] border-b-2 border-[#C5A059]'
                : 'text-[#333333] hover:text-[#C5A059] border-b-2 border-transparent'
            }`}
          >
            {t('nav.projects')}
          </button>

          {/* Item 5: Membres */}
          <button
            id="nav-link-members"
            onClick={() => {
              onTabChange('members');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[13px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer pb-1 ${
              activeTab === 'members'
                ? 'text-[#031632] border-b-2 border-[#C5A059]'
                : 'text-[#333333] hover:text-[#C5A059] border-b-2 border-transparent'
            }`}
          >
            {t('nav.members')}
          </button>

          {/* Item 6: Blog */}
          <button
            id="nav-link-blog"
            onClick={() => {
              onTabChange('blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[13px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer pb-1 ${
              activeTab === 'blog'
                ? 'text-[#031632] border-b-2 border-[#C5A059]'
                : 'text-[#333333] hover:text-[#C5A059] border-b-2 border-transparent'
            }`}
          >
            {t('nav.blog')}
          </button>

          {/* Item 7: Contact */}
          <button
            id="nav-link-contact"
            onClick={() => {
              onTabChange('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[13px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer pb-1 ${
              activeTab === 'contact'
                ? 'text-[#031632] border-b-2 border-[#C5A059]'
                : 'text-[#333333] hover:text-[#C5A059] border-b-2 border-transparent'
            }`}
          >
            {t('nav.contact')}
          </button>
        </nav>

        {/* Association Floating Dropdown Submenu */}
        {assocMenuOpen && (
          <div
            id="association-dropdown-menu"
            role="menu"
            aria-label="Sous-menu Association"
            style={{
              position: 'fixed',
              left: Math.max(16, dropdownCoords.left - 24),
              top: dropdownCoords.top + 6
            }}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
            className="z-50 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Association • Deux Volets
              </span>
            </div>

            {/* Submenu 1: Historique */}
            <button
              id="submenu-item-history"
              role="menuitem"
              onClick={() => {
                onTabChange('history');
                setAssocMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors cursor-pointer group ${
                activeTab === 'history'
                  ? 'bg-slate-50 text-[#031632]'
                  : 'hover:bg-slate-50 text-[#333333]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === 'history'
                    ? 'bg-[#031632] text-[#C5A059]'
                    : 'bg-slate-100 text-[#031632] group-hover:bg-[#031632] group-hover:text-[#C5A059]'
                }`}
              >
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#031632] group-hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  <span>Historique</span>
                  {activeTab === 'history' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  )}
                </div>
                <p className="text-[11px] text-[#666] leading-snug mt-0.5">
                  Histoire, fondation et jalons majeurs de l'association
                </p>
              </div>
            </button>

            {/* Submenu 2: Texte */}
            <button
              id="submenu-item-texts"
              role="menuitem"
              onClick={() => {
                onTabChange('texts');
                setAssocMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors cursor-pointer group ${
                activeTab === 'texts'
                  ? 'bg-slate-50 text-[#031632]'
                  : 'hover:bg-slate-50 text-[#333333]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === 'texts'
                    ? 'bg-[#031632] text-[#C5A059]'
                    : 'bg-slate-100 text-[#031632] group-hover:bg-[#031632] group-hover:text-[#C5A059]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#031632] group-hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  <span>Texte</span>
                  {activeTab === 'texts' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  )}
                </div>
                <p className="text-[11px] text-[#666] leading-snug mt-0.5">
                  Statuts officiels, règlement intérieur et charte
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <button
            id="search-trigger-btn"
            onClick={onOpenSearch}
            aria-label="Rechercher"
            className="p-2 text-[#031632] hover:text-[#C5A059] transition-colors duration-200 cursor-pointer rounded-full hover:bg-slate-100/60"
            title="Rechercher dans les publications et projets"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            id="header-join-cta"
            onClick={onOpenJoin}
            className="bg-[#031632] text-white text-[14px] font-semibold px-6 py-3 rounded hover:bg-[#1A2B48] border-b-2 border-transparent hover:border-[#C5A059] transition-all duration-300 active:scale-95 shadow-sm cursor-pointer"
          >
            {t('nav.join')}
          </button>
        </div>

        {/* Mobile Actions & Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            id="mobile-search-btn"
            onClick={onOpenSearch}
            className="p-2 text-[#031632] hover:text-[#C5A059]"
            aria-label="Recherche"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#031632] focus:outline-none"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden bg-white border-b border-[#c5c6ce] px-5 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3">
            {/* Item 1: Accueil */}
            <button
              id="mobile-nav-home"
              onClick={() => {
                onTabChange('home');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left text-sm font-semibold uppercase tracking-wider py-2 border-l-4 pl-3 transition-colors ${
                activeTab === 'home'
                  ? 'border-[#C5A059] text-[#031632] bg-slate-50 font-bold'
                  : 'border-transparent text-[#333333] hover:text-[#C5A059]'
              }`}
            >
              Accueil
            </button>

            {/* Item 2: Association with Expandable Sub-items */}
            <div className="border-b border-slate-100 pb-2">
              <button
                id="mobile-nav-about"
                onClick={() => setMobileAssocOpen(!mobileAssocOpen)}
                className={`w-full flex items-center justify-between text-left text-sm font-semibold uppercase tracking-wider py-2 border-l-4 pl-3 transition-colors ${
                  isAssocActive
                    ? 'border-[#C5A059] text-[#031632] bg-slate-50 font-bold'
                    : 'border-transparent text-[#333333] hover:text-[#C5A059]'
                }`}
              >
                <span>Association</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileAssocOpen ? 'rotate-180 text-[#C5A059]' : 'text-slate-400'
                  }`}
                />
              </button>

              {mobileAssocOpen && (
                <div className="pl-6 pt-1.5 pb-1 space-y-1.5 animate-in fade-in duration-150">
                  <button
                    id="mobile-nav-history"
                    onClick={() => {
                      onTabChange('history');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-2.5 text-left text-xs py-2 px-3 rounded-lg font-medium transition-colors ${
                      activeTab === 'history'
                        ? 'bg-[#031632] text-white font-bold'
                        : 'text-[#444] hover:bg-slate-100'
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-[#C5A059]" />
                    <div>
                      <div className="font-semibold">Historique</div>
                      <div className="text-[10px] text-slate-400">Histoire et fondation</div>
                    </div>
                  </button>

                  <button
                    id="mobile-nav-texts"
                    onClick={() => {
                      onTabChange('texts');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-2.5 text-left text-xs py-2 px-3 rounded-lg font-medium transition-colors ${
                      activeTab === 'texts'
                        ? 'bg-[#031632] text-white font-bold'
                        : 'text-[#444] hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <div>
                      <div className="font-semibold">Texte</div>
                      <div className="text-[10px] text-slate-400">Statuts et textes officiels</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Item 3: Activités */}
            <button
              id="mobile-nav-activities"
              onClick={() => {
                onTabChange('activities');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left text-sm font-semibold uppercase tracking-wider py-2 border-l-4 pl-3 transition-colors ${
                activeTab === 'activities'
                  ? 'border-[#C5A059] text-[#031632] bg-slate-50 font-bold'
                  : 'border-transparent text-[#333333] hover:text-[#C5A059]'
              }`}
            >
              {t('nav.activities')}
            </button>

            {/* Item 4: Litiges */}
            <button
              id="mobile-nav-projects"
              onClick={() => {
                onTabChange('projects');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left text-sm font-semibold uppercase tracking-wider py-2 border-l-4 pl-3 transition-colors ${
                activeTab === 'projects'
                  ? 'border-[#C5A059] text-[#031632] bg-slate-50 font-bold'
                  : 'border-transparent text-[#333333] hover:text-[#C5A059]'
              }`}
            >
              {t('nav.projects')}
            </button>

            {/* Item 5: Membres */}
            <button
              id="mobile-nav-members"
              onClick={() => {
                onTabChange('members');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left text-sm font-semibold uppercase tracking-wider py-2 border-l-4 pl-3 transition-colors ${
                activeTab === 'members'
                  ? 'border-[#C5A059] text-[#031632] bg-slate-50 font-bold'
                  : 'border-transparent text-[#333333] hover:text-[#C5A059]'
              }`}
            >
              {t('nav.members')}
            </button>

            {/* Item 6: Blog */}
            <button
              id="mobile-nav-blog"
              onClick={() => {
                onTabChange('blog');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left text-sm font-semibold uppercase tracking-wider py-2 border-l-4 pl-3 transition-colors ${
                activeTab === 'blog'
                  ? 'border-[#C5A059] text-[#031632] bg-slate-50 font-bold'
                  : 'border-transparent text-[#333333] hover:text-[#C5A059]'
              }`}
            >
              Blog
            </button>

            {/* Item 7: Contact */}
            <button
              id="mobile-nav-contact"
              onClick={() => {
                onTabChange('contact');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left text-sm font-semibold uppercase tracking-wider py-2 border-l-4 pl-3 transition-colors ${
                activeTab === 'contact'
                  ? 'border-[#C5A059] text-[#031632] bg-slate-50 font-bold'
                  : 'border-transparent text-[#333333] hover:text-[#C5A059]'
              }`}
            >
              Contact
            </button>

            <div className="pt-4 border-t border-slate-200">
              <button
                id="mobile-join-cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenJoin();
                }}
                className="w-full bg-[#031632] text-white text-sm font-semibold px-6 py-3 rounded hover:bg-[#1A2B48] border border-[#C5A059] text-center cursor-pointer"
              >
                Adhérer à l'association
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

