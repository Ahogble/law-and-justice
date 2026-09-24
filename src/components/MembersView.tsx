import React, { useState } from 'react';
import { Search, Mail, BookOpen, X, Award, Tag } from 'lucide-react';
import { Member, MemberCategory } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface MembersViewProps {
  onJoinClick: () => void;
}

const CATEGORY_MAP: Record<string, { fr: string; en: string }> = {
  'Tous': { fr: 'Tous', en: 'All' },
  'Conseil d\'Administration': { fr: 'Conseil d\'Administration', en: 'Board of Directors' },
  'Universitaire': { fr: 'Universitaire', en: 'Academic' },
  'Magistrat': { fr: 'Magistrat', en: 'Magistrate' },
  'Avocat': { fr: 'Avocat', en: 'Attorney' },
  'Juriste d\'Entreprise': { fr: 'Juriste d\'Entreprise', en: 'Corporate Counsel' }
};

const MEMBER_TRANSLATIONS: Record<string, {
  roleEn: string;
  orgEn: string;
  bioEn: string;
  specialtiesEn: string[];
}> = {
  m1: {
    roleEn: 'President of the Association & Attorney at the Paris Bar',
    orgEn: 'Saint-Maur & Partners / Former Member of the National Bar Council',
    bioEn: 'Former Secretary of the Conference and recognized specialist in civil liberties and constitutional litigation. Hélène has presided over Law & Justice since 2021 with a drive to anchor legal debate at the heart of civic life.',
    specialtiesEn: ['Constitutional Law', 'Civil Liberties', 'Strategic Litigation']
  },
  m2: {
    roleEn: 'Vice-President & Emeritus Professor of Private Law',
    orgEn: 'Paris-Panthéon-Assas University',
    bioEn: 'Author of reference treatises on civil liability and contract law, he chairs the Scientific Committee of Law & Justice and coordinates doctrinal research.',
    specialtiesEn: ['Civil Law', 'Legal Theory', 'Legal Ethics']
  },
  m3: {
    roleEn: 'General Secretary & Honorary Magistrate',
    orgEn: 'Paris Court of Appeal (Honorary)',
    bioEn: 'Having served for over thirty years in criminal and civil courts, Claire brings a practical and rigorous vision of judicial institutional needs and litigants\' rights.',
    specialtiesEn: ['Criminal Procedure', 'Judicial Organization', 'Ethics']
  },
  m4: {
    roleEn: 'Treasurer & Group General Counsel',
    orgEn: 'Alliance Energy & Industry',
    bioEn: 'Specialist in compliance, corporate governance, and European economic law. Alexandre leads the "Business Law & Regulatory Transition" committee.',
    specialtiesEn: ['Business Law', 'Compliance & CSR', 'European Law']
  },
  m5: {
    roleEn: 'Research Program Director & Attorney',
    orgEn: 'Lyon Bar & Associate Researcher at CNRS',
    bioEn: 'Pioneer in legal frameworks governing AI applied to justice and the protection of sensitive litigant data.',
    specialtiesEn: ['Digital Law', 'AI & Predictive Justice', 'Data Privacy']
  },
  m6: {
    roleEn: 'Legal Aid Clinic Coordinator',
    orgEn: 'Paris Bar',
    bioEn: 'Attorney specializing in immigration and asylum law, he coordinates a network of 120 volunteers providing free weekly legal consultations.',
    specialtiesEn: ['Asylum Law', 'Access to Justice', 'Human Rights']
  }
};

export const MembersView: React.FC<MembersViewProps> = ({ 
  onJoinClick, 
  members = [], 
  memberCategories = DEFAULT_MEMBER_CATEGORIES_FALLBACK 
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('Tous');
  const [selectedSubcategoryKey, setSelectedSubcategoryKey] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const categoriesList = memberCategories && memberCategories.length > 0 ? memberCategories : DEFAULT_MEMBER_CATEGORIES_FALLBACK;
  const categoryKeys = ['Tous', ...categoriesList.map(c => c.name)];

  const activeCategoryObj = categoriesList.find(
    c => c.name === selectedCategoryKey
  );

  const getSubcatDisplayLabel = (catName: string, subName?: string) => {
    if (!subName) return '';
    const catObj = categoriesList.find(c => c.name === catName);
    const subObj = catObj?.subcategories.find(s => s.name === subName);
    if (!subObj) return subName;
    return isEn ? (subObj.nameEn || subObj.name) : subObj.name;
  };

  const filteredMembers = members.filter((member) => {
    const matchesCat = selectedCategoryKey === 'Tous' || member.category === selectedCategoryKey;
    const matchesSubcat = selectedSubcategoryKey === 'Tous' || member.subcategory === selectedSubcategoryKey;
    const extra = MEMBER_TRANSLATIONS[member.id];
    
    const nameMatch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = (isEn && extra ? extra.roleEn : member.role).toLowerCase().includes(searchQuery.toLowerCase());
    const orgMatch = (isEn && extra ? extra.orgEn : member.organization).toLowerCase().includes(searchQuery.toLowerCase());
    const specList = isEn && extra ? extra.specialtiesEn : (member.specialties || []);
    const specMatch = specList.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSubcat && (nameMatch || roleMatch || orgMatch || specMatch);
  });

  const getMemberData = (member: Member) => {
    const extra = MEMBER_TRANSLATIONS[member.id];
    const catEntry = CATEGORY_MAP[member.category];
    return {
      role: isEn && extra ? extra.roleEn : member.role,
      organization: isEn && extra ? extra.orgEn : member.organization,
      category: isEn ? (CATEGORY_MAP[member.category]?.en || member.category) : member.category,
      subcategoryLabel: getSubcatDisplayLabel(member.category, member.subcategory),
      bio: isEn && extra ? extra.bioEn : member.bio,
      specialties: isEn && extra ? extra.specialtiesEn : member.specialties
    };
  };

  return (
    <div className="pt-24 pb-28">
      {/* Banner */}
      <section className="bg-[#031632] text-white py-16 px-5 md:px-16 border-b border-[#1A2B48]">
        <div className="max-w-[1280px] mx-auto">
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-2">
            {isEn ? 'Institutional Directory' : 'Annuaire Institutionnel'}
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {isEn ? 'Directory of Members' : 'Le Collège des Membres'}
          </h1>
          <p className="text-[#8293b5] text-base md:text-lg max-w-3xl">
            {isEn
              ? 'Meet the legal scholars, academics, judges, and attorneys who drive the work and ensure the doctrinal excellence of Law & Justice.'
              : 'Retrouvez les juristes, universitaires, magistrats et avocats qui animent les travaux et garantissent l\'excellence doctrinale de Droit & Justice.'}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 mt-12 space-y-8">
        {/* Controls: Search & Category Chips */}
        <div className="flex flex-col gap-4 pb-6 border-b border-[#e2e2e2]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categoryKeys.map((catKey) => {
                const label = isEn ? CATEGORY_MAP[catKey].en : CATEGORY_MAP[catKey].fr;
                const isSelected = selectedCategoryKey === catKey;

                return (
                  <button
                    key={catKey}
                    onClick={() => {
                      setSelectedCategoryKey(catKey);
                      setSelectedSubcategoryKey('Tous');
                    }}
                    className={`text-xs font-semibold px-4 py-2 rounded transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#031632] text-white shadow-sm'
                        : 'bg-white text-[#333333] hover:bg-slate-100 border border-[#e2e2e2]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isEn ? 'Search by name, specialty, bar...' : 'Rechercher par nom, matière, barreau...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
              />
            </div>
          </div>

          {/* Subcategories Filter Chips */}
          {selectedCategoryKey !== 'Tous' && activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 flex-wrap">
              <span className="text-xs font-semibold text-[#75777e] uppercase tracking-wider mr-1">
                {isEn ? 'Subcategory:' : 'Sous-catégorie :'}
              </span>
              <button
                onClick={() => setSelectedSubcategoryKey('Tous')}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  selectedSubcategoryKey === 'Tous'
                    ? 'bg-[#C5A059] text-[#031632] font-bold shadow-xs'
                    : 'bg-slate-100 text-[#555555] hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {isEn ? 'All' : 'Toutes'}
              </button>
              {activeCategoryObj.subcategories.map((sub) => {
                const isSubSelected = selectedSubcategoryKey === sub.name;
                const subLabel = isEn ? (sub.nameEn || sub.name) : sub.name;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategoryKey(sub.name)}
                    className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                      isSubSelected
                        ? 'bg-[#C5A059] text-[#031632] font-bold shadow-xs'
                        : 'bg-slate-100 text-[#555555] hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {subLabel}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Member Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const mData = getMemberData(member);

              return (
                <div
                  key={member.id}
                  onClick={() => setActiveMember(member)}
                  className="bg-white rounded border border-[#e2e2e2] p-6 ambient-shadow-hover flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#e2e2e2] group-hover:border-[#C5A059] transition-colors"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A059] block mb-1">
                          {mData.category} {mData.subcategoryLabel ? `• ${mData.subcategoryLabel}` : ''}
                        </span>
                        <h3 className="font-playfair text-lg font-bold text-[#031632] truncate group-hover:text-[#C5A059] transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-xs text-[#75777e] truncate">
                          {mData.organization}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#44474d] line-clamp-3 mb-4 leading-relaxed">
                      {mData.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mData.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-[#f3f3f3] text-[#333333] px-2.5 py-1 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#75777e]">
                    <span>{isEn ? `Member since ${member.joinedYear}` : `Membre depuis ${member.joinedYear}`}</span>
                    <span className="text-[#031632] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      {isEn ? 'View profile →' : 'Consulter la fiche →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded border border-[#e2e2e2]">
            <p className="text-sm text-[#75777e]">
              {isEn
                ? 'No member matches your search criteria.'
                : 'Aucun membre ne correspond à vos critères de recherche.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategoryKey('Tous');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-semibold text-[#031632] underline cursor-pointer"
            >
              {isEn ? 'Reset filters' : 'Réinitialiser les filtres'}
            </button>
          </div>
        )}

        {/* Join Callout Banner */}
        <div className="bg-[#031632] text-white rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mt-16">
          <div>
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-2">
              {isEn ? 'Membership & Network' : 'Adhésion & Réseau'}
            </span>
            <h3 className="font-playfair text-2xl md:text-3xl font-semibold text-white mb-2">
              {isEn ? 'Are you a legal practitioner, judge, or advocate?' : 'Vous êtes juriste, magistrat ou avocat ?'}
            </h3>
            <p className="text-sm text-[#8293b5] max-w-xl">
              {isEn
                ? 'Join a community of rigorous peers and participate in our doctrinal drafting committees and pro bono initiatives.'
                : 'Rejoignez une communauté de pairs exigeants et participez à nos commissions de rédaction doctrinale et d\'action pro bono.'}
            </p>
          </div>
          <button
            onClick={onJoinClick}
            className="whitespace-nowrap bg-[#C5A059] text-[#031632] hover:bg-[#ffdea5] text-sm font-semibold px-8 py-4 rounded transition-all shadow-md cursor-pointer"
          >
            {isEn ? 'Submit an application' : 'Déposer une candidature'}
          </button>
        </div>
      </div>

      {/* Member Details Modal */}
      {activeMember && (() => {
        const mData = getMemberData(activeMember);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-[#c5c6ce] animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="bg-[#031632] text-white p-6 md:p-8 relative">
                <button
                  onClick={() => setActiveMember(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white p-2 cursor-pointer rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-5">
                  <img
                    src={activeMember.avatarUrl}
                    alt={activeMember.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#C5A059]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-1">
                      {mData.category} {mData.subcategoryLabel ? `• ${mData.subcategoryLabel}` : ''}
                    </span>
                    <h3 className="font-playfair text-2xl font-bold text-white">
                      {activeMember.name}
                    </h3>
                    <p className="text-xs text-[#8293b5] mt-1">
                      {mData.role}
                    </p>
                    <p className="text-xs text-white/70">
                      {mData.organization}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#75777e] mb-2">
                    {isEn ? 'Biography & Career' : 'Biographie & Parcours'}
                  </h4>
                  <p className="text-sm text-[#333333] leading-relaxed">
                    {mData.bio}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#75777e] mb-2">
                    {isEn ? 'Areas of Expertise & Specialties' : 'Domaines d\'expertise & Spécialités'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mData.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#f3f3f3] text-[#031632] font-medium px-3 py-1.5 rounded border border-[#e2e2e2]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-[#f9f9f9] p-4 rounded border border-[#e2e2e2]">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#C5A059]" />
                    <div>
                      <div className="text-xs text-[#75777e]">{isEn ? 'Works & Publications' : 'Travaux & Publications'}</div>
                      <div className="text-sm font-bold text-[#031632]">
                        {isEn
                          ? `${activeMember.publicationCount || 12} doctrinal papers`
                          : `${activeMember.publicationCount || 12} articles doctrinaux`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-[#C5A059]" />
                    <div>
                      <div className="text-xs text-[#75777e]">{isEn ? 'Seniority' : 'Ancienneté'}</div>
                      <div className="text-sm font-bold text-[#031632]">
                        {isEn ? `Since ${activeMember.joinedYear}` : `Depuis ${activeMember.joinedYear}`}
                      </div>
                    </div>
                  </div>
                </div>

                {activeMember.email && (
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                    <div className="text-xs text-[#75777e] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#C5A059]" />
                      <span>{activeMember.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        alert(
                          isEn
                            ? `Correspondence message dispatched to secretariat for ${activeMember.name}`
                            : `Message de correspondance adressé au secrétariat pour ${activeMember.name}`
                        );
                      }}
                      className="text-xs font-semibold text-[#031632] hover:text-[#C5A059] underline cursor-pointer"
                    >
                      {isEn ? 'Contact via secretariat' : 'Contacter via le secrétariat'}
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveMember(null)}
                  className="bg-[#031632] text-white text-xs font-semibold px-6 py-2.5 rounded hover:bg-[#1A2B48] transition-colors cursor-pointer"
                >
                  {isEn ? 'Close profile' : 'Fermer la fiche'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

