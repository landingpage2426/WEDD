import { motion } from 'framer-motion';
import { features } from '../utils/Features';


const FeaturesAccueil = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-rose-50 py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Tout pour organiser votre mariage de rêve
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Notre plateforme complète vous accompagne dans chaque étape de l'organisation
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            variants={item}
            whileHover={{ y: -5 }}
          >
            <div className={`w-16 h-16 mx-auto mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
            <div className="mt-4">
              <button className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">
                En savoir plus →
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
      >
        <button className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-rose-500/30">
          Découvrir toutes les fonctionnalités
        </button>
      </motion.div>
    </section>
  );
};

export default FeaturesAccueil;