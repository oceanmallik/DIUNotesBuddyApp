import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated, Linking, Pressable, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '../logic/ThemeProvider';

export const fonts = {
    regular: 'SpaceGrotesk-Regular',
    bold: 'SpaceGrotesk-Bold',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppButton({ link, title, onPress, style }) {
    const router = useRouter();
    const { colors, activeTheme } = useAppTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    const handlePress = () => {
        if (onPress) {
            onPress();
            return;
        }
        if (link) {
            if (link.startsWith('http')) {
                Linking.openURL(link);
            } else {
                router.push(link);
            }
        }
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
        <AnimatedPressable
            style={[
                styles.button,
                { 
                    backgroundColor: colors.card,
                    borderColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    transform: [{ scale: scaleAnim }],
                    shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
                },
                style
            ]} 
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Text style={[
                styles.buttonText, 
                { color: colors.accent }
            ]}>
                {title}
            </Text>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 16,
        marginHorizontal: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16, // Matches the Bento cards perfectly
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    buttonText: {
        fontFamily: fonts.bold,
        fontSize: 15,
        letterSpacing: 0.2,
        textAlign: 'center',
    },
});