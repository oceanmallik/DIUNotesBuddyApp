import backgroundImage from "@/assets/images/backgroundBlue.png"
import { ImageBackground } from 'expo-image'
import { ScrollView, StyleSheet, View } from 'react-native'
import { NameCard } from '../../appDesign/cards.js'
import Header from '../../appDesign/header.js'
import { Planet, Tree } from '../../appDesign/texts.js'

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <Header title="About Us" />
      <ImageBackground source={backgroundImage} style={styles.image}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <Planet title="Built by a small team, with big ideas." />
          <Tree title="DIU Notes Buddy is a passion project crafted by a team of three — designed to help you with your notes in a smarter, friendlier way." />
          <Planet title="Meet the Team Behind" style={{ textAlign: 'center' }} />

          <NameCard
            name="Ocean Mallik"
            username="@oceanmallik"
            description="Grateful for everything, excited for what's next"
            photoURL="https://github.com/oceanmallik.png"
            cardURL="https://github.com/oceanmallik"
            webURL="https://oceanmallik.com/"
            otherURL="https://link.oceanmallik.com/"
            email="mailto:oceanmallik@oceanmallik.com"
            contribution="Co-founder, Developer (App & Web), Github Management"
          />

          <NameCard
            name="Hasibul Hasan Hasib"
            username="@hasib2050"
            description="Dedicated to making learning easier and more accessible"
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
            description="Heroes aren't remembered for what they take. They're remembered for what they contribute."
            photoURL="https://github.com/mdbinasif07.png"
            cardURL="https://github.com/mdbinasif07"
            webURL="https://mdbinasif07.github.io/"
            otherURL="https://www.facebook.com/mohammed.bin.asif.2024"
            email="mailto:mdbinasif@gmail.com"
            contribution="Supporter, Notes Contributor"
          />

        </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default AboutUs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
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