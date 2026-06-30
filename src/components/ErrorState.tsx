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

const IconBox = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.errorBg};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 30px;
    height: 30px;
    color: ${({ theme }) => theme.colors.errorIcon};
  }
`;

const Title = styled.p`
  font-weight: 800;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const Message = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 4px 0 0;
`;

const RetryButton = styled.button`
  padding: 10px 22px;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 14px;
  font-weight: 700;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  transition: box-shadow 0.15s, transform 0.15s;

  &:hover {
    box-shadow: 5px 5px 0 ${({ theme }) => theme.colors.border};
    transform: translate(-1px, -1px);
  }

  &:active {
    box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
    transform: translate(0, 0);
  }
`;

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Wrapper>
      <IconBox>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </IconBox>
      <div>
        <Title>Algo deu errado</Title>
        <Message>{message}</Message>
      </div>
      <RetryButton onClick={onRetry}>Tentar novamente</RetryButton>
    </Wrapper>
  );
}
