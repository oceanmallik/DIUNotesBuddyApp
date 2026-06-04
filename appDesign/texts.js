import { StyleSheet, Text } from 'react-native';

export const fonts = {
    regular: "SpaceGrotesk-Regular",
    bold: "SpaceGrotesk-Bold",
}

export function Planet ({ title, style }) {
    return (
        <Text style={[styles.globalStyle, styles.planet, style]}>{title}</Text>
    );
}

export function Mountain ({ title, style }) {
    return (
        <Text style={[styles.globalStyle, styles.mountain, style]}>{title}</Text>
    );
}

export function Tree ({ title, style }) {
    return (
        <Text style={[styles.globalStyle, styles.tree, style]}>{title}</Text>
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
        fontSize: 22,
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
})