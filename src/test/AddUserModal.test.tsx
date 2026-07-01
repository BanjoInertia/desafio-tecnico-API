import { render, screen, fireEvent } from './utils';
import userEvent from '@testing-library/user-event';
import { AddUserModal } from '../components/AddUserModal';

const defaultProps = {
  onClose: vi.fn(),
  onAdd: vi.fn(),
};

describe('AddUserModal', () => {
  it('renderiza os campos do formulário', () => {
    render(<AddUserModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('Nome completo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@exemplo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('(11) 99999-9999')).toBeInTheDocument();
  });

  it('exibe erro de nome ao submeter sem preencher', async () => {
    const user = userEvent.setup();
    render(<AddUserModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'Criar usuário' }));
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
  });

  it('exibe erro de email ao submeter sem preencher', async () => {
    const user = userEvent.setup();
    render(<AddUserModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'Criar usuário' }));
    expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
  });

  it('exibe erro de email inválido ao sair do campo', async () => {
    const user = userEvent.setup();
    render(<AddUserModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('email@exemplo.com'), 'invalido');
    await user.tab();
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('não exibe erro de email com formato válido', async () => {
    const user = userEvent.setup();
    render(<AddUserModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('email@exemplo.com'), 'valido@email.com');
    await user.tab();
    expect(screen.queryByText('Email inválido')).not.toBeInTheDocument();
  });

  it('formata o telefone automaticamente', () => {
    render(<AddUserModal {...defaultProps} />);
    const phoneInput = screen.getByPlaceholderText('(11) 99999-9999');
    fireEvent.change(phoneInput, { target: { value: '11987654321' } });
    expect(screen.getByDisplayValue('(11) 98765-4321')).toBeInTheDocument();
  });

  it('não aceita letras no campo de telefone', () => {
    render(<AddUserModal {...defaultProps} />);
    const phoneInput = screen.getByPlaceholderText('(11) 99999-9999');
    fireEvent.change(phoneInput, { target: { value: 'abc123' } });
    expect(screen.getByDisplayValue('(12) 3')).toBeInTheDocument();
  });

  it('chama onClose ao clicar em Cancelar', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AddUserModal {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('chama onClose ao pressionar Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AddUserModal {...defaultProps} onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('exibe sugestões no combobox de empresa', async () => {
    const user = userEvent.setup();
    render(<AddUserModal {...defaultProps} companies={['Acme Corp', 'Globo']} />);
    await user.click(screen.getAllByPlaceholderText('Selecione ou digite')[1]);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Globo')).toBeInTheDocument();
  });
});
