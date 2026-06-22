import Clipboard from '@react-native-clipboard/clipboard';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Planet, Tree } from '../../appDesign/texts.js';
import DonationHeader from '../../components/Donationheader.jsx';

export default function Citytouch() {
    const [copied, setCopied] = useState(false);
    const bankNumber = '01326174513';

    const handleCopy = () => {
        Clipboard.setString(bankNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <DonationHeader
                title="Support via Citytouch"
                accentColor="#00D4FF"
                backgroundColor="#0A1628"
            />
            <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
                <Planet title="Support Us via Citytouch" />
                <Tree
                    title="Scan the QR below or copy the account number to support DIU Notes Buddy!"
                    style={{ textAlign: 'center' }}
                />

                <View style={styles.card}>
                    <Image
                        source={{
                            uri: 'https://raw.githubusercontent.com/oceanmallik/myWebsite/refs/heads/seed/pages/support/citytouch.png',
                        }}
                        style={styles.image}
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
                        style={{ textAlign: 'center' }}
                    />
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: '#0A1628',
    },
    container: {
        alignItems: 'center',
        padding: 24,
        paddingBottom: 48,
    },
    card: {
        marginTop: 32,
        backgroundColor: '#0F2040',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#00D4FF',
    },
    image: {
        width: '100%',
        aspectRatio: 320 / 440,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1A3050',
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
        borderRadius: 10,
        marginBottom: 16,
    },
    buttonText: {
        color: '#0A1628',
        fontWeight: '700',
        fontSize: 15,
    },
});