import axios from 'axios';
import { isSessionExpired, redirectToLogin } from './authSession';

const AUTH_URL_RE = /\/(login|register|forgot-password)(\/|$|\?)/i;

axios.interceptors.request.use((config) => {
  const url = String(config.url || '');
  if (AUTH_URL_RE.test(url)) return config;

  if (isSessionExpired()) {
    redirectToLogin();
    return Promise.reject(new Error('Session expirée'));
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = String(error.config?.url || '');
    if (AUTH_URL_RE.test(url)) return Promise.reject(error);

    if (error.response?.status === 401) {
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);
