import React, { useState } from 'react';
import { Search, Clock, Share2, Bookmark, ArrowRight, X } from 'lucide-react';
import { Article } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

const CATEGORY_MAP: Record<string, { fr: string; en: string }> = {
  'Tous': { fr: 'Tous', en: 'All' },
  'Doctrine': { fr: 'Doctrine', en: 'Doctrine' },
  'Jurisprudence': { fr: 'Jurisprudence', en: 'Case Law' },
  'Libertés Fondamentales': { fr: 'Libertés Fondamentales', en: 'Fundamental Freedoms' },
  'Droit & Numérique': { fr: 'Droit & Numérique', en: 'Digital & Law' },
  'Actualités Institutionnelles': { fr: 'Actualités Institutionnelles', en: 'Institutional News' }
};

const ARTICLE_TRANSLATIONS: Record<string, {
  titleEn: string;
  categoryEn: string;
  readTimeEn: string;
  publishDateEn: string;
  summaryEn: string;
  contentEn: string;
  authorRoleEn: string;
  tagsEn: string[];
}> = {
  art1: {
    titleEn: 'The Imperative of Reasoning Judicial Decisions in the Age of Algorithms',
    categoryEn: 'Doctrine',
    readTimeEn: '8 min read',
    publishDateEn: 'October 12, 2024',
    summaryEn: 'The transparency of judicial reasoning remains the primary shield against arbitrariness. The introduction of decision-support tools cannot exempt judges from providing human, individualized reasoning.',
    authorRoleEn: 'Emeritus Professor, Paris-Panthéon-Assas University',
    tagsEn: ['Procedure', 'Doctrine', 'AI', 'Judicial Reasoning'],
    contentEn: `The democratic requirement of justice rendered in the name of the people requires that every litigant understand precisely the legal and factual grounds underlying the verdict. At a time when predictive algorithms and statistical models enter case law analysis, heightened vigilance is required.

## The Century-Old Principle of Human Reasoning

Under Article 455 of the Civil Procedure Code and Article 6 § 1 of the European Convention on Human Rights, judges have a legal obligation to respond to all arguments raised by the parties. An automated or quasi-automated decision disregards the singularity of each dispute.

## The Risks of Probabilistic Justice

The use of probabilistic tools carries the danger of judicial ossification ("fossilized jurisprudence"). If past decisions mechanically dictate future judgments through data processing, all capacity for pretorian evolution is stifled.

> "The law is not a calculation of probabilities; it is the continuous pursuit of what is just and proportionate."

## Association Recommendations

1. Establishing a right of access to the explainability of any algorithmic processing used in proceedings.
2. Formal prohibition of judicial profiling of magistrates.
3. Annulment sanction for any judgment relying on a ground not corroborated by the sovereign office of the judge.`
  },
  art2: {
    titleEn: 'Legal Aid: Diagnosis of an Overheated Public Service',
    categoryEn: 'Fundamental Freedoms',
    readTimeEn: '6 min read',
    publishDateEn: 'September 28, 2024',
    summaryEn: 'Without sustainable funding for defending the underprivileged, the principle of equality before justice remains an incomplete constitutional promise.',
    authorRoleEn: 'President of the Association',
    tagsEn: ['Legal Aid', 'Bar', 'Equality', 'Budget'],
    contentEn: `Effective access to justice forms the keystone of our republican structure. However, the tariff scale for legal aid units allocated to court-appointed attorneys no longer covers the real operating costs of a modern law practice.

Our association formulates three concrete proposals to revaluate legal aid without unduly burdening state finances: expanding the tax base on paid legal acts and establishing a universal endowment fund for justice.`
  },
  art3: {
    titleEn: 'Conciliation and Mediation: Genuine Alternatives or Bargain-Basement Justice?',
    categoryEn: 'Case Law',
    readTimeEn: '5 min read',
    publishDateEn: 'September 15, 2024',
    summaryEn: 'Court congestion led lawmakers to make mandatory prior attempt at amicable settlement for certain disputes. Practical review after 3 years of application.',
    authorRoleEn: 'General Secretary, Honorary Magistrate',
    tagsEn: ['ADR', 'Mediation', 'Civil Procedure'],
    contentEn: `While dialogue between parties is virtuous, the systematic obligation to resort to a third-party conciliator must not turn into an obstacle course depriving citizens of prompt examination by their natural judge.`
  },
  art4: {
    titleEn: 'Attorney-Client Privilege: A Reminder of the Red Lines',
    categoryEn: 'Institutional News',
    readTimeEn: '7 min read',
    publishDateEn: 'September 02, 2024',
    summaryEn: 'The protection of professional secrecy is the citizen\'s guarantee, not a privilege of the lawyer. Synthesis of recent Constitutional Council decisions.',
    authorRoleEn: 'Attorney & Researcher',
    tagsEn: ['Ethics', 'Professional Secrecy', 'Constitutional Council'],
    contentEn: `Professional secrecy should not be viewed as an obstacle to investigations, but as the sine qua non condition for a litigant\'s trust when entrusting their most intimate truths to legal counsel.`
  }
};

interface BlogViewProps {
  articles?: Article[];
}

export const BlogView: React.FC<BlogViewProps> = ({ articles = [] }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const categoryKeys = [
    'Tous',
    'Doctrine',
    'Jurisprudence',
    'Libertés Fondamentales',
    'Droit & Numérique',
    'Actualités Institutionnelles'
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategoryKey === 'Tous' || art.category === selectedCategoryKey;
    const extra = ARTICLE_TRANSLATIONS[art.id];

    const titleMatch = (isEn && extra ? extra.titleEn : art.title).toLowerCase().includes(searchQuery.toLowerCase());
    const summaryMatch = (isEn && extra ? extra.summaryEn : art.summary).toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = art.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const tagList = isEn && extra ? extra.tagsEn : art.tags;
    const tagMatch = tagList.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && (titleMatch || summaryMatch || authorMatch || tagMatch);
  });

  const getArticleData = (article: Article) => {
    const extra = ARTICLE_TRANSLATIONS[article.id];
    return {
      title: isEn && extra ? extra.titleEn : article.title,
      category: isEn ? (CATEGORY_MAP[article.category]?.en || article.category) : article.category,
      readTime: isEn && extra ? extra.readTimeEn : article.readTime,
      publishDate: isEn && extra ? extra.publishDateEn : article.publishDate,
      summary: isEn && extra ? extra.summaryEn : article.summary,
      content: isEn && extra ? extra.contentEn : article.content,
      authorRole: isEn && extra ? extra.authorRoleEn : article.author.role,
      tags: isEn && extra ? extra.tagsEn : article.tags
    };
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((b) => b !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  return (
    <div className="pt-24 pb-28">
      {/* Header Banner */}
      <section className="bg-[#031632] text-white py-16 px-5 md:px-16 border-b border-[#1A2B48]">
        <div className="max-w-[1280px] mx-auto">
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-2">
            {isEn ? 'Publications & Doctrine' : 'Publications & Doctrine'}
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {isEn ? 'Blog & Doctrinal Columns' : 'Le Blog & Chroniques Doctrinales'}
          </h1>
          <p className="text-[#8293b5] text-base md:text-lg max-w-3xl">
            {isEn
              ? 'In-depth legal analysis, commentaries on landmark rulings, and critical reflections written by Law & Justice academics and practitioners.'
              : 'Analyses juridiques approfondies, commentaires des arrêts de principe et réflexions critiques rédigés par les universitaires et praticiens de Droit & Justice.'}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 mt-12 space-y-8">
        {/* Search & Category Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#e2e2e2]">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categoryKeys.map((catKey) => {
              const label = isEn ? CATEGORY_MAP[catKey].en : CATEGORY_MAP[catKey].fr;
              const isSelected = selectedCategoryKey === catKey;

              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategoryKey(catKey)}
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
              placeholder={isEn ? 'Search by keyword, author...' : 'Rechercher par mot-clé, auteur...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-[#c5c6ce] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);
            const aData = getArticleData(article);

            return (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="bg-white rounded-xl border border-[#e2e2e2] p-8 ambient-shadow-hover flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                      {aData.category}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-[#75777e]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {aData.readTime}
                      </span>
                      <button
                        onClick={(e) => toggleBookmark(article.id, e)}
                        className={`p-1 hover:text-[#C5A059] transition-colors ${
                          isBookmarked ? 'text-[#C5A059]' : 'text-slate-400'
                        }`}
                        title={isEn ? 'Save article' : 'Sauvegarder l\'article'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-playfair text-2xl font-bold text-[#031632] mb-3 group-hover:text-[#C5A059] transition-colors leading-snug">
                    {aData.title}
                  </h3>

                  <p className="text-sm text-[#44474d] leading-relaxed mb-6 line-clamp-3">
                    {aData.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {aData.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-[#f3f3f3] text-[#333333] px-2.5 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#e2e2e2]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#031632]">
                        {article.author.name}
                      </div>
                      <div className="text-[11px] text-[#75777e]">
                        {aData.publishDate}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#031632] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {isEn ? 'Read article' : 'Lire la tribune'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Article Reading Modal */}
      {activeArticle && (() => {
        const aData = getArticleData(activeArticle);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-[#c5c6ce] animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="bg-[#031632] text-white p-6 md:p-8 relative">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white p-2 cursor-pointer rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-2">
                  {aData.category} • {aData.readTime}
                </span>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
                  {aData.title}
                </h2>
                <div className="flex items-center gap-3">
                  <img
                    src={activeArticle.author.avatar}
                    alt={activeArticle.author.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#C5A059]"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {activeArticle.author.name}
                    </div>
                    <div className="text-[11px] text-[#8293b5]">
                      {aData.authorRole} • {isEn ? `Published on ${aData.publishDate}` : `Publié le ${aData.publishDate}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 md:p-10 space-y-6 max-h-[65vh] overflow-y-auto">
                <div className="bg-[#f9f9f9] p-4 rounded-lg border-l-4 border-[#C5A059] italic text-sm text-[#333333] leading-relaxed">
                  "{aData.summary}"
                </div>

                <div className="prose max-w-none text-[#333333] text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line">
                  {aData.content}
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {aData.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#f3f3f3] text-[#333333] px-3 py-1 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert(isEn ? 'Citation link copied to clipboard!' : 'Lien de citation copié dans le presse-papiers !');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#031632] hover:text-[#C5A059] cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-[#C5A059]" />
                    <span>{isEn ? 'Cite this publication' : 'Citer cette publication'}</span>
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="bg-[#031632] text-white text-xs font-semibold px-6 py-2.5 rounded hover:bg-[#1A2B48] transition-colors cursor-pointer"
                >
                  {isEn ? 'Close reading' : 'Fermer la lecture'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

