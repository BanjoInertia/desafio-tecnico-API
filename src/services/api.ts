import type { User } from '../types/user';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Falha ao buscar usuários');
  }
  return response.json();
}
