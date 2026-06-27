import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  activeTheme: 'light' | 'dark';
  colors: typeof Colors.light;
  toggleTheme: () => Promise<void>;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useAppTheme = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('app_theme');
        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
          setThemeMode(storedTheme);
        }
      } catch (err) {
        console.warn('Failed to load theme preference', err);
      }
    };
    loadTheme();
  }, []);

  const activeTheme = themeMode === 'system' ? (systemTheme || 'light') : themeMode;

  const toggleTheme = async () => {
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    try {
      await AsyncStorage.setItem('app_theme', newTheme);
    } catch (err) {
      console.warn('Failed to save theme preference', err);
    }
  };

  const colors = Colors[activeTheme as 'light' | 'dark'];

  return (
    <ThemeContext.Provider value={{ activeTheme: activeTheme as 'light' | 'dark', colors, toggleTheme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
