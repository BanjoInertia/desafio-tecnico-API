import { useState, useMemo } from 'react';
import styled, { useTheme, keyframes, css } from 'styled-components';
import { useUsers } from './hooks/useUsers';
import { useDebounce } from './hooks/useDebounce';
import { useTheme as useAppTheme } from './context/ThemeContext';
import { useToast } from './context/ToastContext';
import { ParticleCanvas } from './components/ParticleCanvas';
import { SplashScreen } from './components/SplashScreen';
import { SearchBar } from './components/SearchBar';
import { UserCard } from './components/UserCard';
import { UserModal } from './components/UserModal';
import { AddUserModal } from './components/AddUserModal';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { ToastContainer } from './components/Toast';
import type { User } from './types/user';

type SortOption = 'default' | 'name_asc' | 'name_desc' | 'company_asc';

const enterDown = keyframes`
  from { opacity: 0; transform: translateY(-24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const enterUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const exitFade = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(16px); }
`;

const PageWrapper = styled.div<{ $visible: boolean }>`
  min-height: 100vh;
  position: relative;
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

const Content = styled.div<{ $leaving?: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  ${({ $leaving }) => $leaving && css`animation: ${exitFade} 0.35s ease forwards;`}
`;

const Hero = styled.header`
  background: ${({ theme }) => theme.colors.heroBg};
  padding: 40px 24px 40px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  animation: ${enterDown} 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
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

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.toggleBorder};
  color: ${({ theme }) => theme.colors.heroSubtitle};
  font-size: 10px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  width: fit-content;
  transition: border-color 0.15s, color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.heroTitle};
    color: ${({ theme }) => theme.colors.heroTitle};
    background: ${({ theme }) => theme.colors.toggleBg};
  }
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
  animation: ${enterUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
  flex: 1;
  width: 100%;
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

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
`;

const FilterLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

const FilterSelect = styled.select`
  background: ${({ theme }) => theme.colors.pageBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 7px 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
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

const Footer = styled.footer`
  background: ${({ theme }) => theme.colors.heroBg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 24px;
`;

const FooterInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FooterPrompt = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.heroSubtitle};
  margin: 0;
  span { color: ${({ theme }) => theme.colors.heroTitle}; }
`;

const FooterSub = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  letter-spacing: 0.04em;
`;

const FooterTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const FooterTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 3px 8px;
  border-radius: 3px;
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
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [splashMode, setSplashMode] = useState<'boot' | 'return' | 'done'>('boot');
  const [contentLeaving, setContentLeaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const theme = useTheme();

  const companies = useMemo(
    () => [...new Set(users.map((u) => u.company.name))].sort(),
    [users]
  );

  const cities = useMemo(
    () => [...new Set(users.map((u) => u.address.city))].sort(),
    [users]
  );

  const filtered = useMemo(() => {
    let result = users.filter((u) =>
      u.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    if (filterCompany) result = result.filter((u) => u.company.name === filterCompany);
    if (filterCity) result = result.filter((u) => u.address.city === filterCity);

    return [...result].sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'company_asc') return a.company.name.localeCompare(b.company.name);
      return 0;
    });
  }, [users, debouncedSearch, filterCompany, filterCity, sortBy]);

  function handleAdd(user: User) {
    addUser(user);
    showToast('Usuário criado com sucesso');
  }

  function handleDelete(id: number) {
    removeUser(id);
    setSelectedUser(null);
    showToast('Usuário removido', 'error');
  }

  return (
    <>
      {splashMode !== 'done' && <SplashScreen mode={splashMode} onDone={() => setSplashMode('done')} />}
      <PageWrapper $visible={splashMode === 'done'}>
      <HudCorner $pos="tl" />
      <HudCorner $pos="tr" />
      <HudCorner $pos="bl" />
      <HudCorner $pos="br" />
      <ParticleCanvas colors={theme.colors.particleColors} />

      {splashMode === 'done' && <Content $leaving={contentLeaving}>
        <Hero>
          <HeroPattern />
          <HeroInner>
            <HeroLeft>
              <BackButton onClick={() => {
                setContentLeaving(true);
                setTimeout(() => { setContentLeaving(false); setSplashMode('return'); }, 350);
              }}>← início</BackButton>
              <HeroText>
                <HeroLabel>root@jsonplaceholder:~$ ./load_users</HeroLabel>
                <HeroTitle>Usuários</HeroTitle>
              </HeroText>
            </HeroLeft>
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
            {!loading && !error && (
              <FilterRow>
                <FilterLabel>ordenar</FilterLabel>
                <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                  <option value="default">Padrão</option>
                  <option value="name_asc">Nome A→Z</option>
                  <option value="name_desc">Nome Z→A</option>
                  <option value="company_asc">Empresa A→Z</option>
                </FilterSelect>
                <FilterLabel>empresa</FilterLabel>
                <FilterSelect value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
                  <option value="">Todas</option>
                  {companies.map((c) => <option key={c} value={c}>{c}</option>)}
                </FilterSelect>
                <FilterLabel>cidade</FilterLabel>
                <FilterSelect value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                  <option value="">Todas</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </FilterSelect>
              </FilterRow>
            )}
          </SearchCard>

          {loading && <LoadingState />}
          {error && <ErrorState message={error} onRetry={() => window.location.reload()} />}

          {!loading && !error && (
            <UserGrid key={`${debouncedSearch}-${filterCompany}-${filterCity}-${sortBy}`}>
              {filtered.length === 0 ? (
                <Empty>
                  <EmptyEmoji>🔍</EmptyEmoji>
                  <EmptyTitle>Nenhum usuário encontrado</EmptyTitle>
                  <EmptySubtitle>Tente buscar por outro nome</EmptySubtitle>
                </Empty>
              ) : (
                filtered.map((user, index) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    index={index}
                    isLocal={isLocalUser(user.id)}
                    onClick={setSelectedUser}
                  />
                ))
              )}
            </UserGrid>
          )}
        </MainContent>

        <Footer>
          <FooterInner>
            <FooterLeft>
              <FooterPrompt>
                <span>root@jsonplaceholder</span>:~$ exit
              </FooterPrompt>
              <FooterSub>// todos os usuários carregados</FooterSub>
            </FooterLeft>
            <FooterTags>
              <FooterTag>React</FooterTag>
              <FooterTag>TypeScript</FooterTag>
              <FooterTag>Vite</FooterTag>
              <FooterTag>Styled Components</FooterTag>
            </FooterTags>
          </FooterInner>
        </Footer>
      </Content>}

      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={handleDelete}
          canDelete={isLocalUser(selectedUser.id)}
        />
      )}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
          companies={companies}
          cities={cities}
        />
      )}
      <ToastContainer />
      </PageWrapper>
    </>
  );
}
