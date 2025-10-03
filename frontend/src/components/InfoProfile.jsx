import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from './Image';
import emoji from '../assets/img/user.jpg';
import Bouton from './Bouton';
import { Link } from 'react-router-dom';
import Countdown from './Countdown';
function InfoProfile() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [isHovered, setIsHovered] = useState(false);


  // Récupération du nom de l'utilisateur depuis le localStorage
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setNom(user.nom);
      setPrenom(user.prenom);
    }
  }, []);

  return (
    <motion.div
      className=""
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center">
        {/* Photo de profil avec animation */}
        <motion.div
          className="relative mb-4"
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="w-24 h-24 rounded-full border-4 border-blue-100 overflow-hidden">
            <Image
              src={emoji}
              className="w-full h-full object-cover"
              alt="Profil"
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

        {/* Nom et prénom */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {prenom} <span className="text-blue-600">{nom}</span>
        </h1>
        
<Countdown />

        {/* Bouton profil */}
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
      </div>
    </motion.div>
  );
}

export default InfoProfile;
