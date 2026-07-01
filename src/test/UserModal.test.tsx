import { render, screen } from './utils';
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

const defaultProps = {
  user: mockUser,
  onClose: () => {},
  onDelete: () => {},
  onEdit: () => {},
};

describe('UserModal', () => {
  it('exibe os detalhes do usuário', () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument();
    expect(screen.getByText('1-770-736-8031')).toBeInTheDocument();
    expect(screen.getByText('Gwenborough')).toBeInTheDocument();
    expect(screen.getByText('Romaguera-Crona')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão fechar', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<UserModal {...defaultProps} onClose={handleClose} />);

    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('chama onClose ao pressionar Escape', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<UserModal {...defaultProps} onClose={handleClose} />);

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalled();
  });

  it('chama onClose ao clicar no overlay', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const { container } = render(<UserModal {...defaultProps} onClose={handleClose} />);

    await user.click(container.firstChild as Element);
    expect(handleClose).toHaveBeenCalled();
  });

  it('não exibe botão de remover para usuários da API (canDelete ausente)', () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.queryByRole('button', { name: /remover usuário/i })).not.toBeInTheDocument();
  });

  it('chama onEdit ao clicar em editar usuário (canDelete=true)', async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    render(<UserModal {...defaultProps} onEdit={handleEdit} canDelete />);

    await user.click(screen.getByRole('button', { name: /editar usuário/i }));
    expect(handleEdit).toHaveBeenCalled();
  });

  it('exige confirmação antes de chamar onDelete', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(<UserModal {...defaultProps} onDelete={handleDelete} canDelete />);

    await user.click(screen.getByRole('button', { name: /remover usuário/i }));
    expect(handleDelete).not.toHaveBeenCalled();
    expect(screen.getByText(/esta ação não pode ser desfeita/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /confirmar/i }));
    expect(handleDelete).toHaveBeenCalledWith(mockUser.id);
  });
});
