import { ImageBackground } from 'expo-image'
import { StyleSheet, View } from 'react-native'

import backgroundImage from "@/assets/images/backgroundBlue.png"
import { NameCard } from '../../appDesign/cards.js'
import Header from '../../appDesign/header.js'
import { Planet, Tree } from '../../appDesign/texts.js'

const AboutUs = () => {
  return (
    <View style={styles.container}>

      <Header title="About Us" />

      <ImageBackground source={backgroundImage} style={styles.Image}>

        <Planet title="Built by a small team, with big ideas." />
        <Tree title="DIU Notes Buddy is a passion project crafted by a team of three — designed to help you with your notes in a smarter, friendlier way." />

        <Planet title="Meet the Co-founders" style={{ textAlign: 'center' }} />

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
  Image: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'flex-start',
  },
})