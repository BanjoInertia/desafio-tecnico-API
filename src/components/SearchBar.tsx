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
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 16px 11px 40px;
  border-radius: 8px;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
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
    <Wrapper>
      <Icon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </Icon>
      <Input
        type="text"
        placeholder="Buscar por nome..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Wrapper>
  );
}
