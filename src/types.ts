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
  avatarUrl?: string;
  avatar_url?: string;
  specialties: string[];
  publicationCount?: number;
  publication_count?: number;
  email?: string;
  joinedYear?: number;
  joined_year?: number;
  cases?: MemberCase[];
  associative_activities?: MemberAssociativeActivity[];
  associativeActivities?: MemberAssociativeActivity[];
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
  title_en?: string;
  category: 'Doctrine' | 'Jurisprudence' | 'Libertés Fondamentales' | 'Droit & Numérique' | 'Actualités Institutionnelles';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishDate: string;
  readTime: string;
  summary: string;
  summary_en?: string;
  content: string;
  content_en?: string;
  tags: string[];
  featured?: boolean;
}

export interface MembershipTier {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  period: string;
  periodEn?: string;
  targetAudience: string;
  targetAudienceEn?: string;
  popular?: boolean;
  benefits: string[];
  benefitsEn?: string[];
}

export interface MembershipApplication {
  id: string;
  application_number: string;
  tier_id?: string;
  tier_name: string;
  tier_price: number;
  civility: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  birth_place?: string;
  marital_status?: string;
  cni?: string;
  cni_url?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  secondary_phone?: string;
  address?: string;
  country?: string;
  region?: string;
  department?: string;
  locality?: string;
  profession: string;
  institution?: string;
  motivation?: string;
  payment_method?: string;
  payment_reference?: string;
  payment_receipt_url?: string;
  payment_status?: 'pending' | 'verified' | 'rejected';
  payment_verified_at?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  reviewed_at?: string;
  member_id?: string;
  created_at?: string;
  updated_at?: string;
  cases?: MemberCase[];
  associative_activities?: MemberAssociativeActivity[];
  associativeActivities?: MemberAssociativeActivity[];
}

export interface PaymentAccount {
  id: string;
  type: 'bank' | 'mobile' | 'other';
  name: string;
  bank_name?: string;
  account_holder: string;
  account_number?: string;
  iban?: string;
  swift?: string;
  phone_number?: string;
  instructions?: string;
  active?: boolean;
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

export type MemberCaseStatus = 'en_cours' | 'renvoyee' | 'delibere' | 'jugement_rendu' | 'cloturee' | 'archivee';

export interface MemberCaseDocument {
  id: string;
  member_case_id: string;
  title: string;
  file_path: string;
  file_name: string;
  file_type?: string;
  file_size?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MemberCaseEvent {
  id: string;
  member_case_id: string;
  event_date: string;
  status: MemberCaseStatus | string;
  next_hearing_date?: string | null;
  reason?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MemberCase {
  id: string;
  member_id: string;
  membership_application_id?: string | null;
  case_number: string;
  title: string;
  category: string;
  jurisdiction?: string | null;
  opposing_party?: string | null;
  status: MemberCaseStatus;
  hearing_date?: string | null;
  hearing_reason?: string | null;
  summary?: string | null;
  opened_at?: string | null;
  closed_at?: string | null;
  documents?: MemberCaseDocument[];
  events?: MemberCaseEvent[];
  member?: Member;
  created_at?: string;
  updated_at?: string;
}

export type MemberAssociativeType = 'mandat' | 'commission' | 'evenement' | 'mission' | 'distinction';
export type MemberAssociativeStatus = 'actif' | 'termine' | 'honoraire';

export interface MemberAssociativeActivity {
  id: string;
  member_id?: string | null;
  membership_application_id?: string | null;
  type: MemberAssociativeType;
  title: string;
  role?: string | null;
  organization_unit?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  status: MemberAssociativeStatus;
  description?: string | null;
  document_url?: string | null;
  document_name?: string | null;
  created_at?: string;
  updated_at?: string;
  member?: Member;
  application?: MembershipApplication;
}

