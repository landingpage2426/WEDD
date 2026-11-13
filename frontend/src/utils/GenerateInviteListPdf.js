import { jsPDF } from 'jspdf';
import { translations } from '../i18n/translations.js';
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

const COLUMN_LAYOUT = [
  { key: 'titre', labelKey: 'pdf.col.title', width: 22 },
  { key: 'nom', labelKey: 'pdf.col.lastName', width: 38 },
  { key: 'prenom', labelKey: 'pdf.col.firstName', width: 36 },
  { key: 'id', labelKey: 'pdf.col.id', width: 22 },
  { key: 'table', labelKey: 'pdf.col.table', width: 30 },
  { key: 'contact', labelKey: 'pdf.col.contact', width: 36 },
  { key: 'email', labelKey: 'pdf.col.email', width: 64 },
  { key: 'personnes', labelKey: 'pdf.col.people', width: 25 },
];

const CONTENT_W = COLUMN_LAYOUT.reduce((sum, column) => sum + column.width, 0);
const ROWS_PER_PAGE = Math.floor((CONTENT_BOTTOM - TABLE_TOP - ROW_H) / ROW_H);

const translator = (language) => {
  const dict = translations[language] || translations.fr;
  return (key) => dict[key] || translations.fr[key] || key;
};

const localeFor = (language) => (language === 'en' ? 'en-GB' : 'fr-FR');

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

const formatLongDate = (value, timeZone, locale) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  });
};

const formatGeneratedAt = (value, locale) => {
  const date = value instanceof Date ? value : new Date();
  return date.toLocaleString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const formatMaries = (prenom, nom, fallback) => {
  const fullName = `${capitalizePrenom(prenom || '')} ${formatBilletNom(nom || '')}`.trim();
  return fullName || fallback;
};

const drawHeader = (doc, invites, wedding = {}, generatedAt = new Date(), t, locale) => {
  const people = countInvitePeople(invites);
  const generatedOn = formatGeneratedAt(generatedAt, locale);
  const weddingDate = formatLongDate(wedding.dateMariage, 'UTC', locale);
  const guestWord = invites.length > 1 ? t('pdf.guests') : t('pdf.guest');
  const peopleWord = people > 1 ? t('pdf.people') : t('pdf.person');

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, PAGE_W, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(t('pdf.title'), MARGIN_X, 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`${t('pdf.generated')} ${generatedOn}`, PAGE_W - MARGIN_X, 10.5, { align: 'right' });

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`${t('pdf.couple')} : ${formatMaries(wedding.prenom, wedding.nom, t('pdf.unknownCouple'))}`, MARGIN_X, 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    weddingDate ? `${t('pdf.weddingOn')} ${weddingDate}` : t('pdf.noDate'),
    MARGIN_X,
    31
  );
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${invites.length} ${guestWord}  ·  ${people} ${peopleWord}`, PAGE_W - MARGIN_X, 31, { align: 'right' });
};

const drawTableHeader = (doc, y, t) => {
  doc.setFillColor(37, 99, 235);
  doc.rect(MARGIN_X, y, CONTENT_W, ROW_H, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  let x = MARGIN_X;
  COLUMN_LAYOUT.forEach((column) => {
    doc.text(t(column.labelKey), x + 2, y + 5.3);
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
  COLUMN_LAYOUT.forEach((column) => {
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

export function buildInviteListPdf(invites = [], wedding = {}, generatedAt = new Date(), language = 'fr') {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const t = translator(language);
  const locale = localeFor(language);
  doc.setProperties({ title: t('pdf.title') });

  const totalPages = Math.max(1, Math.ceil(invites.length / ROWS_PER_PAGE));

  for (let page = 1; page <= totalPages; page += 1) {
    if (page > 1) doc.addPage();
    drawHeader(doc, invites, wedding, generatedAt, t, locale);
    let y = drawTableHeader(doc, TABLE_TOP, t);
    const start = (page - 1) * ROWS_PER_PAGE;
    const slice = invites.slice(start, start + ROWS_PER_PAGE);

    if (slice.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text(t('pdf.empty'), MARGIN_X, y + 10);
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

export function downloadInviteListPdf(invites = [], wedding = {}, language = 'fr') {
  const generatedAt = new Date();
  buildInviteListPdf(invites, wedding, generatedAt, language).save(inviteListPdfFileName(wedding, generatedAt));
}
