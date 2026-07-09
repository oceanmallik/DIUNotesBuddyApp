import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { withLayoutContext } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';

const AnimatedTabIcon = ({ IconComponent, name, color, size, focused }: any) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.15 : 1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.15 : 1,
      useNativeDriver: true,
      friction: 5,
      tension: 100
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent size={size} name={name} color={color} />
    </Animated.View>
  );
};
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../logic/ThemeProvider';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from '@react-navigation/material-top-tabs';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const { colors, activeTheme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const bottomOffset = Platform.select({
    ios: 24,
    android: Math.max(insets.bottom, 16),
    default: 16,
  });

  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      tabBar={(props) => (
        <View style={[styles.tabBarContainer, { bottom: bottomOffset }]}>
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
          <MaterialTopTabBar {...props} />
        </View>
      )}
      screenOptions={{
        swipeEnabled: true,
        tabBarShowIcon: true,
        tabBarShowLabel: false, // Hidden for a compact pill look
        tabBarActiveTintColor: activeTheme === 'dark' ? '#FFF' : colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIndicatorStyle: { 
          backgroundColor: colors.accent,
          opacity: 0.25,
          height: 44,
          bottom: 6,
          marginHorizontal: 8,
          borderRadius: 22,
        },
        tabBarStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
        tabBarItemStyle: styles.item,
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <AnimatedTabIcon focused={focused} IconComponent={Feather} name="home" color={color} size={22} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <AnimatedTabIcon focused={focused} IconComponent={Feather} name="book-open" color={color} size={22} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="downloads"
        options={{
          title: 'Download',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <AnimatedTabIcon focused={focused} IconComponent={Feather} name="download" color={color} size={22} />
          ),
        }}
      />

      <MaterialTopTabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <AnimatedTabIcon focused={focused} IconComponent={Feather} name="check-square" color={color} size={22} />
          ),
        }}
      />

      <MaterialTopTabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <AnimatedTabIcon focused={focused} IconComponent={Entypo} name="github" color={color} size={24} />
          ),
        }}
      />
    </MaterialTopTabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 56,
    borderRadius: 28,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  blur: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 28,
  },
  item: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 0,
    height: 56,
    justifyContent: 'center',
  },
});