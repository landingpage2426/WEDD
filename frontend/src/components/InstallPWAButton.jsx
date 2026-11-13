import { createPortal } from 'react-dom';
import { FiDownload, FiX } from 'react-icons/fi';
import logo from '../assets/img/logo.png';
import useInstallPrompt from '../hooks/UseInstallPrompt.jsx';
import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

function InstallPWAButton() {
  const {
    showPrompt,
    canNativeInstall,
    isIos,
    dismiss,
    promptInstall,
  } = useInstallPrompt();
  const [hint, setHint] = useState('');
  const { t } = useI18n();

  if (!showPrompt) return null;

  const handleInstall = async (event) => {
    event.stopPropagation();
    if (canNativeInstall) {
      await promptInstall();
      return;
    }
    if (isIos) {
      setHint('ios');
      return;
    }
    setHint('android');
  };

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[2147483647] flex justify-center"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="pointer-events-auto w-[92%] max-w-lg animate-[slideDown_0.35s_ease-out] rounded-b-xl bg-white px-3 py-2 shadow-lg sm:w-auto">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Wedd" className="h-8 w-8 shrink-0 rounded-full object-cover" />
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
            {t('pwa.installApp')}
          </p>
          <button
            type="button"
            onClick={handleInstall}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600"
          >
            <FiDownload size={14} />
            {t('pwa.install')}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            title={t('pwa.close')}
          >
            <FiX size={16} />
          </button>
        </div>
        {hint === 'ios' && (
          <p className="mt-2 text-[11px] leading-snug text-gray-600">
            {t('pwa.ios')}
          </p>
        )}
        {hint === 'android' && (
          <p className="mt-2 text-[11px] leading-snug text-gray-600">
            {t('pwa.android')}
          </p>
        )}
      </div>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-120%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
}

export default InstallPWAButton;
