import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.skeletonBase} 25%,
    ${({ theme }) => theme.colors.skeletonShimmer} 50%,
    ${({ theme }) => theme.colors.skeletonBase} 75%
  );
  background-size: 1200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 6px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  overflow: hidden;
  transition: background-color 0.3s;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.pageBg};
`;

const Dot = styled.span<{ $color: string }>`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const TitleBarLine = styled(SkeletonBase)`
  height: 10px;
  width: 120px;
  margin-left: 4px;
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 15px;
`;

const AvatarSkeleton = styled(SkeletonBase)`
  width: 70px;
  height: 70px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const Lines = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Line = styled(SkeletonBase)<{ $width: string; $height?: string }>`
  height: ${({ $height }) => $height ?? '15px'};
  width: ${({ $width }) => $width};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export function LoadingState() {
  return (
    <Grid role="status" aria-label="Carregando usuários">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} aria-hidden="true">
          <TitleBar>
            <Dot $color="#FF5F57" />
            <Dot $color="#FFBD2E" />
            <Dot $color="#28CA41" />
            <TitleBarLine />
          </TitleBar>
          <Body>
            <AvatarSkeleton />
            <Lines>
              <Line $width="55%" />
              <Line $width="70%" $height="12px" />
            </Lines>
          </Body>
        </Card>
      ))}
    </Grid>
  );
}
