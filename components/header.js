import topBarBackground from "@/assets/images/topBarBackground.png";
import { ImageBackground, StyleSheet, Text } from 'react-native';

export default function Header({ title }) {
    return (
        <ImageBackground source={topBarBackground} style={styles.topBar}>
            <Text style={styles.title}>{title}</Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        flex: 0.13,
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
        textAlign: 'center',
        paddingTop: 36,
        paddingBottom: 20,
    },
})