import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export const fonts = {
    regular: 'SpaceGrotesk-Regular',
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
        borderRadius: 12,
        backgroundColor: '#1a1a1f',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.07)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        shadowColor: '#00778017',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 40,
    },
    buttonText: {
        fontFamily: fonts.regular,
        color: '#e8e8ea',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.4,
        textAlign: 'center',
    },
});