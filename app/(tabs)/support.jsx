import { IconBadgeAd, IconBookUpload, IconQrcode, IconServer, IconUsersGroup } from '@tabler/icons-react-native'
import { ScrollView, StyleSheet, View } from 'react-native'
import { TitleCard, TitleCardLinked } from '../../appDesign/cards.js'
import Header from '../../appDesign/header.js'
import { Planet, Tree } from '../../appDesign/texts.js'

const SupportUs = () => {
    return (
        <View style={styles.container}>
            <Header title="Help Us Keep the Lights On" />

            <View style={styles.bg}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                    
                    <Planet title="How to Support Us" style={{ textAlign: 'center' }} />
                    <Tree title="You can support us by sharing our app with your friends, providing feedback, donating, making a payment via google play store or even watching a small ad to help us grow and improve." />
                    <Tree title="Click the methods below to support us:" />

                    <TitleCardLinked
                        title="Watch an Ad to Support Us (Free)"
                        icon={IconBadgeAd}
                        link="/ads"
                    />
                    <TitleCardLinked
                        title="Donate via bKash (Donation)"
                        icon={IconQrcode}
                        link="/bKash"
                    />
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