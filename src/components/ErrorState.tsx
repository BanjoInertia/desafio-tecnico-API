import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 16px;
  text-align: center;
  gap: 16px;
`;

const IconCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;
    color: #ef4444;
  }
`;

const Title = styled.p`
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const Message = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0;
`;

const RetryButton = styled.button`
  padding: 8px 20px;
  background: #4f46e5;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #4338ca;
  }
`;

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Wrapper>
      <IconCircle>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </IconCircle>
      <div>
        <Title>Algo deu errado</Title>
        <Message>{message}</Message>
      </div>
      <RetryButton onClick={onRetry}>Tentar novamente</RetryButton>
    </Wrapper>
  );
}
