import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Video, Check, X } from 'lucide-react';
import { Activity } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

const ACTIVITY_TRANSLATIONS: Record<string, {
  titleEn: string;
  typeEn: string;
  dateEn: string;
  timeEn: string;
  locationEn: string;
  descriptionEn: string;
  speakersEn: string[];
  prerequisitesEn?: string;
}> = {
  act1: {
    titleEn: 'Annual Conference: "The Rule of Law Facing Contemporary Crises"',
    typeEn: 'Annual Conference',
    dateEn: 'November 14, 2024',
    timeEn: '09:00 AM - 06:00 PM',
    locationEn: 'Sorbonne Grand Amphitheater, Paris & Live Stream',
    descriptionEn: 'A day of keynote lectures bringing together academics, senior judges, and attorneys to examine the resilience of constitutional and democratic guarantees.',
    speakersEn: [
      'Hélène de Saint-Maur (President)',
      'Prof. Jean-Marc Vallery (Scientific Committee)',
      'Representatives from the European Court of Human Rights',
      'Deans of law faculties'
    ],
    prerequisitesEn: 'Open to the general public. Accredited for 7 hours of continuing bar education.'
  },
  act2: {
    titleEn: 'Roundtable: "Artificial Intelligence & Professional Secrecy"',
    typeEn: 'Roundtable',
    dateEn: 'November 28, 2024',
    timeEn: '06:30 PM - 08:30 PM',
    locationEn: 'Maison du Barreau, Gaston Monnerville Room, Paris',
    descriptionEn: 'Analysis of data leak risks and due diligence duties when deploying Large Language Models (LLMs) in legal practice.',
    speakersEn: [
      'Dr. Soraya Benali (Research Director)',
      'Atty. Thomas Gauthier (GDPR Specialist)',
      'CNIL Board Member'
    ]
  },
  act3: {
    titleEn: 'Clinical Workshop: Emergency Litigation Training (Injunctions)',
    typeEn: 'Practical Workshop',
    dateEn: 'December 05, 2024',
    timeEn: '02:00 PM - 05:30 PM',
    locationEn: 'Association Headquarters, 12 rue Royale, 75008 Paris',
    descriptionEn: 'Intensive practical session on drafting emergency stay and liberty petitions before administrative and judicial courts.',
    speakersEn: ['Atty. Gabriel Leroy', 'Claire Beauchamp'],
    prerequisitesEn: 'Reserved for full members and student members of the association.'
  },
  act4: {
    titleEn: 'Keynote Lecture: "The Evolution of Ecological Damage"',
    typeEn: 'Keynote Lecture',
    dateEn: 'October 18, 2024',
    timeEn: '06:00 PM - 08:00 PM',
    locationEn: 'Lyon III Faculty of Law & Replay Available',
    descriptionEn: 'Review of landmark rulings by the Court of Cassation and perspectives on European climate litigation harmonization.',
    speakersEn: ['Prof. Jean-Marc Vallery', 'Environmental Chamber Magistrates']
  }
};

interface ActivitiesViewProps {
  activities?: Activity[];
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({ activities = [] }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [registrationForm, setRegistrationForm] = useState({
    fullName: '',
    email: '',
    profession: 'Avocat',
    wantsCertificate: true
  });

  const filteredActivities = activities.filter((act) => {
    if (activeFilter === 'all') return true;
    return act.status === activeFilter;
  });

  const getActivityData = (activity: Activity) => {
    const extra = ACTIVITY_TRANSLATIONS[activity.id];
    return {
      title: isEn && extra ? extra.titleEn : activity.title,
      type: isEn && extra ? extra.typeEn : activity.type,
      date: isEn && extra ? extra.dateEn : activity.date,
      time: isEn && extra ? extra.timeEn : activity.time,
      location: isEn && extra ? extra.locationEn : activity.location,
      description: isEn && extra ? extra.descriptionEn : activity.description,
      speakers: isEn && extra ? extra.speakersEn : activity.speakers,
      prerequisites: isEn && extra ? extra.prerequisitesEn : activity.prerequisites
    };
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationForm.fullName || !registrationForm.email) return;
    setRegisterSuccess(true);
  };

  return (
    <div className="pt-24 pb-28">
      {/* Header Banner */}
      <section className="bg-[#031632] text-white py-16 px-5 md:px-16 border-b border-[#1A2B48]">
        <div className="max-w-[1280px] mx-auto">
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-2">
            {isEn ? 'Agenda & Debates' : 'Agenda & Débats'}
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {isEn ? 'Activities & Training' : 'Activités & Formations'}
          </h1>
          <p className="text-[#8293b5] text-base md:text-lg max-w-3xl">
            {isEn
              ? 'Participate in our academic conferences, ethical roundtables, and practical workshops accredited for continuous legal education.'
              : 'Participez à nos colloques académiques, tables rondes déontologiques et ateliers pratiques agréés au titre de la formation continue des professionnels du droit.'}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 mt-12 space-y-8">
        {/* Filter Switcher */}
        <div className="flex gap-3 pb-6 border-b border-[#e2e2e2]">
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`text-xs font-semibold px-5 py-2.5 rounded transition-all cursor-pointer ${
              activeFilter === 'upcoming'
                ? 'bg-[#031632] text-white shadow-sm'
                : 'bg-white text-[#333333] hover:bg-slate-100 border border-[#e2e2e2]'
            }`}
          >
            {isEn ? 'Upcoming Events' : 'Événements à venir'}
          </button>
          <button
            onClick={() => setActiveFilter('past')}
            className={`text-xs font-semibold px-5 py-2.5 rounded transition-all cursor-pointer ${
              activeFilter === 'past'
                ? 'bg-[#031632] text-white shadow-sm'
                : 'bg-white text-[#333333] hover:bg-slate-100 border border-[#e2e2e2]'
            }`}
          >
            {isEn ? 'Archives & Replays' : 'Archives & Replays'}
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-xs font-semibold px-5 py-2.5 rounded transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#031632] text-white shadow-sm'
                : 'bg-white text-[#333333] hover:bg-slate-100 border border-[#e2e2e2]'
            }`}
          >
            {isEn ? 'All Events' : 'Tous les événements'}
          </button>
        </div>

        {/* Activity Cards List */}
        <div className="space-y-6">
          {filteredActivities.map((activity) => {
            const aData = getActivityData(activity);

            return (
              <div
                key={activity.id}
                className="bg-white rounded-xl border border-[#e2e2e2] p-6 md:p-8 ambient-shadow-hover flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] bg-[#f9f9f9] px-2.5 py-1 rounded border border-[#e2e2e2]">
                      {aData.type}
                    </span>
                    {activity.isOnline && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        <Video className="w-3 h-3" />
                        {isEn ? 'Live stream available' : 'Retransmission en direct disponible'}
                      </span>
                    )}
                    {activity.status === 'past' && (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                        {isEn ? 'Past event' : 'Événement terminé'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#031632]">
                    {aData.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#44474d] leading-relaxed">
                    {aData.description}
                  </p>

                  {/* Details Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#75777e]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C5A059]" />
                      <span>{aData.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C5A059]" />
                      <span>{aData.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C5A059]" />
                      <span className="truncate">{aData.location}</span>
                    </div>
                  </div>

                  {/* Speakers */}
                  <div className="text-xs text-[#75777e] pt-1">
                    <strong className="text-[#333333]">{isEn ? 'Speakers:' : 'Intervenants :'}</strong>{' '}
                    {aData.speakers.join(' • ')}
                  </div>
                </div>

                {/* Action side */}
                <div className="lg:w-64 shrink-0 flex flex-col items-start lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 gap-4">
                  <div className="text-left lg:text-right">
                    <div className="text-xs text-[#75777e]">{isEn ? 'Reserved seats' : 'Places réservées'}</div>
                    <div className="text-sm font-bold text-[#031632]">
                      {activity.registeredCount} / {activity.capacity} {isEn ? 'registered' : 'inscrits'}
                    </div>
                    <div className="w-36 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-[#C5A059] h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (activity.registeredCount / activity.capacity) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  {activity.status === 'upcoming' ? (
                    <button
                      onClick={() => {
                        setSelectedActivity(activity);
                        setRegisterSuccess(false);
                      }}
                      className="w-full bg-[#031632] hover:bg-[#1A2B48] text-white text-xs font-semibold px-6 py-3 rounded border-b-2 border-[#C5A059] transition-all shadow-sm cursor-pointer text-center"
                    >
                      {isEn ? 'Register for event' : 'S\'inscrire à l\'événement'}
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(isEn ? `Access to proceedings and audio recordings for: ${aData.title}` : `Accès aux actes et enregistrements audio pour : ${aData.title}`)}
                      className="w-full bg-white text-[#031632] hover:bg-slate-50 text-xs font-semibold px-6 py-3 rounded border border-[#c5c6ce] transition-all shadow-sm cursor-pointer text-center"
                    >
                      {isEn ? 'Access proceedings & Replay' : 'Accéder aux actes & Replay'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Registration Modal */}
      {selectedActivity && (() => {
        const aData = getActivityData(selectedActivity);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden border border-[#c5c6ce] animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="bg-[#031632] text-white p-6 relative">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white p-2 cursor-pointer rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-1">
                  {isEn ? 'Official Registration' : 'Inscription Officielle'}
                </span>
                <h3 className="font-playfair text-xl font-bold text-white">
                  {aData.title}
                </h3>
                <p className="text-xs text-[#8293b5] mt-1">
                  {aData.date} • {aData.time}
                </p>
              </div>

              {/* Modal Form or Success Receipt */}
              <div className="p-6 md:p-8">
                {!registerSuccess ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                        {isEn ? 'Full Name *' : 'Nom et Prénom *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isEn ? 'Atty / Dr / Mr / Ms ...' : 'Me / Dr / M. / Mme ...'}
                        value={registrationForm.fullName}
                        onChange={(e) =>
                          setRegistrationForm({ ...registrationForm, fullName: e.target.value })
                        }
                        className="w-full bg-white px-3.5 py-2.5 text-sm border border-[#c5c6ce] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                        {isEn ? 'Institutional Email Address *' : 'Adresse Courriel Institutionnelle *'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nom.prenom@cabinet.fr"
                        value={registrationForm.email}
                        onChange={(e) =>
                          setRegistrationForm({ ...registrationForm, email: e.target.value })
                        }
                        className="w-full bg-white px-3.5 py-2.5 text-sm border border-[#c5c6ce] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                          {isEn ? 'Title / Profession' : 'Qualité / Profession'}
                        </label>
                        <select
                          value={registrationForm.profession}
                          onChange={(e) =>
                            setRegistrationForm({ ...registrationForm, profession: e.target.value })
                          }
                          className="w-full bg-white px-3.5 py-2.5 text-sm border border-[#c5c6ce] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                        >
                          <option value="Avocat">{isEn ? 'Attorney' : 'Avocat'}</option>
                          <option value="Magistrat">{isEn ? 'Magistrate / Judge' : 'Magistrat'}</option>
                          <option value="Universitaire">{isEn ? 'Academic' : 'Universitaire'}</option>
                          <option value="Juriste">{isEn ? 'Corporate Counsel' : 'Juriste d\'Entreprise'}</option>
                          <option value="Étudiant">{isEn ? 'Law Student' : 'Étudiant en Droit'}</option>
                          <option value="Autre">{isEn ? 'Other' : 'Autre'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#333333] block mb-1">
                          {isEn ? 'Participation Mode' : 'Mode de participation'}
                        </label>
                        <select
                          value={registrationForm.attendance}
                          onChange={(e) =>
                            setRegistrationForm({ ...registrationForm, attendance: e.target.value })
                          }
                          className="w-full bg-white px-3.5 py-2.5 text-sm border border-[#c5c6ce] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                        >
                          <option value="presentiel">{isEn ? 'In-person (On site)' : 'Sur place (Présentiel)'}</option>
                          <option value="distance">{isEn ? 'Videoconference (Live)' : 'Visioconférence (Direct)'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-xs text-[#75777e] bg-slate-50 p-3 rounded border border-slate-100">
                      {isEn
                        ? 'A certificate of attendance for bar continuing education will be issued following the session.'
                        : 'Une attestation de présence pour la formation continue des barreaux sera délivrée à l\'issue de la séance.'}
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setSelectedActivity(null)}
                        className="text-xs font-semibold text-[#75777e] px-4 py-2 hover:text-[#333333] cursor-pointer"
                      >
                        {isEn ? 'Cancel' : 'Annuler'}
                      </button>
                      <button
                        type="submit"
                        className="bg-[#031632] text-white text-xs font-semibold px-6 py-3 rounded hover:bg-[#1A2B48] border-b-2 border-[#C5A059] transition-all cursor-pointer shadow-sm"
                      >
                        {isEn ? 'Confirm Registration' : 'Confirmer l\'inscription'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="font-playfair text-2xl font-bold text-[#031632]">
                      {isEn ? 'Registration Validated' : 'Inscription Validée'}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#44474d] max-w-md mx-auto">
                      {isEn
                        ? `Your seat is confirmed for ${aData.title}. A confirmation email with access details has been sent to ${registrationForm.email}.`
                        : `Votre place est confirmée pour ${aData.title}. Un courriel de convocation avec vos identifiants d'accès a été envoyé à ${registrationForm.email}.`}
                    </p>

                    <div className="bg-[#f9f9f9] p-4 rounded-lg border border-[#e2e2e2] text-left text-xs space-y-1.5 max-w-sm mx-auto">
                      <div className="flex justify-between">
                        <span className="text-[#75777e]">{isEn ? 'Participant:' : 'Participant :'}</span>
                        <span className="font-semibold text-[#031632]">{registrationForm.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#75777e]">{isEn ? 'Date & Time:' : 'Date & Heure :'}</span>
                        <span className="font-semibold text-[#031632]">{aData.date} ({aData.time})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#75777e]">{isEn ? 'Location:' : 'Lieu :'}</span>
                        <span className="font-semibold text-[#031632]">
                          {registrationForm.attendance === 'distance'
                            ? (isEn ? 'Live stream' : 'En direct streaming')
                            : aData.location}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        onClick={() => setSelectedActivity(null)}
                        className="bg-[#031632] text-white text-xs font-semibold px-6 py-2.5 rounded hover:bg-[#1A2B48] cursor-pointer"
                      >
                        {isEn ? 'Finish' : 'Terminer'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

