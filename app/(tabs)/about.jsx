import { ScrollView, StyleSheet, View } from 'react-native'
import { NameCard } from '../../appDesign/cards.js'
import Header from '../../appDesign/header.js'
import { Leaf, Planet, Tree } from '../../appDesign/texts.js'

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <Header title="About Us" />
      <View style={styles.bg}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <Planet title="A small team, with big ideas." style={{ textAlign: 'center' }} />
          <Tree title="DIU Notes Buddy is a passion project crafted by a team of three!" />
          <Planet title="Meet the Team Behind" style={{ textAlign: 'center' }} />

          <NameCard
            name="Ocean Mallik"
            username="@oceanmallik"
            photoURL="https://github.com/oceanmallik.png"
            cardURL="https://github.com/oceanmallik"
            webURL="https://oceanmallik.com/"
            otherURL="https://link.oceanmallik.com/"
            email="mailto:oceanmallik@oceanmallik.com"
            contribution="Co-founder, Developer (App, Web & Backend), Github Management"
          />

          <NameCard
            name="Hasibul Hasan Hasib"
            username="@hasib2050"
            photoURL="https://github.com/hasib2050.png"
            cardURL="https://github.com/hasib2050"
            webURL="https://hasib2050.github.io/"
            otherURL="https://www.facebook.com/hasibulhasan.hasib.2050"
            email="mailto:hasibulhasanhasib355@gmail.com"
            contribution="Co-founder, Developer (Web), Notes Contributor, Github Management"
          />

          <NameCard
            name="Md. Bin Asif"
            username="@mdbinasif07"
            photoURL="https://github.com/mdbinasif07.png"
            cardURL="https://github.com/mdbinasif07"
            webURL="https://mdbinasif07.github.io/"
            otherURL="https://www.facebook.com/mohammed.bin.asif.2024"
            email="mailto:mdbinasif@gmail.com"
            contribution="Supporter, Notes Contributor"
          />

          <Leaf title="View our apps" linkURL="https://diunotesbuddy.live/privacy/privacy.html" />

        </ScrollView>
      </View>
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