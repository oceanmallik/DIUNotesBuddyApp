import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated, Linking, Pressable, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '../logic/ThemeProvider';

export const fonts = {
    regular: 'SpaceGrotesk-Regular',
    bold: 'SpaceGrotesk-Bold',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppButton({ link, title, onPress, style, variant = 'primary', icon: Icon }) {
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

    let bgColor = colors.accent;
    let textColor = activeTheme === 'dark' ? colors.background : '#FFFFFF';
    let borderColor = 'transparent';
    let shadowOpacity = activeTheme === 'dark' ? 0.3 : 0.15;
    let elevation = 3;

    if (variant === 'secondary') {
        bgColor = colors.card;
        textColor = colors.textPrimary;
        borderColor = activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
        shadowOpacity = activeTheme === 'dark' ? 0.2 : 0.05;
        elevation = 1;
    } else if (variant === 'tertiary') {
        bgColor = 'transparent';
        textColor = colors.textSecondary;
        borderColor = 'transparent';
        shadowOpacity = 0;
        elevation = 0;
    }

    return (
        <AnimatedPressable
            style={[
                styles.button,
                { 
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    borderWidth: variant === 'secondary' ? 1 : 0,
                    transform: [{ scale: scaleAnim }],
                    shadowOpacity: shadowOpacity,
                    elevation: elevation,
                    flexDirection: 'row',
                    gap: 8,
                },
                style
            ]} 
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            {Icon && <Icon size={20} color={textColor} />}
            <Text style={[
                styles.buttonText, 
                { color: textColor }
            ]}>
                {title}
            </Text>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 100, // Pill shape for modern premium feel
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 3,
    },
    buttonText: {
        fontFamily: fonts.bold,
        fontSize: 14,
        letterSpacing: 0.3,
        textAlign: 'center',
    },
});