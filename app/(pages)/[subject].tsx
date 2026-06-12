import { IconAlertCircle, IconArrowLeft, IconChevronDown, IconChevronRight, IconFileText, IconFolder, IconFolderOpen } from '@tabler/icons-react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { TitleCard } from '../../appDesign/cards';
import Header from '../../appDesign/header';
import { Mountain, Tree } from '../../appDesign/texts';

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

const SubjectScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const subjectId = Array.isArray(params.subject) ? params.subject[0] : params.subject;

    const [subjectData, setSubjectData] = useState<Subject | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    useEffect(() => {
        if (subjectId) {
            fetchSubjectData();
        }
    }, [subjectId]);

    const fetchSubjectData = async () => {
        try {
            setIsLoading(true);
            
            // Added the cache-buster timestamp to match the first page
            const MANIFEST_URL = `https://raw.githubusercontent.com/oceanmallik/DIUNotesBuddyDATABASE/main/manifest.json?t=${new Date().getTime()}`;
            const response = await fetch(MANIFEST_URL);

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
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTopic = (topicKey: string) => {
        setExpandedTopic(expandedTopic === topicKey ? null : topicKey);
    };

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.bg}>
                {/* Applied inline paddingTop: 90 here to match the first page */}
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingTop: 90 }]}>

                    {isLoading ? (
                        <View style={styles.statusContainer}>
                            <ActivityIndicator size="large" color="#00D0FF" />
                            <Tree title="Loading materials..." style={{ textAlign: 'center', marginTop: 15 }} />
                        </View>
                    ) : error ? (
                        <TitleCard title="Error" description={error} icon={IconAlertCircle} />
                    ) : subjectData ? (
                        <View>
                            <Mountain title={subjectData.title} style={styles.pageTitle} />

                            {Object.entries(subjectData.materials).map(([categoryName, topicsArray]) => {
                                if (!topicsArray || topicsArray.length === 0) return null;

                                return (
                                    <View key={categoryName} style={styles.categoryBlock}>
                                        <Mountain title={`${capitalize(categoryName)}`} style={styles.categoryTitle} />

                                        {topicsArray.map((topicFolder, index) => {
                                            const topicKey = `${categoryName}-${topicFolder.topic}`;
                                            const isTopicOpen = expandedTopic === topicKey;

                                            return (
                                                <View key={index} style={styles.topicWrapper}>
                                                    <Pressable
                                                        style={[styles.topicHeader, isTopicOpen && styles.topicHeaderActive]}
                                                        onPress={() => toggleTopic(topicKey)}
                                                    >
                                                        <View style={styles.topicHeaderLeft}>
                                                            {isTopicOpen ? <IconFolderOpen color="#00D0FF" size={22} /> : <IconFolder color="#A0A0A0" size={22} />}
                                                            <Tree title={topicFolder.topic} style={[styles.topicTitle, isTopicOpen && { color: '#00D0FF' }]} />
                                                        </View>
                                                        {isTopicOpen ? <IconChevronDown color="#00D0FF" size={20} /> : <IconChevronRight color="#A0A0A0" size={20} />}
                                                    </Pressable>

                                                    {isTopicOpen && (
                                                        <View style={styles.filesContainer}>
                                                            {topicFolder.files.map((file, fileIndex) => (
                                                                <Pressable
                                                                    key={fileIndex}
                                                                    style={styles.fileCard}
                                                                    onPress={() => {
                                                                        router.push({
                                                                            pathname: '/Viewer' as any,
                                                                            params: { 
                                                                                url: file.url,
                                                                                title: file.filename 
                                                                            }
                                                                        });
                                                                    }}
                                                                >
                                                                    <View style={styles.fileLeft}>
                                                                        <IconFileText color="#4285F4" size={24} />
                                                                        <Tree title={file.filename} style={styles.filenameText} />
                                                                    </View>
                                                                    <IconChevronRight color="#A0A0A0" size={20} />
                                                                </Pressable>
                                                            ))}
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                );
                            })}

                            {Object.values(subjectData.materials).every(arr => arr.length === 0) && (
                                <Tree title="No materials have been uploaded for this subject yet." style={styles.emptyText} />
                            )}
                        </View>
                    ) : null}

                </ScrollView>
            </View>

            {/* Moved headerArea to the bottom and positioned it absolutely */}
            <View style={styles.headerArea}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconArrowLeft color="#FFFFFF" size={28} />
                </Pressable>
                <Header title="Subject Materials" />
            </View>
        </View>
    );
};

export default SubjectScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#131313'
    },
    headerArea: {
        position: 'absolute', // Updated to absolute to overlay scroll content like Page 1
        top: 0,
        width: '100%',
        zIndex: 100 // Added to ensure buttons remain clickable over the scroll view
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 45,
        padding: 10,
        zIndex: 50
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
        fontSize: 26,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 30
    },
    categoryBlock: {
        marginBottom: 24
    },
    categoryTitle: {
        fontSize: 20,
        color: '#E0E0E0',
        marginBottom: 12,
        paddingLeft: 4
    },
    topicWrapper: {
        marginBottom: 10,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2A2A2A'
    },
    topicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16
    },
    topicHeaderActive: {
        backgroundColor: '#222222',
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A'
    },
    topicHeaderLeft: { 
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    topicTitle: {
        fontSize: 16,
        color: '#E0E0E0'
    },
    filesContainer: {
        backgroundColor: '#0F0F0F',
        padding: 12, gap: 8
    },
    fileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#161616',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#222222'
    },
    fileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1
    },
    filenameText: {
        fontSize: 14,
        color: '#CCCCCC',
        flex: 1
    },
    emptyText: {
        textAlign: 'center',
        color: '#777777',
        fontStyle: 'italic',
        marginTop: 40
    }
});