import { IconArrowLeft } from '@tabler/icons-react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';

const PdfViewer = () => {
    const { url, title } = useLocalSearchParams();
    const router = useRouter();

    const pdfSource = { 
        uri: typeof url === 'string' ? url : '', 
        cache: true 
    };

    if (!url) {
        return (
            <View style={styles.container}>
                <View style={styles.customHeader}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <IconArrowLeft color="#FFFFFF" size={28} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Error</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No document URL was provided.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Ensures the default Expo navigation header is hidden */}
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Custom Minimal Header */}
            <View style={styles.customHeader}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconArrowLeft color="#FFFFFF" size={28} />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                    {typeof title === 'string' ? title : "Reading Note"}
                </Text>
            </View>
            
            {/* PDF Viewer */}
            <View style={styles.pdfContainer}>
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
                        <ActivityIndicator color="#00D0FF" size="large" />
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
        backgroundColor: '#131313',
    },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50, // Pushes it down past the phone's status bar
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: '#131313',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backButton: {
        marginRight: 16,
        padding: 4, // Adds a slightly larger tap area for the user
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        flex: 1, // Ensures the text takes up remaining space and cuts off cleanly
        fontFamily: 'SpaceGrotesk-Bold', // Feel free to remove if you aren't using this font here
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
        backgroundColor: '#1E1E1E',
    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    }
});