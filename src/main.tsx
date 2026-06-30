import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppThemeProvider>
  </StrictMode>,
)
