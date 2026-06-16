import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { IconAlertCircle, IconChevronDown, IconChevronRight, IconFolder, IconFolderOpen, IconSchool } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { TitleCard } from '../../appDesign/cards.js';
import Header from '../../appDesign/header.js';
import { Mountain, Planet, Tree } from '../../appDesign/texts.js';

const Notes = () => {
    const router = useRouter();
    const tabBarHeight = useBottomTabBarHeight();

    const [manifest, setManifest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDepartment, setExpandedDepartment] = useState(null);
    const [expandedYear, setExpandedYear] = useState(null);
    const [expandedSemester, setExpandedSemester] = useState(null);

    useEffect(() => {
        fetchManifest();
    }, []);

    const fetchManifest = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Added the cache-buster timestamp here so you don't have to wait 5 mins for GitHub updates!
            const MANIFEST_URL = `https://raw.githubusercontent.com/oceanmallik/DIUNotesBuddyDATABASE/main/manifest.json?t=${new Date().getTime()}`;
            const response = await fetch(MANIFEST_URL);
            
            if (!response.ok) throw new Error('Failed to connect to the GitHub repository.');
            
            const data = await response.json();
            setManifest(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDepartment = (deptId) => {
        setExpandedDepartment(expandedDepartment === deptId ? null : deptId);
        setExpandedYear(null);
        setExpandedSemester(null);
    };

    const toggleYear = (yearId) => {
        setExpandedYear(expandedYear === yearId ? null : yearId);
        setExpandedSemester(null); 
    };

    const toggleSemester = (semId) => {
        setExpandedSemester(expandedSemester === semId ? null : semId);
    };

    return (
        <View style={styles.container}>
            <View style={styles.bg}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingTop: 90, paddingBottom: tabBarHeight + 20 }]}
                    showsVerticalScrollIndicator={false}>

                    {isLoading ? (
                        <View style={styles.statusContainer}>
                            <ActivityIndicator size="large" color="#00D0FF" />
                            <Tree title="Fetching latest notes from GitHub..." style={{ textAlign: 'center', marginTop: 15 }} />
                        </View>
                    ) : error ? (
                        <TitleCard title="Connection Error" description={error} icon={IconAlertCircle} />
                    ) : manifest && manifest.departments ? (
                        <View style={styles.manifestContainer}>
                            <Planet title="Academic Departments" style={{ textAlign: 'center', marginVertical: 15, fontSize: 22 }} />
                            
                            {/* LEVEL 1: DEPARTMENTS */}
                            {manifest.departments.map((dept) => {
                                const isDeptOpen = expandedDepartment === dept.id;

                                return (
                                    <View key={dept.id} style={styles.deptWrapper}>
                                        <Pressable 
                                            style={[styles.deptHeader, isDeptOpen && styles.deptHeaderActive]} 
                                            onPress={() => toggleDepartment(dept.id)}
                                        >
                                            <View style={styles.headerLeft}>
                                                <IconSchool color={isDeptOpen ? "#00D0FF" : "#A0A0A0"} size={24} />
                                                <Mountain title={dept.title} style={[styles.titleText, isDeptOpen && { color: '#00D0FF' }]} />
                                            </View>
                                            {isDeptOpen ? <IconChevronDown color="#00D0FF" size={20} /> : <IconChevronRight color="#A0A0A0" size={20} />}
                                        </Pressable>

                                        {isDeptOpen && (
                                            <View style={styles.nestedContainer}>
                                                {/* LEVEL 2: YEARS */}
                                                {dept.years.map((year) => {
                                                    const isYearOpen = expandedYear === year.id;

                                                    return (
                                                        <View key={year.id}>
                                                            <Pressable 
                                                                style={[styles.yearHeader, isYearOpen && styles.yearHeaderActive]} 
                                                                onPress={() => toggleYear(year.id)}
                                                            >
                                                                <View style={styles.headerLeft}>
                                                                    {isYearOpen ? <IconFolderOpen color="#00D0FF" size={20} /> : <IconFolder color="#A0A0A0" size={20} />}
                                                                    <Tree title={year.label} style={[styles.yearTitle, isYearOpen && { color: '#00D0FF' }]} />
                                                                </View>
                                                                {isYearOpen ? <IconChevronDown color="#00D0FF" size={18} /> : <IconChevronRight color="#A0A0A0" size={18} />}
                                                            </Pressable>

                                                            {/* LEVEL 3: SEMESTERS */}
                                                            {isYearOpen && (
                                                                <View style={styles.semestersContainer}>
                                                                    {year.semesters.map((sem) => {
                                                                        const isSemOpen = expandedSemester === sem.id;

                                                                        return (
                                                                            <View key={sem.id}>
                                                                                <Pressable 
                                                                                    style={[styles.semesterRow, isSemOpen && styles.semesterRowActive]} 
                                                                                    onPress={() => toggleSemester(sem.id)}
                                                                                >
                                                                                    {isSemOpen ? <IconChevronDown color="#00D0FF" size={16} /> : <IconChevronRight color="#555" size={16} />}
                                                                                    <Tree title={sem.label} style={[styles.semesterTitle, isSemOpen && { color: '#00D0FF' }]} />
                                                                                </Pressable>

                                                                                {/* LEVEL 4: SUBJECTS */}
                                                                                {isSemOpen && (
                                                                                    <View style={styles.subjectsContainer}>
                                                                                        {sem.subjects && sem.subjects.length > 0 ? (
                                                                                            sem.subjects.map((sub) => (
                                                                                                <Pressable 
                                                                                                    key={sub.id} 
                                                                                                    style={styles.subjectRow}
                                                                                                    onPress={() => router.push(`/(pages)/${sub.id}`)}
                                                                                                >
                                                                                                    <View style={styles.subjectIconBullet} />
                                                                                                    <Tree title={sub.title} style={styles.subjectTitle} />
                                                                                                </Pressable>
                                                                                            ))
                                                                                        ) : (
                                                                                            <Tree title="No subjects added yet." style={styles.emptyText} />
                                                                                        )}
                                                                                    </View>
                                                                                )}
                                                                            </View>
                                                                        );
                                                                    })}
                                                                </View>
                                                            )}
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ) : null}
                </ScrollView>
            </View>

            <Header title="Notes Explorer" />
        </View>
    );
};

export default Notes;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    bg: {
        flex: 1,
        width: '100%',
        backgroundColor: '#131313',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 10,
        paddingBottom: 40,
    },
    statusContainer: {
        marginTop: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    manifestContainer: {
        width: '100%',
    },
    deptWrapper: {
        marginBottom: 12,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    deptHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 16,
    },
    deptHeaderActive: {
        backgroundColor: '#222222',
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    titleText: {
        fontSize: 16,
        color: '#E0E0E0',
        marginTop: 0,
        marginBottom: 0,
        flexShrink: 1,
    },
    nestedContainer: {
        backgroundColor: '#161616',
    },
    yearHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.02)',
    },
    yearHeaderActive: {
        backgroundColor: '#1C1C1C',
    },
    yearTitle: {
        fontSize: 14,
        color: '#CCCCCC',
    },
    semestersContainer: {
        backgroundColor: '#121212',
    },
    semesterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 30,
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.01)',
    },
    semesterRowActive: {
        backgroundColor: '#0A0A0A',
    },
    semesterTitle: {
        fontSize: 14,
        color: '#BBBBBB',
    },
    subjectsContainer: {
        backgroundColor: '#050505',
        paddingVertical: 8,
        paddingLeft: 52,
        paddingRight: 24,
    },
    subjectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        gap: 12,
    },
    subjectIconBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#45f442',
    },
    subjectTitle: {
        fontSize: 14,
        color: '#A0A0A0',
    },
    emptyText: {
        fontSize: 14,
        color: '#555555',
        fontStyle: 'italic',
        paddingVertical: 10,
    },
});