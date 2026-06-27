import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../logic/ThemeProvider';

export const fonts = {
    regular: "SpaceGrotesk-Regular",
    bold: "SpaceGrotesk-Bold",
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function NameCard({ name, username, webURL, cardURL, otherURL, email, photoURL, contribution, button1, button2, button3, ID }) {
    const { colors, activeTheme } = useAppTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [expanded, setExpanded] = useState(false);

    const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
    const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    return (
        <View style={styles.wrapper}>
            <AnimatedPressable 
                style={[
                    styles.nameCard, 
                    { 
                        backgroundColor: colors.card,
                        transform: [{ scale: scaleAnim }],
                        shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
                    }
                ]} 
                onPress={() => setExpanded(!expanded)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Image source={{ uri: photoURL }} style={[styles.avatar, { backgroundColor: colors.background }]} />
                <View style={styles.content}>
                    <Text style={[styles.name, { color: colors.textPrimary }]}>{name}</Text>
                    <Text style={[styles.uName, { color: colors.accent }]}>{username}</Text>
                    <Text style={[styles.contribution, { color: colors.textSecondary }]}>{contribution}</Text>
                    <Text style={[styles.contributionLight, { color: colors.textSecondary }]}>ID: {ID}</Text>
                </View>
            </AnimatedPressable>

            {expanded && (
                <View style={styles.buttonContainer}>
                    <Pressable style={({ pressed }) => [styles.cleanButton, { backgroundColor: colors.background }, pressed && { backgroundColor: colors.border }]} onPress={() => Linking.openURL(cardURL)}>
                        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>GitHub</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [styles.cleanButton, { backgroundColor: colors.background }, pressed && { backgroundColor: colors.border }]} onPress={() => Linking.openURL(webURL)}>
                        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>{button1}</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [styles.cleanButton, { backgroundColor: colors.background }, pressed && { backgroundColor: colors.border }]} onPress={() => Linking.openURL(otherURL)}>
                        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>{button2}</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [styles.cleanButton, { backgroundColor: colors.background }, pressed && { backgroundColor: colors.border }]} onPress={() => Linking.openURL(email)}>
                        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>{button3}</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

export function TitleCard({ title, description, icon: Icon }) {
    const { colors, activeTheme } = useAppTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
    const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    return (
        <AnimatedPressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={[styles.titleCardWrapper, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.titleCard, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    <Icon size={24} color={colors.accent} strokeWidth={2} />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.nameTwo, { color: colors.textPrimary }]}>{title}</Text>
                    {description && <Text style={[styles.subname, { color: colors.textSecondary }]}>{description}</Text>}
                </View>
            </View>
        </AnimatedPressable>
    )
}

export function TitleCardScroll({ title, description, icon: Icon }) {
    const { colors, activeTheme } = useAppTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
    const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    return (
        <AnimatedPressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={[styles.titleCardScrollWrapper, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.titleCardScroll, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    <Icon size={24} color={colors.accent} strokeWidth={2} />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.nameTwo, { color: colors.textPrimary }]}>{title}</Text>
                    {description && <Text style={[styles.subname, { color: colors.textSecondary }]}>{description}</Text>}
                </View>
            </View>
        </AnimatedPressable>
    )
}

export function TitleCardLinked({ title, link, icon: Icon }) {
    const { colors, activeTheme } = useAppTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
    const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    return (
        <AnimatedPressable
            style={[styles.titleCardLinkedWrapper, { transform: [{ scale: scaleAnim }] }]}
            onPress={() => router.push(link)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <View style={[styles.titleCardLinked, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                <View style={[styles.iconContainer, { backgroundColor: activeTheme === 'dark' ? '#1A3320' : '#E8F5E9' }]}>
                    <Icon size={20} color={activeTheme === 'dark' ? '#4CAF50' : '#2E7D32'} strokeWidth={2} />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.nameThree, { color: colors.textPrimary }]}>{title}</Text>
                </View>
            </View>
        </AnimatedPressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
    nameCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    titleCardWrapper: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
    titleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 16,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    titleCardScrollWrapper: {
        marginHorizontal: 8,
        marginVertical: 4,
        width: 300,
    },
    titleCardScroll: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 14,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    titleCardLinkedWrapper: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
    titleCardLinked: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 16,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    content: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontFamily: fonts.bold,
        fontSize: 18,
        marginBottom: 2,
    },
    nameTwo: {
        fontFamily: fonts.bold,
        fontSize: 16,
    },
    nameThree: {
        fontFamily: fonts.bold,
        fontSize: 15,
    },
    subname: {
        fontFamily: fonts.regular,
        fontSize: 13,
        marginTop: 2,
        lineHeight: 18,
    },
    contribution: {
        fontFamily: fonts.regular,
        fontSize: 12,
        marginTop: 2,
    },
    contributionLight: {
        fontFamily: fonts.regular,
        fontSize: 12,
        marginTop: 2,
    },
    uName: {
        fontFamily: fonts.regular,
        fontSize: 14,
        marginBottom: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    cleanButton: {
        marginTop: 8,
        marginHorizontal: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    buttonText: {
        fontFamily: fonts.bold,
        fontSize: 13,
    },
});