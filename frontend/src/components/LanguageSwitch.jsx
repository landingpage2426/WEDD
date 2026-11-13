import { useI18n } from '../i18n/I18nContext';

function LanguageSwitch({ light = false }) {
  const { language, setLanguage } = useI18n();
  const active = light ? 'bg-white text-rose-600' : 'bg-rose-500 text-white';
  const idle = light ? 'text-white hover:bg-white/20' : 'text-slate-600 hover:bg-slate-50';

  return (
    <div className={`inline-flex overflow-hidden rounded-lg border text-xs font-semibold ${light ? 'border-white/70' : 'border-slate-200'}`}>
      {['fr', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          className={`px-2.5 py-1 uppercase ${language === code ? active : idle}`}
          aria-pressed={language === code}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitch;
