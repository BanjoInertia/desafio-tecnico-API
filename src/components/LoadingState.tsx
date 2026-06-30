import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: 8px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Circle = styled(SkeletonBase)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const Lines = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Line = styled(SkeletonBase)<{ $width: string }>`
  height: ${({ $width }) => ($width === '40%' ? '12px' : '16px')};
  width: ${({ $width }) => $width};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export function LoadingState() {
  return (
    <List>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <Circle />
          <Lines>
            <Line $width="50%" />
            <Line $width="65%" />
          </Lines>
        </Card>
      ))}
    </List>
  );
}
