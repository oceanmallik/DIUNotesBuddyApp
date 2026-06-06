import backgroundImage from "@/assets/images/backgroundBlue.png"
import { ImageBackground } from 'expo-image'
import { ScrollView, StyleSheet, View } from 'react-native'
import Header from '../../appDesign/header.js'
import { Planet } from '../../appDesign/texts.js'

const Notes = () => {
    return (
        <View style={styles.container}>
            <Header title="Notes" />
            <ImageBackground source={backgroundImage} style={styles.image}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Planet title="Notes are on the way, stay tuned!" style={{ textAlign: 'center', marginTop: 20 }} />
                
                </ScrollView>
            </ImageBackground>
        </View>
    )
}

export default Notes

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    image: {
        flex: 1,
        width: '100%',
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