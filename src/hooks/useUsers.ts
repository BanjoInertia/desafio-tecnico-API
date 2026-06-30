import { useState, useEffect } from 'react';
import type { User } from '../types/user';
import { fetchUsers } from '../services/api';

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}
