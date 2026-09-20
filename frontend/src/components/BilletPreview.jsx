import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiDownload, FiX } from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';
import { generatePdf } from '../utils/GeneratePdf';

function BilletPreview({ invite, onClose, onDownload, downloading }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let objectUrl;
    let cancelled = false;

    const loadPreview = async () => {
      const blob = await generatePdf(invite);
      if (cancelled) return;
      if (!blob) {
        setError('Impossible de générer l’aperçu du billet.');
        return;
      }
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    };

    loadPreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [invite]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="billet-preview-title"
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 id="billet-preview-title" className="text-base font-semibold text-gray-900">
            Aperçu du billet
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            title="Fermer"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="min-h-[50vh] flex-1 bg-[#efe4d4]">
          {error && (
            <p className="p-6 text-center text-sm font-medium text-red-600">{error}</p>
          )}
          {!error && !url && (
            <div className="flex h-full min-h-[50vh] items-center justify-center text-gray-600">
              <ImSpinner8 className="mr-2 animate-spin" />
              Génération de l’aperçu…
            </div>
          )}
          {url && (
            <iframe
              src={url}
              title="Aperçu du billet d’invitation"
              className="h-[68vh] w-full border-0"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Fermer
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading || !url}
            className="inline-flex items-center rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {downloading ? (
              <ImSpinner8 className="mr-2 animate-spin" />
            ) : (
              <FiDownload className="mr-2" />
            )}
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default BilletPreview;
