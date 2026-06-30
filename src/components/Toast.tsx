import styled, { keyframes } from 'styled-components';
import { useToast } from '../context/ToastContext';

const slideIn = keyframes`
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

const Container = styled.div`
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
`;

const ToastItem = styled.div<{ $type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 18px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ $type }) => ($type === 'success' ? '#00FF87' : '#FF4466')};
  border-radius: 4px;
  color: ${({ $type }) => ($type === 'success' ? '#00FF87' : '#FF4466')};
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.04em;
  box-shadow: ${({ $type }) =>
    $type === 'success'
      ? '0 0 18px rgba(0,255,135,0.22), 4px 4px 0 rgba(0,255,135,0.28)'
      : '0 0 18px rgba(255,68,102,0.22), 4px 4px 0 rgba(255,68,102,0.28)'};
  pointer-events: all;
  min-width: 220px;
  animation: ${slideIn} 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both;
`;

const Icon = styled.span`
  font-size: 14px;
  flex-shrink: 0;
`;

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <Container>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} $type={toast.type}>
          <Icon>{toast.type === 'success' ? '✓' : '✕'}</Icon>
          {toast.message}
        </ToastItem>
      ))}
    </Container>
  );
}
