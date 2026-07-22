import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Header, { useHeaderHeight } from '../../appDesign/header.js';
import { useAppTheme } from '../../logic/ThemeProvider';

export default function Donation() {
    const { colors } = useAppTheme();
    const headerHeight = useHeaderHeight();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.webviewContainer, { paddingTop: headerHeight }]}>
                <WebView 
                    source={{ uri: 'https://skr.bd/oceanmallik' }} 
                    style={styles.webview}
                />
            </View>
            <Header title="Donation" showBack={true} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webviewContainer: {
        flex: 1,
    },
    webview: {
        flex: 1,
    }
});