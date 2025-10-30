import { motion } from 'framer-motion';
import developerGif from '../assets/img/about.jpg';

const AboutAccueil = () => {
  return (
    <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-indigo-50 to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Partie Texte */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut"
            }}
            viewport={{ 
              once: true,
              margin: "0px 0px -100px 0px" // Détecte l'élément un peu plus tôt
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              <span className="text-indigo-600">Notre mission</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-6"> 
              Notre mission ? Vous aider à <span className="font-semibold text-indigo-600">marquer votre présence en ligne </span> 
               avec des sites uniques et performants.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Notre expertise</h3>
                  <p className="text-gray-600">
                    Sites vitrine élégants, blogs performants, boutiques e-commerce clé en main. 
                    Nous maîtrisons les dernières technologies pour concrétiser vos idées.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Notre approche</h3>
                  <p className="text-gray-600">
                    Chaque projet est unique. Nous prenons le temps de comprendre vos besoins 
                    pour créer une solution sur mesure qui vous ressemble.
                  </p>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.2,
                duration: 0.6
              }}
              viewport={{ once: true }}
            >
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all shadow-lg">
                Découvrir nos réalisations
              </button>
              <button className="px-6 py-3 bg-white hover:bg-gray-100 text-indigo-600 font-medium rounded-full transition-all border border-indigo-600">
                Contactez-nous
              </button>
            </motion.div>
          </motion.div>
          
          {/* Partie Image */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 0.1,
              ease: "easeOut"
            }}
            viewport={{ 
              once: true,
              margin: "0px 0px -100px 0px"
            }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={developerGif} 
                alt="Notre équipe en action" 
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-indigo-600/20"></div>
              
              <motion.div 
                className="absolute bottom-6 left-6 bg-white px-4 py-2 rounded-full shadow-lg flex items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: 1,
                  boxShadow: ["0 10px 15px -3px rgba(0,0,0,0.1)", "0 20px 25px -5px rgba(79, 70, 229, 0.2)", "0 10px 15px -3px rgba(0,0,0,0.1)"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  opacity: { duration: 0.5, delay: 0.8 }
                }}
              >
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="font-medium text-indigo-600">Disponibles pour votre projet</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutAccueil;