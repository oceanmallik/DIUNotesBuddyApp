import { IconBackhoe, IconSend } from '@tabler/icons-react-native';
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
              onPress={() => router.push('https://github.com/oceanmallik/DIUNotesBuddyApp/issues')}
              title="Report an Issue"
            />
          </View>

          <Planet title="Steps to Contribute" style={{ textAlign: 'center', marginTop: 30 }} />

          <TitleCard
            title="Under Development"
            description="We are currently working on making the contribution process more seamless and integrated within the app. Stay tuned for updates!"
            icon={IconBackhoe}
          />

          <View style={[styles.buttonsContainer, { marginTop: 20 }]}>
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