import { IconArrowLeft, IconTrash, IconFileText, IconCheck, IconX } from '@tabler/icons-react-native';
import { useRouter, useFocusEffect } from 'expo-router';

import React, { useState, useRef, useEffect } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, Modal, Easing, RefreshControl } from 'react-native';
import { Mountain, Planet, Tree } from '../../appDesign/texts';
import { IconRefresh } from '@tabler/icons-react-native';
import Header, { useHeaderHeight } from '../../appDesign/header';
import { OfflineManager } from '../../logic/OfflineManager';
import { useAppTheme } from '../../logic/ThemeProvider';
import { AppButton } from '../../appDesign/button';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DownloadCard = ({ note, colors, activeTheme, isSelectionMode, isSelected, onToggleSelect, onLongPress, onPress, onDelete }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const handlePress = () => {
    if (isSelectionMode) {
      onToggleSelect();
    } else {
      onPress();
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <AnimatedPressable 
        style={[
            styles.profileCard, 
            { 
                backgroundColor: colors.card, 
                borderColor: colors.border, 
                borderWidth: StyleSheet.hairlineWidth,
                shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
                transform: [{ scale: scaleAnim }]
            }
        ]}
        onPress={handlePress}
        onLongPress={onLongPress}
        delayLongPress={300}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={[styles.avatarCircle, { backgroundColor: isSelected ? colors.accent : colors.accent + '15' }]}>
            {isSelected ? (
                <IconCheck size={24} color="#FFF" />
            ) : (
                <IconFileText size={24} color={colors.accent} />
            )}
        </View>
        
        <View style={styles.infoContainer}>
            <Text style={[styles.nameText, { color: colors.textPrimary }]} numberOfLines={2}>{note.title}</Text>
            <Text style={[styles.emailText, { color: colors.textSecondary }]} numberOfLines={1}>
                {new Date(note.savedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
        </View>

        {!isSelectionMode && (
            <Pressable onPress={() => onDelete(note.url)} style={[styles.actionBtn, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', marginLeft: 12 }]}>
                <IconTrash size={18} color={colors.destructive} />
            </Pressable>
        )}
      </AnimatedPressable>
    </View>
  );
};


export default function SavedNotes() {
    const { colors, activeTheme } = useAppTheme();
    const router = useRouter();
    const headerHeight = useHeaderHeight();
    const tabBarHeight = 100;
    const [notes, setNotes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);
    const isSelectionMode = selectedNotes.length > 0;
    
    const loadNotes = async (isManual = false) => {
        if (isManual) {
            setRefreshing(true);
            await new Promise(resolve => setTimeout(resolve, 800));
        } else {
            setRefreshing(true);
        }

        const data = await OfflineManager.getSavedNotes();
        data.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        setNotes(data);

        if (isManual) {
            setRefreshing(false);
        } else {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadNotes();
        }, [])
    );

    const toggleNoteSelection = (url) => {
        if (selectedNotes.includes(url)) {
            setSelectedNotes(selectedNotes.filter(u => u !== url));
        } else {
            setSelectedNotes([...selectedNotes, url]);
        }
    };

    const confirmDelete = async () => {
        if (deleteConfirmTarget === 'bulk') {
            for (const url of selectedNotes) {
                await OfflineManager.deleteNote(url);
            }
            setSelectedNotes([]);
        } else if (deleteConfirmTarget) {
            await OfflineManager.deleteNote(deleteConfirmTarget);
        }
        setDeleteConfirmTarget(null);
        loadNotes();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Offline Library" />
            <ScrollView 
                contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 16, paddingBottom: tabBarHeight + 20, paddingHorizontal: 16 }]}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={() => loadNotes(true)} 
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                        progressBackgroundColor={colors.card}
                        progressViewOffset={headerHeight}
                    />
                }
            >
                {notes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <IconFileText size={64} color={colors.textSecondary} opacity={0.5} />
                        <Mountain title="No offline notes" style={{ marginTop: 16, color: colors.textPrimary }} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary, marginTop: 8 }]}>
                            You haven't saved any offline notes yet.
                        </Text>
                    </View>
                ) : (
                    <>
                        {Object.entries(notes.reduce((acc, note) => {
                            const subject = note.subject && note.subject !== 'Uncategorized' ? note.subject : 'Other Notes';
                            if (!acc[subject]) acc[subject] = [];
                            acc[subject].push(note);
                            return acc;
                        }, {})).map(([subject, subjectNotes]) => (
                            <View key={subject} style={{ marginBottom: 16 }}>
                                <Planet title={subject} style={{ marginLeft: 4, marginBottom: 12, fontSize: 18, color: colors.textPrimary }} />
                                {subjectNotes.map((note) => (
                                    <DownloadCard
                                        key={note.id}
                                        note={note}
                                        colors={colors}
                                        activeTheme={activeTheme}
                                        isSelectionMode={isSelectionMode}
                                        isSelected={selectedNotes.includes(note.url)}
                                        onToggleSelect={() => toggleNoteSelection(note.url)}
                                        onLongPress={() => {
                                            if (!selectedNotes.includes(note.url)) setSelectedNotes([...selectedNotes, note.url]);
                                        }}
                                        onPress={() => router.push(`/Viewer?url=${encodeURIComponent(note.url)}&title=${encodeURIComponent(note.title)}&subject=${encodeURIComponent(note.subject || 'Saved Note')}`)}
                                        onDelete={() => setDeleteConfirmTarget(note.url)}
                                    />
                                ))}
                            </View>
                        ))}
                        
                        {isSelectionMode && (
                            <View style={[styles.selectionBarList, { marginTop: 16 }]}>
                                <Text style={{ color: colors.textPrimary, fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, textAlign: 'center', marginBottom: 12 }}>
                                    {selectedNotes.length} Notes Selected
                                </Text>
                                
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <View style={{ flex: 1 }}>
                                        <AppButton title="Delete" icon={IconTrash} variant="destructive" onPress={() => setDeleteConfirmTarget('bulk')} style={{ width: '100%' }} />
                                    </View>
                                </View>
                                <View style={{ height: 12 }} />
                                <AppButton title="Cancel Selection" icon={IconX} variant="secondary" onPress={() => setSelectedNotes([])} style={{ width: '100%' }} />
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            <Modal visible={deleteConfirmTarget !== null} transparent={true} animationType="fade" onRequestClose={() => setDeleteConfirmTarget(null)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.glowingWrapper}>
                        <LinearGradient
                            colors={[colors.destructive, colors.destructive + '30']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientBorder}
                        >
                            <View style={[styles.innerGlowCard, { backgroundColor: activeTheme === 'dark' ? '#0F1A24' : '#FFFFFF' }]}>
                                <View style={[styles.modalIconWrap, { backgroundColor: colors.destructive + '20', alignSelf: 'center' }]}>
                                    <IconTrash size={32} color={colors.destructive} />
                                </View>
                                <Mountain title="Delete Note?" style={[styles.modalTitleConfirm, { color: colors.textPrimary }]} />
                                <Text style={[styles.modalTextConfirm, { color: colors.textSecondary }]}>
                                    {deleteConfirmTarget === 'bulk' ? `Are you sure you want to delete these ${selectedNotes.length} notes?` : 'Are you sure you want to delete this note?'}
                                </Text>
                                <View style={styles.actionGridInner}>
                                    <AppButton 
                                        title="Yes, Delete it" 
                                        icon={IconTrash} 
                                        onPress={confirmDelete} 
                                        style={[styles.fullWidthButton, { backgroundColor: colors.destructive }]} 
                                    />
                                    <AppButton 
                                        title="Cancel" 
                                        icon={IconX} 
                                        variant="secondary" 
                                        onPress={() => setDeleteConfirmTarget(null)} 
                                        style={styles.fullWidthButton} 
                                    />
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
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
    
    // Card Styles
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 24,
        elevation: 4,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
    },
    nameText: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 16,
        marginBottom: 2,
    },
    emailText: {
        fontFamily: 'SpaceGrotesk-Regular',
        fontSize: 13,
    },
    actionBtn: {
        padding: 6,
        borderRadius: 8,
    },
    
    // Selection Bar styles
    selectionBarList: {
        paddingVertical: 16,
        width: '100%',
    },
    
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    glowingWrapper: {
        width: '100%',
        borderRadius: 24,
        padding: 2,
    },
    gradientBorder: {
        borderRadius: 24,
        padding: 1,
    },
    innerGlowCard: {
        borderRadius: 23,
        padding: 24,
        alignItems: 'center',
    },
    modalIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    modalTitleConfirm: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 22,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalTextConfirm: {
        fontFamily: 'SpaceGrotesk-Regular',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    actionGridInner: {
        width: '100%',
        gap: 12,
    },
    fullWidthButton: {
        width: '100%',
    },
});
