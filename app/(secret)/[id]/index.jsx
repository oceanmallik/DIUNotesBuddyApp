import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
            router.replace(`/(secret)/${id}/message`);
        } else {
            Alert.alert("Access Denied", "Incorrect secret code.");
            setCode('');
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
                
                <TextInput
                    style={[styles.input, { 
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.textPrimary
                    }]}
                    value={code}
                    onChangeText={setCode}
                    placeholder="Enter code..."
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                    onSubmitEditing={handleSubmit}
                    autoCapitalize="none"
                />
                
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
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
        textAlign: 'center',
        marginBottom: 30,
        letterSpacing: 2,
    },
    errorText: {
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
    }
});
