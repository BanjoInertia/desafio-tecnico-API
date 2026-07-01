import { renderHook, act, waitFor } from '@testing-library/react';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../types/user';

const mockApiUser: User = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  phone: '1-770-736-8031',
  website: 'hildegard.org',
  address: { street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874' },
  company: { name: 'Romaguera-Crona', catchPhrase: '', bs: '' },
};

const mockLocalUser: User = {
  id: 9999999,
  name: 'Local User',
  username: 'localuser',
  email: 'local@test.com',
  phone: '',
  website: '',
  address: { street: '', suite: '', city: 'São Paulo', zipcode: '' },
  company: { name: 'Local Co', catchPhrase: '', bs: '' },
};

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [mockApiUser],
  }));
});

afterEach(() => vi.unstubAllGlobals());

describe('useUsers', () => {
  it('inicia em estado de loading', async () => {
    const { result } = renderHook(() => useUsers());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('carrega usuários da API', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toContainEqual(expect.objectContaining({ id: 1 }));
  });

  it('adiciona usuário local no início da lista', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.addUser(mockLocalUser));
    expect(result.current.users[0]).toEqual(mockLocalUser);
  });

  it('isLocalUser retorna true para usuário adicionado localmente', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.addUser(mockLocalUser));
    expect(result.current.isLocalUser(mockLocalUser.id)).toBe(true);
  });

  it('isLocalUser retorna false para usuário da API', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isLocalUser(1)).toBe(false);
  });

  it('removeUser remove o usuário local da lista', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.addUser(mockLocalUser));
    act(() => result.current.removeUser(mockLocalUser.id));
    expect(result.current.isLocalUser(mockLocalUser.id)).toBe(false);
  });

  it('persiste usuários locais no localStorage', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.addUser(mockLocalUser));
    const stored = JSON.parse(localStorage.getItem('local_users') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(mockLocalUser.id);
  });

  it('carrega usuários locais do localStorage ao inicializar', async () => {
    localStorage.setItem('local_users', JSON.stringify([mockLocalUser]));
    const { result } = renderHook(() => useUsers());
    expect(result.current.isLocalUser(mockLocalUser.id)).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('define erro quando a API falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
  });

  it('updateUser atualiza o usuário local na lista', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.addUser(mockLocalUser));
    act(() => result.current.updateUser({ ...mockLocalUser, name: 'Updated Name' }));
    const updated = result.current.users.find((u) => u.id === mockLocalUser.id);
    expect(updated?.name).toBe('Updated Name');
  });

  it('updateUser persiste a alteração no localStorage', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.addUser(mockLocalUser));
    act(() => result.current.updateUser({ ...mockLocalUser, name: 'Updated Name' }));
    const stored = JSON.parse(localStorage.getItem('local_users') || '[]');
    expect(stored[0].name).toBe('Updated Name');
  });
});
