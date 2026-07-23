import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Header, { useHeaderHeight } from '../../appDesign/header.js';
import { useAppTheme } from '../../logic/ThemeProvider';
import { useLocalSearchParams } from 'expo-router';

export default function Browser() {
    const { colors } = useAppTheme();
    const headerHeight = useHeaderHeight();
    const params = useLocalSearchParams();
    
    // Default to Google if no URL is provided
    let targetUrl = 'https://www.google.com';
    if (params.url) {
        targetUrl = Array.isArray(params.url) ? params.url[0] : params.url;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.webviewContainer, { paddingTop: headerHeight }]}>
                <WebView 
                    source={{ uri: targetUrl }} 
                    style={styles.webview}
                />
            </View>
            <Header title="Browser" showBack={true} />
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
