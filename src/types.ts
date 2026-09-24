export type NavTab = 'home' | 'about' | 'history' | 'texts' | 'members' | 'projects' | 'activities' | 'blog' | 'contact';

export interface MemberSubcategory {
  id: string;
  name: string;
  nameEn?: string;
}

export interface MemberCategory {
  id: string;
  name: string;
  nameEn?: string;
  subcategories: MemberSubcategory[];
}

export interface Member {
  id: string;
  name: string;
  role: string;
  organization: string;
  category: string;
  subcategory?: string;
  bio: string;
  avatarUrl: string;
  specialties: string[];
  publicationCount?: number;
  email?: string;
  joinedYear: number;
}

export interface Project {
  id: string;
  title: string;
  category: 'Observatoire' | 'Clinique Juridique' | 'Plaidoyer & Réforme' | 'Éthique & IA';
  status: 'En cours' | 'Publié' | 'Concertation' | 'Phase pilote';
  lead: string;
  shortDescription: string;
  fullDescription: string;
  keyMetrics: { label: string; value: string }[];
  deliverables: string[];
  date: string;
}

export interface Activity {
  id: string;
  title: string;
  type: 'Colloque Annuel' | 'Conférence Magistrale' | 'Atelier Pratique' | 'Table Ronde';
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  status: 'upcoming' | 'past';
  speakers: string[];
  description: string;
  capacity: number;
  registeredCount: number;
  prerequisites?: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'Doctrine' | 'Jurisprudence' | 'Libertés Fondamentales' | 'Droit & Numérique' | 'Actualités Institutionnelles';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishDate: string;
  readTime: string;
  summary: string;
  content: string;
  tags: string[];
  featured?: boolean;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  period: string;
  targetAudience: string;
  popular?: boolean;
  benefits: string[];
}

export type DisputeCategory = 'interne' | 'externe';
export type DisputeStage = 'conciliation' | 'mediation' | 'arbitrage';

export interface DisputeOfficer {
  id: string;
  name: string;
  title: string;
  role: string;
  stage: DisputeStage;
  category: DisputeCategory;
  specialties: string[];
  experienceYears: number;
  casesHandled: number;
  avatarUrl: string;
  email: string;
  availability: 'Disponible' | 'En audience' | 'Sur RDV';
}

export interface DisputeCase {
  id: string;
  caseNumber: string;
  title: string;
  category: DisputeCategory;
  stage: string;
  isPublic: boolean;
  status: 'En cours' | 'Clôturé' | 'Accord Homologué' | 'Sentence Arbitrale' | 'En instruction';
  dateSubmitted: string;
  summary: string;
  parties?: string;
  assignedOfficer?: string;
  confidentialityNote?: string;
  resolutionTimeframe?: string;
}

export interface DisputeStageConfig {
  id: string;
  key: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  legalBasis: string;
  confidentiality: string;
  officersTitle: string;
  keyMetrics?: { label: string; value: string }[];
}

