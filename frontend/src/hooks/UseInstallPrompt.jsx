import { useEffect, useState } from 'react';

const DISMISS_KEY = 'wedd-install-dismissed';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches
  || window.matchMedia('(display-mode: fullscreen)').matches
  || window.navigator.standalone === true;

const isIosDevice = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(window.__pwaInstallPrompt || null);
  const [installed, setInstalled] = useState(isStandalone());
  const [dismissed, setDismissed] = useState(
    () => window.sessionStorage.getItem(DISMISS_KEY) === '1'
  );

  useEffect(() => {
    const capturePrompt = (event) => {
      event.preventDefault();
      window.__pwaInstallPrompt = event;
      setDeferredPrompt(event);
    };

    const syncPrompt = () => {
      if (window.__pwaInstallPrompt) {
        setDeferredPrompt(window.__pwaInstallPrompt);
      }
    };

    const markInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      window.__pwaInstallPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', capturePrompt);
    window.addEventListener('pwa-install-available', syncPrompt);
    window.addEventListener('appinstalled', markInstalled);
    syncPrompt();

    return () => {
      window.removeEventListener('beforeinstallprompt', capturePrompt);
      window.removeEventListener('pwa-install-available', syncPrompt);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  const dismiss = () => {
    window.sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  const promptInstall = async () => {
    const promptEvent = deferredPrompt || window.__pwaInstallPrompt;
    if (!promptEvent) return false;

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    setDeferredPrompt(null);
    window.__pwaInstallPrompt = null;
    if (outcome === 'accepted') {
      setInstalled(true);
      return true;
    }
    return false;
  };

  return {
    installed,
    dismissed,
    isIos: isIosDevice(),
    canNativeInstall: Boolean(deferredPrompt),
    showPrompt: !installed && !dismissed,
    dismiss,
    promptInstall,
  };
}

export default useInstallPrompt;
