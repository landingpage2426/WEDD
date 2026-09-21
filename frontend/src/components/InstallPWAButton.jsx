import { createPortal } from 'react-dom';
import { FiDownload, FiShare2, FiX } from 'react-icons/fi';
import logo from '../assets/img/logo.png';
import useInstallPrompt from '../hooks/UseInstallPrompt.jsx';

function InstallPWAButton() {
  const {
    showPrompt,
    canNativeInstall,
    isIos,
    dismiss,
    promptInstall,
  } = useInstallPrompt();

  if (!showPrompt) return null;

  const handleInstall = async (event) => {
    event.stopPropagation();
    const accepted = await promptInstall();
    if (!accepted && !canNativeInstall) return;
  };

  return createPortal(
    <div className="fixed inset-x-0 bottom-0 z-[2147483647] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-4 sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:p-0">
      <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <img src={logo} alt="Wedd" className="h-12 w-12 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">Installer Wedd</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Ajoute l’application à l’écran d’accueil pour un accès plus rapide.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            title="Plus tard"
          >
            <FiX size={18} />
          </button>
        </div>

        {canNativeInstall ? (
          <button
            type="button"
            onClick={handleInstall}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
          >
            <FiDownload size={16} />
            Installer l’application
          </button>
        ) : isIos ? (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-gray-700">
            Appuie sur <FiShare2 className="mx-1 inline" /> <strong>Partager</strong>, puis
            {' '}<strong>Sur l’écran d’accueil</strong>.
          </p>
        ) : (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-gray-700">
            Ouvre le menu <strong>⋮</strong> du navigateur, puis choisis
            {' '}<strong>Installer l’application</strong>.
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}

export default InstallPWAButton;
