import { useEffect, useState } from 'react';
import download from "../assets/icons/download.png";
import useInstallPrompt from '../hooks/UseInstallPrompt.jsx';
function InstallPWAButton() {
  const { deferredPrompt, isVisible,setDeferredPrompt } = useInstallPrompt();
  const [show, setShow] = useState(true);

  // Masquer le bouton après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Ne rien afficher si pas d'opportunité ou plus visible
  if (!deferredPrompt || !isVisible || !show) return null;

  const handleInstallClick = (e) => {
    e.stopPropagation();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-b-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 flex items-center justify-between gap-2 w-[80%] md:w-auto z-100"
    >
      Installer
      <img src={download} alt="download_installation" className="w-5 h-5" />
    </button>
  );
}

export default InstallPWAButton;
