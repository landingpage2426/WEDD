import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { formatDate } from '../utils/FormatDate';
import LanguageSwitch from '../components/LanguageSwitch';
import { useI18n } from '../i18n/I18nContext';

const apiUrl = import.meta.env.VITE_API_URL;

function formatWhen(value, locale) {
  if (!value) return '—';
  return new Date(value).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
}

function AdminUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) {
      navigate('/login-page');
      return;
    }
    const current = JSON.parse(stored);
    if (current.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    axios.get(`${apiUrl}/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setData(response.data);
    }).catch((err) => {
      setError(err.response?.data?.message || t('admin.notFound'));
    }).finally(() => setLoading(false));
  }, [id, navigate, t]);

  const user = data?.user;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link to="/admin" className="text-sm font-semibold text-blue-700">{t('admin.back')}</Link>
          <LanguageSwitch />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        {loading && <p className="text-slate-500">{t('common.loading')}</p>}
        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>}
        {user && (
          <div className="space-y-6">
            <section className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{t('admin.account')}</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-800">{user.prenom} {user.nom}</h1>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <p className="text-sm text-slate-600">{user.email}</p>
                <p className="text-sm text-slate-600">{user.telephone || t('common.none')}</p>
                <p className="text-sm">
                  <span className="text-slate-500">{t('admin.role')} : </span>
                  {t(`role.${user.role}`)}
                </p>
                <p className="text-sm">
                  <span className="text-slate-500">{t('admin.status')} : </span>
                  {user.actif ? t('common.active') : t('common.inactive')}
                </p>
                <p className="text-sm text-slate-600">{t('admin.joined')} : {formatDate(user.createdAt)}</p>
                <p className="text-sm text-slate-600">{t('admin.lastLogin')} : {formatWhen(user.lastLogin, locale)}</p>
              </div>
              {user.createdBy && (
                <p className="mt-4 text-sm text-slate-600">
                  {t('admin.linkedClient')} : {user.createdBy.prenom} {user.createdBy.nom} · {user.createdBy.email}
                </p>
              )}
            </section>

            {user.role === 'client' && (
              <>
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <article className="rounded-xl border border-rose-100 bg-white p-4">
                    <p className="text-xs uppercase text-slate-500">{t('admin.guests')}</p>
                    <p className="mt-1 text-2xl font-bold text-rose-700">{data.guestStats?.total ?? data.invites.length}</p>
                  </article>
                  <article className="rounded-xl border border-rose-100 bg-white p-4">
                    <p className="text-xs uppercase text-slate-500">{t('admin.tickets')}</p>
                    <p className="mt-1 text-2xl font-bold text-rose-700">{data.guestStats?.billetsEnvoyes || 0}</p>
                  </article>
                  <article className="rounded-xl border border-rose-100 bg-white p-4">
                    <p className="text-xs uppercase text-slate-500">{t('admin.present')}</p>
                    <p className="mt-1 text-2xl font-bold text-rose-700">{data.guestStats?.presents || 0}</p>
                  </article>
                  <article className="rounded-xl border border-rose-100 bg-white p-4">
                    <p className="text-xs uppercase text-slate-500">{t('admin.absent')}</p>
                    <p className="mt-1 text-2xl font-bold text-rose-700">{data.guestStats?.absents || 0}</p>
                  </article>
                </section>

                <section className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
                  <h2 className="px-6 pt-6 text-lg font-semibold text-slate-800">{t('admin.staff')}</h2>
                  {data.staff.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-slate-500">{t('admin.noStaff')}</p>
                  ) : (
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-rose-500 text-left text-xs uppercase text-white">
                          <tr>
                            <th className="px-4 py-3">{t('admin.user')}</th>
                            <th className="px-4 py-3">{t('admin.contact')}</th>
                            <th className="px-4 py-3">{t('register.phone')}</th>
                            <th className="px-4 py-3">{t('admin.role')}</th>
                            <th className="px-4 py-3">{t('admin.status')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.staff.map((member) => (
                            <tr key={member._id} className="border-t border-slate-100">
                              <td className="px-4 py-3 font-medium text-slate-800">{member.prenom} {member.nom}</td>
                              <td className="px-4 py-3">{member.email}</td>
                              <td className="px-4 py-3">{member.telephone || t('common.none')}</td>
                              <td className="px-4 py-3">{t(`role.${member.role}`)}</td>
                              <td className="px-4 py-3">{member.actif ? t('common.active') : t('common.inactive')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}

            <section className="overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm">
              <div className="px-6 pt-6">
                <h2 className="text-lg font-semibold text-slate-800">{t('admin.logins')}</h2>
                <p className="text-sm text-slate-500">{t('admin.loginsHint')}</p>
              </div>
              {(data.logins || []).length === 0 ? (
                <p className="px-6 py-4 text-sm text-slate-500">{t('staff.noHistory')}</p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-rose-500 text-left text-xs uppercase text-white">
                      <tr>
                        <th className="px-4 py-3">{t('admin.when')}</th>
                        <th className="px-4 py-3">{t('admin.author')}</th>
                        <th className="px-4 py-3">{t('admin.action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.logins.map((log) => (
                        <tr key={log._id} className="border-t border-slate-100">
                          <td className="px-4 py-3">{formatWhen(log.createdAt, locale)}</td>
                          <td className="px-4 py-3">{log.actorEmail || '—'}</td>
                          <td className="px-4 py-3">{t(`audit.${log.action}`)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminUser;
