import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { IconHeart } from '@tabler/icons-react-native'
import { ScrollView, StyleSheet, View, Linking } from 'react-native'
import { NameCard, TitleCard } from '../../appDesign/cards.js'
import Header, { useHeaderHeight } from '../../appDesign/header.js'
import { AppButton } from '../../appDesign/button.js'
import { Leaf, Planet } from '../../appDesign/texts.js'
import { useAppTheme } from '../../logic/ThemeProvider'

import { useRouter } from 'expo-router'

const AboutUs = () => {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors } = useAppTheme();
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
})