import { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ParticleCanvas } from './ParticleCanvas';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

type Phase = 'entering' | 'ready' | 'leaving';
type Mode = 'boot' | 'return';

const PARTICLE_COLORS = ['#00FF87', '#00CFFF', '#FF00CC', '#FFD700', '#FF4488'];

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

const Wrapper = styled.div<{ $phase: Phase; $mode: Mode }>`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #060610;
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
    linear-gradient(rgba(0, 255, 135, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 135, 0.04) 1px, transparent 1px);
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
    rgba(0, 255, 135, 0.025) 50%,
    transparent
  );
  pointer-events: none;
  animation: ${scanline} 6s linear infinite;
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
  color: rgba(0, 255, 135, 0.45);
  margin: 0 0 16px;
  animation: ${fadeIn} 0.4s ease 0.2s both;

  span { color: #00FF87; }
`;

const Title = styled.h1`
  font-size: clamp(48px, 11vw, 84px);
  font-weight: 800;
  color: #00FF87;
  letter-spacing: -2px;
  line-height: 0.95;
  margin: 0;
  animation: ${popUp} 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
  text-shadow: 0 0 40px rgba(0, 255, 135, 0.4), 0 0 80px rgba(0, 255, 135, 0.15);
`;

const Cursor = styled.span`
  display: inline-block;
  width: 0.55em;
  height: 0.85em;
  background: #00FF87;
  margin-left: 8px;
  vertical-align: middle;
  animation: ${blink} 1s step-end infinite;
  box-shadow: 0 0 12px rgba(0, 255, 135, 0.6);
`;

const Subtitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 255, 135, 0.5);
  margin: 20px 0 0;
  animation: ${fadeIn} 0.5s ease 0.8s both;
  letter-spacing: 0.03em;
`;

const Actions = styled.div`
  margin-top: 44px;
  animation: ${popUp} 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 1.05s both;
`;

const EnterButton = styled.button`
  padding: 12px 28px;
  background: transparent;
  color: #00FF87;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.08em;
  border: 1.5px solid rgba(0, 255, 135, 0.5);
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(0, 255, 135, 0.15), inset 0 0 12px rgba(0, 255, 135, 0.03);
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;

  &:hover {
    border-color: #00FF87;
    background: rgba(0, 255, 135, 0.07);
    box-shadow: 0 0 24px rgba(0, 255, 135, 0.3), inset 0 0 16px rgba(0, 255, 135, 0.06);
  }

  &:active {
    background: rgba(0, 255, 135, 0.12);
  }
`;

const LoadingLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  color: rgba(0, 255, 135, 0.45);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
`;

const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1.5px solid rgba(0, 255, 135, 0.2);
  border-top-color: #00FF87;
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

  return (
    <Wrapper $phase={phase} $mode={mode}>
      <ParticleCanvas colors={PARTICLE_COLORS} />
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
          </Actions>
        </Inner>
      )}
    </Wrapper>
  );
}
