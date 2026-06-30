import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import type { User } from '../types/user';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const popIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: ${({ theme }) => theme.colors.overlay};
  animation: ${fadeIn} 0.18s ease;
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.modalShadow};
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  animation: ${popIn} 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition: background-color 0.3s, border-color 0.3s;
`;

const ModalHeader = styled.div`
  background: ${({ theme }) => theme.colors.heroBg};
  padding: 28px 24px 44px;
  position: relative;
  overflow: hidden;
`;

const HeaderPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.heroPattern} 1px,
    transparent 1px
  );
  background-size: 18px 18px;
  pointer-events: none;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 6px;
  border: 2px solid ${({ theme }) => theme.colors.toggleBorder};
  background: ${({ theme }) => theme.colors.toggleBg};
  color: ${({ theme }) => theme.colors.toggleColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.toggleBorder};
  }
`;

const AvatarWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  border: 2.5px solid ${({ theme }) => theme.colors.toggleBorder};
  background: ${({ theme }) => theme.colors.toggleBg};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.span`
  font-weight: 900;
  font-size: 26px;
  color: ${({ theme }) => theme.colors.heroTitle};
`;

const HeaderName = styled.h2`
  color: ${({ theme }) => theme.colors.heroTitle};
  font-size: 22px;
  font-weight: 900;
  margin: 14px 0 0;
  letter-spacing: -0.3px;
  position: relative;
  z-index: 1;
`;

const HeaderUsername = styled.p`
  color: ${({ theme }) => theme.colors.heroSubtitle};
  font-size: 13px;
  font-weight: 600;
  margin: 4px 0 0;
  position: relative;
  z-index: 1;
`;

const Body = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 2.5px solid ${({ theme }) => theme.colors.border};
  padding: 8px 0;
  transition: background-color 0.3s;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 24px;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const IconBox = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 7px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};

  svg {
    width: 17px;
    height: 17px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DetailLabel = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  margin: 0;
`;

const DetailValue = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  margin: 3px 0 0;
  transition: color 0.3s;
`;

interface DetailRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function DetailRow({ label, value, icon }: DetailRowProps) {
  return (
    <DetailItem>
      <IconBox>{icon}</IconBox>
      <div>
        <DetailLabel>{label}</DetailLabel>
        <DetailValue>{value}</DetailValue>
      </div>
    </DetailItem>
  );
}

const DeleteButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #ef4444;
  font-size: 13px;
  font-weight: 800;
  border: none;
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #fef2f2;
    color: #dc2626;
  }
`;

interface UserModalProps {
  user: User;
  onClose: () => void;
  onDelete: (id: number) => void;
  canDelete?: boolean;
}

export function UserModal({ user, onClose, onDelete, canDelete = false }: UserModalProps) {
  const [imgError, setImgError] = useState(false);

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

  const avatarUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=transparent`;

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderPattern />
          <HeaderTop>
            <CloseButton onClick={onClose} aria-label="Fechar">✕</CloseButton>
          </HeaderTop>
          <AvatarWrapper>
            {imgError ? (
              <AvatarFallback>{initials}</AvatarFallback>
            ) : (
              <AvatarImg
                src={avatarUrl}
                alt={user.name}
                onError={() => setImgError(true)}
              />
            )}
          </AvatarWrapper>
          <HeaderName>{user.name}</HeaderName>
          <HeaderUsername>@{user.username}</HeaderUsername>
        </ModalHeader>

        <Body>
          <DetailRow
            label="Email"
            value={user.email}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
          <DetailRow
            label="Telefone"
            value={user.phone}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
          />
          <DetailRow
            label="Cidade"
            value={user.address.city}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <DetailRow
            label="Empresa"
            value={user.company.name}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          />
          {canDelete && (
            <DeleteButton onClick={() => { onDelete(user.id); onClose(); }}>
              🗑 Remover usuário
            </DeleteButton>
          )}
        </Body>
      </Dialog>
    </Overlay>
  );
}
