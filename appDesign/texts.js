import { Linking, StyleSheet, Text } from 'react-native';

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

export function Leaf ({ title, style, linkURL }) {
    return (
        <Text style={[styles.leaf, style]}>
            {title} <Text onPress={() => Linking.openURL(linkURL)} style={styles.link}>Privacy Policy</Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    globalStyle: {
        color: 'white',
    },
    planet: {
        fontFamily: fonts.bold,
        fontSize: 23,
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
        textAlign: 'justify',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    leaf: {
        fontFamily: fonts.regular,
        fontSize: 12,
        textAlign: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
        color: 'grey',
    },
    link: {
        color: 'grey',
        textDecorationLine: 'underline',
    },
})