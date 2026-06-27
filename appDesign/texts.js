import { Linking, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '../logic/ThemeProvider';

export const fonts = {
    regular: "SpaceGrotesk-Regular",
    bold: "SpaceGrotesk-Bold",
}

export function Planet({ title, style }) {
    const { colors } = useAppTheme();
    return (
        <Text style={[styles.planet, { color: colors.textPrimary }, style]}>{title}</Text>
    );
}

export function Mountain({ title, style }) {
    const { colors } = useAppTheme();
    return (
        <Text style={[styles.mountain, { color: colors.textPrimary }, style]}>{title}</Text>
    );
}

export function Tree({ title, style }) {
    const { colors } = useAppTheme();
    return (
        <Text style={[styles.tree, { color: colors.textSecondary }, style]}>{title}</Text>
    );
}

export function Leaf({ title, style, linkURL }) {
    const { colors } = useAppTheme();
    return (
        <Text style={[styles.leaf, { color: colors.textSecondary }, style]}>
            {title} {linkURL && <Text onPress={() => Linking.openURL(linkURL)} style={[styles.link, { color: colors.accent }]}>Privacy Policy</Text>}
        </Text>
    );
}

const styles = StyleSheet.create({
    planet: {
        fontFamily: fonts.bold,
        fontSize: 24,
        textAlign: 'left',
        marginHorizontal: 16,
        marginVertical: 12,
        letterSpacing: 0.5,
    },
    mountain: {
        fontFamily: fonts.bold,
        fontSize: 20,
        textAlign: 'left',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    tree: {
        fontFamily: fonts.regular,
        fontSize: 15,
        textAlign: 'left',
        marginHorizontal: 16,
        marginVertical: 6,
        lineHeight: 22,
    },
    leaf: {
        fontFamily: fonts.regular,
        fontSize: 13,
        textAlign: 'center',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    link: {
        // dynamic color added via prop
    },
});