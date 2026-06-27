import appLogo from "@/assets/images/android-icon-foreground.png"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { IconBook2, IconLogin, IconLogout, IconMoon, IconSun, IconTrash, IconUser } from '@tabler/icons-react-native'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { Alert, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { TitleCard } from '../../appDesign/cards.js'
import { Tree } from '../../appDesign/texts.js'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../logic/AuthProvider'
import { useAppTheme } from '../../logic/ThemeProvider'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const app = () => {
  const { user } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeTheme, toggleTheme, colors } = useAppTheme();

  const loginScale = useRef(new Animated.Value(1)).current;
  const avatarScale = useRef(new Animated.Value(1)).current;
  const themeScale = useRef(new Animated.Value(1)).current;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setMenuOpen(false);
    } catch (err) {
      Alert.alert("Logout Error", err.message);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.rpc('delete_user');

              if (error) throw error;

              await supabase.auth.signOut();
              setMenuOpen(false);
            } catch (err) {
              Alert.alert("Error Deleting Account", err.message);
            }
          },
        },
      ]
    );
  };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const initial = user?.email?.charAt(0)?.toUpperCase() ?? "?";
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.bg, { paddingBottom: tabBarHeight + 5 }]}>
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
              <Text style={[styles.titleText, { color: colors.textPrimary }]}>
                DIU <Text style={[styles.titleAccent, { color: colors.accent }]}>Notes</Text>
              </Text>
              <Tree title="Your Ultimate Study Companion" style={{ textAlign: 'left', fontSize: 12, marginVertical: 2, marginLeft: 10, color: colors.textSecondary }} />
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
              onPress={() => (user ? setMenuOpen((v) => !v) : router.push('/login'))}
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

          {user && menuOpen && (
            <>
              <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />

              <View style={[
                styles.menu,
                { 
                  backgroundColor: colors.menuBackground,
                  borderColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
              ]}>
                <BlurView intensity={80} tint={colors.blurTint} style={StyleSheet.absoluteFillObject} />
                <View style={styles.menuContent}>
                  <View style={styles.menuHeader}>
                    {avatarUrl ? (
                      <Image source={{ uri: avatarUrl }} style={styles.menuAvatarImage} />
                    ) : (
                      <View style={[styles.menuAvatarCircle, { backgroundColor: activeTheme === 'dark' ? '#1A3340' : '#F0F8FF' }]}>
                        <Text style={[styles.avatarText, { color: colors.accent }]}>{initial}</Text>
                      </View>
                    )}
                    <View style={styles.menuHeaderText}>
                      {name && (
                        <Text style={[styles.menuName, { color: colors.textPrimary }]} numberOfLines={1} ellipsizeMode="tail">
                          {name}
                        </Text>
                      )}
                      <Text style={[styles.menuEmail, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">
                        {user.email}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.menuDivider, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />

                  <Pressable
                    onPress={handleDeleteAccount}
                    style={({ pressed }) => [
                      styles.menuItem, 
                      pressed && { backgroundColor: activeTheme === 'dark' ? 'rgba(255, 69, 58, 0.2)' : 'rgba(255, 59, 48, 0.1)' }
                    ]}
                  >
                    <View style={[styles.menuIconWrap, { backgroundColor: activeTheme === 'dark' ? '#4A1C1C' : '#FFEDED' }]}>
                        <IconTrash size={16} color={colors.destructive} />
                    </View>
                    <Text style={[styles.menuItemTextDelete, { color: colors.destructive }]}>Delete Account</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleLogout}
                    style={({ pressed }) => [
                      styles.menuItem, 
                      pressed && { backgroundColor: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
                    ]}
                  >
                    <View style={[styles.menuIconWrap, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F2F2F7' }]}>
                        <IconLogout size={16} color={colors.textPrimary} />
                    </View>
                    <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Log out</Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}

          <View style={{ width: '100%', paddingHorizontal: 0, marginVertical: 20 }}>
            <TitleCard
              title='Notes Explorer'
              description="Tap the book icon in the tabs below."
              icon={IconBook2}
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
              <Text style={[styles.signinSubtitle, { color: colors.textSecondary }]}>Log in to submit notes, sync progress, and unlock more features.</Text>
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
    marginTop: 60,
    marginBottom: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
    marginLeft: 10,
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
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 40,
  },
  menu: {
    position: 'absolute',
    top: 135,
    right: 16,
    width: 250,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
  menuContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  menuAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuHeaderText: {
    flex: 1,
  },
  menuName: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  menuEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTextDelete: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  menuItemText: {
    fontSize: 14,
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
    paddingVertical: 24,
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
    marginBottom: 20,
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