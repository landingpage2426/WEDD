import { useEffect, useState } from 'react';

function UseInstallPrompt() {

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

   // Gérer l'affichage du bouton d'installation
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const handleClickOutside = () => {
      setIsVisible(false);
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return {deferredPrompt,setDeferredPrompt, isVisible, setIsVisible};
}

export default UseInstallPrompt
