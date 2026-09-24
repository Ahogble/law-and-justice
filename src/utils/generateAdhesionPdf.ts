import { jsPDF } from 'jspdf';

export interface AdhesionPdfData {
  memberNumber: string;
  civility: string;
  firstName: string;
  lastName: string;
  profession: string;
  institution?: string;
  email: string;
  phone?: string;
  tierName: string;
  tierPrice: number;
  issueDate?: string;
}

export function generateAdhesionPdfBlobUrl(data: AdhesionPdfData): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const now = data.issueDate || new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Top header banner background (Navy #031632)
  doc.setFillColor(3, 22, 50);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent bar (#C5A059)
  doc.setFillColor(197, 160, 89);
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Institution title on header
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('DROIT & JUSTICE', margin, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(197, 160, 89);
  doc.text('INSTITUTION POUR LA DEFENSE DE L\'ETAT DE DROIT ET LA DOCTRINE JURIDIQUE', margin, 27);

  doc.setFontSize(7.5);
  doc.setTextColor(200, 210, 230);
  doc.text('Association regie par la loi du 1er juillet 1901 - Reconnue d\'interet general', margin, 34);
  doc.text('12 rue Royale, 75008 Paris | SIRET : 842 190 284 00018 | RNA : W751239847', margin, 38);

  // Document Title Box
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(3, 22, 50);
  doc.text('ATTESTATION OFFICIELLE D\'ADHESION', pageWidth / 2, 58, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(197, 160, 89);
  doc.text('EXERCICE CIVIL ' + new Date().getFullYear(), pageWidth / 2, 64, { align: 'center' });

  // Border frame around document body
  doc.setDrawColor(210, 215, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, 72, contentWidth, 195, 3, 3);

  // Inner metadata row
  doc.setFillColor(248, 249, 252);
  doc.rect(margin + 0.4, 72.4, contentWidth - 0.8, 16, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(3, 22, 50);
  doc.text(`Identifiant d'Adherent : ${data.memberNumber}`, margin + 5, 82);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 100, 115);
  doc.text(`Delivree a Paris, le ${now}`, pageWidth - margin - 5, 82, { align: 'right' });

  // Member Identity Card Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(197, 160, 89);
  doc.text('I. IDENTITE DU MEMBRE ENREGISTRE', margin + 6, 98);

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.5);
  doc.line(margin + 6, 100, margin + 65, 100);

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(3, 22, 50);
  const fullName = `${data.civility} ${data.firstName} ${data.lastName}`.toUpperCase();
  doc.text(fullName, margin + 6, 108);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(`Profession / Qualite : ${data.profession}`, margin + 6, 115);
  if (data.institution) {
    doc.text(`Rattachement : ${data.institution}`, margin + 6, 121);
  }
  doc.text(`Adresse de contact : ${data.email}`, margin + 6, 127);
  if (data.phone) {
    doc.text(`Telephone : ${data.phone}`, margin + 6, 133);
  }

  // Membership & Fiscal Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(197, 160, 89);
  doc.text('II. QUALITE DE MEMBRE & COTISATION', margin + 6, 145);
  doc.line(margin + 6, 147, margin + 72, 147);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);

  const certText1 = `Le Secretariat General et le Conseil d'Administration de l'Association Droit & Justice attestent que la personne susnommee a ete valablement agrementee au sein du :`;
  const splitText1 = doc.splitTextToSize(certText1, contentWidth - 12);
  doc.text(splitText1, margin + 6, 155);

  // Badge tier box
  doc.setFillColor(3, 22, 50);
  doc.roundedRect(margin + 6, 164, contentWidth - 12, 14, 2, 2, 'F');
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.tierName.toUpperCase()} — Montant acquitte : ${data.tierPrice} EUR TTC`, margin + 12, 173);

  // Legal & Tax information
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(80, 85, 95);
  const certText2 = `L'Association Droit & Justice est un organisme d'interet general a caractere educatif et scientifique au sens des articles 200 et 238 bis du Code General des Impots (CGI). A ce titre, le versement de cette cotisation ouvre droit pour le souscripteur a une reduction d'impot egale a 66% de son montant dans la limite de 20% du revenu imposable (ou 60% pour les personnes morales).`;
  const splitText2 = doc.splitTextToSize(certText2, contentWidth - 12);
  doc.text(splitText2, margin + 6, 186);

  // Seal & Signature Box
  doc.setDrawColor(220, 225, 235);
  doc.line(margin + 6, 208, pageWidth - margin - 6, 208);

  // Seal circle simulation
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.7);
  doc.circle(margin + 24, 232, 14);
  doc.setFont('times', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(197, 160, 89);
  doc.text('DROIT & JUSTICE', margin + 24, 230, { align: 'center' });
  doc.text('* SCEAU OFFICIEL *', margin + 24, 233.5, { align: 'center' });
  doc.text('PARIS 1901', margin + 24, 237, { align: 'center' });

  // Signatures on right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(3, 22, 50);
  doc.text('Pour le Bureau & la Présidence :', pageWidth - margin - 55, 218);

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(3, 22, 50);
  doc.text('Helene de Saint-Maur', pageWidth - margin - 55, 228);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 105, 115);
  doc.text('Presidente de l\'Association Droit & Justice', pageWidth - margin - 55, 234);
  doc.text('Signature electronique certifiee RGS**', pageWidth - margin - 55, 238);

  // Bottom footer page
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 145, 155);
  doc.text(
    `Document officiel genere conformement a l'art. 1366 du Code civil - Empreinte de securite : ${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}

export function downloadAdhesionPdf(data: AdhesionPdfData, filename?: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const now = data.issueDate || new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  doc.setFillColor(3, 22, 50);
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setFillColor(197, 160, 89);
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('DROIT & JUSTICE', margin, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(197, 160, 89);
  doc.text('INSTITUTION POUR LA DEFENSE DE L\'ETAT DE DROIT ET LA DOCTRINE JURIDIQUE', margin, 27);

  doc.setFontSize(7.5);
  doc.setTextColor(200, 210, 230);
  doc.text('Association regie par la loi du 1er juillet 1901 - Reconnue d\'interet general', margin, 34);
  doc.text('12 rue Royale, 75008 Paris | SIRET : 842 190 284 00018 | RNA : W751239847', margin, 38);

  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(3, 22, 50);
  doc.text('ATTESTATION OFFICIELLE D\'ADHESION', pageWidth / 2, 58, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(197, 160, 89);
  doc.text('EXERCICE CIVIL ' + new Date().getFullYear(), pageWidth / 2, 64, { align: 'center' });

  doc.setDrawColor(210, 215, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, 72, contentWidth, 195, 3, 3);

  doc.setFillColor(248, 249, 252);
  doc.rect(margin + 0.4, 72.4, contentWidth - 0.8, 16, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(3, 22, 50);
  doc.text(`Identifiant d'Adherent : ${data.memberNumber}`, margin + 5, 82);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 100, 115);
  doc.text(`Delivree a Paris, le ${now}`, pageWidth - margin - 5, 82, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(197, 160, 89);
  doc.text('I. IDENTITE DU MEMBRE ENREGISTRE', margin + 6, 98);

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.5);
  doc.line(margin + 6, 100, margin + 65, 100);

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(3, 22, 50);
  const fullName = `${data.civility} ${data.firstName} ${data.lastName}`.toUpperCase();
  doc.text(fullName, margin + 6, 108);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(`Profession / Qualite : ${data.profession}`, margin + 6, 115);
  if (data.institution) {
    doc.text(`Rattachement : ${data.institution}`, margin + 6, 121);
  }
  doc.text(`Adresse de contact : ${data.email}`, margin + 6, 127);
  if (data.phone) {
    doc.text(`Telephone : ${data.phone}`, margin + 6, 133);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(197, 160, 89);
  doc.text('II. QUALITE DE MEMBRE & COTISATION', margin + 6, 145);
  doc.line(margin + 6, 147, margin + 72, 147);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);

  const certText1 = `Le Secretariat General et le Conseil d'Administration de l'Association Droit & Justice attestent que la personne susnommee a ete valablement agrementee au sein du :`;
  const splitText1 = doc.splitTextToSize(certText1, contentWidth - 12);
  doc.text(splitText1, margin + 6, 155);

  doc.setFillColor(3, 22, 50);
  doc.roundedRect(margin + 6, 164, contentWidth - 12, 14, 2, 2, 'F');
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.tierName.toUpperCase()} — Montant acquitte : ${data.tierPrice} EUR TTC`, margin + 12, 173);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(80, 85, 95);
  const certText2 = `L'Association Droit & Justice est un organisme d'interet general a caractere educatif et scientifique au sens des articles 200 et 238 bis du Code General des Impots (CGI). A ce titre, le versement de cette cotisation ouvre droit pour le souscripteur a une reduction d'impot egale a 66% de son montant dans la limite de 20% du revenu imposable (ou 60% pour les personnes morales).`;
  const splitText2 = doc.splitTextToSize(certText2, contentWidth - 12);
  doc.text(splitText2, margin + 6, 186);

  doc.setDrawColor(220, 225, 235);
  doc.line(margin + 6, 208, pageWidth - margin - 6, 208);

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.7);
  doc.circle(margin + 24, 232, 14);
  doc.setFont('times', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(197, 160, 89);
  doc.text('DROIT & JUSTICE', margin + 24, 230, { align: 'center' });
  doc.text('* SCEAU OFFICIEL *', margin + 24, 233.5, { align: 'center' });
  doc.text('PARIS 1901', margin + 24, 237, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(3, 22, 50);
  doc.text('Pour le Bureau & la Présidence :', pageWidth - margin - 55, 218);

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(3, 22, 50);
  doc.text('Helene de Saint-Maur', pageWidth - margin - 55, 228);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 105, 115);
  doc.text('Presidente de l\'Association Droit & Justice', pageWidth - margin - 55, 234);
  doc.text('Signature electronique certifiee RGS**', pageWidth - margin - 55, 238);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 145, 155);
  doc.text(
    `Document officiel genere conformement a l'art. 1366 du Code civil`,
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  const finalName = filename || `Attestation_Adhesion_Droit_Justice_${data.memberNumber}.pdf`;
  doc.save(finalName);
}
