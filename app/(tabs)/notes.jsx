import { IconBackhoe, IconWorld } from '@tabler/icons-react-native'
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { TitleCard } from '../../appDesign/cards.js'
import Header from '../../appDesign/header.js'
import { Tree } from '../../appDesign/texts.js'

const Notes = () => {
    return (
        <View style={styles.container}>
            <Header title="Notes Explorer" />
            <View style={styles.bg}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <TitleCard
                        title="Under Development"
                        description="We are currently working on making the contribution process more seamless and integrated within the app. Stay tuned for updates!"
                        icon={IconBackhoe}
                    />

                    <Tree title="In the meantime, you can access all the notes on our website!" style={{ textAlign: 'center', marginVertical: 20 }} />

                    <Pressable onPress={() => Linking.openURL('https://diunotesbuddy.live/notes/')}>
                        <TitleCard
                            title="Click Here to View Notes (Web)"
                            description="www.diunotesbuddy.live/notes"
                            icon={IconWorld}
                        />
                    </Pressable>

                </ScrollView>
            </View>
        </View>
    )
}

export default Notes

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