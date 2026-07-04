import Clipboard from '@react-native-clipboard/clipboard';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Planet, Tree } from '../../appDesign/texts.js';
import DonationHeader from '../../components/Donationheader.jsx';
import { useAppTheme } from '../../logic/ThemeProvider';

export default function bKash() {
    const [copied, setCopied] = useState(false);
    const bkashNumber = '01864103655';
    const { colors, activeTheme } = useAppTheme();

    const handleCopy = () => {
        Clipboard.setString(bkashNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <DonationHeader
                title="bkash Donation"
                accentColor="#E2136E"
                backgroundColor={colors.background}
            />
            <ScrollView style={[styles.scroll, { backgroundColor: colors.background }]} contentContainerStyle={styles.container}>
                <Planet title="bkash Donation" style={{ color: colors.textPrimary }} />
                <Tree
                    title="Click the copy button below to copy our bKash number and help us keep this project alive!"
                    style={{ textAlign: 'center', color: colors.textSecondary }}
                />

                <View style={[styles.card, { backgroundColor: colors.card, borderColor: activeTheme === 'dark' ? '#E2136E' : colors.border, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                    <Image
                        source={{ uri: 'https://diunotesbuddy.live/webAssets/bkash.jpg' }}
                        style={[styles.image, { borderColor: colors.border, borderWidth: 1 }]}
                        resizeMode="contain"
                    />
                    <Text style={styles.label}>bKash Number</Text>
                    <Text style={styles.number}>{bkashNumber}</Text>

                    <TouchableOpacity style={styles.button} onPress={handleCopy}>
                        <Text style={styles.buttonText}>
                            {copied ? '✓ Copied!' : 'Copy Number'}
                        </Text>
                    </TouchableOpacity>

                    <Tree
                        title="Note: Make sure to use Send Money option."
                        style={{ textAlign: 'center', color: colors.textSecondary }}
                    />
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    container: {
        alignItems: 'center',
        padding: 24,
        paddingBottom: 48,
    },
    card: {
        marginTop: 32,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        color: '#888',
        marginBottom: 4,
    },
    number: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#E2136E',
        marginBottom: 16,
        letterSpacing: 1.5,
    },
    button: {
        backgroundColor: '#E2136E',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 20,
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});