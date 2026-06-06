import backgroundImage from "@/assets/images/backgroundBlue.png"
import Memes from "@/assets/memes/contributionMeme.jpeg"
import { IconSend } from '@tabler/icons-react-native'
import { ImageBackground } from 'expo-image'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import AppButton from '../../appDesign/button.js'
import { TitleCard } from '../../appDesign/cards.js'
import Header from '../../appDesign/header.js'
import { Planet, Tree } from '../../appDesign/texts.js'


const Contribute = () => {
  return (
    <View style={styles.container}>

      <Header title="Contribute Notes" />

      <ImageBackground source={backgroundImage} style={styles.Image}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <Planet title="Want to become a part?" />

          <Tree title="Add your notes, fix broken resources, and help make the study library more complete for other DIU students." />

          <TitleCard
            title="Your Contribution Matters"
            description="Every note you share, every error you report, helps build a stronger, more helpful resource for all DIU students. "
            icon={IconSend}
          />

          <Tree title="Ready to contribute? Click the button below to get started!" />

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
        </ScrollView>
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
    paddingTop: 20,
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 2,
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },
})