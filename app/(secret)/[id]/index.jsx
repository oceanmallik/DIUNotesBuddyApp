import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { secretConfig } from '../config';
import Header, { useHeaderHeight } from '../../../appDesign/header';
import { AppButton } from '../../../appDesign/button';
import { useAppTheme } from '../../../logic/ThemeProvider';

export default function SecretEntry() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useAppTheme();
    const headerHeight = useHeaderHeight();
    
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const config = secretConfig[id];

    if (!config) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Unknown Area" showBack />
                <View style={[styles.content, { paddingTop: headerHeight + 20 }]}>
                    <Text style={[styles.errorText, { color: colors.textPrimary }]}>
                        You wandered into an unknown area...
                    </Text>
                </View>
            </View>
        );
    }

    const handleSubmit = () => {
        if (code === config.code) {
            setError('');
            router.replace(config.route);
        } else {
            setError(`Ask for a personal secret code from ${id}`);
            setCode('');
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
            ]).start();
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <Header title="Secret Tunnel" showBack />
            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 50 }]}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Enter Secret Code</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    You have found the secret tunnel for {id}. Enter the code to proceed.
                </Text>
                
                <Animated.View style={{ transform: [{ translateX: shakeAnim }], width: '100%', marginBottom: 30 }}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: colors.card,
                                borderColor: error ? colors.destructive : colors.border,
                                color: colors.textPrimary,
                            }]}
                            value={code}
                            onChangeText={(text) => {
                                setCode(text);
                                if (error) setError('');
                            }}
                            placeholder="Enter code..."
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry={!isPasswordVisible}
                            onSubmitEditing={handleSubmit}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon} 
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            <Ionicons 
                                name={isPasswordVisible ? "eye-off" : "eye"} 
                                size={24} 
                                color={colors.textSecondary} 
                            />
                        </TouchableOpacity>
                    </View>
                    {error ? (
                        <Text style={[styles.inlineError, { color: colors.destructive }]}>{error}</Text>
                    ) : null}
                </Animated.View>
                
                <AppButton title="Unlock" onPress={handleSubmit} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Regular',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        paddingRight: 50,
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
        textAlign: 'center',
        letterSpacing: 2,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    inlineError: {
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Bold',
        textAlign: 'center',
        marginTop: 4,
    },
    errorText: {
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
    }
});
