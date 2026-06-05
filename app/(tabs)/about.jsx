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
          description="grateful for everything, excited for what's next"
          photoURL="https://github.com/oceanmallik.png"
          githubURL="https://github.com/oceanmallik"
          otherURL="https://link.oceanmallik.com/"
          contribution="Lead Developer, Developer (Web & App), Github Management"
        />

        <NameCard
          name="Hasibul Hasan Hasib"
          username="@hasib2050"
          description="dedicated to making learning easier and more accessible"
          photoURL="https://github.com/hasib2050.png"
          githubURL="https://github.com/hasib2050"
          otherURL="https://link.hasib2050.com/"
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