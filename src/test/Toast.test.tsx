import { render, screen, act, fireEvent } from './utils';
import userEvent from '@testing-library/user-event';
import { ToastContainer } from '../components/Toast';
import { ToastProvider, useToast } from '../context/ToastContext';

function Trigger({ message, type = 'success' as const }: { message: string; type?: 'success' | 'error' }) {
  const { showToast } = useToast();
  return <button onClick={() => showToast(message, type)}>trigger</button>;
}

function setup(message: string, type?: 'success' | 'error') {
  render(
    <ToastProvider>
      <Trigger message={message} type={type} />
      <ToastContainer />
    </ToastProvider>
  );
}

describe('ToastContainer', () => {
  it('não renderiza nada sem toasts', () => {
    render(<ToastProvider><ToastContainer /></ToastProvider>);
    expect(screen.queryByText('✓')).not.toBeInTheDocument();
    expect(screen.queryByText('✕')).not.toBeInTheDocument();
  });

  it('exibe toast de sucesso com mensagem e ícone ✓', async () => {
    const user = userEvent.setup();
    setup('Usuário criado com sucesso');
    await user.click(screen.getByRole('button', { name: 'trigger' }));
    expect(screen.getByText('Usuário criado com sucesso')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('exibe toast de erro com mensagem e ícone ✕', async () => {
    const user = userEvent.setup();
    setup('Usuário removido', 'error');
    await user.click(screen.getByRole('button', { name: 'trigger' }));
    expect(screen.getByText('Usuário removido')).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('remove o toast após 3200ms', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger message="Mensagem temporária" />
        <ToastContainer />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'trigger' }));
    expect(screen.getByText('Mensagem temporária')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(3200); });
    expect(screen.queryByText('Mensagem temporária')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
