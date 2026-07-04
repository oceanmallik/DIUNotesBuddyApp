import Clipboard from '@react-native-clipboard/clipboard';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Planet, Tree } from '../../appDesign/texts.js';
import DonationHeader from '../../components/Donationheader.jsx';
import { useAppTheme } from '../../logic/ThemeProvider';

export default function Citytouch() {
    const [copied, setCopied] = useState(false);
    const bankNumber = '01326174513';
    const { colors, activeTheme } = useAppTheme();

    const handleCopy = () => {
        Clipboard.setString(bankNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <DonationHeader
                title="Citytouch Donation"
                accentColor="#00D4FF"
                backgroundColor={colors.background}
            />
            <ScrollView style={[styles.scroll, { backgroundColor: colors.background }]} contentContainerStyle={styles.container}>
                <Planet title="Citytouch Donation" style={{ color: colors.textPrimary }} />
                <Tree
                    title="Scan the QR below or copy the account number to support DIU Notes Buddy!"
                    style={{ textAlign: 'center', color: colors.textSecondary }}
                />

                <View style={[styles.card, { backgroundColor: colors.card, borderColor: activeTheme === 'dark' ? '#00D4FF' : colors.border, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                    <Image
                        source={{
                            uri: 'https://raw.githubusercontent.com/oceanmallik/myWebsite/refs/heads/seed/pages/support/citytouch.png',
                        }}
                        style={[styles.image, { borderColor: colors.border }]}
                        resizeMode="contain"
                    />
                    <Text style={styles.label}>Account Number</Text>
                    <Text style={styles.number}>{bankNumber}</Text>

                    <TouchableOpacity style={styles.button} onPress={handleCopy}>
                        <Text style={styles.buttonText}>
                            {copied ? '✓ Copied!' : 'Copy Account Number'}
                        </Text>
                    </TouchableOpacity>

                    <Tree
                        title="Note: Use the Citytouch app to scan the QR or use the phone number to send via phone number. Only CityTouch users can donate for now."
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
        aspectRatio: 320 / 440,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
    },
    label: {
        fontSize: 13,
        color: '#888',
        marginBottom: 4,
    },
    number: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00D4FF',
        marginBottom: 16,
        letterSpacing: 1.5,
    },
    button: {
        backgroundColor: '#00D4FF',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 20,
        marginBottom: 16,
    },
    buttonText: {
        color: '#0A1628',
        fontWeight: '700',
        fontSize: 15,
    },
});