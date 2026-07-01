import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
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
  max-width: 500px;
  overflow: hidden;
  animation: ${popIn} 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const ModalHeader = styled.div`
  background: ${({ theme }) => theme.colors.heroBg};
  padding: 32px 28px 28px;
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
`;

const HeaderIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
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
  width: 88px;
  height: 88px;
  border-radius: 12px;
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
  font-size: 30px;
  color: ${({ theme }) => theme.colors.heroTitle};
`;

const HeaderName = styled.h2`
  color: ${({ theme }) => theme.colors.heroTitle};
  font-size: 24px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const HeaderUsername = styled.p`
  color: ${({ theme }) => theme.colors.heroSubtitle};
  font-size: 14px;
  font-weight: 600;
  margin: 5px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderMeta = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

const MetaChip = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.heroSubtitle};
  border: 1px solid ${({ theme }) => theme.colors.toggleBorder};
  background: ${({ theme }) => theme.colors.toggleBg};
  padding: 3px 8px;
  border-radius: 3px;
`;

const Body = styled.div`
  background: ${({ theme }) => theme.colors.surface};
`;

const DetailItem = styled.button<{ $clickable?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 28px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: background 0.15s;
  font-family: inherit;

  &:last-child {
    border-bottom: none;
  }

  ${({ $clickable, theme }) =>
    $clickable &&
    `&:hover {
      background: ${theme.colors.toggleBg};
    }`}
`;

const IconBox = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.toggleBg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 19px;
    height: 19px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DetailContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const DetailLabel = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  margin: 0;
`;

const DetailValue = styled.p<{ $empty?: boolean }>`
  color: ${({ $empty, theme }) => ($empty ? theme.colors.textMuted : theme.colors.text)};
  font-size: 14px;
  font-weight: ${({ $empty }) => ($empty ? 400 : 600)};
  font-style: ${({ $empty }) => ($empty ? 'italic' : 'normal')};
  margin: 4px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CopyHint = styled.span<{ $copied: boolean }>`
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  color: ${({ $copied, theme }) => ($copied ? theme.colors.heroTitle : theme.colors.textMuted)};
  letter-spacing: 0.05em;
  transition: color 0.2s;
`;

const DeleteButton = styled.button`
  width: 100%;
  padding: 13px;
  background: transparent;
  color: #ef4444;
  font-size: 13px;
  font-weight: 800;
  border: none;
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  letter-spacing: 0.03em;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(239, 68, 68, 0.08);
  }
`;

interface DetailRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  copyable?: boolean;
  copied?: boolean;
  onCopy?: () => void;
}

function DetailRow({ label, value, icon, copyable, copied, onCopy }: DetailRowProps) {
  const empty = !value.trim();
  const canCopy = copyable && !empty;
  return (
    <DetailItem $clickable={canCopy} onClick={canCopy ? onCopy : undefined}>
      <IconBox>{icon}</IconBox>
      <DetailContent>
        <DetailLabel>{label}</DetailLabel>
        <DetailValue $empty={empty}>{empty ? 'Não informado' : value}</DetailValue>
      </DetailContent>
      {canCopy && (
        <CopyHint $copied={!!copied}>{copied ? '✓ COPIADO' : 'COPIAR'}</CopyHint>
      )}
    </DetailItem>
  );
}

interface UserModalProps {
  user: User;
  onClose: () => void;
  onDelete: (id: number) => void;
  canDelete?: boolean;
}

export function UserModal({ user, onClose, onDelete, canDelete = false }: UserModalProps) {
  useBodyScrollLock();
  const dialogRef = useFocusTrap();
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleCopy(label: string, value: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const avatarUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(user.avatarSeed || user.name)}&backgroundColor=transparent`;
  const addressParts = [user.address.street, user.address.suite, user.address.zipcode].filter(Boolean);
  const address = addressParts.join(', ').replace(/, ([^,]+)$/, ' — $1');

  return (
    <Overlay onClick={onClose}>
      <Dialog ref={dialogRef} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderPattern />
          <HeaderTop>
            <HeaderIdentity>
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
              <div style={{ minWidth: 0, flex: 1 }}>
                <HeaderName>{user.name}</HeaderName>
                <HeaderUsername>@{user.username}</HeaderUsername>
              </div>
            </HeaderIdentity>
            <CloseButton onClick={onClose} aria-label="Fechar">✕</CloseButton>
          </HeaderTop>
          <HeaderMeta>
            {user.company.name && <MetaChip>🏢 {user.company.name}</MetaChip>}
            {user.address.city && <MetaChip>📍 {user.address.city}</MetaChip>}
            {user.website && <MetaChip>🌐 {user.website}</MetaChip>}
          </HeaderMeta>
        </ModalHeader>

        <Body>
          <DetailRow
            label="Email"
            value={user.email}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            copyable
            copied={copied === 'email'}
            onCopy={() => handleCopy('email', user.email)}
          />
          <DetailRow
            label="Telefone"
            value={user.phone}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
            copyable
            copied={copied === 'telefone'}
            onCopy={() => handleCopy('telefone', user.phone)}
          />
          <DetailRow
            label="Website"
            value={user.website}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
            copyable
            copied={copied === 'website'}
            onCopy={() => handleCopy('website', user.website)}
          />
          <DetailRow
            label="Endereço"
            value={address}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
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
