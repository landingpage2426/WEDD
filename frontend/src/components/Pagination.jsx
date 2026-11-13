import { useI18n } from '../i18n/I18nContext';

const PAGE_SIZES = [10, 25, 50, 100];

function Pagination({ page, pageCount, pageSize, total, onPageChange, onPageSizeChange }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-2 text-sm text-slate-600">
        {t('pagination.perPage')}
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </label>
      <p className="text-sm text-slate-500">
        {t('pagination.status', { page, pageCount, total })}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('common.previous')}
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  );
}

export default Pagination;
