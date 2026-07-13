import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconAlertCircle, IconChevronDown, IconChevronRight, IconFileText, IconFolder, IconFolderOpen, IconRefresh, IconDownload, IconCheck } from '@tabler/icons-react-native';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View, RefreshControl, Animated } from 'react-native';
import { BentoLoader } from '../../appDesign/loader';
import { TitleCard } from '../../appDesign/cards';
import { triggerAccordionAnimation } from '../../appDesign/animations';
import Header, { useHeaderHeight } from '../../appDesign/header';
import { Mountain, Tree } from '../../appDesign/texts';
import { useAppTheme } from '../../logic/ThemeProvider';
import { OfflineManager } from '../../logic/OfflineManager';

interface MaterialFile {
    filename: string;
    url: string;
}

interface TopicFolder {
    topic: string;
    files: MaterialFile[];
}

interface SubjectMaterials {
    midterm: TopicFolder[];
    final: TopicFolder[];
    assignment: TopicFolder[];
    presentation: TopicFolder[];
    [key: string]: TopicFolder[];
}

interface Subject {
    id: string;
    title: string;
    materials: SubjectMaterials;
}

interface Department {
    id: string;
    title: string;
    years: any[];
}

const FileItem = ({ file, subjectTitle, colors, activeTheme, router }: { file: MaterialFile, subjectTitle: string, colors: any, activeTheme: any, router: any }) => {
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const checkStatus = async () => {
                const uri = await OfflineManager.getLocalUri(file.url);
                if (uri) {
                    setIsDownloaded(true);
                } else {
                    setIsDownloaded(false);
                }
            };
            checkStatus();
        }, [file.url])
    );

    useEffect(() => {
        if (isDownloaded) {
            setDownloadProgress(1);
        }
    }, [isDownloaded]);

    const handleDownload = async () => {
        if (isDownloaded || isDownloading || typeof file.url !== 'string') return;
        setIsDownloading(true);
        setDownloadProgress(0);
        const success = await OfflineManager.downloadNote(
            file.url, 
            file.filename,
            subjectTitle,
            (progress: number) => setDownloadProgress(progress)
        );
        if (success) {
            setIsDownloaded(true);
        }
        setIsDownloading(false);
    };

    return (
        <Pressable
            style={[styles.fileCard, { backgroundColor: colors.background, borderColor: colors.border }]}
            onPress={() => {
                router.push({
                    pathname: '/Viewer' as any,
                    params: {
                        url: file.url,
                        title: file.filename,
                        subject: subjectTitle
                    }
                });
            }}
        >
            <View style={styles.fileLeft}>
                <IconFileText color={colors.accent} size={24} />
                <View style={{ flex: 1 }}>
                    <Tree title={file.filename} style={[styles.filenameText, { color: colors.textPrimary }]} />
                    {isDownloading && (
                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                                <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${Math.max(5, downloadProgress * 100)}%` }]} />
                            </View>
                            <Tree title={`${Math.round(downloadProgress * 100)}%`} style={[styles.progressText, { color: colors.textSecondary }]} />
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.fileRight}>
                {!isDownloaded && !isDownloading && (
                    <Pressable onPress={handleDownload} style={[styles.downloadButton, { backgroundColor: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' }]}>
                        <IconDownload color={colors.textSecondary} size={18} />
                    </Pressable>
                )}
                {isDownloaded && !isDownloading && (
                    <View style={[styles.downloadButton, { backgroundColor: activeTheme === 'dark' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(52, 199, 89, 0.1)' }]}>
                        <IconCheck color="#34C759" size={18} />
                    </View>
                )}
            </View>
        </Pressable>
    );
};

const TopicAccordion = ({ 
    topicFolder, 
    categoryName, 
    expandedTopic, 
    toggleTopic, 
    subjectTitle, 
    colors, 
    activeTheme, 
    router 
}: {
    topicFolder: TopicFolder,
    categoryName: string,
    expandedTopic: string | null,
    toggleTopic: (key: string) => void,
    subjectTitle: string,
    colors: any,
    activeTheme: any,
    router: any
}) => {
    const topicKey = `${categoryName}-${topicFolder.topic}`;
    const isTopicOpen = expandedTopic === topicKey;
    
    const rotation = useRef(new Animated.Value(isTopicOpen ? 1 : 0)).current;
    const expandAnim = useRef(new Animated.Value(isTopicOpen ? 1 : 0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
    const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    const contentHeight = topicFolder.files.length * 85 + 40;

    useEffect(() => {
        Animated.timing(expandAnim, {
            toValue: isTopicOpen ? 1 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start();

        Animated.timing(rotation, {
            toValue: isTopicOpen ? 1 : 0,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }, [isTopicOpen]);

    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });

    return (
        <View style={{ marginBottom: 16 }}>
            <Animated.View style={[
                styles.topicWrapper, 
                { 
                    backgroundColor: colors.card,
                    shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
                    transform: [{ scale: scaleAnim }],
                    zIndex: 1,
                    marginHorizontal: -8
                }
            ]}>
                <Pressable
                    style={styles.topicHeader}
                    onPress={() => toggleTopic(topicKey)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <View style={styles.topicHeaderLeft}>
                        {isTopicOpen ? <IconFolderOpen color={colors.accent} size={22} /> : <IconFolder color={colors.textSecondary} size={22} />}
                        <Tree title={topicFolder.topic} style={[styles.topicTitle, { color: isTopicOpen ? colors.accent : colors.textPrimary }]} />
                    </View>
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <IconChevronRight color={isTopicOpen ? colors.accent : colors.textSecondary} size={20} />
                    </Animated.View>
                </Pressable>
            </Animated.View>

            <Animated.View style={[
                styles.filesContainer, 
                { 
                    backgroundColor: colors.card,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 10,
                    elevation: 2,
                    zIndex: -1,
                    opacity: expandAnim,
                    maxHeight: expandAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, contentHeight]
                    }),
                    marginTop: expandAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -20]
                    }),
                    paddingTop: expandAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 32]
                    }),
                    paddingBottom: expandAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 12]
                    }),
                    transform: [{
                        translateY: expandAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0]
                        })
                    }]
                }
            ]}
            pointerEvents={isTopicOpen ? 'auto' : 'none'}
            >
                {topicFolder.files.map((file, fileIndex) => (
                    <FileItem
                        key={fileIndex}
                        file={file}
                        subjectTitle={subjectTitle}
                        colors={colors}
                        activeTheme={activeTheme}
                        router={router}
                    />
                ))}
            </Animated.View>
        </View>
    );
};

const SubjectScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const subjectId = Array.isArray(params.subject) ? params.subject[0] : params.subject;
    const { colors, activeTheme } = useAppTheme();
    const headerHeight = useHeaderHeight();

    const [subjectData, setSubjectData] = useState<Subject | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    const fetchSubjectData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setIsLoading(true);

            const MANIFEST_URL = `https://raw.githubusercontent.com/oceanmallik/DIUNotesBuddyDATABASE/main/manifest.json?t=${new Date().getTime()}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(MANIFEST_URL, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Failed to fetch the database.');

            const data = await response.json();
            let foundSubject: Subject | null = null;
            for (const dept of data.departments as Department[]) {
                for (const year of dept.years) {
                    for (const sem of year.semesters) {
                        const match = sem.subjects.find((sub: Subject) => sub.id === subjectId);
                        if (match) {
                            foundSubject = match;
                            break;
                        }
                    }
                    if (foundSubject) break;
                }
                if (foundSubject) break;
            }

            if (!foundSubject) throw new Error("Subject not found in the database.");
            setSubjectData(foundSubject);

        } catch (err: unknown) {
            try {
                const cached = await AsyncStorage.getItem('@cached_manifest');
                if (cached) {
                    const data = JSON.parse(cached);
                    let foundSubject: Subject | null = null;
                    for (const dept of data.departments as Department[]) {
                        for (const year of dept.years) {
                            for (const sem of year.semesters) {
                                const match = sem.subjects.find((sub: Subject) => sub.id === subjectId);
                                if (match) {
                                    foundSubject = match;
                                    break;
                                }
                            }
                            if (foundSubject) break;
                        }
                        if (foundSubject) break;
                    }
                    if (foundSubject) {
                        setSubjectData(foundSubject);
                        return; // Successfully loaded from cache
                    }
                }
            } catch {
                // Ignore cache read error
            }

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            if (isRefresh) setRefreshing(false);
            else setIsLoading(false);
        }
    }, [subjectId]);

    useEffect(() => {
        if (subjectId) {
            fetchSubjectData();
        }
    }, [subjectId, fetchSubjectData]);

    const toggleTopic = (topicKey: string) => {
        setExpandedTopic(expandedTopic === topicKey ? null : topicKey);
    };

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.bg}>
                <ScrollView 
                    style={styles.scrollView} 
                    contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 12 }]}
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={() => fetchSubjectData(true)} 
                            tintColor={colors.accent}
                            colors={[colors.accent]}
                            progressBackgroundColor={colors.card}
                            progressViewOffset={headerHeight}
                        />
                    }
                >

                    {isLoading && !refreshing ? (
                        <BentoLoader text="Loading materials..." />
                    ) : error ? (
                        <TitleCard title="Error" description={error} icon={IconAlertCircle} onPress={() => {}} />
                    ) : subjectData ? (
                        <View>

                            {Object.entries(subjectData.materials).map(([categoryName, topicsArray]) => {
                                if (!topicsArray || topicsArray.length === 0) return null;

                                return (
                                    <View key={categoryName} style={styles.categoryBlock}>
                                        <Mountain title={`${capitalize(categoryName)}`} style={[styles.categoryTitle, { color: colors.textSecondary }]} />

                                        {topicsArray.map((topicFolder, index) => (
                                            <TopicAccordion
                                                key={index}
                                                topicFolder={topicFolder}
                                                categoryName={categoryName}
                                                expandedTopic={expandedTopic}
                                                toggleTopic={toggleTopic}
                                                subjectTitle={subjectData.title}
                                                colors={colors}
                                                activeTheme={activeTheme}
                                                router={router}
                                            />
                                        ))}
                                    </View>
                                );
                            })}

                            {Object.values(subjectData.materials).every(arr => arr.length === 0) && (
                                <Tree title="No materials have been uploaded for this subject yet." style={[styles.emptyText, { color: colors.textSecondary }]} />
                            )}
                        </View>
                    ) : null}

                </ScrollView>
            </View>

            <Header 
                title={subjectData?.title || "Loading..."} 
                showBack 
            />
        </View>
    );
};

export default SubjectScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bg: {
        flex: 1,
        width: '100%'
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40
    },
    statusContainer: {
        marginTop: 80,
        alignItems: 'center'
    },
    pageTitle: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20
    },
    categoryBlock: {
        marginBottom: 24
    },
    categoryTitle: {
        fontSize: 20,
        marginBottom: 12,
        paddingLeft: 4
    },
    topicWrapper: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    topicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16
    },
    topicHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    topicTitle: {
        fontSize: 15,
    },
    filesContainer: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        gap: 8
    },
    fileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
    },
    fileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1
    },
    fileRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    downloadButton: {
        padding: 8,
        borderRadius: 8,
        marginLeft: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 8,
    },
    progressBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 10,
    },
    filenameText: {
        fontSize: 14,
        flex: 1
    },
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 40
    }
});