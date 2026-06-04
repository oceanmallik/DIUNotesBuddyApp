import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export const fonts = {
    regular: 'PlaywriteGBJ-Regular',
};

export default function AppButton({ link, title }) {
    return (
        <Link href={link} asChild>
            <Pressable
                style={styles.button}
                android_ripple={{ color: 'transparent' }}
            >
                <Text style={styles.buttonText}>{title}</Text>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 16,
        marginHorizontal: 8,
        paddingVertical: 4,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.44)',
        borderWidth: 1.5,
        borderColor: 'rgba(0,212,255,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        shadowColor: 'rgba(0, 212, 255, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 100,
    },
    buttonText: {
        fontFamily: fonts.regular,
        color: '#00d4ff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.4,
        textAlign: 'center',
    },
});