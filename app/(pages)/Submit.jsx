import { IconAlertCircle, IconCheck, IconChevronDown, IconFileText, IconUpload, IconX, IconSend, IconUserCheck } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { decode } from 'base64-arraybuffer';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BentoLoader } from '../../appDesign/loader';
import { Mountain, Tree, Planet } from '../../appDesign/texts';
import { TitleCard } from '../../appDesign/cards';
import { AppButton } from '../../appDesign/button';
import Header, { useHeaderHeight } from '../../appDesign/header.js';
import { supabase } from '../../lib/supabase';
import { useAppTheme } from '../../logic/ThemeProvider';

const SubmitForm = () => {
    const router = useRouter();
    const headerHeight = useHeaderHeight();
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [manifest, setManifest] = useState(null);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedSem, setSelectedSem] = useState(null);
    const [selectedSubj, setSelectedSubj] = useState(null);
    const [category, setCategory] = useState('midterm');
    const [topic, setTopic] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalTitle, setModalTitle] = useState('');
    const [onSelectCallback, setOnSelectCallback] = useState(() => { });
    const categories = ['midterm', 'final', 'assignment', 'presentation'];
    
    const { colors, activeTheme } = useAppTheme();

    useEffect(() => {
        fetchManifest();
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setIsAuthChecking(false);
    };

    const fetchManifest = async () => {
        try {
            const MANIFEST_URL = 'https://raw.githubusercontent.com/oceanmallik/DIUNotesBuddyDATABASE/main/manifest.json';
            const response = await fetch(MANIFEST_URL);
            if (!response.ok) throw new Error('Failed to fetch the database.');
            const data = await response.json();
            setManifest(data);
        } catch (err) {
            Alert.alert("Connection Error", "Could not load the subjects database. Please check your internet connection.");
        } finally {
            setIsFetchingData(false);
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets.length > 0) {
                const file = result.assets[0];
                if (file.size > 15 * 1024 * 1024) {
                    Alert.alert("File too large", "Please select a PDF under 15MB.");
                    return;
                }
                setSelectedFile(file);
            }
        } catch (err) {
            Alert.alert("Error", "Could not select the file.");
        }
    };

    const handleSubmit = async () => {
        if (!selectedSubj || !topic || !selectedFile) {
            Alert.alert("Missing Fields", "Please ensure all dropdowns are selected, a topic is entered, and a PDF is attached.");
            return;
        }

        setIsLoading(true);

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw new Error("You must be logged in to submit notes.");
            if (!user.email.endsWith('@diu.edu.bd')) throw new Error("Only DIU student emails are allowed.");
            const expoFile = new File(selectedFile.uri);
            const base64FileData = await expoFile.base64();
            const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
            const filePath = `${user.email}/${Date.now()}_${safeFileName}`;

            const { error: storageError } = await supabase.storage
                .from('pending_pdfs')
                .upload(filePath, decode(base64FileData), { contentType: 'application/pdf' });

            if (storageError) throw new Error("Failed to upload the PDF: " + storageError.message);

            const { error: dbError } = await supabase.from('submissions').insert({
                submitter_email: user.email,
                department: selectedDept.title,
                academic_year: selectedYear.label,
                semester: selectedSem.label,
                subject_id: selectedSubj.id,
                category: category,
                topic: topic.trim(),
                file_name: selectedFile.name,
                file_url: filePath,
            });

            if (dbError) throw new Error("Database error: " + dbError.message);

            setSuccess(true);
            setSelectedSubj(null);
            setTopic('');
            setSelectedFile(null);
            setTimeout(() => setSuccess(false), 4000);

        } catch (err) {
            Alert.alert("Submission Failed", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const openDeptPicker = () => {
        if (!manifest || !manifest.departments) return;
        const options = manifest.departments.map(d => ({ label: d.title, data: d }));
        openModal("Select Department", options, (selected) => {
            setSelectedDept(selected.data);
            setSelectedYear(null); setSelectedSem(null); setSelectedSubj(null);
        });
    };

    const openYearPicker = () => {
        if (!selectedDept) return Alert.alert("Hold on", "Please select a department first.");
        const options = selectedDept.years.map(y => ({ label: y.label, data: y }));
        openModal("Select Year", options, (selected) => {
            setSelectedYear(selected.data);
            setSelectedSem(null); setSelectedSubj(null);
        });
    };

    const openSemPicker = () => {
        if (!selectedYear) return Alert.alert("Hold on", "Please select a year first.");
        const options = selectedYear.semesters.map(s => ({ label: s.label, data: s }));
        openModal("Select Semester", options, (selected) => {
            setSelectedSem(selected.data);
            setSelectedSubj(null);
        });
    };

    const openSubjPicker = () => {
        if (!selectedSem) return Alert.alert("Hold on", "Please select a semester first.");
        if (!selectedSem.subjects || selectedSem.subjects.length === 0) return Alert.alert("Empty", "No subjects found for this semester.");

        const options = selectedSem.subjects.map(sub => ({ label: `${sub.id.toUpperCase()}: ${sub.title}`, data: sub }));
        openModal("Select Subject", options, (selected) => {
            setSelectedSubj(selected.data);
        });
    };

    const openModal = (title, data, callback) => {
        setModalTitle(title);
        setModalData(data);
        setOnSelectCallback(() => (item) => {
            callback(item);
            setModalVisible(false);
        });
        setModalVisible(true);
    };

    const DropdownButton = ({ label, value, onPress, disabled }) => (
        <View style={styles.inputGroup}>
            <Tree title={label} style={[styles.label, { color: colors.textSecondary }]} />
            <Pressable
                style={[
                    styles.dropdownBtn, 
                    { backgroundColor: colors.background, borderColor: colors.border },
                    disabled && { backgroundColor: activeTheme === 'dark' ? '#0A0A0A' : '#F2F2F7', borderColor: colors.border }
                ]}
                onPress={onPress}
            >
                <Text style={[
                    styles.dropdownText, 
                    { color: colors.textPrimary },
                    !value && { color: colors.textSecondary }
                ]}>
                    {value || `Select ${label}...`}
                </Text>
                <IconChevronDown color={disabled ? colors.textSecondary : colors.textPrimary} size={20} />
            </Pressable>
        </View>
    );

    const SelectionRow = ({ label, options, selectedValue, onSelect }) => (
        <View style={styles.inputGroup}>
            <Tree title={label} style={[styles.label, { color: colors.textSecondary }]} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
                {options.map((opt) => (
                    <Pressable
                        key={opt}
                        style={[
                            styles.chip, 
                            { backgroundColor: colors.background, borderColor: colors.border },
                            selectedValue === opt && { backgroundColor: colors.accent, borderColor: colors.accent }
                        ]}
                        onPress={() => onSelect(opt)}
                    >
                        <Tree 
                            title={opt} 
                            style={[
                                styles.chipText, 
                                { color: colors.textPrimary },
                                selectedValue === opt && { color: '#FFFFFF' }
                            ]} 
                        />
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.bg}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 12 }]} showsVerticalScrollIndicator={false}>

                    <TitleCard
                        title="Your Contribution Matters"
                        description="Every note you share helps build a stronger, more helpful resource for all DIU students."
                        icon={IconSend}
                    />
                    
                    <View style={[styles.instructionsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Planet title="How it works" style={{ fontSize: 18, marginBottom: 15, color: colors.textPrimary }} />
                        <View style={styles.stepRow}>
                            <IconUserCheck size={24} color={colors.accent} />
                            <Tree title="1. Log in using your university @diu.edu.bd account." style={[styles.stepText, { color: colors.textSecondary }]} />
                        </View>
                        <View style={styles.stepRow}>
                            <IconUpload size={24} color={colors.accent} />
                            <Tree title="2. Fill out the form and attach your clean PDF file." style={[styles.stepText, { color: colors.textSecondary }]} />
                        </View>
                        <View style={styles.stepRow}>
                            <IconSend size={24} color={colors.accent} />
                            <Tree title="3. Wait for admin approval to see your notes live!" style={[styles.stepText, { color: colors.textSecondary }]} />
                        </View>
                    </View>

                    <Mountain title="Submit a File" style={[styles.pageTitle, { color: colors.textPrimary }]} />
                    <Tree title="Your submission will be reviewed by an admin before being published." style={[styles.subtitle, { color: colors.textSecondary }]} />

                    {isAuthChecking ? (
                        <BentoLoader text="Verifying session..." />
                    ) : !user ? (
                        <View style={[styles.successBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <IconAlertCircle color="#FF4444" size={40} />
                            <Mountain title="Authentication Required" style={{ color: '#FF4444', marginTop: 10, textAlign: 'center' }} />
                            <Tree title="You need to login with your @diu.edu.bd email to submit notes." style={{ textAlign: 'center', marginTop: 5, color: colors.textSecondary }} />
                            <AppButton title="Go to Login" onPress={() => router.push('/login')} style={{ marginTop: 20, borderRadius: 16, width: '100%' }} />
                        </View>
                    ) : isFetchingData ? (
                        <BentoLoader text="Syncing curriculum from GitHub..." />
                    ) : success ? (
                        <View style={[styles.successBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <IconCheck color="#00E676" size={40} />
                            <Mountain title="Upload Successful!" style={{ color: '#00E676', marginTop: 10 }} />
                            <Tree title="Your file is now pending approval." style={{ textAlign: 'center', marginTop: 5, color: colors.textSecondary }} />
                        </View>
                    ) : (
                        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>

                            <DropdownButton label="Department" value={selectedDept?.title} onPress={openDeptPicker} />
                            <DropdownButton label="Academic Year" value={selectedYear?.label} onPress={openYearPicker} disabled={!selectedDept} />
                            <DropdownButton label="Semester" value={selectedSem?.label} onPress={openSemPicker} disabled={!selectedYear} />
                            <DropdownButton label="Subject" value={selectedSubj ? `${selectedSubj.id.toUpperCase()}: ${selectedSubj.title}` : null} onPress={openSubjPicker} disabled={!selectedSem} />

                            <SelectionRow label="Material Category" options={categories} selectedValue={category} onSelect={setCategory} />

                            <View style={styles.inputGroup}>
                                <Tree title="Specific Topic" style={[styles.label, { color: colors.textSecondary }]} />
                                <View style={[styles.fakeDropdown, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                    <TextInput
                                        style={[styles.textInput, { color: colors.textPrimary }]}
                                        value={topic}
                                        onChangeText={setTopic}
                                        placeholder="e.g., Binary Logic"
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Tree title="Select PDF File" style={[styles.label, { color: colors.textSecondary }]} />
                                <Pressable 
                                    style={[
                                        styles.fileBox, 
                                        { backgroundColor: activeTheme === 'dark' ? '#1E1E1E' : '#FAFAFA', borderColor: colors.border },
                                        selectedFile && { borderColor: colors.accent, backgroundColor: activeTheme === 'dark' ? '#001A22' : '#E6F9FF' }
                                    ]} 
                                    onPress={pickDocument}
                                >
                                    {selectedFile ? (
                                        <View style={styles.fileBoxInner}>
                                            <IconFileText color={colors.accent} size={32} />
                                            <View style={styles.fileTextContainer}>
                                                <Tree title={selectedFile.name} style={[styles.fileName, { color: colors.textPrimary }]} numberOfLines={1} />
                                                <Tree title={`${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`} style={[styles.fileSize, { color: colors.textSecondary }]} />
                                            </View>
                                            <Pressable onPress={() => setSelectedFile(null)} style={styles.clearFileBtn}>
                                                <IconX color="#FF4444" size={20} />
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <View style={styles.fileBoxInnerCenter}>
                                            <IconUpload color={colors.textSecondary} size={32} />
                                            <Mountain title="Tap to browse files" style={[styles.browseText, { color: colors.textSecondary }]} />
                                        </View>
                                    )}
                                </Pressable>
                            </View>

                            <Pressable
                                style={[
                                    styles.submitButton, 
                                    { backgroundColor: colors.accent },
                                    (!selectedSubj || !topic || !selectedFile) && { backgroundColor: activeTheme === 'dark' ? '#333' : '#E0E0E0' }
                                ]}
                                onPress={handleSubmit}
                                disabled={isLoading || !selectedSubj || !topic || !selectedFile}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Mountain title="Submit Note" style={styles.submitButtonText} />
                                )}
                            </Pressable>

                        </View>
                    )}
                </ScrollView>
            </View>

            <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Mountain title={modalTitle} style={[styles.modalTitleText, { color: colors.textPrimary }]} />
                            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                                <IconX color={colors.textSecondary} size={24} />
                            </Pressable>
                        </View>
                        <FlatList
                            data={modalData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Pressable style={[styles.modalItem, { borderBottomColor: colors.border }]} onPress={() => onSelectCallback(item)}>
                                    <Text style={[styles.modalItemText, { color: colors.textPrimary }]}>{item.label}</Text>
                                </Pressable>
                            )}
                            contentContainerStyle={{ paddingBottom: 40 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </Pressable>
            </Modal>
            
            <Header title="Submit Notes" showBack={true} />
        </View>
    );
};

export default SubmitForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        paddingBottom: 60,
    },
    pageTitle: {
        fontSize: 24,
        textAlign: 'center',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    formCard: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    instructionsContainer: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 20,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    stepText: {
        flex: 1,
        fontSize: 14,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
    },
    dropdownBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    dropdownText: {
        fontSize: 16,
    },
    fakeDropdown: {
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    textInput: {
        fontSize: 16,
    },
    chipContainer: {
        gap: 10,
        paddingRight: 20,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 14,
    },
    fileBox: {
        borderStyle: 'dashed',
        borderWidth: 2,
        borderRadius: 16,
        padding: 20,
    },
    fileBoxInnerCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    fileBoxInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    fileTextContainer: {
        flex: 1,
    },
    fileName: {
        fontSize: 14,
    },
    fileSize: {
        fontSize: 12,
        marginTop: 2,
    },
    browseText: {
        fontSize: 16,
    },
    clearFileBtn: {
        padding: 8,
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        borderRadius: 20,
    },
    submitButton: {
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    successBox: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        borderRadius: 20,
        borderWidth: 1,
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '60%',
        padding: 24,
        borderWidth: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingBottom: 15,
    },
    modalTitleText: {
        fontSize: 20,
    },
    modalCloseBtn: {
        padding: 5,
    },
    modalItem: {
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    modalItemText: {
        fontSize: 16,
    },
});