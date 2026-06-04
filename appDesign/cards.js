import { StyleSheet, Text } from 'react-native';

export const fonts = {
    regular: "SpaceGrotesk-Regular",
    bold: "SpaceGrotesk-Bold",
}

export function NameCard ({ title, style}) {
    return (
        <Text style={[styles.description, style]}>{title}</Text>
    );
}

const styles = StyleSheet.create({
    description: {
        fontFamily: fonts.regular,
        fontSize: 14,
        textAlign: 'left',
        marginHorizontal: 20,
        marginVertical: 10,
        color: 'white',
    }
})