import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../logic/ThemeProvider';

export const fonts = {
    regular: "SpaceGrotesk-Regular",
    bold: "SpaceGrotesk-Bold",
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function NameCard({ name, username, webURL, cardURL, email, photoURL, contribution, button1, button3, ID }) {
    const { colors, activeTheme } = useAppTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const expandAnim = useRef(new Animated.Value(0)).current;
    const [expanded, setExpanded] = useState(false);

    const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
    const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    const toggleExpand = () => {
        const nextState = !expanded;
        setExpanded(nextState);
        Animated.spring(expandAnim, {
            toValue: nextState ? 1 : 0,
            useNativeDriver: false,
            friction: 7,
            tension: 50,
        }).start();
    };

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
                onPress={toggleExpand}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Image source={{ uri: photoURL }} style={[styles.avatar, { backgroundColor: colors.background }]} />
                <View style={styles.content}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>{name}</Text>
                        <View style={[styles.handleBox, { backgroundColor: colors.background }]}>
                            <Text style={[styles.uName, { color: colors.accent }]} numberOfLines={1}>{username}</Text>
                        </View>
                    </View>
                    <Text style={[styles.contribution, { color: colors.textSecondary }]}>{contribution}</Text>
                    <Text style={[styles.contributionLight, { color: colors.textSecondary }]}>ID: {ID}</Text>
                </View>
            </AnimatedPressable>

            <Animated.View 
                style={[
                    styles.buttonContainer, 
                    { 
                        zIndex: -1,
                        opacity: expandAnim,
                        maxHeight: expandAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 150]
                        }),
                        marginTop: expandAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -15]
                        }),
                        paddingTop: expandAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 15]
                        }),
                        paddingBottom: expandAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 14]
                        }),
                        transform: [{
                            translateY: expandAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-20, 0]
                            })
                        }]
                    }
                ]}
                pointerEvents={expanded ? 'auto' : 'none'}
            >
                <Pressable style={({ pressed }) => [styles.cleanButton, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }, pressed && { opacity: 0.8 }]} onPress={() => Linking.openURL(cardURL)}>
                    <Text style={[styles.buttonText, { color: colors.textPrimary }]}>GitHub</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.cleanButton, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }, pressed && { opacity: 0.8 }]} onPress={() => Linking.openURL(webURL)}>
                    <Text style={[styles.buttonText, { color: colors.textPrimary }]}>{button1}</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.cleanButton, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }, pressed && { opacity: 0.8 }]} onPress={() => Linking.openURL(email)}>
                    <Text style={[styles.buttonText, { color: colors.textPrimary }]}>{button3}</Text>
                </Pressable>
            </Animated.View>
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
        marginVertical: 5,
    },
    nameCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    titleCardWrapper: {
        marginHorizontal: 16,
        marginVertical: 5,
    },
    titleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 12,
        gap: 12,
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
        marginVertical: 5,
    },
    titleCardLinked: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 12,
        gap: 12,
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
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontFamily: fonts.bold,
        fontSize: 17,
        flex: 1,
        marginRight: 8,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    handleBox: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
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
        fontFamily: fonts.bold,
        fontSize: 11,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        overflow: 'hidden',
    },
    cleanButton: {
        marginHorizontal: 4,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 1,
    },
    buttonText: {
        fontFamily: fonts.bold,
        fontSize: 13,
    },
});