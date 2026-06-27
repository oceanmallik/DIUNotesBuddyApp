import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../logic/ThemeProvider';
import { Tree } from './texts';
import { IconSchool } from '@tabler/icons-react-native';

export const BentoLoader = ({ text = "Loading...", style = {} }) => {
    const { colors, activeTheme } = useAppTheme();
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(scaleAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
                    Animated.timing(scaleAnim, { toValue: 0.9, duration: 800, useNativeDriver: true }),
                ]),
                Animated.sequence([
                    Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                    Animated.timing(opacityAnim, { toValue: 0.5, duration: 800, useNativeDriver: true }),
                ])
            ])
        );
        pulse.start();

        return () => pulse.stop();
    }, []);

    return (
        <View style={[styles.container, style]}>
            <View style={[
                styles.box, 
                { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05
                }
            ]}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim, backgroundColor: colors.background, padding: 12, borderRadius: 16 }}>
                    <IconSchool size={40} color={colors.accent} />
                </Animated.View>
                <Tree title={text} style={{ marginTop: 20, color: colors.textSecondary }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 40,
        borderRadius: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 24,
        elevation: 2,
    },
    logo: {
        width: 48,
        height: 48,
        borderRadius: 12,
    }
});
