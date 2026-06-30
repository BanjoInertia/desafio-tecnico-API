import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import type { User } from '../types/user';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const AVATAR_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#8b5cf6',
  '#ef4444', '#14b8a6',
];

function getDiceBearUrl(name: string) {
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(name)}&backgroundColor=transparent`;
}

const Card = styled.button<{ $index: number }>`
  width: 100%;
  text-align: left;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  padding: 18px 20px;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.15s ease, background-color 0.3s;
  animation: ${slideIn} 0.3s ease both;
  animation-delay: ${({ $index }) => $index * 45}ms;

  &:hover {
    box-shadow: ${({ theme }) => theme.colors.cardShadowHover};
    transform: translate(-2px, -2px);
  }

  &:active {
    box-shadow: ${({ theme }) => theme.colors.cardShadow};
    transform: translate(0, 0);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const AvatarWrapper = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ $color }) => $color}18;
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
  font-size: 15px;
  color: ${({ $color }) => $color};
`;

const Info = styled.div`
  min-width: 0;
  flex: 1;
`;

const Name = styled.p`
  font-weight: 700;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const Email = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 3px 0 0;
`;

const ArrowTag = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
  line-height: 1;
  transition: color 0.15s, transform 0.15s;

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(3px);
  }
`;

interface UserCardProps {
  user: User;
  index: number;
  onClick: (user: User) => void;
}

export function UserCard({ user, index, onClick }: UserCardProps) {
  const [imgError, setImgError] = useState(false);
  const color = AVATAR_COLORS[user.id % AVATAR_COLORS.length];

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card $index={index} onClick={() => onClick(user)}>
      <Row>
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
        <ArrowTag>→</ArrowTag>
      </Row>
    </Card>
  );
}
