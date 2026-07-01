import { useState, useEffect } from 'react';
import styled, { keyframes, css, useTheme } from 'styled-components';
import { ParticleCanvas } from './ParticleCanvas';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useTheme as useAppTheme } from '../context/ThemeContext';

type Phase = 'entering' | 'ready' | 'leaving';
type Mode = 'boot' | 'return';

const slideUp = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(-100%); }
`;

const slideDown = keyframes`
  from { transform: translateY(-100%); }
  to   { transform: translateY(0); }
`;

const popUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const scanline = keyframes`
  from { transform: translateY(-100%); }
  to   { transform: translateY(100vh); }
`;

const spinIcon = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const Wrapper = styled.div<{ $phase: Phase; $mode: Mode }>`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.heroBg};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${({ $phase }) =>
    $phase === 'leaving' &&
    css`animation: ${slideUp} 0.7s cubic-bezier(0.76, 0, 0.24, 1) forwards;`}

  ${({ $phase, $mode }) =>
    $phase !== 'leaving' && $mode === 'return' &&
    css`animation: ${slideDown} 0.7s cubic-bezier(0.76, 0, 0.24, 1) forwards;`}
`;

const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(${({ theme }) => theme.colors.heroPattern} 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.colors.heroPattern} 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
`;

const Scanline = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(
    to bottom,
    transparent,
    ${({ theme }) => theme.colors.heroPattern} 50%,
    transparent
  );
  pointer-events: none;
  animation: ${scanline} 6s linear infinite;
`;

const SplashThemeButton = styled.button<{ $spinning: boolean }>`
  align-self: flex-end;
  width: 44px;
  height: 44px;
  border-radius: 4px;
  border: 1.5px solid ${({ theme }) => theme.colors.toggleBorder};
  background: transparent;
  color: ${({ theme }) => theme.colors.heroTitle};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.heroTitle};
    background: ${({ theme }) => theme.colors.toggleBg};
  }

  svg {
    width: 20px;
    height: 20px;
    animation: ${({ $spinning }) => $spinning ? css`${spinIcon} 0.4s ease-in-out` : 'none'};
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 24px;
  width: 100%;
  max-width: 620px;
`;

const Prompt = styled.p`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.heroSubtitle};
  margin: 0 0 16px;
  animation: ${fadeIn} 0.4s ease 0.2s both;

  span { color: ${({ theme }) => theme.colors.heroTitle}; }
`;

const Title = styled.h1`
  font-size: clamp(48px, 11vw, 84px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.heroTitle};
  letter-spacing: -2px;
  line-height: 0.95;
  margin: 0;
  animation: ${popUp} 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 0.55em;
  height: 0.85em;
  background: ${({ theme }) => theme.colors.heroTitle};
  margin-left: 8px;
  vertical-align: middle;
  animation: ${blink} 1s step-end infinite;
`;

const Subtitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.heroSubtitle};
  margin: 20px 0 0;
  animation: ${fadeIn} 0.5s ease 0.8s both;
  letter-spacing: 0.03em;
`;

const Actions = styled.div`
  margin-top: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${popUp} 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 1.05s both;
`;

const EnterButton = styled.button`
  padding: 12px 28px;
  background: transparent;
  color: ${({ theme }) => theme.colors.heroTitle};
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.08em;
  border: 1.5px solid ${({ theme }) => theme.colors.toggleBorder};
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.heroTitle};
    background: ${({ theme }) => theme.colors.toggleBg};
  }

  &:active {
    background: ${({ theme }) => theme.colors.toggleBg};
  }
`;

const LoadingLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  color: ${({ theme }) => theme.colors.heroSubtitle};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
`;

const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.toggleBorder};
  border-top-color: ${({ theme }) => theme.colors.heroTitle};
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;


interface SplashScreenProps {
  onDone: () => void;
  mode?: Mode;
}

export function SplashScreen({ onDone, mode = 'boot' }: SplashScreenProps) {
  const [phase, setPhase] = useState<Phase>(mode === 'return' ? 'ready' : 'entering');
  const [textReady, setTextReady] = useState(mode !== 'return');
  const [spinning, setSpinning] = useState(false);
  const theme = useTheme();
  const { isDark, toggleTheme } = useAppTheme();
  useBodyScrollLock({ hideScrollbar: true });

  useEffect(() => {
    if (mode === 'return') {
      const timer = setTimeout(() => setTextReady(true), 700);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setPhase('ready'), 1000);
    return () => clearTimeout(timer);
  }, [mode]);

  function handleLeave() {
    setPhase('leaving');
    setTimeout(onDone, 700);
  }

  function handleThemeClick() {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => { toggleTheme(); }, 200);
    setTimeout(() => setSpinning(false), 420);
  }

  return (
    <Wrapper $phase={phase} $mode={mode}>
      <ParticleCanvas colors={theme.colors.particleColors} />
      <GridPattern />
      <Scanline />
      {textReady && (
        <Inner>
          <Prompt>
            <span>root@jsonplaceholder</span>:~$ ./load_users.sh
          </Prompt>
          <Title>
            Usuários<Cursor />
          </Title>
          <Subtitle>// JSONPlaceholder API — diretório de usuários</Subtitle>

          <Actions>
            {phase === 'ready' ? (
              <EnterButton onClick={handleLeave}>{'> ENTRAR'}</EnterButton>
            ) : (
              <LoadingLine>
                <Spinner />
                inicializando conexão...
              </LoadingLine>
            )}
            <SplashThemeButton $spinning={spinning} onClick={handleThemeClick} aria-label="Alternar tema">
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </SplashThemeButton>
          </Actions>
        </Inner>
      )}
    </Wrapper>
  );
}
