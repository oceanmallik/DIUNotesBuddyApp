import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { IconSend } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppButton } from '../../appDesign/button.js';
import { TitleCard, TitleCardLinked } from '../../appDesign/cards.js';
import Header from '../../appDesign/header.js';
import { Planet, Tree } from '../../appDesign/texts.js';

const Contribute = () => {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container}>

      <View style={styles.bg}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: 90, paddingBottom: tabBarHeight + 20 }]}
          showsVerticalScrollIndicator={false}>

          
          <TitleCard
            title="Your Contribution Matters"
            description="Every note you share, every error you report, helps build a stronger, more helpful resource for all DIU students. "
            icon={IconSend}
          />

          <Tree title="Ready to contribute? Click the button below to get started! Make sure you are logged in with your university provided @diu.edu.bd account." />

          <TitleCardLinked
            title="Click Here to Contribute Notes"
            icon={IconSend}
            link="/Submit"
          />

          <View style={styles.buttonsContainer}>
            <AppButton
              onPress={() => router.push('/login')}
              title="Click to Login"
            />
            <AppButton
              onPress={() => router.push('mailto:oceanmallik@oceanmallik.com')}
              title="Need Assistance?"
            />
          </View>

          <Planet title="How to Contribute?" style={{ textAlign: 'center', marginTop: 10, marginBottom: 2 }} />

          <Image source={require('../../assets/images/tom_meme.png')} style={[styles.meme, { height: 250, marginTop: 5 }]} />

          <Tree title="1. Click the 'Contribute Notes' button above to submit your notes or report any issues you find." />
          <Image source={'https://raw.githubusercontent.com/AxiomVessel/DIUNotesBuddyWeb/refs/heads/main/webAssets/submission3.jpg'} style={[styles.picture, { height: 85 }]} />
          <Tree title="2. Fill out the contribution form with the required details." />
          <Image source={'https://raw.githubusercontent.com/AxiomVessel/DIUNotesBuddyWeb/refs/heads/main/webAssets/submission2.jpg'} style={[styles.picture, { height: 280 }]} />
          <Tree title="3. Add a topic first, then attach your notes in .pdf format." />
          <Image source={'https://raw.githubusercontent.com/AxiomVessel/DIUNotesBuddyWeb/refs/heads/main/webAssets/submission1.jpg'} style={[styles.picture, { height: 330 }]} />
          <Tree title="4. Submit your contribution and our team will review it as soon as possible." />
          <Tree title="[ Note: If your contribution is approved, it will be added to our library for all students to access! For any questions or if you need assistance, feel free to reach out to us by clicking the 'Get Help or Report' button above. ]" />

          <View style={[styles.buttonsContainer, { marginTop: 1 }]}>
            <AppButton
              onPress={() => router.push('/Admin')}
              title="Admin Portal (Admins Only)"
            />
          </View>

          <Tree title="If you are an admin, you can access admin portal clicking the button above." />
          <Tree title="Want to become an admin? Mail any of our team members to become an admin and help us review contributions faster!" />

        </ScrollView>
      </View>

      <Header title="Want to become a part?" />
    </View>
  )
}

export default Contribute

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  bg: {
    flex: 1,
    width: '100%',
    backgroundColor: '#131313',
  },
  MemeView: {
    resizeMode: 'contain',
    paddingTop: 20,
    margin: 20,
  },
  picture: {
    width: '85%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 146, 0.51)',
    borderRadius: 5,
    opacity: 0.7,
  },
  meme: {
    width: '95%',
    marginTop: 20,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'rgba(143, 0, 0, 0.43)',
    borderRadius: 5,
    opacity: 0.8,
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
    marginTop: -8,
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