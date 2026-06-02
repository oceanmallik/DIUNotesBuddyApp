import { ImageBackground } from 'expo-image'
import { Link } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

import backgroundImage from "@/assets/images/backgroundBlue.png"
import topBarBackground from "@/assets/images/topBarBackground.png"
import Memes from "@/assets/memes/contributionMeme.jpeg"


const Contribute = () => {
  return (
    <View style={styles.container}>

      <ImageBackground source={topBarBackground} style={styles.TopBar}>
        <Text style={styles.title}>Contribute Notes</Text>
      </ImageBackground>

      <ImageBackground source={backgroundImage} style={styles.Image}>

        <Text style={styles.subtitle}>Wanna Contribute to this Project?</Text>

        <Text style={styles.miniTitle}>Add your notes, fix broken resources, and help make the study library more complete for other DIU students.</Text>
        
        <View style={styles.buttonsContainer}>

          <Link style={styles.linkButton} href="https://forms.gle/gVuKTo2LxsfGV9A86" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Contribute Notes</Text>
            </Pressable>
          </Link>
          <Link style={styles.linkButton} href="https://github.com/oceanmallik/DIUNotesBuddyApp/issues" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Report an Issue</Text>
            </Pressable>
          </Link>

        </View>
        <View style={styles.MemeView}>
          <Image source={Memes} style={styles.Meme}></Image>
        </View>

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
  MemeView: {
    resizeMode: 'contain',
    paddingTop: 60,
    margin: 20,
  },
  Meme: {
    width: '100%',
    height: 350,
  },
  TopBar: {
    width: '100%',
    flex: 0.13,
    justifyContent: 'flex-start',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    paddingTop: 36,
    paddingBottom: 20,
  },
  subtitle: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Times New Roman',
    textAlign: 'left',
    padding: 20,
  },
  miniTitle: {
    color: 'grey',
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    allignItems: 'center',
    merginTop: 30,
  },
  button: {
    minHeight: 25,
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
    fontSize: 13,
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