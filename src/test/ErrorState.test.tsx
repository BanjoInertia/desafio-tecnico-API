import { render, screen } from './utils';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '../components/ErrorState';

describe('ErrorState', () => {
  it('exibe a mensagem de erro', () => {
    render(<ErrorState message="Falha ao buscar usuários" onRetry={() => {}} />);
    expect(screen.getByText('Falha ao buscar usuários')).toBeInTheDocument();
  });

  it('chama onRetry ao clicar no botão', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    render(<ErrorState message="Erro" onRetry={handleRetry} />);

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(handleRetry).toHaveBeenCalled();
  });
});
