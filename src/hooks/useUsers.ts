import { useState, useEffect } from 'react';
import type { User } from '../types/user';
import { fetchUsers } from '../services/api';

const LOCAL_USERS_KEY = 'local_users';

function loadLocalUsers(): User[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  addUser: (user: User) => void;
  removeUser: (id: number) => void;
  updateUser: (user: User) => void;
  isLocalUser: (id: number) => boolean;
}

export function useUsers(): UseUsersResult {
  const [fetched, setFetched] = useState<User[]>([]);
  const [local, setLocal] = useState<User[]>(loadLocalUsers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setFetched)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(local));
  }, [local]);

  function addUser(user: User) {
    setLocal((prev) => [user, ...prev]);
  }

  function removeUser(id: number) {
    setLocal((prev) => prev.filter((u) => u.id !== id));
  }

  function updateUser(updated: User) {
    setLocal((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  function isLocalUser(id: number) {
    return local.some((u) => u.id === id);
  }

  return { users: [...local, ...fetched], loading, error, addUser, removeUser, updateUser, isLocalUser };
}
