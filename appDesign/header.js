import topBarBackground from "@/assets/images/topBarBackground.png";
import { ImageBackground, StyleSheet, Text } from 'react-native';

export const fonts = {
    bold: "SpaceGrotesk-Bold",
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
        flex: 0.10,
        justifyContent: 'center',
    },
    galaxy: {
        color: 'white',
        fontSize: 26,
        fontFamily: fonts.bold,
        textAlign: 'center',
        paddingTop: 26,
        paddingBottom: 6,
    },
})