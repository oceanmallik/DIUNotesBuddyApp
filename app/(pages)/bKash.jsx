import Clipboard from '@react-native-clipboard/clipboard';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Planet, Tree } from '../../appDesign/texts.js';

export default function bKash() {
    const [copied, setCopied] = useState(false);
    const bkashNumber = '01864103655';

    const handleCopy = () => {
        Clipboard.setString(bkashNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    return (
        <View style={styles.container}>
            <Planet title="Support US via bKash" />
            <Tree title="Click the copy button below to copy our bKash number and help us keep this project alive!" style={{ textAlign: 'center' }} />

            <View style={styles.card}>
                <Image
                    source={{ uri: 'https://diunotesbuddy.live/webAssets/bkash.jpg' }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.label}>bKash Number</Text>
                <Text style={styles.number}>{bkashNumber}</Text>
                <TouchableOpacity style={styles.button} onPress={handleCopy}>
                    <Text style={styles.buttonText}>Copy Number</Text>
                </TouchableOpacity>

                <Tree title="Note: Make sure to use Send Money option. " style={{ textAlign: 'center' }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        marginBottom: 30,
        backgroundColor: '#290000',
    },
    card: {
        marginTop: 32,
        backgroundColor: '#370000',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#E2136E',
    },
    image: {
        width: 240,
        height: 240,
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
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});