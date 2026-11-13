 import home from '../assets/icons/home.svg';
 import edit from '../assets/icons/edit.svg';
 import invite from '../assets/icons/invite.svg';
 import reunion from '../assets/icons/reunion.svg';
 import search from '../assets/icons/search.png';
 
 export const navItems = [
    { id: 'dashboard', icon: home, labelKey: 'nav.dashboard', path: '/dashboard' },
    { id: 'liste-reunions', icon: reunion, labelKey: 'nav.meetings', path: '/liste-reunions' },
    { id: 'ajout-invite', icon: invite, labelKey: 'nav.addGuest', path: '/ajout-invite' },
    { id: 'profil', icon: edit, labelKey: 'nav.profile', path: '/profil' },
    { id: 'recherche-invite', icon: search, labelKey: 'nav.searchGuest', path: '/recherche-invite' }
  ];