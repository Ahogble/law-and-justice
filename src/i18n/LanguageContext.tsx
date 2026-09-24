import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.association': 'Association',
    'nav.about': 'À propos de nous',
    'nav.history': 'Notre Histoire',
    'nav.texts': 'Revue & Textes Juridiques',
    'nav.members': 'Membres',
    'nav.projects': 'Litiges',
    'nav.activities': 'Activités',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.join': 'Adhérer',
    'nav.search': 'Rechercher',
    'nav.admin': 'Espace Administration (Back-Office)',

    // Titles
    'title.home': 'Accueil - Droit & Justice',
    'title.about': 'À Propos - Droit & Justice',
    'title.history': 'Notre Histoire - Droit & Justice',
    'title.texts': 'Textes Juridiques - Droit & Justice',
    'title.members': 'Membres & Dirigeants - Droit & Justice',
    'title.projects': 'Litiges - Droit & Justice',
    'title.activities': 'Activités & Colloques - Droit & Justice',
    'title.blog': 'Blog - Droit & Justice',
    'title.contact': 'Contact - Droit & Justice',

    // Hero Section
    'hero.badge': 'Institution d\'Excellence',
    'hero.title': 'Droit & Justice',
    'hero.subtitle': 'Promouvoir le droit, renforcer la justice et construire une société fondée sur l\'État de droit.',
    'hero.cta.discover': 'Découvrir l\'association',
    'hero.cta.join': 'Adhérer à l\'association',

    // Key Figures & About
    'about.tag': 'Présentation',
    'about.heading': 'Qui sommes-nous ?',
    'about.text': 'Droit & Justice est une institution dédiée à la préservation et à l\'avancement des principes juridiques fondamentaux. Nous réunissons des experts, des praticiens et des citoyens engagés pour garantir que la justice demeure accessible et équitable pour tous.',
    'about.learnMore': 'En savoir plus',
    'about.stat.members': 'Membres Engagés',
    'about.stat.publications': 'Travaux & Rapports',
    'about.stat.events': 'Colloques / An',
    'about.stat.years': 'Années d\'Excellence',
    'about.doctrine.tag': 'Notre Doctrine',
    'about.doctrine.title': 'Les Piliers de l\'Action',
    'about.doctrine.subtitle': 'L\'engagement de Droit & Justice repose sur quatre engagements cardinaux au service de la Cité.',

    // Home Sections
    'home.projects.tag': 'Pôles d\'Action',
    'home.projects.title': 'Programmes & Observatoires',
    'home.projects.all': 'Tous les projets',
    'home.events.tag': 'Événements & Formations',
    'home.events.title': 'Colloques & Webinaires',
    'home.events.all': 'Agenda complet',
    'home.blog.tag': 'Publications Doctrinales',
    'home.blog.title': 'Blog & Doctrine',
    'home.blog.all': 'Voir les publications',

    // Footer
    'footer.brand.tagline': 'Institution de permanence et d\'excellence dédiée à la promotion de l\'État de droit.',
    'footer.brand.status1': 'Association régie par la loi du 1er juillet 1901',
    'footer.brand.status2': 'Reconnue d\'intérêt général',
    'footer.links.title': 'Liens utiles',
    'footer.links.sitemap': 'Plan du site',
    'footer.links.legal': 'Mentions légales',
    'footer.links.contact': 'Contact',
    'footer.links.privacy': 'Confidentialité',
    'footer.sections.title': 'Rubriques',
    'footer.follow.title': 'Suivez-nous',
    'footer.follow.subtitle': 'Rejoignez notre réseau de plus de 1 250 juristes engagés.',
    'footer.rights': '© 2026 Droit & Justice. Tous droits réservés.',

    // Common Buttons
    'btn.close': 'Fermer',
    'btn.submit': 'Envoyer',
    'btn.cancel': 'Annuler',
    'btn.save': 'Enregistrer',
    'btn.readMore': 'Lire la suite',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.association': 'Association',
    'nav.about': 'About Us',
    'nav.history': 'Our History',
    'nav.texts': 'Legal Texts & Doctrine',
    'nav.members': 'Members',
    'nav.projects': 'Dispute Resolution',
    'nav.activities': 'Activities',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.join': 'Join',
    'nav.search': 'Search',
    'nav.admin': 'Admin Portal (Back-Office)',

    // Titles
    'title.home': 'Home - Law & Justice',
    'title.about': 'About Us - Law & Justice',
    'title.history': 'Our History - Law & Justice',
    'title.texts': 'Legal Texts - Law & Justice',
    'title.members': 'Members & Leadership - Law & Justice',
    'title.projects': 'Dispute Resolution - Law & Justice',
    'title.activities': 'Activities & Events - Law & Justice',
    'title.blog': 'Blog - Law & Justice',
    'title.contact': 'Contact - Law & Justice',

    // Hero Section
    'hero.badge': 'Institution of Excellence',
    'hero.title': 'Law & Justice',
    'hero.subtitle': 'Promoting law, strengthening justice, and building a society grounded in the rule of law.',
    'hero.cta.discover': 'Discover the Association',
    'hero.cta.join': 'Join the Association',

    // Key Figures & About
    'about.tag': 'Overview',
    'about.heading': 'Who We Are',
    'about.text': 'Law & Justice is an institution dedicated to preserving and advancing fundamental legal principles. We bring together legal experts, practitioners, and committed citizens to ensure justice remains accessible and equitable for all.',
    'about.learnMore': 'Learn More',
    'about.stat.members': 'Active Members',
    'about.stat.publications': 'Papers & Reports',
    'about.stat.events': 'Events / Year',
    'about.stat.years': 'Years of Excellence',
    'about.doctrine.tag': 'Our Doctrine',
    'about.doctrine.title': 'Pillars of Action',
    'about.doctrine.subtitle': 'The commitment of Law & Justice is built upon four core principles serving society.',

    // Home Sections
    'home.projects.tag': 'Areas of Action',
    'home.projects.title': 'Programs & Observatories',
    'home.projects.all': 'All Projects',
    'home.events.tag': 'Events & Training',
    'home.events.title': 'Conferences & Webinars',
    'home.events.all': 'Full Schedule',
    'home.blog.tag': 'Doctrinal Publications',
    'home.blog.title': 'Blog & Articles',
    'home.blog.all': 'View All Publications',

    // Footer
    'footer.brand.tagline': 'An institution dedicated to legal excellence and promoting the rule of law.',
    'footer.brand.status1': 'Non-profit association under French Law 1901',
    'footer.brand.status2': 'Recognized public-interest entity',
    'footer.links.title': 'Useful Links',
    'footer.links.sitemap': 'Sitemap',
    'footer.links.legal': 'Legal Notice',
    'footer.links.contact': 'Contact',
    'footer.links.privacy': 'Privacy Policy',
    'footer.sections.title': 'Sections',
    'footer.follow.title': 'Follow Us',
    'footer.follow.subtitle': 'Join our network of over 1,250 committed legal professionals.',
    'footer.rights': '© 2026 Law & Justice. All rights reserved.',

    // Common Buttons
    'btn.close': 'Close',
    'btn.submit': 'Submit',
    'btn.cancel': 'Cancel',
    'btn.save': 'Save',
    'btn.readMore': 'Read More',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.fr, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: keyof typeof translations.fr, fallback?: string): string => {
    const dict = translations[language] || translations.fr;
    return dict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
