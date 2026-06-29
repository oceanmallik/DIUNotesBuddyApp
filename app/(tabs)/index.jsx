import appLogo from "@/assets/images/android-icon-foreground.png"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { IconBook2, IconMoon, IconSun, IconUser } from '@tabler/icons-react-native'
import { router } from 'expo-router'
import { useRef } from 'react'
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { TitleCard } from '../../appDesign/cards.js'
import FocusTimer from '../../appDesign/focusTimer.js'
import { Tree } from '../../appDesign/texts.js'
import { AppButton } from '../../appDesign/button.js'
import { useAuth } from '../../logic/AuthProvider'
import { useAppTheme } from '../../logic/ThemeProvider'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const app = () => {
  const { user } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();
  const { activeTheme, toggleTheme, colors } = useAppTheme();

  const avatarScale = useRef(new Animated.Value(1)).current;
  const themeScale = useRef(new Animated.Value(1)).current;

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const initial = user?.email?.charAt(0)?.toUpperCase() ?? "?";
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.bg, { paddingBottom: tabBarHeight + 25 }]}>
        <View>
          {/* Top bar */}
          <View style={[
            styles.topBar, 
            { 
              backgroundColor: colors.card,
              shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05
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

          <View style={{ width: '100%', paddingHorizontal: 0, marginBottom: 20 }}>
            <TitleCard
              title='Notes Explorer'
              description="Tap the book icon in the tabs below."
              icon={IconBook2}
              onPress={() => router.push('/notes')}
            />
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
              <Text style={[styles.signinSubtitle, { color: colors.textSecondary }]}>Log in to submit notes and unlock more features. Make sure to use @diu.edu.bd email. </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default app

const styles = StyleSheet.create({
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
    marginTop: 50,
    marginBottom: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
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
    paddingVertical: 35,
    paddingHorizontal: 20,
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