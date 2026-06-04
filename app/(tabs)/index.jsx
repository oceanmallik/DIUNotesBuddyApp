import { ImageBackground } from 'expo-image'
import { StyleSheet, View } from 'react-native'

import backgroundImage from "@/assets/images/background.png"
import AppButton from '../../appDesign/button.js'
import { Mountain, Planet, Tree } from '../../appDesign/texts.js'

const app = () => {
  return (
    <View style={styles.container}>

      <ImageBackground source={backgroundImage} style={styles.Image} >

        <Planet title="DIU Notes Buddy" style={{ textAlign: 'center', marginTop: 35, fontSize: 32 }} />

        <Tree title="Your Ultimate Study Companion" style={{ textAlign: 'center', marginVertical: 0, marginBottom: 20 }} />

        <Mountain title="Discover notes from real people." style={{ textAlign: 'center'}} />

        <View style={styles.viewContainer}>
          <AppButton
            link="/about"
            title="About Us"
          />
        </View>
      </ImageBackground>

    </View>
  )
}

export default app

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
  viewContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 10,
    elevation: 10,
  },
})