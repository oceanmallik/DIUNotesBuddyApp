import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].tint;
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
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarStyle: [styles.tabBar, { bottom: bottomOffset }],
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            style={[StyleSheet.absoluteFill, styles.blur]}
          >
            <View style={styles.overlay} />
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
          title: 'Contribute',
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
    height: 72,
    borderRadius: 24,
    borderTopWidth: 0,
    elevation: 0,
    overflow: 'hidden',
    paddingTop: 0,
    paddingBottom: 0,
  },
  blur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 20, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
  },
  item: {
    paddingTop: 6,
    paddingBottom: 8,
    height: 72,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 0,
    marginBottom: 0,
  },
  iconFocused: {
    transform: [{ translateY: -1 }],
  },
});