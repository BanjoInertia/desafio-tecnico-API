import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import type { User } from '../types/user';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.2s ease;
`;

const Dialog = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  animation: ${slideUp} 0.25s ease;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  padding: 32px 24px 48px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 22px;
  flex-shrink: 0;
`;

const HeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const HeaderName = styled.h2`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
`;

const HeaderUsername = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin: 4px 0 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
  align-self: flex-start;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Body = styled.div`
  background: #fff;
  border-radius: 24px 24px 0 0;
  margin-top: -24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const IconWrapper = styled.span`
  color: #6366f1;
  margin-top: 2px;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const DetailText = styled.div``;

const DetailLabel = styled.p`
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
`;

const DetailValue = styled.p`
  color: #1f2937;
  font-weight: 500;
  margin: 2px 0 0;
`;

interface DetailRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function DetailRow({ label, value, icon }: DetailRowProps) {
  return (
    <DetailItem>
      <IconWrapper>{icon}</IconWrapper>
      <DetailText>
        <DetailLabel>{label}</DetailLabel>
        <DetailValue>{value}</DetailValue>
      </DetailText>
    </DetailItem>
  );
}

interface UserModalProps {
  user: User;
  onClose: () => void;
}

export function UserModal({ user, onClose }: UserModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderAvatar>{initials}</HeaderAvatar>
          <HeaderInfo>
            <HeaderName>{user.name}</HeaderName>
            <HeaderUsername>@{user.username}</HeaderUsername>
          </HeaderInfo>
          <CloseButton onClick={onClose} aria-label="Fechar">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </CloseButton>
        </ModalHeader>

        <Body>
          <DetailRow
            label="Email"
            value={user.email}
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <DetailRow
            label="Telefone"
            value={user.phone}
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />
          <DetailRow
            label="Cidade"
            value={user.address.city}
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <DetailRow
            label="Empresa"
            value={user.company.name}
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </Body>
      </Dialog>
    </Overlay>
  );
}
