import { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ParticleCanvas } from './ParticleCanvas';

type Phase = 'entering' | 'ready' | 'leaving';

const PARTICLE_COLORS = ['#ffe566', '#818cf8', '#f472b6', '#34d399', '#60a5fa'];

const slideUp = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(-100%); }
`;

const scaleX = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
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
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
`;

const Wrapper = styled.div<{ $phase: Phase }>`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #1A1A1A;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${({ $phase }) =>
    $phase === 'leaving' &&
    css`
      animation: ${slideUp} 0.7s cubic-bezier(0.76, 0, 0.24, 1) forwards;
    `}
`;

const DotPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1.5px, transparent 1.5px);
  background-size: 22px 22px;
  pointer-events: none;
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 24px;
  width: 100%;
  max-width: 560px;
`;

const AccentBar = styled.div`
  height: 6px;
  width: 80px;
  background: #FFE566;
  border-radius: 2px;
  transform-origin: left;
  animation: ${scaleX} 0.55s cubic-bezier(0.25, 1, 0.5, 1) 0.15s both;
  margin-bottom: 20px;
`;

const Label = styled.p`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin: 0 0 10px;
  animation: ${fadeIn} 0.4s ease 0.45s both;
`;

const Title = styled.h1`
  font-size: clamp(52px, 12vw, 88px);
  font-weight: 900;
  color: #FFE566;
  letter-spacing: -3px;
  line-height: 0.95;
  margin: 0;
  animation: ${popUp} 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s both;
`;

const Subtitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  margin: 18px 0 0;
  animation: ${fadeIn} 0.5s ease 0.85s both;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  animation: ${popUp} 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 1.1s both;
`;

const EnterButton = styled.button`
  padding: 13px 28px;
  background: #FFE566;
  color: #1A1A1A;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.05em;
  border: 2.5px solid #FFE566;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 4px 4px 0 rgba(255, 230, 102, 0.4);
  transition: box-shadow 0.15s, transform 0.15s;

  &:hover {
    box-shadow: 6px 6px 0 rgba(255, 230, 102, 0.4);
    transform: translate(-1px, -1px);
  }

  &:active {
    box-shadow: 2px 2px 0 rgba(255, 230, 102, 0.4);
    transform: translate(0, 0);
  }
`;

const Dots = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Dot = styled.div<{ $delay: string }>`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  animation: ${blink} 1s ease-in-out ${({ $delay }) => $delay} infinite;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #FFE566;
  animation: ${scaleX} 4s linear 1.3s both;
  transform-origin: left;
  width: 100%;
`;

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<Phase>('entering');

  useEffect(() => {
    const readyTimer = setTimeout(() => setPhase('ready'), 1000);
    return () => clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'ready') return;
    const autoTimer = setTimeout(() => handleLeave(), 4200);
    return () => clearTimeout(autoTimer);
  }, [phase]);

  function handleLeave() {
    setPhase('leaving');
    setTimeout(onDone, 680);
  }

  return (
    <Wrapper $phase={phase}>
      <ParticleCanvas colors={PARTICLE_COLORS} />
      <DotPattern />

      <Inner>
        <AccentBar />
        <Label>JSONPlaceholder API</Label>
        <Title>Usuários</Title>
        <Subtitle>Explore o diretório de usuários</Subtitle>

        <Actions>
          {phase === 'ready' ? (
            <EnterButton onClick={handleLeave}>
              Entrar →
            </EnterButton>
          ) : (
            <Dots>
              <Dot $delay="0s" />
              <Dot $delay="0.2s" />
              <Dot $delay="0.4s" />
            </Dots>
          )}
        </Actions>
      </Inner>

      {phase === 'ready' && <ProgressBar />}
    </Wrapper>
  );
}
