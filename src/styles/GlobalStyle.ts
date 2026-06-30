import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
    background-color: ${({ theme }) => theme.colors.pageBg};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;
