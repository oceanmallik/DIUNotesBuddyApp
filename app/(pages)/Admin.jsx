import { IconCheck, IconEye, IconFileText, IconFolderPlus, IconShieldLock, IconTrash, IconX } from '@tabler/icons-react-native';
import { File } from 'expo-file-system';
import { cacheDirectory, downloadAsync } from 'expo-file-system/legacy';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Mountain, Tree } from '../../appDesign/texts';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [processingId, setProcessingId] = useState(null);

    // NEW: Publishing Modal State
    const [manifest, setManifest] = useState(null);
    const [publishModalVisible, setPublishModalVisible] = useState(false);
    const [activeSub, setActiveSub] = useState(null);
    const [finalTopic, setFinalTopic] = useState('');
    const [existingTopics, setExistingTopics] = useState([]);

    useEffect(() => {
        checkAccessAndFetch();
        fetchManifest();
    }, []);

    const fetchManifest = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/oceanmallik/DIUNotesBuddyDATABASE/main/manifest.json');
            if (response.ok) {
                const data = await response.json();
                setManifest(data);
            }
        } catch (err) {
            console.error("Could not fetch manifest for folder suggestions.");
        }
    };

    const checkAccessAndFetch = async () => {
        setIsLoading(true);
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) throw new Error("Please log in first.");
            if (user.app_metadata.provider !== 'github') throw new Error("Access Denied. GitHub Admin login required.");

            const { data: whitelistData, error: whitelistError } = await supabase
                .from('admin_whitelist')
                .select('email')
                .eq('email', user.email)
                .single();

            if (whitelistError || !whitelistData) {
                throw new Error("Access Denied. Your GitHub account is not on the Admin Whitelist.");
            }

            setIsAuthorized(true);

            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);

        } catch (err) {
            Alert.alert("Authentication Error", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewPDF = async (filePath) => {
        try {
            const { data, error } = await supabase.storage
                .from('pending_pdfs')
                .createSignedUrl(filePath, 60);

            if (error) throw error;
            Linking.openURL(data.signedUrl);
        } catch (err) {
            Alert.alert("Error opening file", err.message);
        }
    };

    const handleReject = async (submission) => {
        Alert.alert(
            "Reject Submission",
            `Are you sure you want to delete "${submission.file_name}"? This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setProcessingId(submission.id);
                        try {
                            const { error: storageError } = await supabase.storage
                                .from('pending_pdfs')
                                .remove([submission.file_url]);

                            if (storageError) throw storageError;

                            const { error: dbError } = await supabase
                                .from('submissions')
                                .delete()
                                .eq('id', submission.id);

                            if (dbError) throw dbError;

                            setSubmissions(prev => (prev || []).filter(sub => sub.id !== submission.id));

                        } catch (err) {
                            Alert.alert("Error deleting file", err.message);
                        } finally {
                            setProcessingId(null);
                        }
                    }
                }
            ]
        );
    };


    const openPublishModal = (submission) => {
        setActiveSub(submission);
        setFinalTopic(submission.topic);

        let foundTopics = [];
        if (manifest && manifest.departments) {
            const dept = manifest.departments.find(d => d.title === submission.department);
            const year = dept?.years?.find(y => y.label === submission.academic_year);
            const sem = year?.semesters?.find(s => s.label === submission.semester);
            const subj = sem?.subjects?.find(s => s.id === submission.subject_id);
            if (subj && subj.materials && subj.materials[submission.category]) {
                foundTopics = subj.materials[submission.category].map(t => t.topic);
            }
        }
        setExistingTopics(foundTopics);
        setPublishModalVisible(true);
    };

    const confirmPublish = async () => {
        if (!finalTopic || !finalTopic.trim()) {
            Alert.alert("Required", "Please provide a topic folder name.");
            return;
        }

        setPublishModalVisible(false);
        setProcessingId(activeSub.id);

        try {
            const githubToken = process.env.EXPO_PUBLIC_GITHUB_TOKEN;
            if (!githubToken) throw new Error("GitHub token is missing from .env configuration.");

            // 1. Get temporary download link
            const { data: urlData, error: urlError } = await supabase.storage
                .from('pending_pdfs')
                .createSignedUrl(activeSub.file_url, 60);
            if (urlError) throw urlError;

            // 2. Download to cache
            const safeName = activeSub.file_name.replace(/[^a-zA-Z0-9.-_]/g, '');
            const localUri = cacheDirectory + safeName;
            const { uri } = await downloadAsync(urlData.signedUrl, localUri);

            // 3. Convert to Base64
            const downloadedFile = new File(uri);
            const base64Content = await downloadedFile.base64();

            // 4. Build the GitHub Path WITH THE NEW TOPIC FOLDER!
            const clean = (str) => str.replace(/[^a-zA-Z0-9.\-_ \(\)]/g, '').trim();
            const githubPath = `${clean(activeSub.department)}/${clean(activeSub.academic_year)}/${clean(activeSub.semester)}/${clean(activeSub.subject_id).toUpperCase()}/${clean(activeSub.category)}/${clean(finalTopic)}/${clean(activeSub.file_name)}`;
            const apiUrl = `https://api.github.com/repos/oceanmallik/DIUNotesBuddyDATABASE/contents/${encodeURIComponent(githubPath)}`;

            // 5. Push to GitHub
            const githubResponse = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `🚀 Auto-published: ${activeSub.file_name} into ${finalTopic}`,
                    content: base64Content,
                    branch: 'main'
                })
            });

            if (!githubResponse.ok) {
                const errorData = await githubResponse.json();
                throw new Error(errorData.message || "Failed to push to GitHub.");
            }

            // 6. Cleanup
            await supabase.storage.from('pending_pdfs').remove([activeSub.file_url]);
            await supabase.from('submissions').update({ status: 'approved' }).eq('id', activeSub.id);
            setSubmissions(prev => (prev || []).filter(sub => sub.id !== activeSub.id));

            Alert.alert("Success!", "File published successfully to the exact folder you specified!");

        } catch (err) {
            Alert.alert("Publishing Error", err.message);
        } finally {
            setProcessingId(null);
            setActiveSub(null);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color="#00D0FF" />
                    <Tree title="Verifying admin credentials..." style={{ marginTop: 20 }} />
                </View>
            </View>
        );
    }

    if (!isAuthorized) {
        return (
            <View style={styles.container}>
                <View style={styles.centerBox}>
                    <IconShieldLock color="#FF4444" size={60} />
                    <Mountain title="Access Restricted" style={{ color: '#FF4444', fontSize: 24, marginTop: 15 }} />
                    <Tree title="Only authorized administrators using a GitHub login can view this page." style={{ textAlign: 'center', marginTop: 10, paddingHorizontal: 40 }} />
                </View>
            </View>
        );
    }

    const safeSubmissions = submissions || [];

    return (
        <View style={styles.container}>
            <View style={styles.bg}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

                    <View style={styles.headerRow}>
                        <Mountain title="Pending Notes" style={styles.pageTitle} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{safeSubmissions.length}</Text>
                        </View>
                    </View>

                    {safeSubmissions.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <IconCheck color="#00E676" size={48} />
                            <Tree title="You are all caught up!" style={{ marginTop: 15, fontSize: 16 }} />
                            <Tree title="No pending submissions to review." style={{ color: '#777', marginTop: 5 }} />
                        </View>
                    ) : (
                        safeSubmissions.map((sub) => (
                            <View key={sub.id} style={styles.card}>

                                <View style={styles.cardHeader}>
                                    <View style={styles.tagContainer}>
                                        <Text style={styles.tag}>{sub.department}</Text>
                                        <Text style={styles.tag}>{sub.subject_id.toUpperCase()}</Text>
                                    </View>
                                    <Tree title={new Date(sub.created_at).toLocaleDateString()} style={styles.dateText} />
                                </View>

                                <Mountain title={`Suggested: ${sub.topic}`} style={styles.topicTitle} />
                                <Tree title={`Category: ${sub.category} • ${sub.academic_year} (${sub.semester})`} style={styles.subText} />
                                <Tree title={`Submitted by: ${sub.submitter_email}`} style={styles.emailText} />

                                <Pressable style={styles.fileLink} onPress={() => handleViewPDF(sub.file_url)}>
                                    <IconFileText color="#00D0FF" size={20} />
                                    <Tree title={sub.file_name} style={styles.fileName} />
                                    <IconEye color="#A0A0A0" size={20} style={{ marginLeft: 'auto' }} />
                                </Pressable>

                                <View style={styles.actionRow}>
                                    <Pressable
                                        style={[styles.actionBtn, styles.rejectBtn]}
                                        onPress={() => handleReject(sub)}
                                        disabled={processingId === sub.id}
                                    >
                                        {processingId === sub.id ? <ActivityIndicator color="#FF4444" /> : (
                                            <>
                                                <IconTrash color="#FF4444" size={20} />
                                                <Text style={styles.rejectText}>Reject</Text>
                                            </>
                                        )}
                                    </Pressable>

                                    <Pressable
                                        style={[styles.actionBtn, styles.acceptBtn]}
                                        onPress={() => openPublishModal(sub)}
                                        disabled={processingId === sub.id}
                                    >
                                        {processingId === sub.id ? <ActivityIndicator color="#000000" /> : (
                                            <>
                                                <IconCheck color="#000000" size={20} />
                                                <Text style={styles.acceptText}>Approve</Text>
                                            </>
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>

            {/* Admin Topic Selection Modal */}
            <Modal visible={publishModalVisible} transparent={true} animationType="fade" onRequestClose={() => setPublishModalVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setPublishModalVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>

                        <View style={styles.modalHeader}>
                            <Mountain title="Assign Topic Folder" style={styles.modalTitleText} />
                            <Pressable onPress={() => setPublishModalVisible(false)} style={styles.modalCloseBtn}>
                                <IconX color="#A0A0A0" size={24} />
                            </Pressable>
                        </View>

                        <View style={styles.modalBody}>
                            <Tree title={`Student Suggestion: "${activeSub?.topic}"`} style={styles.studentSuggestionText} />

                            <Tree title="Select Existing Folder:" style={styles.modalLabel} />
                            {existingTopics.length > 0 ? (
                                <View style={styles.chipsWrap}>
                                    {existingTopics.map(topic => (
                                        <Pressable
                                            key={topic}
                                            style={[styles.topicChip, finalTopic === topic && styles.topicChipActive]}
                                            onPress={() => setFinalTopic(topic)}
                                        >
                                            <Text style={[styles.topicChipText, finalTopic === topic && styles.topicChipTextActive]}>{topic}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            ) : (
                                <Tree title="No existing folders for this category yet." style={styles.noFoldersText} />
                            )}

                            <Tree title="Or Create New Folder:" style={[styles.modalLabel, { marginTop: 20 }]} />
                            <View style={styles.fakeInput}>
                                <IconFolderPlus color="#A0A0A0" size={20} />
                                <TextInput
                                    style={styles.textInput}
                                    value={finalTopic}
                                    onChangeText={setFinalTopic}
                                    placeholder="Type folder name..."
                                    placeholderTextColor="#555"
                                />
                            </View>

                            <Pressable
                                style={[styles.submitButton, !finalTopic.trim() && styles.submitButtonDisabled]}
                                onPress={confirmPublish}
                                disabled={!finalTopic.trim()}
                            >
                                <IconCheck color={!finalTopic.trim() ? "#555" : "#000"} size={20} />
                                <Mountain title="Confirm & Publish" style={[styles.submitButtonText, !finalTopic.trim() && { color: '#555' }]} />
                            </Pressable>

                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

export default AdminDashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#131313',
    },
    bg: {
        flex: 1,
        width: '100%',
    },
    centerBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
        marginBottom: 25,
    },
    pageTitle: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    badge: {
        backgroundColor: '#00D0FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyBox: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        marginTop: 20,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tagContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    tag: {
        backgroundColor: '#222222',
        color: '#A0A0A0',
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        overflow: 'hidden',
    },
    dateText: {
        color: '#666666',
        fontSize: 12,
    },
    topicTitle: {
        fontSize: 20,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subText: {
        fontSize: 14,
        color: '#888888',
        marginBottom: 4,
    },
    emailText: {
        fontSize: 13,
        color: '#555555',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    fileLink: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111111',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333333',
        marginBottom: 20,
        gap: 10,
    },
    fileName: {
        color: '#CCCCCC',
        fontSize: 14,
        flexShrink: 1,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    rejectBtn: {
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 68, 68, 0.3)',
    },
    rejectText: {
        color: '#FF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    acceptBtn: {
        backgroundColor: '#00D0FF',
    },
    acceptText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
        backgroundColor: '#1E1E1E',
    },
    modalTitleText: {
        fontSize: 20,
        color: '#FFF',
    },
    modalCloseBtn: {
        padding: 5,
    },
    modalBody: {
        padding: 20,
    },
    studentSuggestionText: {
        color: '#00D0FF',
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 20,
        backgroundColor: 'rgba(0, 208, 255, 0.1)',
        padding: 10,
        borderRadius: 8,
    },
    modalLabel: {
        color: '#A0A0A0',
        fontSize: 14,
        marginBottom: 10,
    },
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
    },
    topicChip: {
        backgroundColor: '#111',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    topicChipActive: {
        backgroundColor: '#00D0FF',
        borderColor: '#00D0FF',
    },
    topicChipText: {
        color: '#888',
        fontSize: 14,
    },
    topicChipTextActive: {
        color: '#000',
        fontWeight: 'bold',
    },
    noFoldersText: {
        color: '#555',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    fakeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#111',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 25,
    },
    textInput: {
        color: '#FFF',
        fontSize: 16,
        flex: 1,
    },
    submitButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#00D0FF',
        paddingVertical: 16,
        borderRadius: 12,
    },
    submitButtonDisabled: {
        backgroundColor: '#222',
    },
    submitButtonText: {
        color: '#000',
        fontSize: 18,
    },
});