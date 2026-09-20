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

export const formatInviteDisplayName = (invite) => {
  if (!invite) return '';
  if (isCouple(invite)) {
    return `M. & Mme ${invite.nom || ''}`.trim();
  }

  const titreMap = { M: 'M.', Mme: 'Mme', Mlle: 'Mlle' };
  const prefix = titreMap[invite.titre] || '';
  return `${prefix} ${invite.prenom || ''} ${invite.nom || ''}`.replace(/\s+/g, ' ').trim();
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
