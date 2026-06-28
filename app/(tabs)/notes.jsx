import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { IconAlertCircle, IconChevronDown, IconChevronRight, IconFolder, IconFolderOpen, IconSchool } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, UIManager, View } from 'react-native';
import { BentoLoader } from '../../appDesign/loader';
import { TitleCard } from '../../appDesign/cards.js';
import { triggerAccordionAnimation } from '../../appDesign/animations.js';
import Header, { useHeaderHeight } from '../../appDesign/header.js';
import { Mountain, Planet, Tree } from '../../appDesign/texts.js';
import { useAppTheme } from '../../logic/ThemeProvider';

const Notes = () => {
    const router = useRouter();
    const tabBarHeight = useBottomTabBarHeight();
    const { colors, activeTheme } = useAppTheme();
    const headerHeight = useHeaderHeight();

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
        triggerAccordionAnimation();
        setExpandedDepartment(expandedDepartment === deptId ? null : deptId);
        setExpandedYear(null);
        setExpandedSemester(null);
    };

    const toggleYear = (yearId) => {
        triggerAccordionAnimation();
        setExpandedYear(expandedYear === yearId ? null : yearId);
        setExpandedSemester(null); 
    };

    const toggleSemester = (semId) => {
        triggerAccordionAnimation();
        setExpandedSemester(expandedSemester === semId ? null : semId);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.bg, { backgroundColor: colors.background }]}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 12, paddingBottom: tabBarHeight + 20 }]}
                    showsVerticalScrollIndicator={false}>

                    {isLoading ? (
                        <BentoLoader text="Fetching latest notes..." />
                    ) : error ? (
                        <TitleCard title="Connection Error" description={error} icon={IconAlertCircle} />
                    ) : manifest && manifest.departments ? (
                        <View style={styles.manifestContainer}>
                            
                            {/* LEVEL 1: DEPARTMENTS */}
                            {manifest.departments.map((dept) => {
                                const isDeptOpen = expandedDepartment === dept.id;

                                return (
                                    <View key={dept.id} style={[
                                        styles.deptWrapper, 
                                        { 
                                            backgroundColor: colors.card,
                                            shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05
                                        }
                                    ]}>
                                        <Pressable 
                                            style={styles.deptHeader} 
                                            onPress={() => toggleDepartment(dept.id)}
                                        >
                                            <View style={styles.headerLeft}>
                                                <View style={[
                                                    styles.iconBox, 
                                                    { backgroundColor: isDeptOpen ? colors.accent : (activeTheme === 'dark' ? '#1A3340' : '#F0F8FF') }
                                                ]}>
                                                    <IconSchool color={isDeptOpen ? "#FFFFFF" : colors.accent} size={22} />
                                                </View>
                                                <Mountain title={dept.title} style={styles.titleText} />
                                            </View>
                                            {isDeptOpen ? <IconChevronDown color={colors.textSecondary} size={20} /> : <IconChevronRight color={colors.textSecondary} size={20} />}
                                        </Pressable>

                                        {isDeptOpen && (
                                            <View style={[styles.nestedContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                                                {/* LEVEL 2: YEARS */}
                                                {dept.years.map((year) => {
                                                    const isYearOpen = expandedYear === year.id;

                                                    return (
                                                        <View key={year.id} style={[styles.yearBlock, { borderBottomColor: colors.border }]}>
                                                            <Pressable 
                                                                style={[styles.yearHeader, { backgroundColor: colors.card }]} 
                                                                onPress={() => toggleYear(year.id)}
                                                            >
                                                                <View style={styles.headerLeft}>
                                                                    {isYearOpen ? <IconFolderOpen color="#34C759" size={20} /> : <IconFolder color={colors.textSecondary} size={20} />}
                                                                    <Tree title={year.label} style={styles.yearTitle} />
                                                                </View>
                                                                {isYearOpen ? <IconChevronDown color={colors.textSecondary} size={18} /> : <IconChevronRight color={colors.textSecondary} size={18} />}
                                                            </Pressable>

                                                            {/* LEVEL 3: SEMESTERS */}
                                                            {isYearOpen && (
                                                                <View style={[styles.semestersContainer, { backgroundColor: activeTheme === 'dark' ? '#121212' : '#F9F9FB' }]}>
                                                                    {year.semesters.map((sem) => {
                                                                        const isSemOpen = expandedSemester === sem.id;

                                                                        return (
                                                                            <View key={sem.id}>
                                                                                <Pressable 
                                                                                    style={[
                                                                                        styles.semesterRow, 
                                                                                        { borderBottomColor: colors.border },
                                                                                        isSemOpen && { backgroundColor: colors.background }
                                                                                    ]} 
                                                                                    onPress={() => toggleSemester(sem.id)}
                                                                                >
                                                                                    {isSemOpen ? <IconChevronDown color="#AF52DE" size={16} /> : <IconChevronRight color={colors.textSecondary} size={16} />}
                                                                                    <Tree title={sem.label} style={styles.semesterTitle} />
                                                                                </Pressable>

                                                                                {/* LEVEL 4: SUBJECTS */}
                                                                                {isSemOpen && (
                                                                                    <View style={[styles.subjectsContainer, { backgroundColor: colors.background }]}>
                                                                                        {sem.subjects && sem.subjects.length > 0 ? (
                                                                                            sem.subjects.map((sub) => (
                                                                                                <Pressable 
                                                                                                    key={sub.id} 
                                                                                                    style={({ pressed }) => [
                                                                                                        styles.subjectRow, 
                                                                                                        pressed && { backgroundColor: colors.border }
                                                                                                    ]}
                                                                                                    onPress={() => router.push(`/(pages)/${sub.id}`)}
                                                                                                >
                                                                                                    <View style={[styles.subjectIconBullet, { backgroundColor: colors.accent }]} />
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

            <Header title="Explore the Archives" />
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
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    statusContainer: {
        marginTop: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    manifestContainer: {
        width: '100%',
        marginTop: 10,
    },
    deptWrapper: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    deptHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 16,
        marginTop: 0,
        marginBottom: 0,
        flexShrink: 1,
    },
    nestedContainer: {
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    yearBlock: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    yearHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    yearTitle: {
        fontSize: 15,
    },
    semestersContainer: {
        // dynamic bg
    },
    semesterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        gap: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    semesterTitle: {
        fontSize: 14,
    },
    subjectsContainer: {
        paddingVertical: 8,
        paddingLeft: 56,
        paddingRight: 16,
    },
    subjectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        gap: 10,
        borderRadius: 12,
    },
    subjectIconBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    subjectTitle: {
        fontSize: 14,
    },
    emptyText: {
        fontSize: 13,
        fontStyle: 'italic',
        paddingVertical: 10,
    },
});