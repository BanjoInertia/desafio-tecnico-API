import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.heroTitle} ${({ theme }) => theme.colors.heroBg};
    background-color: ${({ theme }) => theme.colors.heroBg};
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.heroBg};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.heroTitle};
    border-radius: 0;
    box-shadow: 0 0 6px ${({ theme }) => theme.colors.heroTitle};
  }

  ::-webkit-scrollbar-thumb:hover {
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.heroTitle};
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
