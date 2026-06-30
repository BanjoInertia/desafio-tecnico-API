import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  min-width: 0;
  width: 100%;
`;

const InputWrapper = styled.div<{ $error?: boolean; $focused: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 7px;
  border: 2px solid ${({ theme, $error, $focused }) =>
    $error ? '#ef4444' : $focused ? theme.colors.primary : theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme, $error, $focused }) =>
    $error
      ? '3px 3px 0 #ef4444'
      : $focused
      ? theme.colors.inputShadowFocus
      : theme.colors.inputShadow};
  transition: border-color 0.15s, box-shadow 0.15s;
  cursor: text;
  gap: 6px;
`;

const ComboInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 400;
  }
`;

const Chevron = styled.span<{ $open: boolean }>`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px;
  flex-shrink: 0;
  transition: transform 0.15s;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
  cursor: pointer;
  user-select: none;
`;

const Dropdown = styled.ul<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 300;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  max-height: 180px;
  overflow-y: auto;
  list-style: none;
  padding: 4px 0;
  display: ${({ $open }) => ($open ? 'block' : 'none')};

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} transparent;
`;

const Item = styled.li`
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: background 0.1s, color 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddItem = styled(Item)`
  color: ${({ theme }) => theme.colors.primary};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 2px;
  padding-top: 10px;
`;

const EmptyItem = styled.li`
  padding: 10px 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit;
`;

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  $error?: boolean;
}

export function Combobox({ value, onChange, options, placeholder, $error }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = value.trim()
    ? options.filter((o) => o.toLowerCase().includes(value.toLowerCase()))
    : options;

  const showAdd = value.trim() !== '' && !options.some((o) => o.toLowerCase() === value.toLowerCase());

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
  }

  return (
    <Wrapper ref={wrapperRef}>
      <InputWrapper $error={$error} $focused={focused} onClick={() => { setOpen(true); setFocused(true); }}>
        <ComboInput
          value={value}
          placeholder={placeholder}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
        />
        <Chevron $open={open} onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>▼</Chevron>
      </InputWrapper>

      <Dropdown $open={open}>
        {filtered.length === 0 && !showAdd && (
          <EmptyItem>Nenhuma opção encontrada</EmptyItem>
        )}
        {filtered.map((opt) => (
          <Item key={opt} onMouseDown={() => handleSelect(opt)}>{opt}</Item>
        ))}
        {showAdd && (
          <AddItem onMouseDown={() => handleSelect(value)}>
            + Adicionar "{value}"
          </AddItem>
        )}
      </Dropdown>
    </Wrapper>
  );
}
