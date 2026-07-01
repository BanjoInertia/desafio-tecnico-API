import { render, screen } from './utils';
import userEvent from '@testing-library/user-event';
import { SelectDropdown } from '../components/SelectDropdown';

const options = [
  { label: 'Padrão', value: 'default' },
  { label: 'Nome A→Z', value: 'name_asc' },
  { label: 'Nome Z→A', value: 'name_desc' },
];

describe('SelectDropdown', () => {
  it('exibe o label da opção selecionada', () => {
    render(<SelectDropdown value="default" onChange={() => {}} options={options} />);
    expect(screen.getByText('Padrão')).toBeInTheDocument();
  });

  it('abre o dropdown ao clicar no trigger', async () => {
    const user = userEvent.setup();
    render(<SelectDropdown value="default" onChange={() => {}} options={options} />);
    await user.click(screen.getByText('Padrão'));
    expect(screen.getByText('Nome A→Z')).toBeInTheDocument();
    expect(screen.getByText('Nome Z→A')).toBeInTheDocument();
  });

  it('chama onChange com o valor correto ao selecionar', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<SelectDropdown value="default" onChange={handleChange} options={options} />);
    await user.click(screen.getByText('Padrão'));
    await user.pointer({ target: screen.getByText('Nome A→Z'), keys: '[MouseLeft]' });
    expect(handleChange).toHaveBeenCalledWith('name_asc');
  });

  it('fecha o dropdown após selecionar uma opção', async () => {
    const user = userEvent.setup();
    render(<SelectDropdown value="default" onChange={() => {}} options={options} />);
    await user.click(screen.getByText('Padrão'));
    await user.pointer({ target: screen.getByText('Nome A→Z'), keys: '[MouseLeft]' });
    expect(screen.queryByText('Nome Z→A')).not.toBeInTheDocument();
  });
});
