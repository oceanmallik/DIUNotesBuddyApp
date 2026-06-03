import { ImageBackground } from 'expo-image'
import { StyleSheet, Text, View } from 'react-native'

import backgroundImage from "@/assets/images/background.png"
import AppButton from '../../appDesign/button.js'
import Header from '../../appDesign/header.js'

const app = () => {
  return (
    <View style={styles.container}>

      <Header title="DIU Notes Buddy" />

      <ImageBackground source={backgroundImage} style={styles.Image} >

        <Text style={styles.description}>Your Ultimate Study Companion</Text>

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
  title: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 30,
    paddingBottom: 5,
  },
  description: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: 20,
  },
  TopBar: {
    backgroundColor: '#333',
    color: 'white',
    fontSize: 18,
    paddingHorizontal: 25,
  },
  button: {
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(17, 24, 39, 0.92)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  linkButton: {
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 40,
    minWidth: 50,
  },
  viewContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 10,
    elevation: 10,
  },
})