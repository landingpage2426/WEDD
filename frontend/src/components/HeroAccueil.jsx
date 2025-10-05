import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import calculateTimeLeft from '../utils/CalculateTimeLeft';

const HeroAccueil = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft('2025-12-20T20:00:00'));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft('2025-11-20T20:00:00'));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center mx-2">
        <motion.span 
          className="text-4xl md:text-3xl font-bold text-white"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={timeLeft[interval]}
        >
          {timeLeft[interval]}
        </motion.span>
        <span className="text-sm md:text-lg text-white/80 capitalize">{interval}</span>
      </div>
    );
  });

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Image de fond avec overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Mariage romantique"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="">Votre Journée</span> <span className="text-rose-200">Inoubliable</span>
          </h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Nous créons des mariages sur mesure qui reflètent votre histoire d'amour et votre personnalité.
          </motion.p>
          
          {/* Countdown */}
          {Object.keys(timeLeft).length ? (
            <motion.div 
              className="flex justify-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {timerComponents}
            </motion.div>
          ) : (
            <motion.div 
              className="text-2xl text-white mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Le grand jour est arrivé !
            </motion.div>
          )}
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <button className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-rose-500/30">
              Découvrez nos prestations
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105">
              Contactez-nous
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Fleche pour indiquer de scroller */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroAccueil;