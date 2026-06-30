import type { User } from '../types/user';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) throw new Error('Falha ao buscar usuários');
  return response.json();
}

export interface NewUserData {
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
}


export async function createUser(data: NewUserData): Promise<User> {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      username: data.name.toLowerCase().replace(/\s+/g, '.'),
      website: '',
      address: { street: '', suite: '', city: data.city, zipcode: '' },
      company: { name: data.company, catchPhrase: '', bs: '' },
    }),
  });
  if (!response.ok) throw new Error('Falha ao criar usuário');
  const created = await response.json();
  // JSONPlaceholder always returns id 11 — use a unique local id instead
  return { ...created, id: Date.now() };
}
