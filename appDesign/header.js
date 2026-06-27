import { BlurView } from 'expo-blur';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../logic/ThemeProvider';

export const fonts = {
  bold: "SpaceGrotesk-Bold",
}

export default function Header({ title }) {
  const { colors, activeTheme } = useAppTheme();

  return (
    <View style={styles.topBar}>
      <BlurView intensity={80} tint={colors.blurTint} style={StyleSheet.absoluteFill} />
      <View style={[styles.bottomBorder, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
      <Text style={[styles.galaxy, { color: colors.textPrimary }]}>{title}</Text>
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
    justifyContent: 'flex-end',
    height: 90,
    paddingBottom: 14,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  galaxy: {
    fontSize: 18,
    fontFamily: fonts.bold,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});