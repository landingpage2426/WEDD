export const isCouple = (inviteOrTitre) => {
  const titre = typeof inviteOrTitre === 'string'
    ? inviteOrTitre
    : inviteOrTitre?.titre;
  return titre === 'couple';
};

export const getInvitePersonCount = (invite) => (isCouple(invite) ? 2 : 1);

export const countInvitePeople = (invites = []) =>
  invites.reduce((sum, invite) => sum + getInvitePersonCount(invite), 0);

export const countInvitePeopleByStatus = (invites = [], status) =>
  countInvitePeople(
    invites.filter((invite) => invite.status?.toUpperCase() === status)
  );

export const capitalizePrenom = (prenom = '') =>
  String(prenom || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const formatBilletNom = (nom = '') => String(nom || '').trim().toUpperCase();

export const formatInviteDisplayName = (invite) => {
  if (!invite) return '';
  const nom = formatBilletNom(invite.nom);
  if (isCouple(invite)) {
    return `M. & Mme ${nom}`.trim();
  }

  const titreMap = { M: 'M.', Mme: 'Mme', Mlle: 'Mlle' };
  const prefix = titreMap[invite.titre] || '';
  const prenom = capitalizePrenom(invite.prenom && invite.prenom !== '-' ? invite.prenom : '');
  return `${prefix} ${nom} ${prenom}`.replace(/\s+/g, ' ').trim();
};

export const getBilletCivility = (titre) => {
  switch (titre) {
    case 'M':
      return 'M.';
    case 'Mme':
      return 'Mme';
    case 'Mlle':
      return 'Mlle';
    case 'couple':
      return 'M. & Mme';
    default:
      return '';
  }
};

export const MAX_BILLET_LINE_CHARS = 36;

export const getBilletLineText = (prenom = '', nom = '', titre = '') => {
  const nomFormat = formatBilletNom(nom);
  if (isCouple(titre)) return nomFormat;
  const p = prenom && prenom !== '-' ? capitalizePrenom(prenom) : '';
  return `${nomFormat} ${p}`.replace(/\s+/g, ' ').trim();
};

export const getBilletCharsRemaining = (prenom, nom, titre) =>
  Math.max(0, MAX_BILLET_LINE_CHARS - getBilletLineText(prenom, nom, titre).length);

export const limitBilletField = (currentPrenom, currentNom, titre, field, value) => {
  const nextPrenom = field === 'prenom' ? value : currentPrenom;
  const nextNom = field === 'nom' ? value : currentNom;
  const line = getBilletLineText(nextPrenom, nextNom, titre);
  if (line.length <= MAX_BILLET_LINE_CHARS) {
    return value;
  }
  const overflow = line.length - MAX_BILLET_LINE_CHARS;
  return value.slice(0, Math.max(0, value.length - overflow));
};

export const formatTitreLabel = (titre) => {
  switch (titre) {
    case 'M':
      return 'Monsieur';
    case 'Mme':
      return 'Madame';
    case 'Mlle':
      return 'Mademoiselle';
    case 'couple':
      return 'Couple (2 personnes)';
    default:
      return titre || 'Non spécifié';
  }
};
