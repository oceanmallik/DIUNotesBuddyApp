import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import MobileAds from 'react-native-google-mobile-ads';
import 'react-native-reanimated';

import { AuthProvider } from '../logic/AuthProvider';
import { AppThemeProvider, useAppTheme } from '../logic/ThemeProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { activeTheme, colors } = useAppTheme();

  const baseTheme = activeTheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.card,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.destructive,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(pages)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Aubrey-Regular': require('../assets/fonts/Aubrey-Regular.ttf'),
    'BitcountSingle-Regular': require('../assets/fonts/BitcountSingle-Regular.ttf'),
    'Cause-Bold': require('../assets/fonts/Cause-Bold.ttf'),
    'Cause-Regular': require('../assets/fonts/Cause-Regular.ttf'),
    'PlaywriteGBJ-Italic': require('../assets/fonts/PlaywriteGBJ-Italic.ttf'),
    'PlaywriteGBJ-Regular': require('../assets/fonts/PlaywriteGBJ-Regular.ttf'),
    'PlaywriteGBJ-Thin': require('../assets/fonts/PlaywriteGBJ-Thin.ttf'),
    'SpaceGrotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    'SpaceGrotesk-Regular': require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

  useEffect(() => {
    MobileAds().initialize();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (error) {
    throw error;
  }

  if (!loaded) {
    return null;
  }

  return (
    <AppThemeProvider>
      <RootLayoutNav />
    </AppThemeProvider>
  );
}