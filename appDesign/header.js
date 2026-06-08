import { StyleSheet, Text, View } from 'react-native';

export const fonts = {
    bold: "SpaceGrotesk-Bold",
}

export default function Header({ title }) {
    return (
        <View style={styles.topBar}>
            <Text style={styles.galaxy}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        flex: 0.10,
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
    },
    galaxy: {
        color: 'white',
        fontSize: 22,
        fontFamily: fonts.bold,
        textAlign: 'center',
        paddingTop: 26,
        paddingBottom: 6,
    },
})