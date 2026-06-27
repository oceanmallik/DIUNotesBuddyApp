import * as AuthSession from 'expo-auth-session';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '../lib/supabase';
import { useAuth } from '../logic/AuthProvider';
import { useAppTheme } from '../logic/ThemeProvider';

WebBrowser.maybeCompleteAuthSession();

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Login() {
  const { session, initialized } = useAuth();
  const router = useRouter();
  const { colors, activeTheme } = useAppTheme();

  const googleScale = useRef(new Animated.Value(1)).current;
  const githubScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (initialized && session) {
      router.replace('/(tabs)');
    }
  }, [initialized, session]);

  const handleLogin = async (provider: 'google' | 'github') => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

        if (result.type === 'success' && result.url) {
          const params = result.url.split('#')[1]?.split('&').reduce((acc, current) => {
            const [key, value] = current.split('=');
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);

          if (params?.access_token && params?.refresh_token) {
            await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token,
            });
          }
        } else {
          console.log('User cancelled the login process.');
        }
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    }
  };

  if (!initialized) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.contentWrapper}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            DIU <Text style={[styles.titleAccent, { color: colors.accent }]}>Notes</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your campus, your notes.</Text>
        </View>

        <View style={[
          styles.cardContainer, 
          { 
            backgroundColor: colors.card,
            shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05
          }
        ]}>
          <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Sign in to continue</Text>

          <AnimatedPressable
            style={[styles.button, { borderColor: colors.border, transform: [{ scale: googleScale }] }]}
            onPress={() => handleLogin('google')}
            onPressIn={() => Animated.spring(googleScale, { toValue: 0.98, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(googleScale, { toValue: 1, useNativeDriver: true }).start()}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.background }]}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <Path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <Path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <Path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </Svg>
            </View>
            <View style={styles.btnTextBlock}>
              <Text style={[styles.btnLabel, { color: colors.textPrimary }]}>Student Login</Text>
              <Text style={[styles.btnHint, { color: colors.textSecondary }]}>@diu.edu.bd accounts</Text>
            </View>
          </AnimatedPressable>

          <AnimatedPressable
            style={[styles.button, { backgroundColor: colors.background, borderColor: 'transparent', transform: [{ scale: githubScale }] }]}
            onPress={() => handleLogin('github')}
            onPressIn={() => Animated.spring(githubScale, { toValue: 0.98, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(githubScale, { toValue: 1, useNativeDriver: true }).start()}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.background }]}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  fill={colors.textPrimary}
                />
              </Svg>
            </View>
            <View style={styles.btnTextBlock}>
              <Text style={[styles.btnLabel, { color: colors.textPrimary }]}>Admin Login</Text>
              <Text style={[styles.btnHint, { color: colors.textSecondary }]}>Verified admins only</Text>
            </View>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontFamily: 'SpaceGrotesk-Bold',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  titleAccent: {
    // Dynamic color
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  cardContainer: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 4,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'SpaceGrotesk-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextBlock: {
    flex: 1,
  },
  btnLabel: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-Bold',
    marginBottom: 2,
  },
  btnHint: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Regular',
  },
});