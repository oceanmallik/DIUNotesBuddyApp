import appLogo from "@/assets/images/android-icon-foreground.png"
import backgroundImage from "@/assets/images/backgroundGreen.png"
import { IconBrandGithub, IconWorld } from '@tabler/icons-react-native'
import { ImageBackground } from 'expo-image'
import { Image, Linking, Pressable, StyleSheet, View } from 'react-native'
import AppButton from '../../appDesign/button.js'
import { TitleCard } from '../../appDesign/cards.js'
import { Mountain, Planet, Tree } from '../../appDesign/texts.js'

const app = () => {
  return (
    <View style={styles.container}>

      <ImageBackground source={backgroundImage} style={styles.Image} >

        <View style={styles.topBar}>
          <Image source={appLogo} style={styles.logo} />
          <View>
            <Planet title="DIU Notes Buddy" style={{ textAlign: 'center', fontSize: 27, marginVertical: 1 }} />
            <Tree title="Your Ultimate Study Companion" style={{ textAlign: 'center', marginVertical: 5 }} />
          </View>

        </View>

        <Mountain title="Discover notes from real people." style={{ textAlign: 'center', marginVertical: 0 }} />

        <View style={{ width: '100%', paddingHorizontal: 0, marginVertical: 20 }}>
          <Pressable onPress={() => Linking.openURL('https://diunotesbuddy.live/')}>
            <TitleCard
              title="Our App Experience is Live!"
              description="Click Here to view the website instead"
              icon={IconWorld}
            />
          </Pressable>
          <Pressable onPress={() => Linking.openURL('https://github.com/AxiomVessel')}>
            <TitleCard
              title="Check us out on Github!"
              description="Click Here to view the website instead"
              icon={IconBrandGithub}
            />
          </Pressable>
        </View>
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
  topBar: {
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'left',
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