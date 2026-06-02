import { ImageBackground } from 'expo-image'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import backgroundImage from "@/assets/images/background.png"

const Contribute = () => {
  return (
    <View style={styles.container}>
        <ImageBackground source={backgroundImage} style={styles.Image}>

          <Text style={styles.title}>Contribute Notes</Text>

          <Link style={styles.linkButton} href="https://forms.gle/gVuKTo2LxsfGV9A86" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Contribute Notes</Text>
            </Pressable>
          </Link>

        </ImageBackground>
    </View>
  )
}

export default Contribute

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
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 30,
    paddingBottom: 20,
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
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 20,
    minWidth: 50,
  },
})