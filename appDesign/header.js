import { BlurView } from 'expo-blur';
import { StyleSheet, Text, View } from 'react-native';

export const fonts = {
  bold: "SpaceGrotesk-Bold",
}

export default function Header({ title }) {
  return (
    <View style={styles.topBar}>
      <BlurView intensity={120} tint="dark" style={StyleSheet.absoluteFill} />
      <Text style={styles.galaxy}>{title}</Text>
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
    justifyContent: 'center',
    overflow: 'hidden',
    height: 88, // adjust to your liking
  },
  galaxy: {
    color: 'white',
    fontSize: 22,
    fontFamily: fonts.bold,
    textAlign: 'center',
    paddingTop: 26,
    paddingBottom: 6,
  },
})