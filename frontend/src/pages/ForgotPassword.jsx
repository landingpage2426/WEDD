import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useI18n } from "../i18n/I18nContext";
import LanguageSwitch from "../components/LanguageSwitch";

function ForgotPassword() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    const data = await res.json(); 
    const timer =  setTimeout(() => {
      setMessage('');
      navigate('/login-page');
    }, 2000);
    setMessage(data.type === "success" ? `${data.message} ${t('forgot.redirect')}` : data.message);
    setType(data.type);
    if (data.type !== "success") clearTimeout(timer);
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded">
      <div className="flex justify-end mb-4"><LanguageSwitch /></div>
      <h2 className="text-center text-xl mb-4">{t('forgot.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder={t('forgot.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t('forgot.new')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 pr-10 rounded"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t('forgot.confirm')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 pr-10 rounded"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          type="submit"
          className="flex w-full justify-center items-center rounded-md bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {t('forgot.submit')}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-${type === 'danger' ? 'red' : 'green'}-600`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ForgotPassword;
