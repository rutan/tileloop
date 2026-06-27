import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
export type EffectiveTheme = 'light' | 'dark';

const themeStorageKey = 'tileloop:theme';
const darkModeMediaQuery = '(prefers-color-scheme: dark)';

interface ThemeContextValue {
  preference: ThemePreference;
  effectiveTheme: EffectiveTheme;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

function getSystemTheme(): EffectiveTheme {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia(darkModeMediaQuery).matches ? 'dark' : 'light';
}

function getStoredThemePreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';

  try {
    const value = window.localStorage.getItem(themeStorageKey);
    return isThemePreference(value) ? value : 'system';
  } catch {
    return 'system';
  }
}

function saveThemePreference(preference: ThemePreference) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(themeStorageKey, preference);
  } catch {
    // localStorage can be unavailable in private or restricted browser contexts.
  }
}

function applyThemePreference(preference: ThemePreference) {
  if (typeof document === 'undefined') return;

  if (preference === 'system') {
    delete document.documentElement.dataset.theme;
    return;
  }

  document.documentElement.dataset.theme = preference;
}

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [preference, setPreference] = useState<ThemePreference>(getStoredThemePreference);
  const [systemTheme, setSystemTheme] = useState<EffectiveTheme>(getSystemTheme);
  const effectiveTheme = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    applyThemePreference(preference);
    saveThemePreference(preference);
  }, [preference]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(darkModeMediaQuery);
    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      effectiveTheme,
      setThemePreference: setPreference,
      toggleTheme: () => {
        setPreference(effectiveTheme === 'dark' ? 'light' : 'dark');
      },
    }),
    [effectiveTheme, preference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider.');
  }

  return value;
}
