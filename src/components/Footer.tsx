import React from 'react';
import { Scale, Share2 } from 'lucide-react';
import { NavTab } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface FooterProps {
  onTabChange: (tab: NavTab) => void;
  onOpenLegal: (type: 'sitemap' | 'legal' | 'contact' | 'privacy') => void;
  onOpenShare: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onTabChange,
  onOpenLegal,
  onOpenShare
}) => {
  const { t } = useLanguage();

  return (
    <footer id="main-footer" className="bg-[#031632] pt-24 pb-8 w-full text-white border-t border-[#1A2B48]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-16 max-w-[1280px] mx-auto mb-16">
        {/* Col 1: Brand & Identity */}
        <div className="col-span-1 md:col-span-1">
          <div className="font-playfair text-2xl text-[#C5A059] flex items-center gap-2.5 mb-6 font-bold">
            <Scale className="w-6 h-6 stroke-[2.2]" />
            Droit &amp; Justice
          </div>
          <p className="text-[15px] leading-relaxed text-white/80 mb-6">
            {t('footer.brand.tagline')}
          </p>
          <div className="text-xs text-[#8293b5] space-y-1 mb-6">
            <p>{t('footer.brand.status1')}</p>
            <p>{t('footer.brand.status2')}</p>
          </div>

          <div className="pt-2">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Col 2: Useful Links */}
        <div>
          <h4 className="font-playfair text-lg text-white mb-6 font-semibold">{t('footer.links.title')}</h4>
          <ul className="flex flex-col gap-3 text-[15px]">
            <li>
              <button
                id="footer-link-sitemap"
                onClick={() => onOpenLegal('sitemap')}
                className="text-[#8293b5] hover:text-[#C5A059] transition-colors duration-200 text-left cursor-pointer"
              >
                {t('footer.links.sitemap')}
              </button>
            </li>
            <li>
              <button
                id="footer-link-legal"
                onClick={() => onOpenLegal('legal')}
                className="text-[#8293b5] hover:text-[#C5A059] transition-colors duration-200 text-left cursor-pointer"
              >
                {t('footer.links.legal')}
              </button>
            </li>
            <li>
              <button
                id="footer-link-contact"
                onClick={() => {
                  onTabChange('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#8293b5] hover:text-[#C5A059] transition-colors duration-200 text-left cursor-pointer"
              >
                {t('footer.links.contact')}
              </button>
            </li>
            <li>
              <button
                id="footer-link-privacy"
                onClick={() => onOpenLegal('privacy')}
                className="text-[#8293b5] hover:text-[#C5A059] transition-colors duration-200 text-left cursor-pointer"
              >
                {t('footer.links.privacy')}
              </button>
            </li>
            <li className="pt-2 border-t border-[#1A2B48]">
              <a
                href="/login"
                className="text-[#C5A059] font-medium hover:underline transition-colors text-left flex items-center gap-1.5 text-xs"
              >
                <span>{t('nav.admin')}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Sections Directes */}
        <div>
          <h4 className="font-playfair text-lg text-white mb-6 font-semibold">Rubriques</h4>
          <ul className="flex flex-col gap-3 text-[15px]">
            <li>
              <button
                onClick={() => {
                  onTabChange('history');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#8293b5] hover:text-[#C5A059] transition-colors duration-200 text-left cursor-pointer"
              >
                Histoire de l'Association
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onTabChange('texts');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#8293b5] hover:text-[#C5A059] transition-colors duration-200 text-left cursor-pointer"
              >
                Textes &amp; Statuts officiels
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onTabChange('activities');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#8293b5] hover:text-[#C5A059] transition-colors duration-200 text-left cursor-pointer"
              >
                Activités &amp; Colloques
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onTabChange('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#8293b5] hover:text-[#C5A059] transition-colors duration-200 text-left cursor-pointer"
              >
                {t('nav.projects')}
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onTabChange('members');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#8293b5] hover:text-[#C5A059] transition-colors duration-200 text-left cursor-pointer"
              >
                Annuaire des membres
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Follow Us & Social */}
        <div className="col-span-1 flex flex-col md:items-end">
          <div>
            <h4 className="font-playfair text-lg text-white mb-6 font-semibold">Suivez-nous</h4>
            <div className="flex gap-4">
              <button
                id="footer-share-btn"
                onClick={onOpenShare}
                aria-label="Partager la plateforme"
                className="w-10 h-10 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#031632] transition-all duration-300 cursor-pointer shadow-sm group"
                title="Partager Droit & Justice"
              >
                <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
              </button>
            </div>
            <p className="text-xs text-[#8293b5] mt-4 max-w-[220px]">
              Rejoignez notre réseau de plus de 1 250 juristes engagés.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="border-t border-[#1A2B48] pt-8 px-5 md:px-16 max-w-[1280px] mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[13px] text-[#8293b5]">
          © 2024 Droit &amp; Justice. Tous droits réservés. Institution de permanence et d'excellence.
        </p>
        <p className="text-[12px] text-[#8293b5]/80">
          Siège social : 12 rue Royale, 75008 Paris
        </p>
      </div>
    </footer>
  );
};
