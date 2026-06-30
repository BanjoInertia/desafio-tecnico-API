import styled from 'styled-components';
import type { User } from '../types/user';

const Card = styled.button`
  width: 100%;
  text-align: left;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #c7d2fe;
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
  background: #e0e7ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  transition: background 0.2s;

  ${Card}:hover & {
    background: #c7d2fe;
  }
`;

const Info = styled.div`
  min-width: 0;
  flex: 1;
`;

const Name = styled.p`
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const Email = styled.p`
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  margin-top: 2px;
`;

const ChevronIcon = styled.svg`
  width: 20px;
  height: 20px;
  color: #d1d5db;
  flex-shrink: 0;
  transition: color 0.2s;

  ${Card}:hover & {
    color: #6366f1;
  }
`;

interface UserCardProps {
  user: User;
  onClick: (user: User) => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card onClick={() => onClick(user)}>
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
