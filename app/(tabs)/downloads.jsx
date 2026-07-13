import { IconArrowLeft, IconTrash, IconFileText, IconCheck, IconX, IconEye, IconEyeOff, IconFileExport, IconPlayerPlay } from '@tabler/icons-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';

import React, { useState, useRef, useEffect } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, Modal, Easing, RefreshControl, Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Mountain, Planet, Tree } from '../../appDesign/texts';
import { IconRefresh } from '@tabler/icons-react-native';
import Header, { useHeaderHeight } from '../../appDesign/header';
import { OfflineManager } from '../../logic/OfflineManager';
import { useAppTheme } from '../../logic/ThemeProvider';
import { AppButton } from '../../appDesign/button';
import { LinearGradient } from 'expo-linear-gradient';
import useRewardedAd from '../../hooks/useRewardedAd';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DownloadCard = ({ note, colors, activeTheme, isSelectionMode, isSelected, onToggleSelect, onLongPress, onPress, onDelete, onToggleRead, onExport }) => {
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
                transform: [{ scale: scaleAnim }],
                opacity: (note.read && !isSelected) ? 0.65 : 1
            }
        ]}
        onPress={handlePress}
        onLongPress={onLongPress}
        delayLongPress={300}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={[styles.nameText, { color: note.read ? colors.textSecondary : colors.textPrimary, marginBottom: 12, flex: 1, paddingRight: 8 }]} numberOfLines={2}>
                {note.title}
            </Text>
            
            {!isSelectionMode && (
                <Pressable onPress={() => onDelete(note.url)} style={[styles.actionBtn, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                    <IconTrash size={18} color={colors.destructive} />
                </Pressable>
            )}
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={() => { if (!isSelectionMode) onToggleRead(note.url, !note.read); }}>
                    <View style={[
                        styles.typeBadge, 
                        { 
                            backgroundColor: isSelected ? colors.accent : (note.read ? '#00E67615' : colors.destructive + '15'),
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 16,
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                        }
                    ]}>
                        <Text style={[
                            styles.typeText, 
                            { color: isSelected ? '#FFF' : (note.read ? '#00E676' : colors.destructive) }
                        ]}>
                            {isSelected ? 'SELECTED' : (note.read ? 'READ' : 'UNREAD')}
                        </Text>

                        {!isSelected && (
                            <>
                                <View style={{ width: 1, height: 12, backgroundColor: note.read ? '#00E67640' : colors.destructive + '40', marginHorizontal: 8 }} />
                                {note.read ? <IconEyeOff size={14} color="#00E676" /> : <IconEye size={14} color={colors.destructive} />}
                            </>
                        )}
                        {isSelected && (
                            <>
                                <View style={{ width: 1, height: 12, backgroundColor: '#FFFFFF40', marginHorizontal: 8 }} />
                                <IconCheck size={14} color="#FFF" />
                            </>
                        )}
                    </View>
                </Pressable>
            </View>

            {!isSelectionMode && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable onPress={() => onExport(note)}>
                        <View style={[
                            styles.typeBadge, 
                            { 
                                backgroundColor: colors.accent + '15',
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRadius: 16,
                                paddingVertical: 6,
                                paddingHorizontal: 10,
                            }
                        ]}>
                            <Text style={[
                                styles.typeText, 
                                { color: colors.accent }
                            ]}>
                                EXPORT
                            </Text>
                            <View style={{ width: 1, height: 12, backgroundColor: colors.accent + '40', marginHorizontal: 8 }} />
                            <IconFileExport size={14} color={colors.accent} />
                        </View>
                    </Pressable>
                </View>
            )}
        </View>
      </AnimatedPressable>
    </View>
  );
};


export default function SavedNotes() {
    const { colors, activeTheme } = useAppTheme();
    const router = useRouter();
    const headerHeight = useHeaderHeight();
    const tabBarHeight = 100;

    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Read', 'Unread'];

    const [notes, setNotes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);
    const [exportConfirmTarget, setExportConfirmTarget] = useState(null);
    const [exportSuccessVisible, setExportSuccessVisible] = useState(false);
    const isSelectionMode = selectedNotes.length > 0;
    
    const { showAd, loaded: adLoaded } = useRewardedAd();
    
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

    const markSelectedAsRead = async (isRead) => {
        await OfflineManager.toggleReadStatus(selectedNotes, isRead);
        setSelectedNotes([]);
        loadNotes();
    };

    const toggleRead = async (url, isRead) => {
        await OfflineManager.toggleReadStatus([url], isRead);
        loadNotes();
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

    const handleExportConfirm = () => {
        if (!exportConfirmTarget) return;
        
        showAd(async () => {
            if (Platform.OS === 'android') {
                try {
                    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                    if (permissions.granted) {
                        const fileContent = await FileSystem.readAsStringAsync(exportConfirmTarget.localUri, { encoding: FileSystem.EncodingType.Base64 });
                        const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
                            permissions.directoryUri,
                            exportConfirmTarget.filename || 'export.pdf',
                            'application/pdf'
                        );
                        await FileSystem.writeAsStringAsync(newFileUri, fileContent, { encoding: FileSystem.EncodingType.Base64 });
                        setExportSuccessVisible(true);
                    } else {
                        Alert.alert('Permission Denied', 'Folder permission is required to save the file.');
                    }
                } catch (e) {
                    Alert.alert('Error', 'Failed to save the file to the selected folder.');
                    console.error(e);
                }
            } else {
                // Reward callback - execute export after ad finishes successfully
                const isAvailable = await Sharing.isAvailableAsync();
                if (isAvailable) {
                    // Use localUri (file:// scheme) instead of url (https:// scheme)
                    await Sharing.shareAsync(exportConfirmTarget.localUri, {
                        dialogTitle: 'Export PDF to File Manager',
                        UTI: 'com.adobe.pdf',
                        mimeType: 'application/pdf',
                    });
                } else {
                    Alert.alert('Error', 'Sharing is not available on your device');
                }
            }
        });
        setExportConfirmTarget(null);
    };

    const filteredNotes = notes.filter(note => {
        if (activeTab === 'Read') return note.read;
        if (activeTab === 'Unread') return !note.read;
        return true;
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Offline Library" />
            
            <View style={[styles.tabsWrapper, { paddingTop: headerHeight + 12 }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                {tabs.map(tab => {
                  const isActive = activeTab === tab;
                  const tabColor = tab === 'Read' ? '#00E676' : tab === 'Unread' ? colors.destructive : colors.accent;
                  return (
                    <Pressable
                      key={tab}
                      style={[
                        styles.tabButton,
                        { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                        isActive && { backgroundColor: tabColor }
                      ]}
                      onPress={() => setActiveTab(tab)}
                    >
                      <Text style={[
                        styles.tabText,
                        { color: isActive ? '#FFFFFF' : tabColor }
                      ]}>
                        {tab}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <ScrollView 
                contentContainerStyle={[styles.scrollContent, { paddingTop: 12, paddingBottom: tabBarHeight + 20, paddingHorizontal: 16 }]}
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

                        {Object.entries(filteredNotes.reduce((acc, note) => {
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
                                        onToggleRead={toggleRead}
                                        onExport={(noteData) => setExportConfirmTarget(noteData)}
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
                                        <AppButton title="Mark Read" icon={IconEye} variant="primary" onPress={() => markSelectedAsRead(true)} style={{ width: '100%', backgroundColor: colors.accent }} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <AppButton title="Mark Unread" icon={IconEyeOff} variant="secondary" onPress={() => markSelectedAsRead(false)} style={{ width: '100%' }} />
                                    </View>
                                </View>
                                <View style={{ height: 12 }} />
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <View style={{ flex: 1 }}>
                                        <AppButton title="Delete" icon={IconTrash} variant="destructive" onPress={() => setDeleteConfirmTarget('bulk')} style={{ width: '100%' }} />
                                    </View>
                                </View>
                                <View style={{ height: 12 }} />
                                <AppButton title="Cancel Selection" icon={IconX} variant="secondary" onPress={() => setSelectedNotes([])} style={{ width: '100%' }} />
                            </View>
                        )}
                        {!isSelectionMode && notes.length > 0 && (
                            <Text style={{ color: colors.textSecondary, fontFamily: 'SpaceGrotesk-Regular', fontSize: 13, marginTop: 24, textAlign: 'center', opacity: 0.6 }}>
                                Tip: Long press on a note to select multiple for bulk actions
                            </Text>
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

            {/* Export Ad Confirmation Modal */}
            <Modal visible={exportConfirmTarget !== null} transparent={true} animationType="fade" onRequestClose={() => setExportConfirmTarget(null)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.glowingWrapper}>
                        <LinearGradient
                            colors={[colors.accent, colors.accent + '30']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientBorder}
                        >
                            <View style={[styles.innerGlowCard, { backgroundColor: activeTheme === 'dark' ? '#0F1A24' : '#FFFFFF' }]}>
                                <View style={[styles.modalIconWrap, { backgroundColor: colors.accent + '20', alignSelf: 'center' }]}>
                                    <IconFileExport size={32} color={colors.accent} />
                                </View>
                                <Mountain title="Export File" style={[styles.modalTitleConfirm, { color: colors.textPrimary }]} />
                                <Text style={[styles.modalTextConfirm, { color: colors.textSecondary }]}>
                                    A short video ad will play to support the app. After it finishes, you can save the PDF to your device.
                                </Text>
                                <View style={styles.actionGridInner}>
                                    <AppButton 
                                        title={adLoaded ? "Watch Ad & Export" : "Loading Ad..."} 
                                        icon={IconPlayerPlay} 
                                        onPress={handleExportConfirm} 
                                        disabled={!adLoaded}
                                        style={[styles.fullWidthButton, { backgroundColor: colors.accent }]} 
                                    />
                                    <AppButton 
                                        title="Cancel" 
                                        icon={IconX} 
                                        variant="secondary" 
                                        onPress={() => setExportConfirmTarget(null)} 
                                        style={styles.fullWidthButton} 
                                    />
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>

            {/* Export Success Modal */}
            <Modal visible={exportSuccessVisible} transparent={true} animationType="fade" onRequestClose={() => setExportSuccessVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.glowingWrapper}>
                        <LinearGradient
                            colors={['#00E676', '#00E67630']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientBorder}
                        >
                            <View style={[styles.innerGlowCard, { backgroundColor: activeTheme === 'dark' ? '#0F1A24' : '#FFFFFF' }]}>
                                <View style={[styles.modalIconWrap, { backgroundColor: '#00E67620', alignSelf: 'center' }]}>
                                    <IconCheck size={32} color="#00E676" />
                                </View>
                                <Mountain title="Export Successful!" style={[styles.modalTitleConfirm, { color: colors.textPrimary }]} />
                                <Text style={[styles.modalTextConfirm, { color: colors.textSecondary }]}>
                                    Your PDF file has been safely exported to your device's folder.
                                </Text>
                                <View style={styles.actionGridInner}>
                                    <AppButton 
                                        title="Awesome" 
                                        icon={IconCheck} 
                                        onPress={() => setExportSuccessVisible(false)} 
                                        style={[styles.fullWidthButton, { backgroundColor: '#00E676' }]} 
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
    
    tabsWrapper: {
        width: '100%',
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(150,150,150,0.2)',
    },
    tabsContainer: {
        paddingHorizontal: 16,
        gap: 8,
    },
    tabButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 14,
    },

    // Card Styles
    profileCard: {
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingHorizontal: 16,
        paddingVertical: 16,
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
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    typeText: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 11,
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
