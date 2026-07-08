import appLogo from "@/assets/images/android-icon-foreground.png"

import { IconBook2, IconMoon, IconSun, IconUser, IconDownload, IconInfoCircle } from '@tabler/icons-react-native'
import { router } from 'expo-router'
import { useRef } from 'react'
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Tree } from '../../appDesign/texts.js'
import FocusTimer from '../../appDesign/focusTimer.js'
import { useAuth } from '../../logic/AuthProvider'
import { useAppTheme } from '../../logic/ThemeProvider'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const App = () => {
  const { user } = useAuth();
  const tabBarHeight = 100;
  const { activeTheme, toggleTheme, colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const avatarScale = useRef(new Animated.Value(1)).current;
  const themeScale = useRef(new Animated.Value(1)).current;

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const initial = user?.email?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.bg, { paddingBottom: tabBarHeight + 25 }]}>
        <View>
          {/* Top bar */}
          <View style={[
            styles.topBar, 
            { 
              backgroundColor: colors.card,
              shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
              marginTop: insets.top + 10
            }
          ]}>
            <View style={[styles.logoWrapper, { backgroundColor: colors.background }]}>
              <Image source={appLogo} style={styles.logo} />
            </View>

            <View style={styles.titleWrap}>
              <Text style={[styles.titleText, { color: colors.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit>
                DIU <Text style={[styles.titleAccent, { color: colors.accent }]}>Notes</Text>
              </Text>
              <Tree title="Your Ultimate Study Buddy" style={{ textAlign: 'left', fontSize: 10, marginVertical: 2, marginHorizontal: 0, color: colors.textSecondary }} numberOfLines={1} adjustsFontSizeToFit />
            </View>

            {/* Theme Toggle */}
            <AnimatedPressable
              onPress={toggleTheme}
              onPressIn={() => Animated.spring(themeScale, { toValue: 0.8, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(themeScale, { toValue: 1, useNativeDriver: true }).start()}
              style={[styles.themeButton, { transform: [{ scale: themeScale }] }]}
            >
              {activeTheme === 'dark' ? (
                <IconSun size={22} color={colors.accent} strokeWidth={2} />
              ) : (
                <IconMoon size={22} color={colors.accent} strokeWidth={2} />
              )}
            </AnimatedPressable>

            {/* Account control */}
            <AnimatedPressable
              onPress={() => (user ? router.push('/profile') : router.push('/login'))}
              onPressIn={() => Animated.spring(avatarScale, { toValue: 0.9, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(avatarScale, { toValue: 1, useNativeDriver: true }).start()}
              style={[
                styles.avatarButton, 
                { 
                  transform: [{ scale: avatarScale }],
                  backgroundColor: activeTheme === 'dark' ? '#1A3340' : '#F0F8FF'
                }
              ]}
            >
              {user ? (
                avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarCircle}>
                    <Text style={[styles.avatarText, { color: colors.accent }]}>{initial}</Text>
                  </View>
                )
              ) : (
                <IconUser size={20} color={colors.accent} />
              )}
            </AnimatedPressable>
          </View>

          <FocusTimer />

          <View style={{ width: '100%', paddingHorizontal: 16, marginBottom: 20, gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable 
                onPress={() => router.push('/notes')} 
                style={[styles.quickButton, { flex: 1, backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}
              >
                <IconBook2 size={22} color={colors.accent} />
                <Tree title="Notes" style={[styles.quickButtonText, { color: colors.textPrimary }]} />
              </Pressable>
              
              <Pressable 
                onPress={() => router.push('/downloads')} 
                style={[styles.quickButton, { flex: 1, backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}
              >
                <IconDownload size={22} color={colors.accent} />
                <Tree title="Downloads" style={[styles.quickButtonText, { color: colors.textPrimary }]} />
              </Pressable>
            </View>

            <Pressable 
              onPress={() => router.push('/about')} 
              style={[styles.quickButton, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}
            >
              <IconInfoCircle size={22} color={colors.accent} />
              <Tree title="About Us" style={[styles.quickButtonText, { color: colors.textPrimary }]} />
            </Pressable>
          </View>
        </View>

        {/* Logged-out prompt banner */}
        {!user && (
          <View style={[
            styles.signinBanner,
            { 
              backgroundColor: colors.card,
              shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05
            }
          ]}>
            <View style={styles.signinContent}>
              <Text style={[styles.signinTitle, { color: colors.textPrimary }]}>Not signed in</Text>
              <Text style={[styles.signinSubtitle, { color: colors.textSecondary }]}>Log in with your university email to unlock more features.</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  quickButton: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
    gap: 8,
  },
  quickButtonText: {
    fontSize: 13,
    fontFamily: 'SpaceGrotesk-Bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  bg: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    marginBottom: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 2,
  },
  logoWrapper: {
    borderRadius: 16,
    padding: 4,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  titleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  titleText: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  titleAccent: {
    // Dynamic color
  },
  themeButton: {
    marginRight: 10,
    padding: 8,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  signinBanner: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  signinContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  signinTitle: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
    marginBottom: 8,
  },
  signinSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-Bold',
  },
});