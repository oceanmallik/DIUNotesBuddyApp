import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { IconSearch, IconChevronRight, IconFileText, IconSchool, IconDownload, IconCheck } from '@tabler/icons-react-native';

import Header, { useHeaderHeight } from '../../appDesign/header';
import { Mountain, Tree } from '../../appDesign/texts';
import { useAppTheme } from '../../logic/ThemeProvider';
import { BentoLoader } from '../../appDesign/loader';
import { OfflineManager } from '../../logic/OfflineManager';

const SearchFileItem = ({ item, colors, activeTheme, router }) => {
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const checkStatus = async () => {
                const uri = await OfflineManager.getLocalUri(item.url);
                if (uri) {
                    setIsDownloaded(true);
                } else {
                    setIsDownloaded(false);
                }
            };
            checkStatus();
        }, [item.url])
    );

    useEffect(() => {
        if (isDownloaded) {
            setDownloadProgress(1);
        }
    }, [isDownloaded]);

    const handleDownload = async () => {
        if (isDownloaded || isDownloading || typeof item.url !== 'string') return;
        setIsDownloading(true);
        setDownloadProgress(0);
        const success = await OfflineManager.downloadNote(
            item.url, 
            item.filename,
            item.subjectTitle,
            (progress) => setDownloadProgress(progress)
        );
        if (success) {
            setIsDownloaded(true);
        }
        setIsDownloading(false);
    };

    return (
        <Pressable 
            style={({ pressed }) => [
                styles.resultCard, 
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && { opacity: 0.7 }
            ]}
            onPress={() => {
                router.push({
                    pathname: '/Viewer',
                    params: {
                        url: item.url,
                        title: item.filename,
                        subject: item.subjectTitle
                    }
                });
            }}
        >
            <IconFileText color={colors.accent} size={24} style={{ marginRight: 10 }} />
            <View style={styles.resultContent}>
                <Mountain title={item.filename} style={[styles.fileTitle, { color: colors.textPrimary }]} numberOfLines={1} />
                <Tree title={item.context} style={[styles.fileContext, { color: colors.textSecondary }]} numberOfLines={1} />
                
                {isDownloading && (
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${Math.max(5, downloadProgress * 100)}%` }]} />
                        </View>
                        <Tree title={`${Math.round(downloadProgress * 100)}%`} style={[styles.progressText, { color: colors.textSecondary }]} />
                    </View>
                )}
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

export default function Search() {
    const { colors, activeTheme } = useAppTheme();
    const headerHeight = useHeaderHeight();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [allFiles, setAllFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadManifest();
    }, []);

    const loadManifest = async () => {
        setIsLoading(true);
        try {
            const cached = await AsyncStorage.getItem('@cached_manifest');
            if (cached) {
                const manifest = JSON.parse(cached);
                const flattened = [];

                if (manifest && manifest.departments) {
                    manifest.departments.forEach(dept => {
                        if (dept.years) {
                            dept.years.forEach(year => {
                                if (year.semesters) {
                                    year.semesters.forEach(sem => {
                                        if (sem.subjects) {
                                            sem.subjects.forEach(sub => {
                                                if (sub.materials) {
                                                    Object.keys(sub.materials).forEach(category => {
                                                        const topics = sub.materials[category];
                                                        if (Array.isArray(topics)) {
                                                            topics.forEach(topicFolder => {
                                                                if (topicFolder.files && Array.isArray(topicFolder.files)) {
                                                                    topicFolder.files.forEach(file => {
                                                                        flattened.push({
                                                                            filename: file.filename,
                                                                            url: file.url,
                                                                            subjectTitle: sub.title,
                                                                            context: `${sub.title} • ${category.toUpperCase()} • ${topicFolder.topic}`
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                setAllFiles(flattened);
                setFilteredFiles(flattened);
            }
        } catch (error) {
            console.error("Failed to load manifest for search", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredFiles(allFiles);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = allFiles.filter(file => 
            file.filename.toLowerCase().includes(query) || 
            file.subjectTitle.toLowerCase().includes(query)
        );
        setFilteredFiles(results);
    }, [searchQuery, allFiles]);

    const renderItem = ({ item, index }) => (
        <SearchFileItem item={item} colors={colors} activeTheme={activeTheme} router={router} />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Search PDFs" showBack={true} />
            
            <View style={[styles.content, { paddingTop: headerHeight + 16 }]}>
                <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <IconSearch color={colors.textSecondary} size={20} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        placeholder="Search for notes..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />
                </View>

                {isLoading ? (
                    <BentoLoader text="Crawling documents..." />
                ) : filteredFiles.length > 0 ? (
                    <FlatList
                        data={filteredFiles}
                        keyExtractor={(item, index) => `${item.url}-${index}`}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <IconSchool color={colors.border} size={64} />
                        <Mountain title="No notes found" style={[styles.emptyTitle, { color: colors.textPrimary }]} />
                        <Tree title="Try searching with a different keyword." style={[styles.emptySubtitle, { color: colors.textSecondary }]} />
                    </View>
                )}
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
        paddingHorizontal: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Bold',
        padding: 0,
    },
    listContent: {
        paddingBottom: 40,
        gap: 8,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
    resultContent: {
        flex: 1,
        paddingRight: 12,
    },
    fileTitle: {
        fontSize: 15,
    },
    fileContext: {
        fontSize: 12,
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 18,
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        marginTop: 8,
    },
    fileRight: {
        paddingLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
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
        fontFamily: 'SpaceGrotesk-Bold',
    },
});
