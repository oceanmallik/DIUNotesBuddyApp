import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export const fonts = {
    regular: "PlaywriteGBJ-Regular",
}

export default function AppButton({ link, title }) {
    return (
        <Link style={styles.linkButton} href={link} asChild>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>{title}</Text>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 25,
        borderRadius: 28,
        backgroundColor: 'rgba(17, 24, 39, 0.92)',
        paddingVertical: 14,
        paddingHorizontal: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.18)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonText: {
        fontFamily: fonts.regular,
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    linkButton: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 20,
        minWidth: 50,
    },
})
