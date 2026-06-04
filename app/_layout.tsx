import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    'Aubrey-Regular': require('../assets/fonts/Aubrey-Regular.ttf'),
    'Cause-Bold': require('../assets/fonts/Cause-Bold.ttf'),
    'Cause-Regular': require('../assets/fonts/Cause-Regular.ttf'),
    'PlaywriteGBJ-Italic': require('../assets/fonts/PlaywriteGBJ-Italic.ttf'),
    'PlaywriteGBJ-Regular': require('../assets/fonts/PlaywriteGBJ-Regular.ttf'),
    'PlaywriteGBJ-Thin': require('../assets/fonts/PlaywriteGBJ-Thin.ttf'),
    'SpaceGrotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    'SpaceGrotesk-Regular': require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="contribute" options={{ title: 'Contribute Notes' }} />
        <Stack.Screen name="about" options={{ title: 'About Us' }} /> */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
