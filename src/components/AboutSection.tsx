import React from 'react';
import { ArrowRight, Scale, ShieldCheck, BookOpen, Cpu } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AboutSectionProps {
  onLearnMoreClick: () => void;
  keyFigures?: { value: string; label: string; subtext: string }[];
  pillars?: { id: string; title: string; description: string; iconName: string }[];
}

const DEFAULT_KEY_FIGURES = [
  { value: '1988', label: 'Année de fondation', subtext: 'Plus de 35 ans d’engagement' },
  { value: '1 250+', label: 'Membres & Juristes', subtext: 'Avocats, magistrats, professeurs' },
  { value: '2 850', label: 'Consultations gratuites', subtext: 'Délivrées chaque année' },
  { value: '48', label: 'Rapports & Livres Blancs', subtext: 'Remis aux pouvoirs publics' }
];

const DEFAULT_PILLARS = [
  {
    id: 'pil1',
    title: 'Défense de l’État de Droit',
    description: 'Veiller scrupuleusement au respect de la hiérarchie des normes, à l’indépendance de la magistrature et à la primauté des droits fondamentaux.',
    iconName: 'Scale'
  },
  {
    id: 'pil2',
    title: 'Égalité d’Accès à la Justice',
    description: 'Abattre les obstacles géographiques, financiers et culturels qui éloignent les citoyens de leurs droits à travers nos permanences gratuites.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'pil3',
    title: 'Rigueur Doctrinale & Réflexion',
    description: 'Produire des études juridiques indépendantes et des propositions législatives rédigées par les plus éminents praticiens et universitaires.',
    iconName: 'BookOpen'
  },
  {
    id: 'pil4',
    title: 'Éthique & Avenir Numérique',
    description: 'Anticiper les mutations technologiques et réguler l’usage des outils d’intelligence artificielle dans le strict respect de la dignité humaine.',
    iconName: 'Cpu'
  }
];

export const AboutSection: React.FC<AboutSectionProps> = ({ 
  onLearnMoreClick,
  keyFigures = DEFAULT_KEY_FIGURES,
  pillars = DEFAULT_PILLARS
}) => {
  const { t, language } = useLanguage();
  const meetingImageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC3v0y_SsNA63RzTorXUO8coF1BeiGNRExikhl2eWOt8wdv-XgPtmesxPYyv4kT9dIgl9aMyzgMnGCVg9IRypv8831mTKigYzaGhJsYwSBXugstCN27HWYUd8IcJxaMMqtYcj9N_uW59wVotT2UQ8ctXrWhM7IZtPEIIwvw484lExRs0HzZQcfJayXYKtZA59gLLorVqnU58_FmH1yXY2TPDLysNVcmBMk3eRHAlYxvCkJA6e2dQrOj';

  const figuresToUse = keyFigures && keyFigures.length > 0 ? keyFigures : DEFAULT_KEY_FIGURES;
  const pillarsToUse = pillars && pillars.length > 0 ? pillars : DEFAULT_PILLARS;

  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'Scale':
        return <Scale className="w-6 h-6 text-[#C5A059]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#C5A059]" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-[#C5A059]" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#C5A059]" />;
      default:
        return <Scale className="w-6 h-6 text-[#C5A059]" />;
    }
  };

  return (
    <div id="about-section-wrapper" className="bg-[#f9f9f9]">
      {/* 1. Qui sommes-nous ? */}
      <section
        id="about"
        className="py-24 md:py-32 px-5 md:px-16 max-w-[1280px] mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-2">
              {t('about.tag')}
            </span>
            <h2
              id="about-heading"
              className="font-playfair text-3xl sm:text-4xl text-[#031632] mb-6 font-semibold tracking-tight"
            >
              {t('about.heading')}
            </h2>
            <p className="text-[#44474d] text-base leading-relaxed mb-8">
              {t('about.text')}
            </p>
            <button
              id="about-learn-more-btn"
              onClick={onLearnMoreClick}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#031632] border-b-2 border-[#C5A059] pb-1 hover:text-[#C5A059] transition-colors duration-300 group cursor-pointer"
            >
              <span>{t('about.learnMore')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Conference Room Image */}
          <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden ambient-shadow group">
            <img
              id="about-conference-image"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-alt="A modern, bright conference room within a prestigious legal association."
              src={meetingImageUrl}
              alt="Réunion des membres de l'association Droit & Justice"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl" />
          </div>
        </div>
      </section>

      {/* 2. Chiffres Clés */}
      <section className="bg-[#FFFFFF] border-y border-[#e2e2e2] py-16 px-5 md:px-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {figuresToUse.map((fig, idx) => (
              <div key={idx} className="text-center md:text-left">
                <div className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#031632] mb-1">
                  {fig.value}
                </div>
                <div className="text-sm font-semibold text-[#333333] mb-0.5">
                  {language === 'en' ? (
                    idx === 0 ? 'Active Members' :
                    idx === 1 ? 'Papers & Reports' :
                    idx === 2 ? 'Conferences / Year' : 'Years of Excellence'
                  ) : fig.label}
                </div>
                <div className="text-xs text-[#75777e]">
                  {language === 'en' ? (
                    idx === 0 ? 'Legal professionals' :
                    idx === 1 ? 'Published works' :
                    idx === 2 ? 'Annual events' : 'Independent institution'
                  ) : fig.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Nos 4 Piliers Fondamentaux */}
      <section className="py-24 px-5 md:px-16 max-w-[1280px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-2">
            {t('about.doctrine.tag')}
          </span>
          <h3 className="font-playfair text-3xl font-semibold text-[#031632]">
            {t('about.doctrine.title')}
          </h3>
          <p className="text-sm text-[#44474d] mt-3">
            {t('about.doctrine.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillarsToUse.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="bg-white p-7 rounded border border-[#e2e2e2] ambient-shadow-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded bg-[#f3f3f3] flex items-center justify-center mb-6">
                  {getPillarIcon(pillar.iconName)}
                </div>
                <h4 className="font-playfair text-lg font-semibold text-[#031632] mb-3">
                  {language === 'en' ? (
                    idx === 0 ? 'Rule of Law' :
                    idx === 1 ? 'Independence' :
                    idx === 2 ? 'Doctrinal Excellence' : 'Digital Justice'
                  ) : pillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                  {language === 'en' ? (
                    idx === 0 ? 'Defending constitutional principles and protecting fundamental freedoms.' :
                    idx === 1 ? 'An independent forum free from political or commercial influence.' :
                    idx === 2 ? 'Publishing high-level research and analyzing legal developments.' : 'Ethical framework for AI and technology in the judicial system.'
                  ) : pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
