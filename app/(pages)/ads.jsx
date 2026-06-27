import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Planet, Tree } from '../../appDesign/texts.js';
import DonationHeader from '../../components/Donationheader.jsx';
import useInterstitialAd from '../../hooks/useInterstitialAd';
import { useAppTheme } from '../../logic/ThemeProvider';

export default function AdsPage() {
  const { showAd, loaded } = useInterstitialAd();
  const { colors, activeTheme } = useAppTheme();

  return (
    <>
      <DonationHeader
        title="Support via Ads"
        accentColor="#06d42f"
        backgroundColor={colors.background}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Planet title="Support Us via Ads" style={{ color: colors.textPrimary }} />
        <Tree
          title="Click the button below to watch a short ad and help us keep this project alive!"
          style={{ textAlign: 'center', color: colors.textSecondary }}
        />

        <TouchableOpacity
          style={[styles.button, !loaded && styles.buttonDisabled]}
          onPress={showAd}
          disabled={!loaded}
        >
          <Text style={styles.buttonText}>
            {loaded ? 'Click Here to Watch Ad' : 'The Ad is on its way...'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Watch a short ad to help us keep this project alive.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#06d42f',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
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