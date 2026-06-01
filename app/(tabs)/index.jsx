import { ImageBackground } from 'expo-image'
import { StyleSheet, Text, View } from 'react-native'

import backgroundImage from "@/assets/images/background.png"

const app = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.Image}
      >
        <Text style={styles.text}>DIU Notes Buddy</Text>
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
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})