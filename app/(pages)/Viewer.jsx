import { IconArrowLeft } from '@tabler/icons-react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAppTheme } from '../../logic/ThemeProvider';
import { OfflineManager } from '../../logic/OfflineManager';

const PdfViewer = () => {
    const params = useLocalSearchParams();
    const url = Array.isArray(params.url) ? params.url[0] : params.url;
    const title = Array.isArray(params.title) ? params.title[0] : params.title;
    const router = useRouter();
    const { colors } = useAppTheme();

    const [localUri, setLocalUri] = useState(null);
    const [isCheckingLocal, setIsCheckingLocal] = useState(true);

    useEffect(() => {
        if (typeof url === 'string') {
            OfflineManager.getLocalUri(url).then(uri => {
                if (uri) {
                    setLocalUri(uri);
                }
                setIsCheckingLocal(false);
            }).catch(() => {
                setIsCheckingLocal(false);
            });
        } else {
            setIsCheckingLocal(false);
        }
    }, [url]);

    const pdfSource = { 
        uri: localUri ? localUri : (typeof url === 'string' ? url : ''), 
        cache: true 
    };

    const headerMarginTop = useRef(new Animated.Value(0)).current;
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastPage = useRef(1);
    const lastTouchY = useRef(0);

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
            </Animated.View>
            
            <View
                style={[styles.pdfContainer, { backgroundColor: colors.card }]}
                collapsable={false}
                renderToHardwareTextureAndroid={true}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
            >
                {isCheckingLocal ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator color={colors.accent} size="large" />
                    </View>
                ) : (
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
                )}
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