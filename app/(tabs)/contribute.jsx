import { IconSend } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppButton } from '../../appDesign/button.js';
import { TitleCard } from '../../appDesign/cards.js';
import Header from '../../appDesign/header.js';
import { Planet, Tree } from '../../appDesign/texts.js';

const Contribute = () => {
  const router = useRouter(); 

  return (
    <View style={styles.container}>

      <Header title="Want to become a part?" />

      <View style={styles.bg}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <Tree title="Add your notes, fix broken resources, and help make the study library more complete for other DIU students." />

          <TitleCard
            title="Your Contribution Matters"
            description="Every note you share, every error you report, helps build a stronger, more helpful resource for all DIU students. "
            icon={IconSend}
          />

          <Tree title="Ready to contribute? Click the button below to get started! Make sure you are logged in with your university provided @diu.edu.bd account." />

          <View style={styles.buttonsContainer}>
            <AppButton
              onPress={() => router.push('/Submit')}
              title="Contribute Notes"
            />
            <AppButton
              onPress={() => router.push('mailto:oceanmallik@oceanmallik.com')}
              title="Get Help or Report"
            />
          </View>

          <Planet title="How to Contribute?" style={{ textAlign: 'center', marginTop: 30 }} />

          <Tree title="1. Click the 'Contribute Notes' button above to submit your notes or report any issues you find." />
          <Tree title="2. Fill out the contribution form with the required details and attach your notes or screenshots of the issue." />
          <Tree title="3. Submit your contribution and our team will review it as soon as possible." />
          <Tree title="4. If your contribution is approved, it will be added to our library for all students to access!" />
          <Tree title="5. For any questions or if you need assistance, feel free to reach out to us by clicking the 'Get Help or Report' button above." />

          <View style={[styles.buttonsContainer, { marginTop: 1 }]}>
            <AppButton
              onPress={() => router.push('/Admin')}
              title="Admin Portal (Admins Only)"
            />
          </View>

        </ScrollView>
      </View>
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
    marginTop: -15,
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