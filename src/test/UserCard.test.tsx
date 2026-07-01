import { render, screen } from './utils';
import userEvent from '@testing-library/user-event';
import { UserCard } from '../components/UserCard';
import type { User } from '../types/user';

const mockUser: User = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  phone: '1-770-736-8031',
  website: 'hildegard.org',
  address: { street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874' },
  company: { name: 'Romaguera-Crona', catchPhrase: '', bs: '' },
};

describe('UserCard', () => {
  it('exibe nome e email do usuário', () => {
    render(<UserCard user={mockUser} index={0} onClick={() => {}} />);
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument();
  });

  it('exibe avatar com o nome do usuário como alt', () => {
    render(<UserCard user={mockUser} index={0} onClick={() => {}} />);
    expect(screen.getByRole('img', { name: 'Leanne Graham' })).toBeInTheDocument();
  });

  it('exibe iniciais como fallback se o avatar falhar', async () => {
    render(<UserCard user={mockUser} index={0} onClick={() => {}} />);
    const img = screen.getByRole('img', { name: 'Leanne Graham' });
    img.dispatchEvent(new Event('error'));
    expect(await screen.findByText('LG')).toBeInTheDocument();
  });

  it('chama onClick ao clicar no card', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<UserCard user={mockUser} index={0} onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith(mockUser);
  });

  it('exibe badge LOCAL quando isLocal é true', () => {
    render(<UserCard user={mockUser} index={0} isLocal onClick={() => {}} />);
    expect(screen.getByText('LOCAL')).toBeInTheDocument();
  });

  it('não exibe badge LOCAL para usuários da API', () => {
    render(<UserCard user={mockUser} index={0} onClick={() => {}} />);
    expect(screen.queryByText('LOCAL')).not.toBeInTheDocument();
  });

  it('exibe o path do usuário na barra de título', () => {
    render(<UserCard user={mockUser} index={0} onClick={() => {}} />);
    expect(screen.getByText('~/users/bret')).toBeInTheDocument();
  });
});
