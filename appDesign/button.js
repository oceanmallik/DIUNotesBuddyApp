import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export const fonts = {
    regular: 'SpaceGrotesk-Regular',
};

export function AppButton({ link, title }) {
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
    buttonExternal: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1f',
        borderWidth: 1,
        borderColor: 'rgba(133, 20, 20, 0.44)',
        borderRadius: 8,
        padding: 12,
        shadowColor: '#00778017',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 100,
        marginHorizontal: 16,
        marginVertical: 8,
        gap: 12,
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: fonts.regular,
        color: '#e8e8ea',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.4,
        textAlign: 'center',
    },
    buttonTextExternal: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.4,
        textAlign: 'center',
    },
});