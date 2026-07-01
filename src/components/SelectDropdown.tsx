import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  position: relative;
`;

const SelectTrigger = styled.button<{ $open: boolean }>`
  background: ${({ theme }) => theme.colors.pageBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1.5px solid ${({ $open, theme }) => $open ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  padding: 7px 28px 7px 10px;
  min-width: 160px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  position: relative;
  white-space: nowrap;
  text-align: left;
  transition: border-color 0.15s;

  &::after {
    content: '';
    position: absolute;
    right: 9px;
    top: 50%;
    transform: translateY(-50%) ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0)'};
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid ${({ theme }) => theme.colors.textMuted};
    transition: transform 0.15s;
  }
`;

const SelectDropdownList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 100%;
  z-index: 200;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 4px 0;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} transparent;
`;

const SelectItem = styled.li<{ $active: boolean }>`
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.text};
  background: ${({ $active, theme }) => $active ? theme.colors.primaryLight : 'transparent'};
  cursor: pointer;
  transition: background 0.1s, color 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export function SelectDropdown({ value, onChange, options }: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = options.find(o => o.value === value)?.label ?? value;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <SelectWrapper ref={ref}>
      <SelectTrigger $open={open} onClick={() => setOpen(o => !o)}>
        {label}
      </SelectTrigger>
      {open && (
        <SelectDropdownList>
          {options.map(opt => (
            <SelectItem
              key={opt.value}
              $active={opt.value === value}
              onMouseDown={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectDropdownList>
      )}
    </SelectWrapper>
  );
}
