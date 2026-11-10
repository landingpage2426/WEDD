import { jsPDF } from 'jspdf';
import {
  capitalizePrenom,
  countInvitePeople,
  formatBilletNom,
  getBilletCivility,
  getInvitePersonCount,
} from './invitePeople.js';

const PAGE_W = 297;
const PAGE_H = 210;
const MARGIN_X = 12;
const TABLE_TOP = 40;
const ROW_H = 8;
const FOOTER_Y = PAGE_H - 8;
const CONTENT_BOTTOM = PAGE_H - 16;

const COLUMNS = [
  { key: 'titre', label: 'Titre', width: 22 },
  { key: 'nom', label: 'Nom', width: 38 },
  { key: 'prenom', label: 'Prénom', width: 36 },
  { key: 'id', label: 'ID', width: 22 },
  { key: 'table', label: 'Table', width: 30 },
  { key: 'contact', label: 'Contact', width: 36 },
  { key: 'email', label: 'Email', width: 64 },
  { key: 'personnes', label: 'Personnes', width: 25 },
];

const CONTENT_W = COLUMNS.reduce((sum, column) => sum + column.width, 0);
const ROWS_PER_PAGE = Math.floor((CONTENT_BOTTOM - TABLE_TOP - ROW_H) / ROW_H);

const dash = (value) => {
  const text = String(value || '').trim();
  return text && text !== '-' ? text : '-';
};

const rowValues = (invite) => {
  const prenom = invite.prenom && invite.prenom !== '-' ? capitalizePrenom(invite.prenom) : '';
  const phone = String(invite.telephone || '').trim();
  return {
    titre: dash(getBilletCivility(invite.titre)),
    nom: dash(formatBilletNom(invite.nom)),
    prenom: dash(prenom),
    id: dash(invite.inviteId),
    table: dash(invite.nomTable),
    contact: phone ? `+237 ${phone}` : '-',
    email: dash(invite.email),
    personnes: String(getInvitePersonCount(invite)),
  };
};

const fitText = (doc, text, width) => {
  const maxWidth = width - 3;
  let value = String(text);
  if (doc.getTextWidth(value) <= maxWidth) return value;
  while (value.length > 1 && doc.getTextWidth(`${value}...`) > maxWidth) {
    value = value.slice(0, -1);
  }
  return `${value}...`;
};

const drawFooter = (doc, page, totalPages) => {
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(MARGIN_X, PAGE_H - 14, MARGIN_X + CONTENT_W, PAGE_H - 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${page}/${totalPages}`, PAGE_W / 2, FOOTER_Y, { align: 'center' });
};

const formatLongDate = (value, timeZone) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  });
};

const formatGeneratedAt = (value) => {
  const date = value instanceof Date ? value : new Date();
  return date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const formatMaries = (prenom, nom) => {
  const fullName = `${capitalizePrenom(prenom || '')} ${formatBilletNom(nom || '')}`.trim();
  return fullName || 'Non renseigné';
};

const drawHeader = (doc, invites, wedding = {}, generatedAt = new Date()) => {
  const people = countInvitePeople(invites);
  const generatedOn = formatGeneratedAt(generatedAt);
  const weddingDate = formatLongDate(wedding.dateMariage, 'UTC');
  const guestLabel = `${invites.length} invité${invites.length > 1 ? 's' : ''}`;
  const peopleLabel = `${people} personne${people > 1 ? 's' : ''}`;

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, PAGE_W, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Liste des invités', MARGIN_X, 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Généré le ${generatedOn}`, PAGE_W - MARGIN_X, 10.5, { align: 'right' });

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Mariés : ${formatMaries(wedding.prenom, wedding.nom)}`, MARGIN_X, 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    weddingDate ? `Mariage prévu le ${weddingDate}` : 'Date de mariage non renseignée',
    MARGIN_X,
    31
  );
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${guestLabel}  ·  ${peopleLabel}`, PAGE_W - MARGIN_X, 31, { align: 'right' });
};

const drawTableHeader = (doc, y) => {
  doc.setFillColor(37, 99, 235);
  doc.rect(MARGIN_X, y, CONTENT_W, ROW_H, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  let x = MARGIN_X;
  COLUMNS.forEach((column) => {
    doc.text(column.label, x + 2, y + 5.3);
    x += column.width;
  });
  return y + ROW_H;
};

const drawRow = (doc, invite, y, shaded) => {
  if (shaded) {
    doc.setFillColor(248, 250, 252);
    doc.rect(MARGIN_X, y, CONTENT_W, ROW_H, 'F');
  }
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const values = rowValues(invite);
  let x = MARGIN_X;
  COLUMNS.forEach((column) => {
    doc.text(fitText(doc, values[column.key], column.width), x + 2, y + 5.3);
    x += column.width;
  });
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.15);
  doc.line(MARGIN_X, y + ROW_H, MARGIN_X + CONTENT_W, y + ROW_H);
};

const fileToken = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const fileStamp = (date) => {
  const pad = (part) => String(part).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + `_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
};

export function inviteListPdfFileName(wedding = {}, generatedAt = new Date()) {
  const names = [fileToken(wedding.prenom), fileToken(wedding.nom)].filter(Boolean).join('_');
  return `liste_invites_${names || 'maries'}_${fileStamp(generatedAt)}.pdf`;
}

export function buildInviteListPdf(invites = [], wedding = {}, generatedAt = new Date()) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.setProperties({ title: 'Liste des invités' });

  const totalPages = Math.max(1, Math.ceil(invites.length / ROWS_PER_PAGE));

  for (let page = 1; page <= totalPages; page += 1) {
    if (page > 1) doc.addPage();
    drawHeader(doc, invites, wedding, generatedAt);
    let y = drawTableHeader(doc, TABLE_TOP);
    const start = (page - 1) * ROWS_PER_PAGE;
    const slice = invites.slice(start, start + ROWS_PER_PAGE);

    if (slice.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text('Aucun invité à afficher', MARGIN_X, y + 10);
    } else {
      slice.forEach((invite, index) => {
        drawRow(doc, invite, y, index % 2 === 1);
        y += ROW_H;
      });
    }

    drawFooter(doc, page, totalPages);
  }

  return doc;
}

export function downloadInviteListPdf(invites = [], wedding = {}) {
  const generatedAt = new Date();
  buildInviteListPdf(invites, wedding, generatedAt).save(inviteListPdfFileName(wedding, generatedAt));
}
