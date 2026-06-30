import styled, { keyframes } from 'styled-components';
import type { User } from '../types/user';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Card = styled.button<{ $index: number }>`
  width: 100%;
  text-align: left;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadow};
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s, background-color 0.3s;
  animation: ${slideIn} 0.3s ease both;
  animation-delay: ${({ $index }) => $index * 60}ms;

  &:hover {
    box-shadow: ${({ theme }) => theme.colors.shadowHover};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryText};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  transition: background 0.2s;

  ${Card}:hover & {
    background: ${({ theme }) => theme.colors.primaryLightHover};
  }
`;

const Info = styled.div`
  min-width: 0;
  flex: 1;
`;

const Name = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  transition: color 0.3s;
`;

const Email = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 2px 0 0;
  transition: color 0.3s;
`;

const ChevronIcon = styled.svg`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  transition: color 0.2s;

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface UserCardProps {
  user: User;
  index: number;
  onClick: (user: User) => void;
}

export function UserCard({ user, index, onClick }: UserCardProps) {
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card $index={index} onClick={() => onClick(user)}>
      <Row>
        <Avatar>{initials}</Avatar>
        <Info>
          <Name>{user.name}</Name>
          <Email>{user.email}</Email>
        </Info>
        <ChevronIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </ChevronIcon>
      </Row>
    </Card>
  );
}
