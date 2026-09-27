export const LOGIN_PATH = '/login-page';

export const PUBLIC_PATHS = [
  '/',
  '/login-page',
  '/register-page',
  '/forgot-password',
  '/help-page',
];

export function clearSession() {
  localStorage.removeItem('token');
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
  if (!token) return false;
  const expiration = getSessionExpiration();
  return Boolean(expiration && Date.now() >= expiration);
}

export function isLoginPath(pathname = window.location.pathname) {
  return pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
}

let redirecting = false;

export function redirectToLogin() {
  if (redirecting) return;
  if (isLoginPath()) {
    clearSession();
    return;
  }
  redirecting = true;
  clearSession();
  window.location.assign(LOGIN_PATH);
}

export function enforceSession() {
  if (isSessionExpired()) {
    redirectToLogin();
  }
}
