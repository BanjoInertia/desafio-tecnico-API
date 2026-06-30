import 'styled-components';

export const lightTheme = {
  colors: {
    pageBg: '#FFFBEB',
    heroBg: '#1A1A1A',
    heroPattern: 'rgba(255,255,255,0.04)',
    heroTitle: '#FFE566',
    heroSubtitle: 'rgba(255,255,255,0.6)',
    toggleBg: 'rgba(255,255,255,0.08)',
    toggleBorder: 'rgba(255,255,255,0.25)',
    toggleColor: '#FFFFFF',
    surface: '#FFFFFF',
    border: '#1A1A1A',
    text: '#1A1A1A',
    textSecondary: '#404040',
    textMuted: '#737373',
    primary: '#4F46E5',
    primaryLight: '#EEF2FF',
    primaryText: '#4F46E5',
    cardShadow: '4px 4px 0 #1A1A1A',
    cardShadowHover: '7px 7px 0 #1A1A1A',
    searchShadow: '5px 5px 0 #1A1A1A',
    inputShadow: '3px 3px 0 #1A1A1A',
    inputShadowFocus: '3px 3px 0 #4F46E5',
    modalShadow: '8px 8px 0 #1A1A1A',
    badge: '#FFE566',
    badgeText: '#1A1A1A',
    errorBg: '#FEF2F2',
    errorIcon: '#EF4444',
    skeletonBase: '#E5E5E5',
    skeletonShimmer: '#F0F0F0',
    overlay: 'rgba(0,0,0,0.75)',
    particleColors: ['#6366f1', '#ec4899', '#f59e0b', '#3b82f6', '#10b981'],
  },
};

export const darkTheme = {
  colors: {
    pageBg: '#0D0D0D',
    heroBg: '#FFE566',
    heroPattern: 'rgba(0,0,0,0.06)',
    heroTitle: '#1A1A1A',
    heroSubtitle: 'rgba(26,26,26,0.65)',
    toggleBg: 'rgba(0,0,0,0.1)',
    toggleBorder: 'rgba(0,0,0,0.25)',
    toggleColor: '#1A1A1A',
    surface: '#1A1A1A',
    border: '#E5E5E5',
    text: '#F5F5F5',
    textSecondary: '#C0C0C0',
    textMuted: '#808080',
    primary: '#818CF8',
    primaryLight: '#1E1B4B',
    primaryText: '#A5B4FC',
    cardShadow: '4px 4px 0 #E5E5E5',
    cardShadowHover: '7px 7px 0 #FFE566',
    searchShadow: '5px 5px 0 #E5E5E5',
    inputShadow: '3px 3px 0 #E5E5E5',
    inputShadowFocus: '3px 3px 0 #818CF8',
    modalShadow: '8px 8px 0 #E5E5E5',
    badge: '#2A2A2A',
    badgeText: '#FFE566',
    errorBg: '#450A0A',
    errorIcon: '#F87171',
    skeletonBase: '#2A2A2A',
    skeletonShimmer: '#3A3A3A',
    overlay: 'rgba(0,0,0,0.85)',
    particleColors: ['#ffe566', '#818cf8', '#34d399', '#f472b6', '#60a5fa'],
  },
};

export type AppTheme = typeof lightTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
