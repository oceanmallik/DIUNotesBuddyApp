import appLogo from "@/assets/images/android-icon-foreground.png"
import { IconBrandGithub, IconWorld } from '@tabler/icons-react-native'
import { Image, Linking, Pressable, StyleSheet, View } from 'react-native'
import { AppButton } from '../../appDesign/button.js'
import { TitleCard } from '../../appDesign/cards.js'
import { Mountain, Planet, Tree } from '../../appDesign/texts.js'

const app = () => {
  return (
    <View style={styles.container}>

      <View style={styles.bg} >

        <View style={styles.topBar}>
          <Image source={appLogo} style={styles.logo} />
          <View>
            <Planet title="DIU Notes Buddy" style={{ textAlign: 'center', fontSize: 27, marginVertical: 1 }} />
            <Tree title="Your Ultimate Study Companion" style={{ textAlign: 'center', marginVertical: 3 }} />
          </View>

        </View>

        <Mountain title="The app is in early access!" style={{ textAlign: 'center', marginVertical: 0, marginTop: 10, fontSize: 20 }} />

        <View style={{ width: '100%', paddingHorizontal: 0, marginVertical: 20 }}>
          <Pressable onPress={() => Linking.openURL('https://diunotesbuddy.live/')}>
            <TitleCard
              title="Our Web Experience is Live!"
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
      </View>

    </View>
  )
}

export default app

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  bg: {
    width: '100%',
    flex: 1,
    backgroundColor: '#131313',
  },
  topBar: {
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'left',
    justifyContent: 'flex-start',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgb(0, 208, 255)',
  },
  viewContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 10,
    elevation: 10,
  },
})