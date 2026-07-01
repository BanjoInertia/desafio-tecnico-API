import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

const Icon = styled.svg`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 17px;
  height: 17px;
  color: ${({ theme }) => theme.colors.cardTitleColor};
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.cardTitleColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 4px;
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 36px 11px 40px;
  border-radius: 8px;
  border: 2.5px solid ${({ theme }) => theme.colors.cardTitleColor};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  box-shadow: ${({ theme }) => theme.colors.inputShadow};
  outline: none;
  transition: box-shadow 0.15s, border-color 0.15s, background-color 0.3s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 400;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.colors.inputShadowFocus};
  }
`;

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <Wrapper role="search" aria-label="Buscar usuários">
      <Icon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </Icon>
      <Input
        type="text"
        placeholder="Buscar por nome..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar por nome"
      />
      {value && (
        <ClearButton onClick={() => onChange('')} aria-label="Limpar busca">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </ClearButton>
      )}
    </Wrapper>
  );
}
