import { render, screen } from './utils';
import { LoadingState } from '../components/LoadingState';

describe('LoadingState', () => {
  it('renderiza com role status e label acessível', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status', { name: 'Carregando usuários' })).toBeInTheDocument();
  });

  it('exibe 6 cards skeleton', () => {
    const { container } = render(<LoadingState />);
    const cards = container.querySelectorAll('[aria-hidden="true"]');
    expect(cards).toHaveLength(6);
  });
});
