import { IconHeart, IconBrandGooglePlay, IconPlayerPlay, IconWorld, IconBuildingBank, IconWallet } from '@tabler/icons-react-native'
import { ScrollView, StyleSheet, View, Linking } from 'react-native'
import { TitleCard } from '../../appDesign/cards.js'
import Header, { useHeaderHeight } from '../../appDesign/header.js'
import { AppButton } from '../../appDesign/button.js'
import { Planet, Leaf } from '../../appDesign/texts.js'
import { useAppTheme } from '../../logic/ThemeProvider'
import useInterstitialAd from '../../hooks/useInterstitialAd'
import * as StoreReview from 'expo-store-review'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

const Support = () => {
  const router = useRouter();
  const tabBarHeight = 100;
  const { colors, activeTheme } = useAppTheme();
  const { showAd, loaded } = useInterstitialAd();
  const headerHeight = useHeaderHeight();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.bg, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 12, paddingBottom: tabBarHeight + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Support Content Moved Here */}
          <TitleCard
              title="Help Keep Us Running"
              description="DIU Notes Buddy is free for everyone. Your support keeps our servers online and helps us expand resources."
              icon={IconHeart}
          />

          <Planet title="Donate & Support" style={{ textAlign: 'center' }} />
          
          <View style={[styles.glowingWrapper, { shadowColor: colors.accent }]}>
              <LinearGradient
                  colors={[colors.accent, colors.accent + '30']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBorder}
              >
                  <View style={[styles.innerGlowCard, { backgroundColor: activeTheme === 'dark' ? '#0F1A24' : '#FFFFFF' }]}>
                      <View style={styles.actionGridInner}>
                          <AppButton
                              onPress={() => loaded ? showAd() : null}
                              title={loaded ? "Watch an Ad (Free)" : "Ad Loading..."}
                              style={styles.fullWidthButton}
                              icon={IconPlayerPlay}
                          />
                          <View style={styles.buttonRow}>
                              <AppButton
                                  onPress={() => router.push('/bKash')}
                                  title="bKash"
                                  style={styles.halfButton}
                                  variant="semi"
                                  icon={IconWallet}
                              />
                              <AppButton
                                  onPress={() => router.push('/Bank')}
                                  title="Bank"
                                  style={styles.halfButton}
                                  variant="semi"
                                  icon={IconBuildingBank}
                              />
                          </View>

                          <AppButton
                              title="Rate Us on Google Play"
                              icon={IconBrandGooglePlay}
                              style={styles.fullWidthButton}
                              variant="secondary"
                              onPress={async () => {
                                  try {
                                      const isAvailable = await StoreReview.isAvailableAsync();
                                      if (isAvailable) {
                                          await StoreReview.requestReview();
                                      } else {
                                          const marketUrl = "market://details?id=com.oceanmallik.diunote";
                                          const canOpen = await Linking.canOpenURL(marketUrl);
                                          if (canOpen) {
                                              Linking.openURL(marketUrl);
                                          } else {
                                              Linking.openURL("https://play.google.com/store/apps/details?id=com.oceanmallik.diunote");
                                          }
                                      }
                                  } catch (e) {
                                      Linking.openURL("https://play.google.com/store/apps/details?id=com.oceanmallik.diunote");
                                  }
                              }}
                          />
                          <AppButton
                              title="Visit Web Version"
                              icon={IconWorld}
                              style={styles.fullWidthButton}
                              variant="secondary"
                              onPress={() => Linking.openURL("https://diunotesbuddy.live/")}
                          />
                      </View>
                  </View>
              </LinearGradient>
          </View>

        </ScrollView>
      </View>
      <Header title="Support the Devs" showBack={true} />
    </View>
  )
}

export default Support

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  bg: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 2,
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },
  glowingWrapper: {
    marginHorizontal: 16,
    marginTop: 5,
    marginBottom: 30,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 20,
  },
  innerGlowCard: {
    borderRadius: 18,
    padding: 16,
  },
  actionGridInner: {
    width: '100%',
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  fullWidthButton: {
    width: '100%',
    marginHorizontal: 0,
    marginTop: 0,
    paddingVertical: 16,
    borderRadius: 16,
  },
  halfButton: {
    flex: 1,
    marginHorizontal: 0,
    marginTop: 0,
    paddingVertical: 16,
  },
})
