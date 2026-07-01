import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header, { useHeaderHeight } from '../../appDesign/header';
import { useAppTheme } from '../../logic/ThemeProvider';

export default function OceanVault() {
    const { colors } = useAppTheme();
    const headerHeight = useHeaderHeight();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Ocean's Secret Vault" showBack />
            <View style={[styles.content, { paddingTop: headerHeight + 20 }]}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Welcome to the Vault!
                </Text>
                <Text style={[styles.message, { color: colors.textSecondary }]}>
                    This page is work-in-progress mode!
                </Text>
            </View>
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
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Regular',
        textAlign: 'center',
        lineHeight: 24,
    }
});
