import appLogo from "@/assets/images/android-icon-foreground.png"

import { IconBook2, IconMoon, IconSun, IconUser, IconDownload, IconInfoCircle, IconHeart } from '@tabler/icons-react-native'
import { router, useFocusEffect } from 'expo-router'
import React, { useRef, useState, useCallback } from 'react'
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Tree } from '../../appDesign/texts.js'
import FocusTimer from '../../appDesign/focusTimer.js'
import { useAuth } from '../../logic/AuthProvider'
import { useAppTheme } from '../../logic/ThemeProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { OfflineManager } from '../../logic/OfflineManager'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const App = () => {
  const { user } = useAuth();
  const tabBarHeight = 100;
  const { activeTheme, toggleTheme, colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const avatarScale = useRef(new Animated.Value(1)).current;
  const themeScale = useRef(new Animated.Value(1)).current;
  const themeSpin = useRef(new Animated.Value(0)).current;

  const [stats, setStats] = useState({ total: 0, unread: 0, readNotes: 0 });

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        try {
          const notesRaw = await OfflineManager.getSavedNotes();
          const total = notesRaw.length;
          const readNotes = notesRaw.filter(n => n.read).length;
          const unread = total - readNotes;

          setStats({ total, unread, readNotes });
        } catch (e) {
          console.error(e);
        }
      };
      loadStats();
    }, [])
  );

  const handleToggleTheme = () => {
    toggleTheme();
    themeSpin.setValue(0);
    Animated.spring(themeSpin, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const spin = themeSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg']
  });

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const initial = user?.email?.charAt(0)?.toUpperCase() ?? "?";

  const provider = user?.app_metadata?.provider || 'Email';
  const prov = provider.toLowerCase();
  const isGoogle = prov === 'google' || user?.email?.endsWith('@diu.edu.bd');
  const isGithub = prov === 'github';

  const renderAvatarInner = () => {
    if (avatarUrl) {
      return <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />;
    }
    return (
      <View style={[styles.avatarCircle, { backgroundColor: activeTheme === 'dark' ? '#1A3340' : '#F0F8FF' }]}>
        <Text style={[styles.avatarText, { color: colors.accent }]}>{initial}</Text>
      </View>
    );
  };

  const renderAvatar = () => {
    if (!user) {
      return (
        <View style={[styles.avatarCircle, { backgroundColor: activeTheme === 'dark' ? '#1A3340' : '#F0F8FF' }]}>
          <IconUser size={20} color={colors.accent} />
        </View>
      );
    }
    if (isGoogle) {
      return (
        <View style={{ width: 41, height: 41, borderRadius: 20.5, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', top: 0, left: 0, width: 21, height: 21, backgroundColor: '#EA4335' }} />
          <View style={{ position: 'absolute', top: 0, right: 0, width: 21, height: 21, backgroundColor: '#4285F4' }} />
          <View style={{ position: 'absolute', bottom: 0, left: 0, width: 21, height: 21, backgroundColor: '#FBBC05' }} />
          <View style={{ position: 'absolute', bottom: 0, right: 0, width: 21, height: 21, backgroundColor: '#34A853' }} />
          {renderAvatarInner()}
        </View>
      );
    }
    
    const githubRing = isGithub ? { borderWidth: 2, borderColor: activeTheme === 'dark' ? '#FFFFFF' : '#24292E' } : {};
    
    return (
      <View style={[githubRing, { borderRadius: 18, padding: isGithub ? 2 : 0 }]}>
        {renderAvatarInner()}
      </View>
    );
  };

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
              onPress={handleToggleTheme}
              onPressIn={() => Animated.spring(themeScale, { toValue: 0.8, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(themeScale, { toValue: 1, useNativeDriver: true }).start()}
              style={[styles.themeButton, { transform: [{ scale: themeScale }] }]}
            >
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                {activeTheme === 'dark' ? (
                  <IconSun size={22} color={colors.accent} strokeWidth={2} />
                ) : (
                  <IconMoon size={22} color={colors.accent} strokeWidth={2} />
                )}
              </Animated.View>
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
                  backgroundColor: 'transparent' // Background handled in inner views now
                }
              ]}
            >
              {renderAvatar()}
            </AnimatedPressable>
          </View>

          <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 20, gap: 12 }}>
            <View style={[styles.statBox, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                <Text style={[styles.statNum, { color: colors.accent }]}>{stats.total}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Downloads</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                <Text style={[styles.statNum, { color: colors.destructive }]}>{stats.unread}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Unread</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                <Text style={[styles.statNum, { color: '#00E676' }]}>{stats.readNotes}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Read</Text>
            </View>
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
                <IconDownload size={22} color="#00E676" />
                <Tree title="Downloads" style={[styles.quickButtonText, { color: colors.textPrimary }]} />
              </Pressable>
            </View>

            <Pressable 
              onPress={() => router.push('/Support')} 
              style={[styles.quickButton, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}
            >
              <IconHeart size={22} color="#FFA000" />
              <Tree title="Support App" style={[styles.quickButtonText, { color: colors.textPrimary }]} />
            </Pressable>
          </View>
        </View>


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
  statBox: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
  },
  statNum: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 22,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 11,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
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