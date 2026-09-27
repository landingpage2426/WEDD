import {
  countTableOccupied,
  getInvitePersonCount,
  getTableCapacity,
  normalizeTableName,
} from '../utils/invitePeople';

function TableOccupancyHint({ tableName, invites = [], tables = [], titre, excludeInviteId }) {
  const table = normalizeTableName(tableName);
  if (!table) return null;

  const occupied = countTableOccupied(invites, table, excludeInviteId);
  const capacity = getTableCapacity(tables, table);
  const adding = titre ? getInvitePersonCount({ titre }) : 0;
  const remaining = capacity != null ? Math.max(0, capacity - occupied) : null;
  const over = capacity != null && occupied + adding > capacity;

  return (
    <div
      className={`mt-2 rounded-lg px-3 py-2 text-sm ${
        over ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-100'
      }`}
    >
      <p className="font-medium">
        {capacity != null
          ? `${occupied} place${occupied > 1 ? 's' : ''} déjà occupée${occupied > 1 ? 's' : ''} sur ${capacity}`
          : `${occupied} place${occupied > 1 ? 's' : ''} déjà occupée${occupied > 1 ? 's' : ''} sur cette table`}
      </p>
      {capacity != null && (
        <p className="mt-0.5">
          {remaining} place{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
          {adding > 0 ? ` · cet invité occupera ${adding} place${adding > 1 ? 's' : ''}` : ''}
        </p>
      )}
      {capacity == null && adding > 0 && (
        <p className="mt-0.5">Cet invité occupera {adding} place{adding > 1 ? 's' : ''}.</p>
      )}
      {over && (
        <p className="mt-0.5 font-semibold">Cette table dépasserait sa capacité.</p>
      )}
    </div>
  );
}

export default TableOccupancyHint;
