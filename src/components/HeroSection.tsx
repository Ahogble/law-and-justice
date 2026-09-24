import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface HeroSectionProps {
  onDiscoverClick: () => void;
  onJoinClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onDiscoverClick,
  onJoinClick
}) => {
  const { t } = useLanguage();
  const heroImageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB6B1xKCgJlGwuUD_WDW5GRZaFC8tIeqrW1YI_hDqJ2RyYJ2BeN1X6J_9QrkFYWMEOsJELnN-E8UdcervYq0Km8jtE_e-yeNSG5XfxR5PYgO1NIRf7P1jaOJcU22Uht3SjnOk1V5kFsGwN0Vda0hp_2rODdEUpOF0dQ68DGO1Tr-CkxtbQPPMJ3-6ldrLbuv1tJv87wcuIYbbpaSVFJOIQ8KtzX9McPwhayR9MkIbzi8cQGXoemMNbL';

  return (
    <section
      id="hero-section"
      className="relative min-h-[921px] flex items-center justify-center pt-24 pb-28 px-5 md:px-16 overflow-hidden"
    >
      {/* Background with Classical Pillars & Stone Stairs */}
      <div className="absolute inset-0 z-0">
        <div
          className="bg-cover bg-center w-full h-full absolute inset-0 transform scale-105 transition-transform duration-1000 ease-out"
          data-alt="A grand, architectural composition featuring classical legal pillars and majestic stone stairs bathed in bright, morning light. The setting implies a prestigious institution of justice."
          style={{ backgroundImage: `url('${heroImageUrl}')` }}
        />
        {/* Layered overlay for readability and exact color harmony */}
        <div className="absolute inset-0 bg-[#031632]/70 backdrop-blur-[2px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031632] via-transparent to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl text-center text-white flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
        <span
          id="hero-eyebrow"
          className="text-xs font-semibold text-[#C5A059] mb-4 block uppercase tracking-[0.25em]"
        >
          {t('hero.badge')}
        </span>
        <h1
          id="hero-title"
          className="font-playfair text-4xl sm:text-5xl md:text-[56px] leading-tight md:leading-[68px] font-bold text-white mb-6 tracking-tight drop-shadow-sm"
        >
          {t('hero.title')}
        </h1>
        <p
          id="hero-subtitle"
          className="text-base sm:text-lg text-[#F5F5F5] max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          {t('hero.subtitle')}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none">
          <button
            id="hero-cta-discover"
            onClick={onDiscoverClick}
            className="bg-[#FFFFFF] text-[#031632] text-sm font-semibold px-8 py-4 rounded hover:bg-[#F5F5F5] border border-transparent transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            {t('hero.cta.discover')}
          </button>
          <button
            id="hero-cta-join"
            onClick={onJoinClick}
            className="bg-transparent text-white border-2 border-[#C5A059] text-sm font-semibold px-8 py-4 rounded hover:bg-[#C5A059] hover:text-[#031632] transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            {t('hero.cta.join')}
          </button>
        </div>
      </div>
    </section>
  );
};
