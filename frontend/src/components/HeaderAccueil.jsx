import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/img/logo.png";
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import LanguageSwitch from '../components/LanguageSwitch';
import { useI18n } from '../i18n/I18nContext';

const HeaderAccueil = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { t } = useI18n();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  return (
    <motion.header
      className={`fixed w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto flex flex-row justify-between items-center px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <Link to="/">
            <motion.img 
              src={logo} 
              alt="logo" 
              className={`h-14 w-14 rounded-full border-2 ${
                isScrolled ? 'border-rose-500' : 'border-white'
              } transition-all duration-300`}
              whileHover={{ scale: 1.05 }}
            />
          </Link>
        </div>
        
        <motion.div 
          className="flex gap-2 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <LanguageSwitch light={!isScrolled} />
          <Link
            to="/login-page"
            className={`text-sm sm:text-base font-medium transition-all duration-300 px-3 sm:px-4 py-2 rounded-lg ${
              isScrolled 
                ? 'text-rose-700 hover:text-rose-800 border border-rose-500' 
                : 'text-white hover:text-rose-200 border border-white'
            }`}
          >
            {t('auth.loginLink')}
          </Link>
          <Link
            to="/register-page"
            className={`text-sm sm:text-base font-medium transition-all duration-300 px-3 sm:px-4 py-2 rounded-lg ${
              isScrolled 
                ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
            }`}
          >
            {t('auth.registerLink')}
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default HeaderAccueil;