import { ImageBackground } from 'expo-image'
import { Image, StyleSheet, Text, View } from 'react-native'

import backgroundImage from "@/assets/images/backgroundBlue.png"
import Memes from "@/assets/memes/contributionMeme.jpeg"
import AppButton from '../../components/button.js'
import Header from '../../components/header.js'


const Contribute = () => {
  return (
    <View style={styles.container}>

      <Header title="Contribute Notes" />

      <ImageBackground source={backgroundImage} style={styles.Image}>

        <Text style={styles.subtitle}>Wanna Contribute to this Project?</Text>

        <Text style={styles.miniTitle}>Add your notes, fix broken resources, and help make the study library more complete for other DIU students.</Text>
        
        <View style={styles.buttonsContainer}>

          <AppButton
            link="https://forms.gle/gVuKTo2LxsfGV9A86"
            title="Contribute Notes"
          />
          <AppButton
            link="https://github.com/oceanmallik/DIUNotesBuddyApp/issues"
            title="Report an Issue"
          />
          
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
  },
})