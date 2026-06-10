import { IconCheck, IconChevronDown, IconFileText, IconUpload, IconX } from '@tabler/icons-react-native';
import { decode } from 'base64-arraybuffer';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Mountain, Tree } from '../../appDesign/texts';
import { supabase } from '../../lib/supabase';

const SubmitForm = () => {
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

    useEffect(() => {
        fetchManifest();
    }, []);

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

            // Success Reset
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
            <Tree title={label} style={styles.label} />
            <Pressable
                style={[styles.dropdownBtn, disabled && styles.dropdownBtnDisabled]}
                onPress={onPress}
            >
                <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
                    {value || `Select ${label}...`}
                </Text>
                <IconChevronDown color={disabled ? "#555" : "#A0A0A0"} size={20} />
            </Pressable>
        </View>
    );

    const SelectionRow = ({ label, options, selectedValue, onSelect }) => (
        <View style={styles.inputGroup}>
            <Tree title={label} style={styles.label} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
                {options.map((opt) => (
                    <Pressable
                        key={opt}
                        style={[styles.chip, selectedValue === opt && styles.chipActive]}
                        onPress={() => onSelect(opt)}
                    >
                        <Tree title={opt} style={[styles.chipText, selectedValue === opt && styles.chipTextActive]} />
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.bg}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

                    <Mountain title="Submit a File" style={styles.pageTitle} />
                    <Tree title="Your submission will be reviewed by an admin before being published." style={styles.subtitle} />

                    {isFetchingData ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#c3ff00" />
                            <Tree title="Syncing curriculum from GitHub..." style={{ marginTop: 15 }} />
                        </View>
                    ) : success ? (
                        <View style={styles.successBox}>
                            <IconCheck color="#00E676" size={40} />
                            <Mountain title="Upload Successful!" style={{ color: '#00E676', marginTop: 10 }} />
                            <Tree title="Your file is now pending approval." style={{ textAlign: 'center', marginTop: 5 }} />
                        </View>
                    ) : (
                        <View style={styles.formCard}>

                            <DropdownButton label="Department" value={selectedDept?.title} onPress={openDeptPicker} />
                            <DropdownButton label="Academic Year" value={selectedYear?.label} onPress={openYearPicker} disabled={!selectedDept} />
                            <DropdownButton label="Semester" value={selectedSem?.label} onPress={openSemPicker} disabled={!selectedYear} />
                            <DropdownButton label="Subject" value={selectedSubj ? `${selectedSubj.id.toUpperCase()}: ${selectedSubj.title}` : null} onPress={openSubjPicker} disabled={!selectedSem} />

                            <SelectionRow label="Material Category" options={categories} selectedValue={category} onSelect={setCategory} />

                            <View style={styles.inputGroup}>
                                <Tree title="Specific Topic" style={styles.label} />
                                <View style={styles.fakeDropdown}>
                                    <TextInput
                                        style={styles.textInput}
                                        value={topic}
                                        onChangeText={setTopic}
                                        placeholder="e.g., Binary Logic"
                                        placeholderTextColor="#555"
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Tree title="Select PDF File" style={styles.label} />
                                <Pressable style={[styles.fileBox, selectedFile && styles.fileBoxSelected]} onPress={pickDocument}>
                                    {selectedFile ? (
                                        <View style={styles.fileBoxInner}>
                                            <IconFileText color="#00D0FF" size={32} />
                                            <View style={styles.fileTextContainer}>
                                                <Tree title={selectedFile.name} style={styles.fileName} numberOfLines={1} />
                                                <Tree title={`${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`} style={styles.fileSize} />
                                            </View>
                                            <Pressable onPress={() => setSelectedFile(null)} style={styles.clearFileBtn}>
                                                <IconX color="#FF4444" size={20} />
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <View style={styles.fileBoxInnerCenter}>
                                            <IconUpload color="#A0A0A0" size={32} />
                                            <Mountain title="Tap to browse files" style={styles.browseText} />
                                        </View>
                                    )}
                                </Pressable>
                            </View>

                            <Pressable
                                style={[styles.submitButton, (!selectedSubj || !topic || !selectedFile) && styles.submitButtonDisabled]}
                                onPress={handleSubmit}
                                disabled={isLoading || !selectedSubj || !topic || !selectedFile}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#000000" />
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
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Mountain title={modalTitle} style={styles.modalTitleText} />
                            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                                <IconX color="#A0A0A0" size={24} />
                            </Pressable>
                        </View>
                        <FlatList
                            data={modalData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Pressable style={styles.modalItem} onPress={() => onSelectCallback(item)}>
                                    <Text style={styles.modalItemText}>{item.label}</Text>
                                </Pressable>
                            )}
                            contentContainerStyle={{ paddingBottom: 40 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default SubmitForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#131313',
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
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    formCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    inputGroup: {
        marginBottom: 20,
    },
    rowGroup: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 0,
    },
    label: {
        fontSize: 14,
        color: '#A0A0A0',
        marginBottom: 8,
        marginLeft: 4,
    },
    dropdownBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#111111',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333333',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    dropdownBtnDisabled: {
        backgroundColor: '#0A0A0A',
        borderColor: '#222',
    },
    dropdownText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    dropdownPlaceholder: {
        color: '#555555',
    },
    fakeDropdown: {
        backgroundColor: '#111111',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#333333',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    textInput: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    chipContainer: {
        gap: 10,
        paddingRight: 20,
    },
    chip: {
        backgroundColor: '#111111',
        paddingVertical: 1,
        paddingHorizontal: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#333333',
    },
    chipActive: {
        backgroundColor: '#00ff5955',
        borderColor: '#00D0FF',
    },
    chipText: {
        color: '#ffffff',
        fontSize: 14,
    },
    chipTextActive: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    fileBox: {
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#333333',
        borderRadius: 12,
        padding: 20,
        backgroundColor: '#1c682b2c',
    },
    fileBoxSelected: {
        borderStyle: 'solid',
        borderColor: '#00eeff',
        backgroundColor: '#233749',
    },
    fileBoxInnerCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    fileBoxInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
    },
    fileTextContainer: {
        flex: 1,
    },
    fileName: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    fileSize: {
        color: '#b3b3b3',
        fontSize: 12,
        marginTop: 2,
    },
    browseText: {
        color: '#A0A0A0',
        fontSize: 16,
    },
    clearFileBtn: {
        padding: 8,
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        borderRadius: 20,
    },
    submitButton: {
        backgroundColor: '#00D0FF',
        paddingVertical: 1,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonDisabled: {
        backgroundColor: '#333333',
    },
    submitButtonText: {
        color: '#000000',
        fontSize: 18,
    },
    successBox: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '60%',
        padding: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 15,
    },
    modalTitleText: {
        fontSize: 20,
        color: '#FFF',
    },
    modalCloseBtn: {
        padding: 5,
    },
    modalItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    modalItemText: {
        color: '#E0E0E0',
        fontSize: 16,
    },
});