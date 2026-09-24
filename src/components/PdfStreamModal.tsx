import React, { useState } from 'react';
import { X, Download, Printer, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Scale, Shield, Check, Eye } from 'lucide-react';
import { AdhesionPdfData, downloadAdhesionPdf } from '../utils/generateAdhesionPdf';

interface PdfStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfBlobUrl: string | null;
  data: AdhesionPdfData;
}

export const PdfStreamModal: React.FC<PdfStreamModalProps> = ({
  isOpen,
  onClose,
  pdfBlobUrl,
  data
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'stream' | 'facsimile'>('stream');

  if (!isOpen || !pdfBlobUrl) return null;

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-stream-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        return;
      } catch (err) {
        console.warn('Iframe print restricted, fallback to window.print', err);
      }
    }
    window.print();
  };

  const handleDownload = () => {
    downloadAdhesionPdf(data);
  };

  const handleOpenNewTab = () => {
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, '_blank');
    }
  };

  return (
    <div
      id="pdf-stream-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="pdf-stream-modal-container"
        className="bg-[#1f232b] text-white w-full max-w-5xl h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-200"
      >
        {/* Top Navigation & Controls Bar */}
        <div className="bg-[#031632] px-4 py-3 border-b border-[#1A2B48] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Document Title & Stream Status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/40">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  Attestation_Adhesion_{data.memberNumber}.pdf
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Flux PDF Actif
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#8293b5]">
                Format A4 (210 × 297 mm) • Certifié Droit &amp; Justice • Reçu fiscal CGI art. 200
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex bg-slate-800 p-0.5 rounded border border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('stream')}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] font-semibold cursor-pointer ${
                  viewMode === 'stream' ? 'bg-[#C5A059] text-[#031632]' : 'text-slate-300 hover:text-white'
                }`}
              >
                Flux PDF natif
              </button>
              <button
                onClick={() => setViewMode('facsimile')}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] font-semibold cursor-pointer ${
                  viewMode === 'facsimile' ? 'bg-[#C5A059] text-[#031632]' : 'text-slate-300 hover:text-white'
                }`}
              >
                Aperçu fac-similé
              </button>
            </div>

            {/* Zoom Controls (Active in facsimile mode) */}
            {viewMode === 'facsimile' && (
              <div className="hidden md:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs">
                <button
                  onClick={() => setZoom(Math.max(60, zoom - 15))}
                  className="p-1 text-slate-300 hover:text-white"
                  title="Zoom arrière"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] w-12 text-center">{zoom}%</span>
                <button
                  onClick={() => setZoom(Math.min(160, zoom + 15))}
                  className="p-1 text-slate-300 hover:text-white"
                  title="Zoom avant"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoom(100)}
                  className="p-1 text-slate-400 hover:text-white ml-1"
                  title="Réinitialiser"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 transition-colors cursor-pointer"
              title="Imprimer l'attestation"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#d6b36e] text-[#031632] px-3 py-1.5 rounded font-semibold text-xs transition-colors cursor-pointer shadow-sm"
              title="Télécharger le fichier PDF sur votre appareil"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Télécharger</span>
            </button>

            {/* External Tab */}
            <button
              onClick={handleOpenNewTab}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition-colors cursor-pointer"
              title="Ouvrir le flux PDF dans un nouvel onglet"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer ml-1"
              title="Fermer la visionneuse"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="flex-1 bg-[#2a2d36] overflow-auto relative flex justify-center p-2 sm:p-6">
          {viewMode === 'stream' ? (
            <div className="w-full h-full rounded-lg overflow-hidden bg-white shadow-xl flex flex-col">
              <iframe
                id="pdf-stream-iframe"
                src={`${pdfBlobUrl}#toolbar=1&navpanes=0`}
                title="Flux PDF Attestation d'adhésion"
                className="w-full h-full border-0 rounded-lg flex-1"
              />
              <div className="bg-slate-900 text-slate-400 text-[11px] px-4 py-2 border-t border-slate-800 flex justify-between items-center shrink-0">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                  Flux de données PDF en mémoire locale (Blob URL sécurisé)
                </span>
                <button
                  onClick={() => setViewMode('facsimile')}
                  className="text-[#C5A059] hover:underline"
                >
                  Problème d'affichage navigateur ? Passer en fac-similé
                </button>
              </div>
            </div>
          ) : (
            /* Facsimile Mode (renders the physical sheet with typography & official elements) */
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="w-[210mm] min-h-[297mm] bg-white text-[#1a1c1c] shadow-2xl p-10 flex flex-col justify-between shrink-0 rounded-xs select-text border border-slate-300"
            >
              {/* Header Box */}
              <div>
                <div className="bg-[#031632] text-white p-6 rounded-t-sm -mx-10 -mt-10 mb-6 border-b-4 border-[#C5A059]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-playfair text-2xl font-bold tracking-tight text-white">
                        DROIT &amp; JUSTICE
                      </div>
                      <div className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-wider mt-0.5">
                        Institution pour la défense de l'État de droit et la doctrine juridique
                      </div>
                      <div className="text-[10px] text-slate-300 mt-2 space-y-0.5 font-sans">
                        <p>Association régie par la loi du 1er juillet 1901 – Reconnue d'intérêt général</p>
                        <p>12 rue Royale, 75008 Paris • SIRET : 842 190 284 00018 • RNA : W751239847</p>
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                      <Scale className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center my-6">
                  <h1 className="font-playfair text-2xl font-bold text-[#031632] uppercase tracking-wide">
                    Attestation Officielle d'Adhésion
                  </h1>
                  <p className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mt-1">
                    Exercice Civil {new Date().getFullYear()}
                  </p>
                </div>

                {/* Reference Banner */}
                <div className="bg-[#f9f9f9] border border-[#e2e2e2] p-3 rounded flex justify-between text-xs mb-8">
                  <div>
                    <span className="text-slate-500">Identifiant d'adhérent : </span>
                    <strong className="text-[#031632] font-mono">{data.memberNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Délivrée à Paris, le </span>
                    <strong className="text-[#031632]">{data.issueDate || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </div>
                </div>

                {/* Member Box */}
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] border-b-2 border-[#C5A059] pb-1 mb-3">
                    I. Identité du Membre Enregistré
                  </h2>
                  <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
                    <div className="text-base font-bold font-playfair text-[#031632]">
                      {data.civility} {data.firstName} {data.lastName}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[#333333]">
                      <p><strong>Qualité / Profession :</strong> {data.profession}</p>
                      <p><strong>Rattachement :</strong> {data.institution || 'Barreau / Juridiction'}</p>
                      <p><strong>Courriel professionnel :</strong> {data.email}</p>
                      <p><strong>Téléphone :</strong> {data.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>

                {/* Membership & Tax Box */}
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] border-b-2 border-[#C5A059] pb-1 mb-3">
                    II. Qualité de Membre &amp; Cotisation
                  </h2>
                  <p className="text-xs text-[#44474d] leading-relaxed mb-3">
                    Le Secrétariat Général et le Conseil d'Administration de l'Association Droit &amp; Justice attestent par la présente que la personne susnommée a été valablement agréée en qualité de :
                  </p>
                  <div className="bg-[#031632] text-white p-4 rounded text-xs flex justify-between items-center mb-4">
                    <div>
                      <span className="text-[10px] text-[#C5A059] uppercase block font-semibold">Collège statutaire</span>
                      <strong className="text-sm font-playfair">{data.tierName}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-300 block">Cotisation annuelle acquittée</span>
                      <strong className="text-base font-bold text-[#C5A059]">{data.tierPrice} € TTC</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-[11px] text-amber-900 leading-relaxed italic">
                    L'Association Droit &amp; Justice est un organisme d'intérêt général à caractère éducatif et scientifique au sens des articles 200 et 238 bis du Code Général des Impôts (CGI). À ce titre, le versement de cette cotisation ouvre droit à une réduction d'impôt sur le revenu égale à 66% de son montant dans la limite de 20% du revenu imposable.
                  </div>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="border-t-2 border-slate-200 pt-6 mt-8">
                <div className="flex justify-between items-end">
                  {/* Seal */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#C5A059] flex flex-col items-center justify-center text-[#C5A059] text-[9px] font-bold text-center leading-tight">
                      <Scale className="w-5 h-5 mb-0.5" />
                      <span>DROIT &amp; JUSTICE</span>
                      <span className="text-[8px] font-mono">PARIS • 1901</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Cachet officiel d'authentification<br />
                      Validité permanente pour l'exercice
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="text-right text-xs">
                    <p className="font-semibold text-[#031632] mb-1">Pour le Bureau &amp; la Présidence :</p>
                    <p className="font-playfair text-base italic font-bold text-[#031632]">
                      Hélène de Saint-Maur
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Présidente de l'Association Droit &amp; Justice
                    </p>
                    <p className="text-[10px] text-emerald-700 font-mono flex items-center justify-end gap-1 mt-1">
                      <Check className="w-3 h-3" />
                      Signature électronique qualifiée eIDAS
                    </p>
                  </div>
                </div>

                <div className="text-center text-[9px] text-slate-400 mt-8">
                  Document officiel généré numériquement conformément à l'article 1366 du Code civil.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Status */}
        <div className="bg-[#031632] px-6 py-3 border-t border-[#1A2B48] flex justify-between items-center text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-semibold">Attestation dématérialisée</span>
            <span>• N° {data.memberNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="text-white hover:text-[#C5A059] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Enregistrer le fichier</span>
            </button>
            <span>|</span>
            <button
              onClick={onClose}
              className="text-white hover:text-slate-300 transition-colors cursor-pointer"
            >
              Fermer la visionneuse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
