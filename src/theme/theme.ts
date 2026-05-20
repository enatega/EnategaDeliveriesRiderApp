import { darkColors, lightColors, ThemeColors } from './colors';
import { layout } from './layout';
import { typography } from './typography';

export type Theme = {
  isDark: boolean;
  colors: ThemeColors;
  typography: typeof typography;
  layout: typeof layout;
};

export const buildTheme = (scheme: 'light' | 'dark' | null): Theme => {
  const isDark = scheme === 'dark';

  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    typography,
    layout,
  };
};
