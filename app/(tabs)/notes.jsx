import { IconBackhoe, IconWorld } from '@tabler/icons-react-native'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { TitleCard } from '../../appDesign/cards.js'
import Header from '../../appDesign/header.js'

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

                    <Pressable onPress={() => Linking.openURL('https://diunotesbuddy.live/')}>
                        <TitleCard
                            title="Our Web Experience is works!"
                            description="Click Here to view the website instead"
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