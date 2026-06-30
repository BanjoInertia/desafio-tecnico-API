import { render, type RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../styles/theme';

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>;
}

function renderWithTheme(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Wrapper, ...options });
}

export { renderWithTheme as render };
export * from '@testing-library/react';
