window.__pwaInstallPrompt = window.__pwaInstallPrompt || null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.__pwaInstallPrompt = event;
  window.dispatchEvent(new Event('pwa-install-available'));
});

window.addEventListener('appinstalled', () => {
  window.__pwaInstallPrompt = null;
});
