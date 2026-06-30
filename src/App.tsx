import { useState, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { useUsers } from './hooks/useUsers';
import { useDebounce } from './hooks/useDebounce';
import { useTheme as useAppTheme } from './context/ThemeContext';
import { ParticleCanvas } from './components/ParticleCanvas';
import { SplashScreen } from './components/SplashScreen';
import { SearchBar } from './components/SearchBar';
import { UserCard } from './components/UserCard';
import { UserModal } from './components/UserModal';
import { AddUserModal } from './components/AddUserModal';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import type { User } from './types/user';

const PageWrapper = styled.div<{ $visible: boolean }>`
  min-height: 100vh;
  position: relative;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.5s ease 0.1s;
`;

const cornerSize = '22px';
const cornerThickness = '2px';
const cornerGlow = 'rgba(0, 255, 135, 0.5)';

const HudCorner = styled.div<{ $pos: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: fixed;
  width: 36px;
  height: 36px;
  z-index: 10;
  pointer-events: none;

  ${({ $pos }) => $pos === 'tl' && 'top: 16px; left: 16px;'}
  ${({ $pos }) => $pos === 'tr' && 'top: 16px; right: 16px;'}
  ${({ $pos }) => $pos === 'bl' && 'bottom: 16px; left: 16px;'}
  ${({ $pos }) => $pos === 'br' && 'bottom: 16px; right: 16px;'}

  &::before, &::after {
    content: '';
    position: absolute;
    background: ${({ theme }) => theme.colors.heroTitle};
    box-shadow: 0 0 6px ${cornerGlow};
  }

  /* horizontal bar */
  &::before {
    width: ${cornerSize};
    height: ${cornerThickness};
    top: ${({ $pos }) => ($pos === 'tl' || $pos === 'tr') ? '0' : 'auto'};
    bottom: ${({ $pos }) => ($pos === 'bl' || $pos === 'br') ? '0' : 'auto'};
    left: ${({ $pos }) => ($pos === 'tl' || $pos === 'bl') ? '0' : 'auto'};
    right: ${({ $pos }) => ($pos === 'tr' || $pos === 'br') ? '0' : 'auto'};
  }

  /* vertical bar */
  &::after {
    width: ${cornerThickness};
    height: ${cornerSize};
    top: ${({ $pos }) => ($pos === 'tl' || $pos === 'tr') ? '0' : 'auto'};
    bottom: ${({ $pos }) => ($pos === 'bl' || $pos === 'br') ? '0' : 'auto'};
    left: ${({ $pos }) => ($pos === 'tl' || $pos === 'bl') ? '0' : 'auto'};
    right: ${({ $pos }) => ($pos === 'tr' || $pos === 'br') ? '0' : 'auto'};
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
`;

const Hero = styled.header`
  background: ${({ theme }) => theme.colors.heroBg};
  padding: 40px 24px 40px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeroPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(${({ theme }) => theme.colors.heroPattern} 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.colors.heroPattern} 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
`;

const HeroInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const HeroText = styled.div``;

const HeroLabel = styled.p`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.heroSubtitle};
  margin: 0 0 8px;
`;

const HeroTitle = styled.h1`
  font-size: 42px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.heroTitle};
  margin: 0;
  letter-spacing: -1px;
  line-height: 1;
`;

const ThemeToggle = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.toggleBorder};
  background: ${({ theme }) => theme.colors.toggleBg};
  color: ${({ theme }) => theme.colors.toggleColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.toggleBorder};
  }
`;

const MainContent = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 48px;
`;

const SearchCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 16px 18px;
  box-shadow: ${({ theme }) => theme.colors.searchShadow};
  margin-bottom: 20px;
  transition: background-color 0.3s;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AddButton = styled.button`
  white-space: nowrap;
  padding: 8px 14px;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 13px;
  font-weight: 900;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  transition: box-shadow 0.15s, transform 0.15s;
  flex-shrink: 0;

  &:hover {
    box-shadow: 5px 5px 0 ${({ theme }) => theme.colors.border};
    transform: translate(-1px, -1px);
  }

  &:active {
    box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
    transform: translate(0, 0);
  }
`;

const ResultsBadge = styled.span`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.badgeText};
  background: ${({ theme }) => theme.colors.badge};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 4px 10px;
  border-radius: 4px;
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 64px 16px;
  grid-column: 1 / -1;
`;

const EmptyEmoji = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const EmptyTitle = styled.p`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const EmptySubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 6px 0 0;
`;

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useAppTheme();
  return (
    <ThemeToggle onClick={toggleTheme} aria-label="Alternar tema">
      {isDark ? '☀️' : '🌙'}
    </ThemeToggle>
  );
}

export default function App() {
  const { users, loading, error, addUser, removeUser, isLocalUser } = useUsers();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [splashDone, setSplashDone] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const theme = useTheme();

  const filtered = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(debouncedSearch.toLowerCase())),
    [users, debouncedSearch]
  );

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <PageWrapper $visible={splashDone}>
      <HudCorner $pos="tl" />
      <HudCorner $pos="tr" />
      <HudCorner $pos="bl" />
      <HudCorner $pos="br" />
      <ParticleCanvas colors={theme.colors.particleColors} />

      <Content>
        <Hero>
          <HeroPattern />
          <HeroInner>
            <HeroText>
              <HeroLabel>root@jsonplaceholder:~$ ./load_users</HeroLabel>
              <HeroTitle>Usuários</HeroTitle>
            </HeroText>
            <ThemeToggleButton />
          </HeroInner>
        </Hero>

        <MainContent>
          <SearchCard>
            <SearchRow>
              <SearchBar value={search} onChange={setSearch} />
              {!loading && !error && (
                <ResultsBadge>{filtered.length}/{users.length}</ResultsBadge>
              )}
              <AddButton onClick={() => setShowAddModal(true)}>+ Novo</AddButton>
            </SearchRow>
          </SearchCard>

          {loading && <LoadingState />}
          {error && <ErrorState message={error} onRetry={() => window.location.reload()} />}

          {!loading && !error && (
            <UserGrid>
              {filtered.length === 0 ? (
                <Empty>
                  <EmptyEmoji>🔍</EmptyEmoji>
                  <EmptyTitle>Nenhum usuário encontrado</EmptyTitle>
                  <EmptySubtitle>Tente buscar por outro nome</EmptySubtitle>
                </Empty>
              ) : (
                filtered.map((user, index) => (
                  <UserCard key={user.id} user={user} index={index} onClick={setSelectedUser} />
                ))
              )}
            </UserGrid>
          )}
        </MainContent>
      </Content>

      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={(id) => { removeUser(id); setSelectedUser(null); }}
          canDelete={isLocalUser(selectedUser.id)}
        />
      )}
      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} onAdd={addUser} />
      )}
      </PageWrapper>
    </>
  );
}
