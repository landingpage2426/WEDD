import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useTableOccupancy({ invites: invitesProp, tables: tablesProp } = {}) {
  const [invites, setInvites] = useState(invitesProp || []);
  const [tables, setTables] = useState(tablesProp || []);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (invitesProp) setInvites(invitesProp);
  }, [invitesProp]);

  useEffect(() => {
    if (tablesProp) setTables(tablesProp);
  }, [tablesProp]);

  useEffect(() => {
    if (invitesProp && tablesProp) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };
    const requests = [];

    if (!invitesProp) {
      requests.push(
        axios
          .get(`${apiUrl}/api/invites`, { headers, withCredentials: true })
          .then((res) => setInvites(res.data.invites || []))
          .catch(() => setInvites([]))
      );
    }

    if (!tablesProp) {
      requests.push(
        axios
          .get(`${apiUrl}/api/room-layout`, { headers })
          .then((res) => setTables(res.data.layout?.tables || []))
          .catch(() => setTables([]))
      );
    }

    return undefined;
  }, [apiUrl, invitesProp, tablesProp]);

  return { invites, tables };
}
