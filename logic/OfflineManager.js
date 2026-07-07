import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const OFFLINE_NOTES_KEY = '@offline_notes';

export const OfflineManager = {
    getSafeFilename: (url) => {
        const hash = url.split('/').pop().replace(/[^a-zA-Z0-9.-]/g, '_');
        const randomString = Math.random().toString(36).substring(7);
        return `${randomString}_${hash}`;
    },

    getSavedNotes: async () => {
        try {
            const data = await AsyncStorage.getItem(OFFLINE_NOTES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error getting saved notes:', e);
            return [];
        }
    },

    downloadNote: async (url, title, subject = 'Saved Note', onProgress) => {
        try {
            const saved = await OfflineManager.getSavedNotes();
            if (saved.find(n => n.url === url)) {
                return true; 
            }

            const filename = OfflineManager.getSafeFilename(url);
            const fileUri = `${FileSystem.documentDirectory}${filename}`;

            const downloadResumable = FileSystem.createDownloadResumable(
                url,
                fileUri,
                {},
                (downloadProgress) => {
                    if (onProgress) {
                        if (downloadProgress.totalBytesExpectedToWrite > 0) {
                            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                            onProgress(progress);
                        } else {
                            // If Content-Length is missing (common with GitHub/G-Drive), simulate progress
                            // Assume an average PDF is ~3MB (3000000 bytes) for the fake progress
                            const fakeProgress = Math.min(0.95, downloadProgress.totalBytesWritten / 3000000);
                            onProgress(fakeProgress);
                        }
                    }
                }
            );

            const { uri } = await downloadResumable.downloadAsync();

            const newNote = {
                id: Math.random().toString(36).substring(2, 9),
                url,
                localUri: uri,
                filename,
                title: title || 'Untitled Note',
                subject: subject,
                savedAt: new Date().toISOString()
            };

            await AsyncStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify([...saved, newNote]));
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            Alert.alert('Download Error', error.message || JSON.stringify(error));
            return false;
        }
    },

    deleteNote: async (url) => {
        try {
            const saved = await OfflineManager.getSavedNotes();
            const note = saved.find(n => n.url === url);
            if (note) {
                await FileSystem.deleteAsync(note.localUri, { idempotent: true });
                const newSaved = saved.filter(n => n.url !== url);
                await AsyncStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify(newSaved));
            }
            return true;
        } catch (error) {
            console.error('Delete failed:', error);
            return false;
        }
    },

    getLocalUri: async (url) => {
        try {
            const saved = await OfflineManager.getSavedNotes();
            const note = saved.find(n => n.url === url);
            if (note) {
                const fileInfo = await FileSystem.getInfoAsync(note.localUri);
                if (fileInfo.exists) {
                    return note.localUri;
                } else {
                    await OfflineManager.deleteNote(url);
                    return null;
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    }
};
