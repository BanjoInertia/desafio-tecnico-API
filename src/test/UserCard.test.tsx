import { render, screen } from '@testing-library/react';
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
    render(<UserCard user={mockUser} onClick={() => {}} />);
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument();
  });

  it('exibe as iniciais do nome no avatar', () => {
    render(<UserCard user={mockUser} onClick={() => {}} />);
    expect(screen.getByText('LG')).toBeInTheDocument();
  });

  it('chama onClick ao clicar no card', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<UserCard user={mockUser} onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith(mockUser);
  });
});
