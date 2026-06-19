import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Planet, Tree } from '../../appDesign/texts.js';
import useInterstitialAd from '../../hooks/useInterstitialAd';

export default function AdsPage() {
  const { showAd, loaded } = useInterstitialAd();

  return (
    <View style={styles.container}>
      <Planet title="Support US via Ads" />
      <Tree title="Click the button below to watch a short ad and help us keep this project alive!" style={{ textAlign: 'center' }} />

      <TouchableOpacity
        style={[styles.button, !loaded && styles.buttonDisabled]}
        onPress={showAd}
        disabled={!loaded}
      >
        <Text style={styles.buttonText}>
          {loaded ? 'Click Here to Watch Ad' : 'The Ad is on its way...'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Watch a short ad to help us keep this project alive.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#001c07',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 50,
    color: '#cacaca',
  },
  button: {
    backgroundColor: '#06d42f',
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonDisabled: {
    backgroundColor: '#af5959',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});