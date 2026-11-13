import axios from 'axios';
import { isSessionExpired, redirectToLogin, refreshAccessToken } from './authSession';

const AUTH_URL_RE = /\/(login|register|forgot-password|refresh)(\/|$|\?)/i;

axios.interceptors.request.use(async (config) => {
  const url = String(config.url || '');
  if (AUTH_URL_RE.test(url)) return config;

  if (isSessionExpired()) {
    const token = await refreshAccessToken();
    if (!token) {
      redirectToLogin();
      return Promise.reject(new Error('Session expirée'));
    }
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = String(error.config?.url || '');
    const original = error.config || {};
    if (AUTH_URL_RE.test(url)) return Promise.reject(error);

    if (error.response?.data?.code === 'ACCOUNT_DISABLED') {
      redirectToLogin('disabled');
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${token}`;
        return axios(original);
      }
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);
