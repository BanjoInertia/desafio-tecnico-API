import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useUsers } from './hooks/useUsers';
import { useTheme } from './context/ThemeContext';
import { SearchBar } from './components/SearchBar';
import { UserCard } from './components/UserCard';
import { UserModal } from './components/UserModal';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import type { User } from './types/user';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  transition: background-color 0.3s ease;
`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadow};
  transition: background-color 0.3s, border-color 0.3s;
`;

const HeaderInner = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleGroup = styled.div``;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  transition: color 0.3s;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 4px 0 0;
  transition: color 0.3s;
`;

const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Main = styled.main`
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const SearchWrapper = styled.div`
  margin-bottom: 20px;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Empty = styled.div`
  text-align: center;
  padding: 64px 16px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyTitle = styled.p`
  font-size: 17px;
  font-weight: 500;
  margin: 0;
`;

const EmptySubtitle = styled.p`
  font-size: 14px;
  margin: 4px 0 0;
`;

export default function App() {
  const { users, loading, error } = useUsers();
  const { isDark, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  return (
    <PageWrapper>
      <Header>
        <HeaderInner>
          <TitleGroup>
            <Title>Usuários</Title>
            <Subtitle>Diretório de usuários JSONPlaceholder</Subtitle>
          </TitleGroup>
          <ThemeToggle onClick={toggleTheme} aria-label="Alternar tema">
            {isDark ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </ThemeToggle>
        </HeaderInner>
      </Header>

      <Main>
        <SearchWrapper>
          <SearchBar value={search} onChange={setSearch} />
        </SearchWrapper>

        {loading && <LoadingState />}

        {error && <ErrorState message={error} onRetry={() => window.location.reload()} />}

        {!loading && !error && (
          filtered.length === 0 ? (
            <Empty>
              <EmptyTitle>Nenhum usuário encontrado</EmptyTitle>
              <EmptySubtitle>Tente um nome diferente</EmptySubtitle>
            </Empty>
          ) : (
            <UserList>
              {filtered.map((user, index) => (
                <UserCard key={user.id} user={user} index={index} onClick={setSelectedUser} />
              ))}
            </UserList>
          )
        )}
      </Main>

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </PageWrapper>
  );
}
