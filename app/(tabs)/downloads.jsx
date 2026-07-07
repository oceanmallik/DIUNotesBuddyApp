import { IconArrowLeft, IconTrash, IconFileText, IconCircle, IconCircleCheckFilled } from '@tabler/icons-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TitleCard } from '../../appDesign/cards';
import { Planet } from '../../appDesign/texts';
import Header, { useHeaderHeight } from '../../appDesign/header';
import { OfflineManager } from '../../logic/OfflineManager';
import { useAppTheme } from '../../logic/ThemeProvider';

export default function SavedNotes() {
    const { colors, activeTheme } = useAppTheme();
    const router = useRouter();
    const headerHeight = useHeaderHeight();
    const tabBarHeight = useBottomTabBarHeight();
    const [notes, setNotes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState([]);

    const loadNotes = async () => {
        setRefreshing(true);
        const data = await OfflineManager.getSavedNotes();
        data.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        setNotes(data);
        setRefreshing(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            loadNotes();
        }, [])
    );

    const handleDelete = async (url) => {
        await OfflineManager.deleteNote(url);
        loadNotes();
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedNotes([]);
    };

    const toggleNoteSelection = (url) => {
        if (selectedNotes.includes(url)) {
            setSelectedNotes(selectedNotes.filter(u => u !== url));
        } else {
            setSelectedNotes([...selectedNotes, url]);
        }
    };

    const handleDeleteSelected = async () => {
        for (const url of selectedNotes) {
            await OfflineManager.deleteNote(url);
        }
        setIsSelectionMode(false);
        setSelectedNotes([]);
        loadNotes();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header 
                title={isSelectionMode ? `${selectedNotes.length} Selected` : "Offline Library"} 
                leftComponent={
                    isSelectionMode ? (
                        <Pressable onPress={toggleSelectionMode} style={{ padding: 4, marginRight: 16 }}>
                            <IconArrowLeft color={colors.textPrimary} size={24} />
                        </Pressable>
                    ) : null
                }
                rightComponent={
                    isSelectionMode ? (
                        <Pressable 
                            style={{ padding: 4, opacity: selectedNotes.length > 0 ? 1 : 0.5 }}
                            disabled={selectedNotes.length === 0}
                            onPress={handleDeleteSelected}
                        >
                            <IconTrash color="#FF3B30" size={24} />
                        </Pressable>
                    ) : notes.length > 0 ? (
                        <Pressable onPress={toggleSelectionMode} style={{ padding: 4 }}>
                            <Text style={{ color: colors.accent, fontFamily: 'SpaceGrotesk-Bold', fontSize: 16 }}>
                                Select
                            </Text>
                        </Pressable>
                    ) : null
                }
            />
            <ScrollView 
                contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 16, paddingBottom: tabBarHeight + 20 }]}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadNotes} tintColor={colors.accent} />
                }
            >
                {notes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            You haven&apos;t saved any offline notes yet.
                        </Text>
                    </View>
                ) : (
                    Object.entries(notes.reduce((acc, note) => {
                        const subject = note.subject && note.subject !== 'Uncategorized' ? note.subject : 'Other Notes';
                        if (!acc[subject]) acc[subject] = [];
                        acc[subject].push(note);
                        return acc;
                    }, {})).map(([subject, subjectNotes]) => (
                        <View key={subject} style={{ marginBottom: 24 }}>
                            <Planet title={subject} style={{ marginLeft: 16, marginBottom: 8, fontSize: 18 }} />
                            {subjectNotes.map((note) => {
                                const isSelected = selectedNotes.includes(note.url);
                                return (
                                    <View key={note.id} style={styles.noteRow}>
                                        {isSelectionMode && (
                                            <Pressable 
                                                onPress={() => toggleNoteSelection(note.url)}
                                                style={styles.checkboxContainer}
                                            >
                                                {isSelected ? (
                                                    <IconCircleCheckFilled color={colors.accent} size={26} />
                                                ) : (
                                                    <IconCircle color={colors.border} size={26} strokeWidth={1.5} />
                                                )}
                                            </Pressable>
                                        )}
                                        <View style={styles.cardContainer}>
                                            <TitleCard
                                                title={note.title}
                                                description={new Date(note.savedAt).toLocaleDateString()}
                                                icon={IconFileText}
                                                onPress={() => {
                                                    if (isSelectionMode) {
                                                        toggleNoteSelection(note.url);
                                                    } else {
                                                        router.push(`/Viewer?url=${encodeURIComponent(note.url)}&title=${encodeURIComponent(note.title)}&subject=${encodeURIComponent(note.subject || 'Saved Note')}`)
                                                    }
                                                }}
                                            />
                                        </View>
                                        {!isSelectionMode && (
                                            <Pressable 
                                                onPress={() => handleDelete(note.url)} 
                                                style={[styles.deleteButton, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,59,48,0.1)' : 'rgba(255,59,48,0.05)' }]}
                                            >
                                                <IconTrash color="#FF3B30" size={20} />
                                            </Pressable>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    emptyContainer: {
        marginTop: 60,
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Regular',
        lineHeight: 24,
    },
    noteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
    },
    cardContainer: {
        flex: 1,
    },
    deleteButton: {
        padding: 12,
        borderRadius: 12,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxContainer: {
        paddingVertical: 16,
        paddingLeft: 16,
        justifyContent: 'center',
    },
});
