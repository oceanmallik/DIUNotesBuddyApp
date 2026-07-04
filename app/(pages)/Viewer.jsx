import { IconArrowLeft, IconDownload, IconCheck } from '@tabler/icons-react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAppTheme } from '../../logic/ThemeProvider';
import { OfflineManager } from '../../logic/OfflineManager';

const PdfViewer = () => {
    const { url, title, subject } = useLocalSearchParams();
    const router = useRouter();
    const { colors, activeTheme } = useAppTheme();

    const [localUri, setLocalUri] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    useEffect(() => {
        if (typeof url === 'string') {
            OfflineManager.getLocalUri(url).then(uri => {
                if (uri) {
                    setLocalUri(uri);
                    setIsDownloaded(true);
                    setDownloadProgress(1);
                }
            });
        }
    }, [url]);

    // Visually satisfying fake download progress
    useEffect(() => {
        let interval;
        if (isDownloading) {
            setDownloadProgress(0);
            interval = setInterval(() => {
                setDownloadProgress(prev => {
                    if (prev >= 0.92) return prev; 
                    return prev + 0.04; 
                });
            }, 100);
        } else if (isDownloaded) {
            setDownloadProgress(1);
        }
        return () => clearInterval(interval);
    }, [isDownloading, isDownloaded]);

    const handleDownload = async () => {
        if (isDownloaded || isDownloading || typeof url !== 'string') return;
        setIsDownloading(true);
        const success = await OfflineManager.downloadNote(
            url, 
            typeof title === 'string' ? title : 'Saved Note',
            typeof subject === 'string' ? subject : 'Uncategorized'
        );
        if (success) {
            setIsDownloaded(true);
            const uri = await OfflineManager.getLocalUri(url);
            if (uri) setLocalUri(uri);

            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        }
        setIsDownloading(false);
    };

    const pdfSource = { 
        uri: localUri ? localUri : (typeof url === 'string' ? url : ''), 
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

    const headerMarginTop = useRef(new Animated.Value(0)).current;
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastPage = useRef(1);
    const lastTouchY = useRef(0);

    const hideHeader = () => {
        if (!isHeaderVisible) return;
        setIsHeaderVisible(false);
        Animated.timing(headerMarginTop, {
            toValue: -100, // Move up by 100 to hide
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    const showHeader = () => {
        if (isHeaderVisible) return;
        setIsHeaderVisible(true);
        Animated.timing(headerMarginTop, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    const handleTouchStart = (e) => {
        lastTouchY.current = e.nativeEvent.pageY;
    };

    const handleTouchMove = (e) => {
        const currentY = e.nativeEvent.pageY;
        const diff = currentY - lastTouchY.current;

        if (diff < -15 && isHeaderVisible) { // Swiping up (scrolling down)
            hideHeader();
        } else if (diff > 15 && !isHeaderVisible) { // Swiping down (scrolling up)
            showHeader();
        }
        lastTouchY.current = currentY;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <Animated.View style={[
                styles.customHeader, 
                { backgroundColor: colors.background, borderBottomColor: colors.border, marginTop: headerMarginTop }
            ]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconArrowLeft color={colors.textPrimary} size={28} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.textPrimary, flex: 1, paddingRight: 8 }]} numberOfLines={1} ellipsizeMode="tail">
                    {typeof title === 'string' ? title : "Reading Note"}
                </Text>
                {typeof url === 'string' && (
                    <Pressable onPress={handleDownload} style={{ padding: 8, marginLeft: 'auto' }}>
                        {isDownloading ? (
                            <Text style={{ color: colors.accent, fontFamily: 'SpaceGrotesk-Bold', fontSize: 14 }}>
                                {Math.round(downloadProgress * 100)}%
                            </Text>
                        ) : isDownloaded ? (
                            <IconCheck color={colors.accent} size={24} />
                        ) : (
                            <IconDownload color={colors.textPrimary} size={24} />
                        )}
                    </Pressable>
                )}
            </Animated.View>
            
            <View
                style={[styles.pdfContainer, { backgroundColor: colors.card }]}
                collapsable={false}
                renderToHardwareTextureAndroid={true}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
            >
                <Pdf
                    trustAllCerts={false}
                    source={pdfSource}
                    onLoadComplete={(numberOfPages) => {
                        console.log(`Document loaded successfully with ${numberOfPages} pages.`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page}/${numberOfPages}`);
                        if (page > lastPage.current) {
                            hideHeader();
                        } else if (page < lastPage.current) {
                            showHeader();
                        }
                        lastPage.current = page;
                    }}
                    onPageSingleTap={(page, x, y) => {
                        if (isHeaderVisible) hideHeader();
                        else showHeader();
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

            {(isDownloading || showSuccessToast) && (
                <View style={[styles.downloadToast, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.1 }]}>
                    <Text style={[styles.toastTitle, { color: showSuccessToast ? '#34C759' : colors.textPrimary }]}>
                        {showSuccessToast ? "Downloaded to Offline Library!" : "Downloading to Offline Library..."}
                    </Text>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressBarFill, { backgroundColor: showSuccessToast ? '#34C759' : colors.accent, width: `${Math.max(5, downloadProgress * 100)}%` }]} />
                    </View>
                    <Text style={[styles.toastPercentage, { color: colors.textSecondary }]}>
                        {Math.round(downloadProgress * 100)}%
                    </Text>
                </View>
            )}
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
    },
    downloadToast: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 5,
    },
    toastTitle: {
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 12,
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    toastPercentage: {
        fontSize: 12,
        fontFamily: 'SpaceGrotesk-Regular',
        marginTop: 8,
        textAlign: 'right',
    }
});