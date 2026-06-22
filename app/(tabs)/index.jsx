import appLogo from "@/assets/images/android-icon-foreground.png"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { IconBook2, IconLogin, IconLogout, IconTrash, IconUser } from '@tabler/icons-react-native'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { TitleCard } from '../../appDesign/cards.js'
import { Tree } from '../../appDesign/texts.js'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../logic/AuthProvider'

const app = () => {
  const { user } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();
  const [menuOpen, setMenuOpen] = useState(false);

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
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
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
              Alert.alert("Account Deleted", "Your account has been successfully deleted.");
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
    <View style={styles.container}>
      <View style={[styles.bg, { paddingBottom: tabBarHeight + 5 }]}>
        <View>
          {/* Top bar */}
          <View style={styles.topBar}>
            <Image source={appLogo} style={styles.logo} />

            <View style={styles.titleWrap}>
              <Text style={styles.titleText}>
                DIU <Text style={styles.titleAccent}>Notes</Text> Buddy
              </Text>
              <Tree title="Your Ultimate Study Companion" style={{ textAlign: 'left', fontSize: 11, marginVertical: 2, marginLeft: 10 }} />
              <Tree title="A fork of www.diunotesbuddy.live" style={{ textAlign: 'left', fontSize: 8.5, marginVertical: 0, marginLeft: 10 }} />
            </View>

            {/* Account control */}
            <Pressable
              onPress={() => (user ? setMenuOpen((v) => !v) : router.push('/login'))}
              style={({ pressed }) => [styles.avatarButton, pressed && styles.buttonPressed]}
            >
              {user ? (
                avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{initial}</Text>
                  </View>
                )
              ) : (
                <IconUser size={20} color="#00D4FF" />
              )}
            </Pressable>
          </View>

          {user && menuOpen && (
            <>
              {/* Invisible backdrop to close menu on outside tap */}
              <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />

              <BlurView intensity={40} tint="dark" style={styles.menu}>
                <View style={styles.menuHeader}>
                  {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.menuAvatarImage} />
                  ) : (
                    <View style={styles.menuAvatarCircle}>
                      <Text style={styles.avatarText}>{initial}</Text>
                    </View>
                  )}
                  <View style={styles.menuHeaderText}>
                    {name && (
                      <Text style={styles.menuName} numberOfLines={1} ellipsizeMode="tail">
                        {name}
                      </Text>
                    )}
                    <Text style={styles.menuEmail} numberOfLines={1} ellipsizeMode="tail">
                      {user.email}
                    </Text>
                  </View>
                </View>

                <View style={styles.menuDivider} />

                {/* Delete Account */}
                <Pressable
                  onPress={handleDeleteAccount}
                  style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                >
                  <IconTrash size={16} color="#FF6B6B" />
                  <Text style={styles.menuItemText}>Delete Account</Text>
                </Pressable>

                {/* Log out */}
                <Pressable
                  onPress={handleLogout}
                  style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                >
                  <IconLogout size={16} color="#9BA4C0" />
                  <Text style={[styles.menuItemText, { color: '#9BA4C0' }]}>Log out</Text>
                </Pressable>
              </BlurView>
            </>
          )}

          <View style={{ width: '100%', paddingHorizontal: 0, marginVertical: 20 }}>
            <Pressable onPress={() => router.push('/notes')}>
              <TitleCard
                title='Tap on "Notes" to access'
                description="Our notes are also available on web! www.diunotesbuddy.live"
                icon={IconBook2}
              />
            </Pressable>
          </View>
        </View>

        {/* Logged-out prompt banner */}
        {!user && (
          <View style={styles.signinBanner}>
            <Text style={styles.signinTitle}>You're not signed in</Text>
            <Text style={styles.signinSubtitle}>Log in to submit notes, sync progress, and unlock more</Text>
            <Pressable
              onPress={() => router.push('/login')}
              style={({ pressed }) => [styles.loginButton, pressed && styles.buttonPressed]}
            >
              <IconLogin size={18} color="#0A1A0A" />
              <Text style={styles.loginButtonText}>Log in</Text>
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
    width: 66,
    height: 66,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgb(0, 208, 255)',
  },
  titleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  titleText: {
    textAlign: 'left',
    fontSize: 23,
    fontWeight: '700',
    marginVertical: 0,
    marginLeft: 10,
    color: '#FFFFFF',
  },
  titleAccent: {
    color: '#00D4FF',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.35)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00D4FF',
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
    top: 95,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.25)',
    backgroundColor: 'rgb(0, 0, 0)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    zIndex: 50,
    shadowColor: '#00D4FF',
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.35)',
  },
  menuAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuHeaderText: {
    flex: 1,
  },
  menuName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 16,
  },
  menuEmail: {
    fontSize: 11.5,
    color: '#9BA4C0',
    marginTop: 2,
    lineHeight: 14,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  menuItemPressed: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  menuItemText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
  },
  signinBanner: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#16213E',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.25)',
    gap: 10,
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
    marginTop: 4,
  },
  loginButtonText: {
    color: '#0A1A0A',
    fontSize: 14,
    fontWeight: '700',
  },
})