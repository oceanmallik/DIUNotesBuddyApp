import { ImageBackground } from 'expo-image'
import { StyleSheet, Text, View } from 'react-native'

import backgroundImage from "@/assets/images/backgroundBlue.png"
import Header from '../../appDesign/header.js'

const AboutUs = () => {
  return (
    <View style={styles.container}>

      <Header title="About Us" />

      <ImageBackground source={backgroundImage} style={styles.Image}>

        <Text>Coming soon...</Text>

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