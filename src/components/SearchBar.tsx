import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
`;

const Icon = styled.svg`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 16px 10px 38px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.inputFocusRing};
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
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
