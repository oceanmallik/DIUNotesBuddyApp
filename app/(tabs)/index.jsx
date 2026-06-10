import appLogo from "@/assets/images/android-icon-foreground.png"
import { IconBrandGithub, IconWorld } from '@tabler/icons-react-native'
import { Alert, Image, Linking, Pressable, StyleSheet, View } from 'react-native'
import { AppButton } from '../../appDesign/button.js'
import { TitleCard } from '../../appDesign/cards.js'
import { Mountain, Planet, Tree } from '../../appDesign/texts.js'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../logic/AuthProvider'

const app = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      Alert.alert("Success", "You have been logged out.");
      
    } catch (err) {
      Alert.alert("Logout Error", err.message);
    }
  };

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
              description="Click Here to view the repository"
              icon={IconBrandGithub}
            />
          </Pressable>
        </View>

        <View style={styles.viewContainer}>
          {!user ? (
            <AppButton
              link="/login"
              title="Login"
            />
          ) : (
            <View style={styles.loggedInActions}>
              <Tree title={`Logged in as: \n${user.email}`} style={styles.emailText} />

              <AppButton
                title="Log Out"
                onPress={handleLogout}
                style={{ alignSelf: 'flex-end' }} 
              />
            </View>
          )}
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
    alignSelf: 'flex-start',
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
  loggedInActions: {
    alignItems: 'flex-end',
    gap: 15,
  },
  emailText: {
    textAlign: 'right',
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: -5,
  }
})