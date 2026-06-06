import { ScrollView, StyleSheet, View } from 'react-native'
import Header from '../../appDesign/header.js'
import { Planet } from '../../appDesign/texts.js'

const Notes = () => {
    return (
        <View style={styles.container}>
            <Header title="Notes" />
            <View style={styles.bg}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Planet title="Notes are on the way, stay tuned!" style={{ textAlign: 'center', marginTop: 20 }} />
                
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