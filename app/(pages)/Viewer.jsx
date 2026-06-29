import { IconArrowLeft } from '@tabler/icons-react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAppTheme } from '../../logic/ThemeProvider';

const PdfViewer = () => {
    const { url, title } = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useAppTheme();

    const pdfSource = { 
        uri: typeof url === 'string' ? url : '', 
        cache: true 
    };

    if (!url) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.customHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <IconArrowLeft color={colors.textPrimary} size={28} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Error</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No document URL was provided.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={[styles.customHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconArrowLeft color={colors.textPrimary} size={28} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1} ellipsizeMode="tail">
                    {typeof title === 'string' ? title : "Reading Note"}
                </Text>
            </View>
            
            <View
                style={[styles.pdfContainer, { backgroundColor: colors.card }]}
                collapsable={false}
                renderToHardwareTextureAndroid={true}
            >
                <Pdf
                    trustAllCerts={false}
                    source={pdfSource}
                    onLoadComplete={(numberOfPages) => {
                        console.log(`Document loaded successfully with ${numberOfPages} pages.`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page}/${numberOfPages}`);
                    }}
                    onError={(error) => {
                        console.log("PDF Rendering Error:", error);
                    }}
                    style={styles.pdf}
                    renderActivityIndicator={() => (
                        <ActivityIndicator color={colors.accent} size="large" />
                    )}
                />
            </View>
        </View>
    );
};

export default PdfViewer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        flex: 1,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#FF5252',
        fontSize: 16,
    },
    pdfContainer: {
        flex: 1,
        width: '100%',
    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    }
});