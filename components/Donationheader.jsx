import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DonationHeader({ title, accentColor = '#00D4FF', backgroundColor = '#0A1628' }) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.wrapper, { paddingTop: insets.top, backgroundColor }]}>
            <View style={styles.inner}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
                    <Text style={[styles.backArrow, { color: accentColor }]}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: accentColor }]} numberOfLines={1}>
                    {title}
                </Text>
                {/* spacer to keep title centered */}
                <View style={styles.spacer} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 36,
        alignItems: 'flex-start',
    },
    backArrow: {
        fontSize: 22,
        fontWeight: '600',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.4,
    },
    spacer: {
        width: 36,
    },
});