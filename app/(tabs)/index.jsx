import { ImageBackground } from 'expo-image'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import backgroundImage from "@/assets/images/background.png"

const app = () => {
  return (
    <View style={styles.container}>

      <ImageBackground source={backgroundImage} style={styles.Image} >

        <Text style={styles.title}>DIU Notes Buddy</Text>
        <Text style={styles.description}>Your Ultimate Study Companion</Text>

        <Link style={{marginHorizontal: '120'}} href="/about" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>About Us</Text>
          </Pressable>
        </Link>

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
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  description: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  TopBar: {
    backgroundColor: '#333',
    color: 'white',
    fontSize: 18,
    paddingHorizontal: 25,
  },
  link: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 6,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'center',
  },
})