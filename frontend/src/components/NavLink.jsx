import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import help from '../assets/img/help.svg';
import logo from '../assets/img/logo.png';
import Image from './Image';
import { navItems } from '../utils/NavItems';
import { handleLogout } from '../services/HandleLogout';
function NavLink() {
  const [activeLink, setActiveLink] = useState('dashboard');
  const [isHovered, setIsHovered] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = userRole === 'admin';
  
  // Synchronisation de l'état actif avec l'URL
  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setActiveLink(path || 'dashboard');
    
    // Récupérer le rôle de l'utilisateur
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setUserRole(user.role);
    }
  }, [location]);

  return (
    <motion.div 
      className="w-64 h-screen flex flex-col gap-2 border-r border-gray-200 bg-white shadow-sm fixed left-0 top-0 z-10"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <img src={logo} alt="WEDD" className="h-10 w-10 rounded-full object-cover" />
        <div>
          <h1 className="text-xl font-bold text-blue-700 leading-tight">WEDD</h1>
          {isAdmin && (
            <p className="text-xs text-slate-500">Administrateur</p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-2 p-4">
          {navItems
            .filter(item => {
              // Navigation admin : uniquement dashboard (redirigé) et profil
              if (userRole === 'admin') {
                return item.id === 'profil';
              }
              // Filtrer les éléments selon le rôle
              if (item.id === 'liste-reunions' && !['client', 'manager', 'chef_protocole', 'protocole'].includes(userRole)) {
                return false;
              }
              if (item.id === 'ajout-invite' && userRole !== 'client' && userRole !== 'manager') {
                return false;
              }
              if (item.id === 'recherche-invite' && !['client', 'manager', 'chef_protocole', 'protocole'].includes(userRole)) {
                return false;
              }
              return true;
            })
            .map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(item.id)}
              onHoverEnd={() => setIsHovered(null)}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                  activeLink === item.id 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <motion.span 
                  animate={{
                    color: activeLink === item.id || isHovered === item.id ? '#be185d' : '#4b5563'
                  }}
                >
                  <img 
                    src={item.icon} 
                    alt={item.label} 
                    className="w-5 h-5" 
                  />
                </motion.span>
                <span className="font-medium">{item.label}</span>
                {activeLink === item.id && (
                  <motion.div 
                    className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}

          {/* Lien Admin uniquement pour les administrateurs */}
          {userRole === 'admin' && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered('admin')}
              onHoverEnd={() => setIsHovered(null)}
            >
              <Link
                to="/admin"
                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                  activeLink === 'admin' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <motion.span 
                  animate={{
                    color: activeLink === 'admin' || isHovered === 'admin' ? '#2563eb' : '#4b5563'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </motion.span>
                <span className="font-medium">Utilisateurs</span>
                {activeLink === 'admin' && (
                  <motion.div 
                    className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          )}
          
          {/* Lien Administration uniquement pour les clients */}
          {userRole === 'client' && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered('administration')}
              onHoverEnd={() => setIsHovered(null)}
            >
              <Link
                to="/administration"
                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                  activeLink === 'administration' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <motion.span 
                  animate={{
                    color: activeLink === 'administration' || isHovered === 'administration' ? '#be185d' : '#4b5563'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </motion.span>
                <span className="font-medium">Administration</span>
                {activeLink === 'administration' && (
                  <motion.div 
                    className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 space-y-4">
          {!isAdmin && (
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <Image src={help} className="w-48 mb-2" alt="Besoin d'aide" />
              <Link 
                to="/help-page" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline underline-offset-4"
              >
                Avez-vous besoin d&apos;aide ?
              </Link>
            </div>
          )}

          <motion.button
            onClick={() => { setActiveLink('logout'); handleLogout(navigate); }}
            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:text-red-800 rounded-lg hover:bg-blue-50 transition-colors"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Déconnexion</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default NavLink;