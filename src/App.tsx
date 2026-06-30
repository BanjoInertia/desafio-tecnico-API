import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useUsers } from './hooks/useUsers';
import { SearchBar } from './components/SearchBar';
import { UserCard } from './components/UserCard';
import { UserModal } from './components/UserModal';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import type { User } from './types/user';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
`;

const Header = styled.header`
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const HeaderInner = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 20px 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 0;
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
  color: #9ca3af;
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
          <Title>Usuários</Title>
          <Subtitle>Diretório de usuários JSONPlaceholder</Subtitle>
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
              {filtered.map((user) => (
                <UserCard key={user.id} user={user} onClick={setSelectedUser} />
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
