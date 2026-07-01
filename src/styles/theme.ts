import 'styled-components';

export const lightTheme = {
  colors: {
    pageBg: '#F2FFF6',
    heroBg: '#080F0A',
    heroPattern: 'rgba(0, 255, 135, 0.035)',
    heroTitle: '#00FF87',
    heroSubtitle: 'rgba(0, 255, 135, 0.55)',
    toggleBg: 'rgba(0, 255, 135, 0.08)',
    toggleBorder: 'rgba(0, 255, 135, 0.35)',
    toggleColor: '#00FF87',
    surface: '#FFFFFF',
    border: '#0A1A10',
    text: '#0A1A10',
    textSecondary: '#1A3020',
    textMuted: '#4A6A55',
    primary: '#007A42',
    primaryLight: '#E6FFF0',
    primaryText: '#007A42',
    cardShadow: '4px 4px 0 #0A1A10',
    cardShadowHover: '7px 7px 0 #0A1A10, 0 0 18px rgba(0, 200, 100, 0.18)',
    searchShadow: '5px 5px 0 #0A1A10',
    inputShadow: '3px 3px 0 #0A1A10',
    inputShadowFocus: '3px 3px 0 #007A42, 0 0 8px rgba(0, 150, 70, 0.2)',
    modalShadow: '8px 8px 0 #0A1A10',
    badge: '#00FF87',
    badgeText: '#0A1A10',
    errorBg: '#FFF0F3',
    errorIcon: '#FF2255',
    skeletonBase: '#E0F5E8',
    skeletonShimmer: '#F0FFF5',
    overlay: 'rgba(0, 8, 3, 0.78)',
    particleColors: ['#005C30', '#007A42', '#009B50', '#003D20', '#006438'],
  },
};

export const darkTheme = {
  colors: {
    pageBg: '#060610',
    heroBg: '#07070F',
    heroPattern: 'rgba(0, 255, 135, 0.022)',
    heroTitle: '#00FF87',
    heroSubtitle: 'rgba(0, 255, 135, 0.5)',
    toggleBg: 'rgba(0, 255, 135, 0.06)',
    toggleBorder: 'rgba(0, 255, 135, 0.28)',
    toggleColor: '#00FF87',
    surface: '#0C0C1C',
    border: 'rgba(0, 255, 135, 0.25)',
    text: '#C8FFD8',
    textSecondary: '#88BB99',
    textMuted: 'rgba(0, 255, 135, 0.38)',
    primary: '#00CFFF',
    primaryLight: '#001520',
    primaryText: '#00CFFF',
    cardShadow: '0 0 0 1px rgba(0, 255, 135, 0.22), 4px 4px 0 rgba(0, 255, 135, 0.45)',
    cardShadowHover: '0 0 22px rgba(0, 255, 135, 0.22), 0 0 0 1px #00FF87, 6px 6px 0 #00FF87',
    searchShadow: '0 0 0 1px rgba(0, 255, 135, 0.22), 5px 5px 0 rgba(0, 255, 135, 0.35)',
    inputShadow: '0 0 0 1px rgba(0, 255, 135, 0.18)',
    inputShadowFocus: '0 0 10px rgba(0, 207, 255, 0.35), 0 0 0 1px #00CFFF',
    modalShadow: '0 0 50px rgba(0, 255, 135, 0.18), 0 0 0 1px rgba(0, 255, 135, 0.4)',
    badge: 'rgba(0, 255, 135, 0.12)',
    badgeText: '#00FF87',
    errorBg: '#0F0508',
    errorIcon: '#FF4466',
    skeletonBase: '#0C1A14',
    skeletonShimmer: '#142518',
    overlay: 'rgba(0, 0, 8, 0.88)',
    particleColors: ['#00FF87', '#00CFFF', '#FF00CC', '#FFD700', '#FF4488'],
  },
};

export type AppTheme = typeof lightTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
