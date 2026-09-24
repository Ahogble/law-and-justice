import React from 'react';
import { Scale, CheckCircle2, Award, Landmark, FileText, Download } from 'lucide-react';

interface AssociationViewProps {
  onJoinClick: () => void;
  keyFigures?: { value: string; label: string; subtext: string }[];
  pillars?: { id: string; title: string; description: string; iconName: string }[];
}

const DEFAULT_KEY_FIGURES = [
  { value: '1988', label: 'Année de fondation', subtext: 'Plus de 35 ans d’engagement' },
  { value: '1 250+', label: 'Membres & Juristes', subtext: 'Avocats, magistrats, professeurs' },
  { value: '2 850', label: 'Consultations gratuites', subtext: 'Délivrées chaque année' },
  { value: '48', label: 'Rapports & Livres Blancs', subtext: 'Remis aux pouvoirs publics' }
];

export const AssociationView: React.FC<AssociationViewProps> = ({ 
  onJoinClick,
  keyFigures = DEFAULT_KEY_FIGURES,
}) => {
  const meetingImageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC3v0y_SsNA63RzTorXUO8coF1BeiGNRExikhl2eWOt8wdv-XgPtmesxPYyv4kT9dIgl9aMyzgMnGCVg9IRypv8831mTKigYzaGhJsYwSBXugstCN27HWYUd8IcJxaMMqtYcj9N_uW59wVotT2UQ8ctXrWhM7IZtPEIIwvw484lExRs0HzZQcfJayXYKtZA59gLLorVqnU58_FmH1yXY2TPDLysNVcmBMk3eRHAlYxvCkJA6e2dQrOj';

  const figuresToUse = keyFigures && keyFigures.length > 0 ? keyFigures : DEFAULT_KEY_FIGURES;

  return (
    <div className="pt-24 pb-28">
      {/* Header Banner */}
      <section className="bg-[#031632] text-white py-20 px-5 md:px-16 border-b border-[#1A2B48]">
        <div className="max-w-[1280px] mx-auto">
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest block mb-3">
            Institution &amp; Engagements
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            L'Association Droit &amp; Justice
          </h1>
          <p className="text-[#8293b5] text-lg max-w-3xl leading-relaxed">
            Fondée sous l'égide de juristes éminents et de praticiens engagés, Droit &amp; Justice œuvre sans relâche pour la primauté des droits constitutionnels, la modernisation du service public de la justice et la formation doctrinale d'excellence.
          </p>
        </div>
      </section>

      {/* Main Content Presentation */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 mt-16 space-y-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-playfair text-3xl font-bold text-[#031632]">
              Notre Raison d'Être
            </h2>
            <p className="text-[#44474d] text-base leading-relaxed">
              L’association réunit une communauté indépendante d’universitaires, de magistrats, d’avocats et de juristes désireux d’apporter une contribution concrète au perfectionnement de notre système juridique.
            </p>
            <p className="text-[#44474d] text-base leading-relaxed">
              Face à la complexification constante des normes et aux défis de la transition numérique, Droit &amp; Justice constitue un pôle de rigueur doctrinale, de propositions réformatrices et d’accès effectif au droit.
            </p>
            <div className="pt-4">
              <button
                onClick={onJoinClick}
                className="bg-[#031632] text-white font-semibold text-sm px-6 py-3 rounded hover:bg-[#1A2B48] transition-colors cursor-pointer"
              >
                Rejoindre l'association
              </button>
            </div>
          </div>

          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg border border-[#e2e2e2]">
            <img
              src={meetingImageUrl}
              alt="Assemblée générale Droit & Justice"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Key Figures Grid */}
        <div className="bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] p-10">
          <h3 className="font-playfair text-2xl font-bold text-[#031632] mb-8 text-center">
            Droit &amp; Justice en Chiffres
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {figuresToUse.map((fig, idx) => (
              <div key={idx} className="text-center">
                <div className="font-playfair text-4xl font-bold text-[#C5A059] mb-2">
                  {fig.value}
                </div>
                <div className="text-sm font-semibold text-[#031632] mb-1">
                  {fig.label}
                </div>
                <div className="text-xs text-[#75777e]">
                  {fig.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Charter Download */}
        <div className="bg-[#031632] text-white rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
              Document Officiel
            </span>
            <h3 className="font-playfair text-2xl font-bold">
              Statuts &amp; Charte Éthique de l'Association
            </h3>
            <p className="text-[#8293b5] text-sm max-w-xl">
              Téléchargez l'intégralité de nos statuts déposés et notre charte de déontologie régissant nos comités d'études.
            </p>
          </div>

          <button
            onClick={() => alert("Téléchargement des statuts officiels Droit & Justice")}
            className="bg-[#C5A059] text-[#031632] font-semibold text-sm px-6 py-3 rounded hover:bg-[#b08e4c] transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger les Statuts (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
