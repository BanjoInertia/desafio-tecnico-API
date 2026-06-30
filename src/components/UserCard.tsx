import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import type { User } from '../types/user';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const AVATAR_COLORS = [
  '#00FF87', '#00CFFF', '#FF00CC',
  '#FFD700', '#FF4488', '#00E5FF',
  '#ADFF2F', '#FF6EC7',
];

function getDiceBearUrl(name: string) {
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(name)}&backgroundColor=transparent`;
}

const Card = styled.button<{ $index: number }>`
  width: 100%;
  text-align: left;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 6px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  padding: 0;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.15s ease, background-color 0.3s;
  animation: ${slideIn} 0.3s ease both;
  animation-delay: ${({ $index }) => $index * 45}ms;
  overflow: hidden;

  &:hover {
    box-shadow: ${({ theme }) => theme.colors.cardShadowHover};
    transform: translate(-2px, -2px);
  }

  &:active {
    box-shadow: ${({ theme }) => theme.colors.cardShadow};
    transform: translate(0, 0);
  }
`;

const CardTitleBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.pageBg};
`;

const Dot = styled.span<{ $color: string }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const TitleBarPath = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.04em;
  margin-left: 4px;
  flex: 1;
`;

const LocalBadge = styled.span`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 1px 5px;
  border-radius: 2px;
  opacity: 0.85;
  flex-shrink: 0;
`;

const CardBody = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
`;

const AvatarWrapper = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 4px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ $color }) => $color}14;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.span<{ $color: string }>`
  font-weight: 800;
  font-size: 14px;
  color: ${({ $color }) => $color};
`;

const Info = styled.div`
  min-width: 0;
  flex: 1;
`;

const Name = styled.p`
  font-weight: 700;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const Email = styled.p`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 3px 0 0;
`;

const Prompt = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
  line-height: 1;
  transition: color 0.15s;

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface UserCardProps {
  user: User;
  index: number;
  isLocal?: boolean;
  onClick: (user: User) => void;
}

export function UserCard({ user, index, isLocal = false, onClick }: UserCardProps) {
  const [imgError, setImgError] = useState(false);
  const color = AVATAR_COLORS[user.id % AVATAR_COLORS.length];

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const slug = user.username.toLowerCase();

  return (
    <Card $index={index} onClick={() => onClick(user)}>
      <CardTitleBar>
        <Dot $color="#FF5F57" />
        <Dot $color="#FFBD2E" />
        <Dot $color="#28CA41" />
        <TitleBarPath>~/users/{slug}</TitleBarPath>
        {isLocal && <LocalBadge>LOCAL</LocalBadge>}
      </CardTitleBar>
      <CardBody>
        <AvatarWrapper $color={color}>
          {imgError ? (
            <AvatarFallback $color={color}>{initials}</AvatarFallback>
          ) : (
            <AvatarImg
              src={getDiceBearUrl(user.name)}
              alt={user.name}
              onError={() => setImgError(true)}
            />
          )}
        </AvatarWrapper>
        <Info>
          <Name>{user.name}</Name>
          <Email>{user.email}</Email>
        </Info>
        <Prompt>{'>_'}</Prompt>
      </CardBody>
    </Card>
  );
}
