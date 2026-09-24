import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { AssociationView } from './components/AssociationView';
import { HistoryView } from './components/HistoryView';
import { TextsView } from './components/TextsView';
import { MembersView } from './components/MembersView';
import { ProjectsView } from './components/ProjectsView';
import { ActivitiesView } from './components/ActivitiesView';
import { BlogView } from './components/BlogView';
import { ContactView } from './components/ContactView';
import { JoinModal } from './components/JoinModal';
import { SearchModal } from './components/SearchModal';
import { LegalModal, ShareModal } from './components/InfoModals';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { NavTab } from './types';
import { Scale, ArrowRight, BookOpen, Calendar, FolderGit2, Users } from 'lucide-react';

const TAB_TITLES_FR: Record<NavTab, string> = {
  home: 'Accueil - Droit & Justice',
  about: 'À Propos - Droit & Justice',
  history: 'Notre Histoire - Droit & Justice',
  texts: 'Textes Juridiques - Droit & Justice',
  members: 'Membres & Dirigeants - Droit & Justice',
  projects: 'Projets - Droit & Justice',
  activities: 'Activités & Colloques - Droit & Justice',
  blog: 'Blog - Droit & Justice',
  contact: 'Contact - Droit & Justice',
};

const TAB_TITLES_EN: Record<NavTab, string> = {
  home: 'Home - Law & Justice',
  about: 'About Us - Law & Justice',
  history: 'Our History - Law & Justice',
  texts: 'Legal Texts - Law & Justice',
  members: 'Members & Leadership - Law & Justice',
  projects: 'Projects - Law & Justice',
  activities: 'Activities & Events - Law & Justice',
  blog: 'Blog - Law & Justice',
  contact: 'Contact - Law & Justice',
};

function MainAppContent(props: any) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'sitemap' | 'legal' | 'contact' | 'privacy' | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
  };

  const titlesMap = language === 'en' ? TAB_TITLES_EN : TAB_TITLES_FR;

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] text-[#1a1c1c]">
      <Head title={titlesMap[activeTab] || titlesMap.home} />
      {/* Top Fixed Sticky Header */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenJoin={() => setJoinModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Exact matching Hero section */}
            <HeroSection
              onDiscoverClick={() => {
                const aboutEl = document.getElementById('about');
                if (aboutEl) {
                  aboutEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleTabChange('about');
                }
              }}
              onJoinClick={() => setJoinModalOpen(true)}
            />

            {/* Exact matching "Qui sommes-nous ?" section & key figures */}
            <AboutSection
              onLearnMoreClick={() => {
                handleTabChange('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Home Supplementary: Featured Initiatives, Events & Doctrine */}
            <section className="py-20 px-5 md:px-16 bg-[#FFFFFF] border-t border-[#e2e2e2]">
              <div className="max-w-[1280px] mx-auto space-y-16">
                {/* 1. Projets Phares Header & Cards */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e2e2e2] gap-4">
                    <div>
                      <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-1">
                        {t('home.projects.tag')}
                      </span>
                      <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#031632]">
                        {t('home.projects.title')}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        handleTabChange('projects');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#031632] hover:text-[#C5A059] transition-colors cursor-pointer"
                    >
                      <span>{t('home.projects.all')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(props.initialProjects || []).slice(0, 2).map((proj: any) => (
                      <div
                        key={proj.id}
                        onClick={() => {
                          handleTabChange('projects');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-[#f9f9f9] p-6 rounded-lg border border-[#e2e2e2] hover:border-[#C5A059] transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A059]">
                            {proj.category}
                          </span>
                          <span className="text-[11px] bg-white border border-[#c5c6ce] text-[#333333] px-2 py-0.5 rounded font-medium">
                            {proj.status}
                          </span>
                        </div>
                        <h4 className="font-playfair text-xl font-bold text-[#031632] mb-2 group-hover:text-[#C5A059] transition-colors">
                          {proj.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#44474d] line-clamp-2 leading-relaxed mb-4">
                          {proj.shortDescription || proj.description}
                        </p>
                        <div className="text-xs font-semibold text-[#031632] flex items-center gap-1">
                          {t('about.learnMore')} &rarr;
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Prochain Événement & Dernière Doctrine */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Next Event Box */}
                  {props.initialActivities && props.initialActivities.length > 0 && (
                    <div className="bg-[#031632] text-white p-8 rounded-xl flex flex-col justify-between relative overflow-hidden">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#C5A059]">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-widest">
                            {t('home.events.tag')}
                          </span>
                        </div>
                        <h4 className="font-playfair text-2xl font-bold text-white leading-snug">
                          {props.initialActivities[0].title}
                        </h4>
                        <p className="text-xs text-[#8293b5] leading-relaxed">
                          {props.initialActivities[0].description}
                        </p>
                        <div className="text-xs text-white/80 space-y-1 pt-2">
                          <p><strong>Date :</strong> {props.initialActivities[0].date}</p>
                          <p><strong>Lieu :</strong> {props.initialActivities[0].location}</p>
                        </div>
                      </div>
                      <div className="pt-6">
                        <button
                          onClick={() => {
                            handleTabChange('activities');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-[#C5A059] hover:bg-[#ffdea5] text-[#031632] text-xs font-semibold px-6 py-3 rounded transition-colors shadow-md cursor-pointer inline-flex items-center gap-2"
                        >
                          <span>{t('home.events.all')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Latest Article Box */}
                  {props.initialArticles && props.initialArticles.length > 0 && (
                    <div className="bg-[#f9f9f9] p-8 rounded-xl border border-[#e2e2e2] flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            {t('home.blog.tag')}
                          </span>
                          <span className="text-xs text-[#75777e]">{props.initialArticles[0].read_time || props.initialArticles[0].readTime}</span>
                        </div>
                        <h4 className="font-playfair text-2xl font-bold text-[#031632] leading-snug">
                          {props.initialArticles[0].title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                          {props.initialArticles[0].excerpt || props.initialArticles[0].summary}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          {props.initialArticles[0].author_name && (
                            <div className="text-xs">
                              <strong className="text-[#031632] block">{props.initialArticles[0].author_name || props.initialArticles[0].author?.name}</strong>
                              <span className="text-[#75777e]">{props.initialArticles[0].author_role || props.initialArticles[0].author?.role}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="pt-6">
                        <button
                          onClick={() => {
                            handleTabChange('blog');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-[#031632] hover:bg-[#1A2B48] text-white text-xs font-semibold px-6 py-3 rounded border-b-2 border-[#C5A059] transition-colors cursor-pointer inline-flex items-center gap-2"
                        >
                          <span>Lire la publication complète</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <AssociationView
            onJoinClick={() => setJoinModalOpen(true)}
            keyFigures={props.siteSettings?.key_figures}
            pillars={props.siteSettings?.association_pillars}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            onJoinClick={() => setJoinModalOpen(true)}
            onNavigateTexts={() => handleTabChange('texts')}
          />
        )}

        {activeTab === 'texts' && (
          <TextsView />
        )}

        {activeTab === 'members' && (
          <MembersView
            onJoinClick={() => setJoinModalOpen(true)}
            members={props.initialMembers}
            memberCategories={props.siteSettings?.member_categories}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            disputeOfficers={props.initialDisputeOfficers}
            disputeCases={props.initialDisputeCases}
            disputeStages={props.initialDisputeStages}
          />
        )}

        {activeTab === 'activities' && (
          <ActivitiesView activities={props.initialActivities} />
        )}

        {activeTab === 'blog' && (
          <BlogView articles={props.initialArticles} />
        )}

        {activeTab === 'contact' && <ContactView />}
      </main>

      {/* Institutional Footer */}
      <Footer
        onTabChange={handleTabChange}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenShare={() => setShareModalOpen(true)}
      />

      {/* Modals */}
      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        membershipTiers={props.siteSettings?.membership_tiers}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleTabChange}
        articles={props.initialArticles}
        members={props.initialMembers}
        projects={props.initialProjects}
        activities={props.initialActivities}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        onNavigate={handleTabChange}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}

export default function App(props: any) {
  return (
    <LanguageProvider>
      <MainAppContent {...props} />
    </LanguageProvider>
  );
}
