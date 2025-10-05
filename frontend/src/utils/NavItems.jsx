 import home from '../assets/icons/home.svg';
 import edit from '../assets/icons/edit.svg';
 import invite from '../assets/icons/invite.svg';
 import reunion from '../assets/icons/reunion.svg';
 import search from '../assets/icons/search.png';
 
 export const navItems = [
    { id: 'dashboard', icon: home, label: 'Dashboard', path: '/dashboard' },
    { id: 'liste-reunions', icon: reunion, label: 'Réunions', path: '/liste-reunions' },
    { id: 'ajout-invite', icon: invite, label: 'Ajouter un invité', path: '/ajout-invite' },
    { id: 'profil', icon: edit, label: 'Profil', path: '/profil' },
    { id: 'recherche-invite', icon: search, label: 'Recherche invité', path: '/recherche-invite' }
  ];