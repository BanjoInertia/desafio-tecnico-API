import { render, screen } from './utils';
import userEvent from '@testing-library/user-event';
import { Combobox } from '../components/Combobox';

const options = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'];

describe('Combobox', () => {
  it('renderiza com o placeholder correto', () => {
    render(<Combobox value="" onChange={() => {}} options={options} placeholder="Selecione a cidade" />);
    expect(screen.getByPlaceholderText('Selecione a cidade')).toBeInTheDocument();
  });

  it('exibe o valor atual no input', () => {
    render(<Combobox value="São Paulo" onChange={() => {}} options={options} />);
    expect(screen.getByDisplayValue('São Paulo')).toBeInTheDocument();
  });

  it('abre o dropdown ao clicar no input', async () => {
    const user = userEvent.setup();
    render(<Combobox value="" onChange={() => {}} options={options} placeholder="Cidade" />);
    await user.click(screen.getByPlaceholderText('Cidade'));
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument();
  });

  it('chama onChange ao selecionar uma opção', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Combobox value="" onChange={handleChange} options={options} placeholder="Cidade" />);
    await user.click(screen.getByPlaceholderText('Cidade'));
    await user.click(screen.getByText('São Paulo'));
    expect(handleChange).toHaveBeenCalledWith('São Paulo');
  });

  it('chama onChange ao digitar no input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Combobox value="" onChange={handleChange} options={options} placeholder="Cidade" />);
    await user.type(screen.getByPlaceholderText('Cidade'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('exibe opção de adicionar para valor novo', async () => {
    const user = userEvent.setup();
    render(<Combobox value="Curitiba" onChange={() => {}} options={options} placeholder="Cidade" />);
    await user.click(screen.getByPlaceholderText('Cidade'));
    expect(screen.getByText(/Adicionar "Curitiba"/)).toBeInTheDocument();
  });

  it('não exibe opção de adicionar quando o valor já existe', async () => {
    const user = userEvent.setup();
    render(<Combobox value="São Paulo" onChange={() => {}} options={options} placeholder="Cidade" />);
    await user.click(screen.getByPlaceholderText('Cidade'));
    expect(screen.queryByText(/Adicionar "São Paulo"/)).not.toBeInTheDocument();
  });

  it('abre e fecha o dropdown ao clicar na seta', async () => {
    const user = userEvent.setup();
    render(<Combobox value="" onChange={() => {}} options={options} placeholder="Cidade" />);
    const chevron = screen.getByText('▼');
    await user.click(chevron);
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
  });
});
