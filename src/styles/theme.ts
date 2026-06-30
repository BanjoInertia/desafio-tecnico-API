import 'styled-components';

export const lightTheme = {
  colors: {
    bg: '#f3f4f6',
    surface: '#ffffff',
    border: '#e5e7eb',
    borderHover: '#c7d2fe',
    text: '#111827',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    primaryLight: '#e0e7ff',
    primaryLightHover: '#c7d2fe',
    primaryText: '#4f46e5',
    headerBg: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    headerOverlay: 'rgba(255,255,255,0.2)',
    shadow: '0 1px 3px rgba(0,0,0,0.06)',
    shadowHover: '0 4px 12px rgba(0,0,0,0.1)',
    shadowModal: '0 20px 60px rgba(0,0,0,0.2)',
    errorBg: '#fee2e2',
    errorIcon: '#ef4444',
    skeletonBase: '#f0f0f0',
    skeletonShimmer: '#e0e0e0',
    inputFocusRing: 'rgba(99, 102, 241, 0.15)',
    overlay: 'rgba(0,0,0,0.5)',
  },
};

export const darkTheme = {
  colors: {
    bg: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    borderHover: '#4f46e5',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: '#1e1b4b',
    primaryLightHover: '#312e81',
    primaryText: '#818cf8',
    headerBg: 'linear-gradient(135deg, #3730a3, #6d28d9)',
    headerOverlay: 'rgba(255,255,255,0.15)',
    shadow: '0 1px 3px rgba(0,0,0,0.3)',
    shadowHover: '0 4px 16px rgba(0,0,0,0.4)',
    shadowModal: '0 20px 60px rgba(0,0,0,0.5)',
    errorBg: '#450a0a',
    errorIcon: '#f87171',
    skeletonBase: '#1e293b',
    skeletonShimmer: '#334155',
    inputFocusRing: 'rgba(99, 102, 241, 0.25)',
    overlay: 'rgba(0,0,0,0.7)',
  },
};

export type AppTheme = typeof lightTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
