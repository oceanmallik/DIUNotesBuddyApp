import { ImageBackground } from 'expo-image'
import { StyleSheet, View } from 'react-native'

import backgroundImage from "@/assets/images/backgroundBlue.png"
import Header from '../../appDesign/header.js'
import { Planet, Tree } from '../../appDesign/texts.js'

const AboutUs = () => {
  return (
    <View style={styles.container}>

      <Header title="About Us" />

      <ImageBackground source={backgroundImage} style={styles.Image}>

        <Planet title="Built by a small team, with big ideas." />

        <Tree title="DIU Notes Buddy is a passion project crafted by a team of three — designed to help you capture, organize, and revisit your notes in a smarter, friendlier way." />

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