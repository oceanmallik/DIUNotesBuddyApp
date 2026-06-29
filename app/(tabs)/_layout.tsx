import { HapticTab } from '@/components/haptic-tab';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../logic/ThemeProvider';

export default function TabLayout() {
  const { colors, activeTheme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const bottomOffset = Platform.select({
    ios: 24,
    android: Math.max(insets.bottom, 16),
    default: 16,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarStyle: [styles.tabBar, { bottom: bottomOffset }],
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={colors.blurTint as any}
            style={[StyleSheet.absoluteFill, styles.blur]}
          >
            <View style={[
              styles.overlay, 
              { 
                backgroundColor: activeTheme === 'dark' ? 'rgba(4, 17, 22, 0.85)' : 'rgba(244, 239, 230, 0.85)',
                borderColor: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
              }
            ]} />
          </BlurView>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Feather size={22} name="home" color={color} style={focused && styles.iconFocused} />
          ),
        }}
      />
      <Tabs.Screen
        name="contribute"
        options={{
          title: 'Send',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={20}
              name="paper-plane-o"
              color={color}
              style={focused && styles.iconFocused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, focused }) => (
            <Feather
              size={22}
              name="book-open"
              color={color}
              style={focused && styles.iconFocused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={22}
              name="handshake-o"
              color={color}
              style={focused && styles.iconFocused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Entypo size={24} name="github" color={color} style={focused && styles.iconFocused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 32,
    borderTopWidth: 0,
    elevation: 0,
    overflow: 'hidden',
    paddingTop: 0,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  blur: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 32,
  },
  item: {
    paddingTop: 6,
    paddingBottom: 6,
    height: 64,
  },
  label: {
    fontSize: 10,
    fontFamily: 'SpaceGrotesk-Bold',
    marginTop: 2,
    marginBottom: 0,
  },
  iconFocused: {
    transform: [{ translateY: -2 }],
  },
});