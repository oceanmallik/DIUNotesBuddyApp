import { IconArrowLeft, IconTrash, IconFileText, IconCircle, IconCircleCheckFilled } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TitleCard } from '../../appDesign/cards';
import Header, { useHeaderHeight } from '../../appDesign/header';
import { OfflineManager } from '../../logic/OfflineManager';
import { useAppTheme } from '../../logic/ThemeProvider';

export default function SavedNotes() {
    const { colors, activeTheme } = useAppTheme();
    const router = useRouter();
    const headerHeight = useHeaderHeight();
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

    useEffect(() => {
        loadNotes();
    }, []);

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
                showBack={!isSelectionMode} 
                leftComponent={
                    isSelectionMode ? (
                        <Pressable onPress={toggleSelectionMode} style={{ padding: 4, marginRight: 16 }}>
                            <IconArrowLeft color={colors.textPrimary} size={24} />
                        </Pressable>
                    ) : null
                }
                rightComponent={
                    notes.length > 0 ? (
                        <Pressable onPress={toggleSelectionMode} style={{ padding: 4 }}>
                            <Text style={{ color: colors.accent, fontFamily: 'SpaceGrotesk-Bold', fontSize: 16 }}>
                                {isSelectionMode ? 'Cancel' : 'Select'}
                            </Text>
                        </Pressable>
                    ) : null
                }
            />
            <ScrollView 
                contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 16 }]}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadNotes} tintColor={colors.accent} />
                }
            >
                {notes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            You haven't saved any offline notes yet.
                        </Text>
                    </View>
                ) : (
                    notes.map((note) => {
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
                    })
                )}
            </ScrollView>

            {isSelectionMode && (
                <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                    <Pressable 
                        style={[styles.bulkDeleteButton, { opacity: selectedNotes.length > 0 ? 1 : 0.5 }]}
                        disabled={selectedNotes.length === 0}
                        onPress={handleDeleteSelected}
                    >
                        <IconTrash color="#FF3B30" size={20} />
                        <Text style={styles.bulkDeleteText}>
                            Delete
                        </Text>
                    </Pressable>
                </View>
            )}
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
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    bulkDeleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 32,
        backgroundColor: 'rgba(255,59,48,0.1)',
        borderRadius: 100,
    },
    bulkDeleteText: {
        color: '#FF3B30', 
        fontFamily: 'SpaceGrotesk-Bold', 
        marginLeft: 8,
        fontSize: 16
    }
});
