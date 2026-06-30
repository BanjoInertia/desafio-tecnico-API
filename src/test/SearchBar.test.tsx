import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../components/SearchBar';

describe('SearchBar', () => {
  it('renderiza o input com placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Buscar por nome...')).toBeInTheDocument();
  });

  it('exibe o valor passado via prop', () => {
    render(<SearchBar value="Leanne" onChange={() => {}} />);
    expect(screen.getByDisplayValue('Leanne')).toBeInTheDocument();
  });

  it('chama onChange ao digitar', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    await user.type(screen.getByPlaceholderText('Buscar por nome...'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });
});
