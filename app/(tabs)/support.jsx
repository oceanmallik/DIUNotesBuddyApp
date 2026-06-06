import { IconBookUpload, IconServer, IconUsersGroup } from '@tabler/icons-react-native'
import { ScrollView, StyleSheet, View } from 'react-native'
import { AppButtonExternal } from '../../appDesign/button.js'
import { TitleCard } from '../../appDesign/cards.js'
import Header from '../../appDesign/header.js'
import { Planet, Tree } from '../../appDesign/texts.js'

const SupportUs = () => {
    return (
        <View style={styles.container}>
            <Header title="Support Us" />

            <View style={styles.bg}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Planet title="Help Us Keep the Lights On" style={{ textAlign: 'center' }} />
                    <Tree title="DIU Notes Buddy is free and open for everyone. Your donation keeps our servers running and helps us expand resources for students." />

                    <Planet title="Why Your Support Matters" style={{ textAlign: 'center' }} />
                    <TitleCard
                        title="Reliable Hosting"
                        description="Keeps our platform fast and available 24/7 for all students."
                        icon={IconServer}
                    />

                    <TitleCard
                        title="New Content"
                        description="Enables us to add more courses, subjects, and resources."
                        icon={IconBookUpload}
                    />

                    <TitleCard
                        title="Community Growth"
                        description="Supports contributors and builds a stronger learning community."
                        icon={IconUsersGroup}
                    />
                    
                    <Planet title="How to Support US" style={{ textAlign: 'center' }} />
                    <Tree title="You can support us by sharing our app with your friends, providing feedback, donating, making a payment via google play store or even watching a small ad to help us grow and improve." />

                    <AppButtonExternal title="Watch an Ad" location="/ads" />

                </ScrollView>
            </View>
        </View>
    )
}

export default SupportUs

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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 2,
        paddingVertical: 10,
        justifyContent: 'flex-start',
    },
})