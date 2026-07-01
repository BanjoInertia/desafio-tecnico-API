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
  website: string;
  street: string;
  suite: string;
  zipcode: string;
  city: string;
  company: string;
  avatarSeed?: string;
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
      website: data.website,
      address: { street: data.street, suite: data.suite, city: data.city, zipcode: data.zipcode },
      company: { name: data.company, catchPhrase: '', bs: '' },
    }),
  });
  if (!response.ok) throw new Error('Falha ao criar usuário');
  const created = await response.json();
  return { ...created, id: Date.now(), avatarSeed: data.avatarSeed };
}
