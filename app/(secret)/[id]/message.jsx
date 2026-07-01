import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { secretConfig } from '../config';
import Header, { useHeaderHeight } from '../../../appDesign/header';
import { useAppTheme } from '../../../logic/ThemeProvider';

export default function SecretMessage() {
    const { id } = useLocalSearchParams();
    const { colors } = useAppTheme();
    const headerHeight = useHeaderHeight();

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

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={config.title || "Secret Message"} showBack />
            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 40 }]}>
                <Text style={[styles.messageText, { color: colors.textPrimary }]}>
                    {config.message}
                </Text>
            </ScrollView>
        </View>
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
        padding: 24,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    messageText: {
        fontSize: 20,
        fontFamily: 'SpaceGrotesk-Regular',
        lineHeight: 30,
        textAlign: 'center',
    }
});
