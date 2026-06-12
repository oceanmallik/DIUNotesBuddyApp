import appLogo from "@/assets/images/android-icon-foreground.png"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { IconLogin, IconLogout, IconSparkles, IconWorld } from '@tabler/icons-react-native'
import { router } from 'expo-router'
import { Alert, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { TitleCard } from '../../appDesign/cards.js'
import { Planet, Tree } from '../../appDesign/texts.js'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../logic/AuthProvider'

const app = () => {
  const { user } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      Alert.alert("Logout Error", err.message);
    }
  };
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  // Fallback
  const initial = user?.email?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <View style={styles.container}>
      <View style={[styles.bg, { paddingBottom: tabBarHeight + 5 }]}>
        <View>
          <View style={styles.topBar}>
            <Image source={appLogo} style={styles.logo} />
            <View>
              <Planet title="DIU Notes Buddy" style={{ textAlign: 'center', fontSize: 27, marginVertical: 1 }} />
              <Tree title="Your Ultimate Study Companion" style={{ textAlign: 'center', marginVertical: 3 }} />
            </View>
          </View>

          <View style={{ width: '100%', paddingHorizontal: 0, marginVertical: 20 }}>
            <Pressable onPress={() => Linking.openURL('https://www.diunotesbuddy.live')}>
              <TitleCard
                title="Visit our Website!"
                description="www.diunotesbuddy.live"
                icon={IconWorld}
              />
            </Pressable>
          </View>
        </View>

        {/* Account section */}
        {!user ? (
          // ---------- LOGGED OUT: sign-in card ----------
          <View style={styles.signinCard}>
            <View style={styles.signinHeader}>
              <View style={styles.signinIconWrap}>
                <IconSparkles size={24} color="#00ff8c" />
              </View>
              <View style={styles.signinTextWrap}>
                <Text style={styles.signinTitle}>You're not signed in</Text>
                <Text style={styles.signinSubtitle}>Log in to submit notes, sync progress, and unlock more</Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/login')}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <IconLogin size={18} color="#0A1A0A" />
              <Text style={styles.loginButtonText}>Log in</Text>
            </Pressable>
          </View>
        ) : (
          // ---------- LOGGED IN: profile card ----------
          <View style={styles.profileCard}>
            <View style={styles.profileTopRow}>

              {/* Profile Image Logic */}
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>
              )}

              <View style={styles.profileInfo}>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusLabel}>Signed in</Text>
                </View>
                <Text
                  style={styles.profileEmail}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {user.email}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <IconLogout size={16} color="#FF6B6B" />
              <Text style={styles.logoutButtonText}>Log out</Text>
            </Pressable>
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
    backgroundColor: '#131313',
    justifyContent: 'space-between',
  },
  topBar: {
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgb(0, 208, 255)',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  // ----- Logged out: sign-in card -----
  signinCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#16213E',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.25)',
    gap: 14,
  },
  signinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  signinIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0, 212, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signinTextWrap: {
    flex: 1,
  },
  signinTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  signinSubtitle: {
    fontSize: 12,
    color: '#9BA4C0',
    marginTop: 3,
    lineHeight: 16,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgb(0, 208, 255)',
  },
  loginButtonText: {
    color: '#0A1A0A',
    fontSize: 14,
    fontWeight: '700',
  },

  // ----- Logged in: profile card -----
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.35)',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00D4FF',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#4ADE80',
  },
  statusLabel: {
    fontSize: 11,
    color: '#A0A0A0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 13,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 17,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.25)',
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
  },
})