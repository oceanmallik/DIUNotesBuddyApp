import { IconAlertCircle, IconArrowLeft, IconChevronDown, IconChevronRight, IconFileText, IconFolder, IconFolderOpen } from '@tabler/icons-react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BentoLoader } from '../../appDesign/loader';
import { TitleCard } from '../../appDesign/cards';
import Header, { useHeaderHeight } from '../../appDesign/header';
import { Mountain, Tree } from '../../appDesign/texts';
import { useAppTheme } from '../../logic/ThemeProvider';

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
    const { colors, activeTheme } = useAppTheme();
    const headerHeight = useHeaderHeight();

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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.bg}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight }]}>

                    {isLoading ? (
                        <BentoLoader text="Loading materials..." />
                    ) : error ? (
                        <TitleCard title="Error" description={error} icon={IconAlertCircle} />
                    ) : subjectData ? (
                        <View>
                            <Mountain title={subjectData.title} style={[styles.pageTitle, { color: colors.textPrimary }]} />

                            {Object.entries(subjectData.materials).map(([categoryName, topicsArray]) => {
                                if (!topicsArray || topicsArray.length === 0) return null;

                                return (
                                    <View key={categoryName} style={styles.categoryBlock}>
                                        <Mountain title={`${capitalize(categoryName)}`} style={[styles.categoryTitle, { color: colors.textSecondary }]} />

                                        {topicsArray.map((topicFolder, index) => {
                                            const topicKey = `${categoryName}-${topicFolder.topic}`;
                                            const isTopicOpen = expandedTopic === topicKey;

                                            return (
                                                <View key={index} style={[
                                                    styles.topicWrapper, 
                                                    { 
                                                        backgroundColor: colors.card,
                                                        shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05
                                                    }
                                                ]}>
                                                    <Pressable
                                                        style={[
                                                            styles.topicHeader, 
                                                            isTopicOpen && { 
                                                                backgroundColor: colors.background, 
                                                                borderBottomWidth: StyleSheet.hairlineWidth, 
                                                                borderBottomColor: colors.border 
                                                            }
                                                        ]}
                                                        onPress={() => toggleTopic(topicKey)}
                                                    >
                                                        <View style={styles.topicHeaderLeft}>
                                                            {isTopicOpen ? <IconFolderOpen color={colors.accent} size={22} /> : <IconFolder color={colors.textSecondary} size={22} />}
                                                            <Tree title={topicFolder.topic} style={[styles.topicTitle, { color: isTopicOpen ? colors.accent : colors.textPrimary }]} />
                                                        </View>
                                                        {isTopicOpen ? <IconChevronDown color={colors.accent} size={20} /> : <IconChevronRight color={colors.textSecondary} size={20} />}
                                                    </Pressable>

                                                    {isTopicOpen && (
                                                        <View style={[styles.filesContainer, { backgroundColor: activeTheme === 'dark' ? '#121212' : '#F9F9FB' }]}>
                                                            {topicFolder.files.map((file, fileIndex) => (
                                                                <Pressable
                                                                    key={fileIndex}
                                                                    style={[styles.fileCard, { backgroundColor: colors.background, borderColor: colors.border }]}
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
                                                                        <IconFileText color={colors.accent} size={24} />
                                                                        <Tree title={file.filename} style={[styles.filenameText, { color: colors.textPrimary }]} />
                                                                    </View>
                                                                    <IconChevronRight color={colors.textSecondary} size={20} />
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
                                <Tree title="No materials have been uploaded for this subject yet." style={[styles.emptyText, { color: colors.textSecondary }]} />
                            )}
                        </View>
                    ) : null}

                </ScrollView>
            </View>

            <Header title="Knowledge Vault" showBack />
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
        marginBottom: 16,
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
        padding: 12, 
        gap: 12
    },
    fileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
    },
    fileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1
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