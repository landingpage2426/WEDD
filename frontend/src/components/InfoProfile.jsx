import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from './Image';
import emoji from '../assets/img/user.jpg';
import Bouton from './Bouton';
import { Link, useLocation } from 'react-router-dom';
import Countdown from './Countdown';

function InfoProfile() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [role, setRole] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const isAdmin = role === 'admin';
  const isOnProfil = location.pathname === '/profil';

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setNom(user.nom);
      setPrenom(user.prenom);
      setRole(user.role || '');
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          className="relative mb-4"
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="w-24 h-24 rounded-full border-4 border-blue-100 overflow-hidden bg-blue-50">
            <Image
              src={emoji}
              className="w-full h-full object-cover"
              alt="Photo de profil"
            />
          </div>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          {prenom} <span className="text-blue-600">{nom}</span>
        </h1>

        {isAdmin ? (
          <span className="mb-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">
            Administrateur
          </span>
        ) : (
          <Countdown />
        )}

        {!isOnProfil && (
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4"
          >
            <Link to="/profil">
              <Bouton
                width="w-32"
                height="h-auto"
                bg="bg-blue-600 hover:bg-blue-700"
                color="text-white"
                rounded="rounded-lg"
                shadow="shadow-md hover:shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Profil</span>
                </div>
              </Bouton>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default InfoProfile;
