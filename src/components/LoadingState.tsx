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
  border-radius: 10px;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  padding: 18px 20px;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  display: flex;
  align-items: center;
  gap: 14px;
  transition: background-color 0.3s;
`;

const AvatarSkeleton = styled(SkeletonBase)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
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
    <Grid>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <AvatarSkeleton />
          <Lines>
            <Line $width="55%" />
            <Line $width="70%" $height="12px" />
          </Lines>
        </Card>
      ))}
    </Grid>
  );
}
