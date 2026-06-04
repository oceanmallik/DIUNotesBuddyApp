import topBarBackground from "@/assets/images/topBarBackground.png";
import { ImageBackground, StyleSheet, Text } from 'react-native';

export const fonts = {
    bold: "Cause-Bold",
}

export default function Header({ title }) {
    return (
        <ImageBackground source={topBarBackground} style={styles.topBar}>
            <Text style={styles.galaxy}>{title}</Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        flex: 0.13,
        justifyContent: 'center',
    },
    galaxy: {
        color: 'white',
        fontSize: 30,
        fontFamily: fonts.bold,
        textAlign: 'center',
        paddingTop: 36,
        paddingBottom: 20,
    },
})