import { StyleSheet, Text } from 'react-native';

export const fonts = {
    regular: "SpaceGrotesk-Regular",
    bold: "SpaceGrotesk-Bold",
}

export function Planet ({ title }) {
    return (
        <Text style={[styles.globalStyle, styles.planet]}>{title}</Text>
    );
}

export function Tree ({ title }) {
    return (
        <Text style={[styles.globalStyle, styles.tree]}>{title}</Text>
    );
}

const styles = StyleSheet.create({
    globalStyle: {
        color: 'white',
    },
    planet: {
        fontFamily: fonts.bold,
        fontSize: 22,
        textAlign: 'left',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    mountain: {
        fontFamily: fonts.regular,
        fontSize: 18,
        textAlign: 'left',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    tree: {
        fontFamily: fonts.regular,
        fontSize: 14,
        textAlign: 'left',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    branch: {
        fontFamily: fonts.regular,
        fontSize: 12,
        textAlign: 'left',
        marginHorizontal: 20,
        marginVertical: 10,
    }
})