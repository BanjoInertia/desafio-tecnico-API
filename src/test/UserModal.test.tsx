import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserModal } from '../components/UserModal';
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

describe('UserModal', () => {
  it('exibe os detalhes do usuário', () => {
    render(<UserModal user={mockUser} onClose={() => {}} />);
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument();
    expect(screen.getByText('1-770-736-8031')).toBeInTheDocument();
    expect(screen.getByText('Gwenborough')).toBeInTheDocument();
    expect(screen.getByText('Romaguera-Crona')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão fechar', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<UserModal user={mockUser} onClose={handleClose} />);

    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('chama onClose ao pressionar Escape', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<UserModal user={mockUser} onClose={handleClose} />);

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalled();
  });

  it('chama onClose ao clicar no overlay', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const { container } = render(<UserModal user={mockUser} onClose={handleClose} />);

    await user.click(container.firstChild as Element);
    expect(handleClose).toHaveBeenCalled();
  });
});
