import { BlurView } from 'expo-blur';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconArrowLeft } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../logic/ThemeProvider';

export const fonts = {
  bold: "SpaceGrotesk-Bold",
}

export function useHeaderHeight() {
  const insets = useSafeAreaInsets();
  return 60 + insets.top;
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {boolean} [props.showBack]
 * @param {any} [props.rightComponent]
 * @param {any} [props.leftComponent]
 */
export default function Header({ title, showBack = false, rightComponent = null, leftComponent = null }) {
  const { colors, activeTheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  return (
    <View style={[styles.topBar, { height: headerHeight, paddingTop: insets.top }]}>
      <BlurView intensity={80} tint={colors.blurTint} style={StyleSheet.absoluteFill}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: activeTheme === 'dark' ? 'rgba(4, 17, 22, 0.85)' : 'rgba(244, 239, 230, 0.85)' }]} />
      </BlurView>
      <View style={[styles.bottomBorder, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
      
      <View style={styles.contentContainer}>
        {showBack ? (
          <Pressable onPress={() => router.back()} style={styles.leftContainer}>
            <IconArrowLeft color={colors.textPrimary} size={24} />
          </Pressable>
        ) : leftComponent ? (
          <View style={styles.leftContainer}>
            {leftComponent}
          </View>
        ) : null}
        <Text style={[styles.galaxy, { color: colors.textPrimary }]} numberOfLines={1}>{title}</Text>
        {rightComponent && (
          <View style={styles.rightContainer}>
            {rightComponent}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    width: '100%',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  leftContainer: {
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
    zIndex: 10,
  },
  rightContainer: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
    zIndex: 10,
  },
  galaxy: {
    fontSize: 20,
    fontFamily: fonts.bold,
    textAlign: 'center',
    letterSpacing: 0.3,
    paddingHorizontal: 40,
  },
});