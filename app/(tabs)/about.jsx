import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { ScrollView, StyleSheet, View } from 'react-native'
import { NameCard } from '../../appDesign/cards.js'
import Header from '../../appDesign/header.js'
import { Leaf, Planet, Tree } from '../../appDesign/texts.js'

const AboutUs = () => {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <View style={styles.container}>
      <View style={styles.bg}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: 90, paddingBottom: tabBarHeight + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <Tree title="DIU Notes Buddy is a passion project crafted by a dedicated team of Software Engineering students!" />
          <Planet title="Meet the Team Behind" style={{ textAlign: 'center', marginTop: 0 }} />
          <NameCard
            name="Ocean Mallik"
            username="@oceanmallik"
            photoURL="https://github.com/oceanmallik.png"
            cardURL="https://github.com/oceanmallik"
            webURL="https://oceanmallik.com/"
            otherURL="https://link.oceanmallik.com/"
            email="mailto:oceanmallik@oceanmallik.com"
            contribution="Co-founder, Developer (App, Website & Backend), Github Management"
            button1="Website"
            button2="Links"
            button3="Email"
            ID="253-35-087"
          />
          <NameCard
            name="Hasibul Hasan Hasib"
            username="@hasib2050"
            photoURL="https://github.com/hasib2050.png"
            cardURL="https://github.com/hasib2050"
            webURL="https://www.instagram.com/h.a.s.i.b_50/"
            otherURL="https://www.facebook.com/hasibulhasan.hasib.2050"
            email="mailto:hasibulhasanhasib355@gmail.com"
            contribution="Co-founder, Developer (Website), Notes Contributor, Github Management"
            button1="Instagram"
            button2="Facebook"
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
            otherURL="https://www.facebook.com/mohammed.bin.asif.2024"
            email="mailto:mdbinasif@gmail.com"
            contribution="Early Supporter, Notes Contributor & Review Squad Member (SWE)"
            button1="Instagram"
            button2="Facebook"
            button3="Email"
            ID="253-35-381"
          />
          <NameCard
            name="Dhrubo Mitra"
            username="@dhrubo04-oneman"
            photoURL="https://github.com/dhrubo04-oneman.png"
            cardURL="https://github.com/dhrubo04-oneman"
            webURL="https://www.instagram.com/dhrubo7304/"
            otherURL="https://www.facebook.com/dhrubo.mitra.90"
            email="mailto:balnuru411@gmail.com"
            contribution="Notes Contributor & Review Squad Member (ITM)"
            button1="Instagram"
            button2="Facebook"
            button3="Email"
            ID="261-51-004"
          />
          <Leaf title="View our apps" linkURL="https://diunotesbuddy.live/privacy/privacy.html" />
        </ScrollView>
      </View>
      <Header title="A small team, with big ideas" />
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
    backgroundColor: '#131313',
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