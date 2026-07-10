import { IconArrowLeft, IconX } from '@tabler/icons-react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAppTheme } from '../../logic/ThemeProvider';
import { OfflineManager } from '../../logic/OfflineManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PdfViewer = () => {
    const params = useLocalSearchParams();
    const rawUrl = Array.isArray(params.url) ? params.url[0] : params.url;
    // expo-router decodes the URL, turning %20 into spaces. Re-encode to fix PDF fetching & OfflineManager matching.
    const url = typeof rawUrl === 'string' ? encodeURI(rawUrl) : rawUrl;
    const title = Array.isArray(params.title) ? params.title[0] : params.title;
    const router = useRouter();
    const { colors } = useAppTheme();

    const [localUri, setLocalUri] = useState(null);
    const [isCheckingLocal, setIsCheckingLocal] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [resumePage, setResumePage] = useState(null);
    const [showResumePopup, setShowResumePopup] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const pdfRef = useRef(null);

    const hideResumeTimeout = useRef(null);
    useEffect(() => {
        if (showResumePopup) {
            if (hideResumeTimeout.current) clearTimeout(hideResumeTimeout.current);
            hideResumeTimeout.current = setTimeout(() => {
                setShowResumePopup(false);
            }, 10000);
        }
        return () => {
            if (hideResumeTimeout.current) clearTimeout(hideResumeTimeout.current);
        };
    }, [showResumePopup]);
    
    const pageIndicatorOpacity = useRef(new Animated.Value(0)).current;
    const hideIndicatorTimeout = useRef(null);

    const showPageIndicator = () => {
        Animated.timing(pageIndicatorOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();

        if (hideIndicatorTimeout.current) clearTimeout(hideIndicatorTimeout.current);
        hideIndicatorTimeout.current = setTimeout(() => {
            Animated.timing(pageIndicatorOpacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }, 1500);
    };

    const getStorageKey = () => `@pdf_page_${url}`;

    useEffect(() => {
        const checkSavedPage = async () => {
            if (!url) return;
            try {
                const saved = await AsyncStorage.getItem(getStorageKey());
                if (saved !== null) {
                    const page = parseInt(saved, 10);
                    if (page > 1) {
                        setResumePage(page);
                        setShowResumePopup(true);
                    }
                }
            } catch (e) {}
        };
        checkSavedPage();
    }, [url]);

    const saveCurrentPage = async (page) => {
        if (!url) return;
        try {
            await AsyncStorage.setItem(getStorageKey(), page.toString());
        } catch (e) {}
    };

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
        cache: false 
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
                ) : hasError ? (
                    <View style={styles.errorContainer}>
                        <Text style={[styles.errorText, { marginBottom: 16 }]}>Failed to load document.</Text>
                        <Pressable 
                            style={[styles.retryButton, { backgroundColor: colors.accent }]}
                            onPress={() => {
                                setHasError(false);
                                setRetryKey(prev => prev + 1);
                            }}
                        >
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pdf
                        ref={pdfRef}
                        key={retryKey}
                        trustAllCerts={false}
                        showsVerticalScrollIndicator={true}
                        spacing={10}
                    source={pdfSource}
                    onLoadComplete={(numberOfPages) => {
                        console.log(`Document loaded successfully with ${numberOfPages} pages.`);
                        setTotalPages(numberOfPages);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        // Spoof the last page to bypass the scroll-center calculation bug on wide PDFs
                        const displayPage = (page === numberOfPages - 1 && numberOfPages > 3) ? numberOfPages : page;
                        console.log(`Current page: ${displayPage}/${numberOfPages}`);
                        setCurrentPage(displayPage);
                        showPageIndicator();
                        saveCurrentPage(displayPage);

                        if (displayPage > lastPage.current) {
                            hideHeader();
                        } else if (displayPage < lastPage.current) {
                            showHeader();
                        }
                        lastPage.current = displayPage;
                        lastPage.current = displayPage;

                        if (displayPage === numberOfPages && numberOfPages > 1 && !isCompleted) {
                            setIsCompleted(true);
                            OfflineManager.toggleReadStatus([url], true).catch(console.error);
                        }
                    }}
                    onPageSingleTap={(page, x, y) => {
                        if (isHeaderVisible) hideHeader();
                        else showHeader();
                    }}
                    onError={(error) => {
                        console.log("PDF Rendering Error:", error);
                        setHasError(true);
                    }}
                    style={styles.pdf}
                    renderActivityIndicator={() => (
                        <ActivityIndicator color={colors.accent} size="large" />
                    )}
                />
                )}

                {totalPages > 0 && !isCheckingLocal && !hasError && (
                    <Animated.View style={[styles.pageIndicatorContainer, { opacity: pageIndicatorOpacity }]} pointerEvents="none">
                        <Text style={styles.pageIndicatorText}>{currentPage} / {totalPages}</Text>
                    </Animated.View>
                )}
                {showResumePopup && (
                    <View style={styles.resumePopup}>
                        <Text style={styles.resumeText}>Jump to {resumePage}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Pressable style={[styles.resumeActionBtn, { backgroundColor: colors.accent }]} onPress={() => {
                                pdfRef.current?.setPage(resumePage);
                                setShowResumePopup(false);
                            }}>
                                <Text style={styles.resumeActionText}>Jump</Text>
                            </Pressable>
                            <Pressable onPress={() => setShowResumePopup(false)} style={styles.resumeCloseBtn}>
                                <IconX color="#FFFFFF" size={20} />
                            </Pressable>
                        </View>
                    </View>
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
        fontFamily: 'SpaceGrotesk-Regular',
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontFamily: 'SpaceGrotesk-Bold',
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
    pageIndicatorContainer: {
        position: 'absolute',
        right: 32,
        top: '50%',
        marginTop: -20,
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    pageIndicatorText: {
        color: '#FFFFFF',
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 14,
    },
    resumePopup: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.85)',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 30,
        width: '85%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    resumeText: {
        color: '#FFFFFF',
        fontFamily: 'SpaceGrotesk-Regular',
        fontSize: 14,
        flex: 1,
    },
    resumeActionBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginLeft: 12,
    },
    resumeActionText: {
        color: '#000000',
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 13,
    },
    resumeCloseBtn: {
        marginLeft: 12,
        padding: 4,
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