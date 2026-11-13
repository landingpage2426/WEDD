export const LOGIN_PATH = '/login-page';

export const PUBLIC_PATHS = [
  '/',
  '/login-page',
  '/register-page',
  '/forgot-password',
  '/help-page',
];

let refreshPromise = null;

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiration');
  localStorage.removeItem('user');
}

export function getJwtExpirationMs(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export function getSessionExpiration() {
  const stored = Number(localStorage.getItem('tokenExpiration') || 0);
  const token = localStorage.getItem('token');
  const jwtExp = token ? getJwtExpirationMs(token) : 0;
  if (stored && jwtExp) return Math.min(stored, jwtExp);
  return stored || jwtExp;
}

export function isSessionExpired() {
  const token = localStorage.getItem('token');
  if (!token) return Boolean(localStorage.getItem('refreshToken'));
  const expiration = getSessionExpiration();
  return Boolean(expiration && Date.now() >= expiration);
}

export function isLoginPath(pathname = window.location.pathname) {
  return pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
}

let redirecting = false;

export function redirectToLogin(reason) {
  if (redirecting) return;
  if (isLoginPath()) {
    clearSession();
    return;
  }
  redirecting = true;
  clearSession();
  const target = reason ? `${LOGIN_PATH}?reason=${encodeURIComponent(reason)}` : LOGIN_PATH;
  window.location.assign(target);
}

export function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = localStorage.getItem('refreshToken');
  const refreshExpiry = refreshToken ? getJwtExpirationMs(refreshToken) : 0;
  if (!refreshToken || (refreshExpiry && Date.now() >= refreshExpiry)) {
    return Promise.resolve(null);
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  refreshPromise = fetch(`${apiUrl}/api/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (response) => {
      if (!response.ok) return null;
      const data = await response.json();
      if (!data.token) return null;
      localStorage.setItem('token', data.token);
      localStorage.setItem('tokenExpiration', String(Date.now() + Number(data.expiresIn || 15 * 60 * 1000)));
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      return data.token;
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export function enforceSession() {
  if (!localStorage.getItem('token') && !localStorage.getItem('refreshToken')) return;
  if (!isSessionExpired()) return;

  refreshAccessToken().then((token) => {
    if (!token) redirectToLogin();
  });
}
