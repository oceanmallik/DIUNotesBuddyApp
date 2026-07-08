
import { IconHeart, IconBrandGooglePlay, IconPlayerPlay, IconWorld, IconBuildingBank, IconWallet } from '@tabler/icons-react-native'
import { ScrollView, StyleSheet, View, Linking } from 'react-native'
import { NameCard, TitleCard, TitleCardLinked } from '../../appDesign/cards.js'
import Header, { useHeaderHeight } from '../../appDesign/header.js'
import { AppButton } from '../../appDesign/button.js'
import { Leaf, Planet } from '../../appDesign/texts.js'
import { useAppTheme } from '../../logic/ThemeProvider'
import useInterstitialAd from '../../hooks/useInterstitialAd'
import * as StoreReview from 'expo-store-review'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

const AboutUs = () => {
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
          <TitleCard
            title="About the team at work"
            description="DIU Notes Buddy is a passion project crafted by a dedicated team of Software Engineering students!"
            icon={IconHeart}
          />
          <Planet title="Meet the Team Behind" style={{ textAlign: 'center' }} />
          <NameCard
            name="Ocean Mallik"
            username="@oceanmallik"
            photoURL="https://github.com/oceanmallik.png"
            cardURL="https://github.com/oceanmallik"
            webURL="https://oceanmallik.com/"
            email="mailto:oceanmallik@oceanmallik.com"
            contribution="Co-founder, Developer (App, Website & Backend), Github Management"
            button1="Website"
            button3="Email"
            ID="253-35-087"
            secretId="oceanmallik"
            onSecretTrigger={() => router.push('/(secret)/oceanmallik')}
          />
          <NameCard
            name="Hasibul Hasan Hasib"
            username="@hasib2050"
            photoURL="https://github.com/hasib2050.png"
            cardURL="https://github.com/hasib2050"
            webURL="https://www.instagram.com/h.a.s.i.b_50/"
            email="mailto:hasibulhasanhasib355@gmail.com"
            contribution="Co-founder, Developer (Website), Notes Contributor, Github Management"
            button1="Instagram"
            button3="Email"
            ID="253-35-645"
          />
          <Planet title="Our Honorable Review Squad" style={{ textAlign: 'center' }} />
          <NameCard
            name="Md. Bin Asif"
            username="@mdbinasif07"
            photoURL="https://github.com/mdbinasif07.png"
            cardURL="https://github.com/mdbinasif07"
            webURL="https://www.instagram.com/msasif7/"
            email="mailto:mdbinasif@gmail.com"
            contribution="Early Supporter, Notes Contributor & Review Squad Member (SWE)"
            button1="Instagram"
            button3="Email"
            ID="253-35-515"
          />

          <NameCard
            name="Dhrubo Mitra"
            username="@dhrubo04-oneman"
            photoURL="https://github.com/dhrubo04-oneman.png"
            cardURL="https://github.com/dhrubo04-oneman"
            webURL="https://www.instagram.com/dhrubo7304/"
            email="mailto:balnuru411@gmail.com"
            contribution="Notes Contributor & Review Squad Member (ITM)"
            button1="Instagram"
            button3="Email"
            ID="261-51-004"
          />
          <Leaf title="" linkURL="mailto:oceanmallik@oceanmallik.com" linkText="Mail us to join review squad" />

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
                                  if (__DEV__) {
                                      Linking.openURL("market://details?id=com.oceanmallik.diunote").catch(() => {
                                          Linking.openURL("https://play.google.com/store/apps/details?id=com.oceanmallik.diunote");
                                      });
                                  } else {
                                      try {
                                          if (await StoreReview.hasAction()) {
                                              await StoreReview.requestReview();
                                          } else {
                                              Linking.openURL("market://details?id=com.oceanmallik.diunote");
                                          }
                                      } catch {
                                          Linking.openURL("https://play.google.com/store/apps/details?id=com.oceanmallik.diunote");
                                      }
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

          <Leaf title="View our" linkURL="https://diunotesbuddy.live/privacy/privacy.html" style={{ marginBottom: 30 }} />
        </ScrollView>
      </View>
      <Header title="Crafted with Passion" />
    </View>
  )
}

export default AboutUs

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