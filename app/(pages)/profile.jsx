import { IconArrowLeft, IconLogout, IconTrash, IconUser, IconShieldLock, IconCalendarStats, IconClock, IconAlertTriangle } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View, Animated, Modal } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../logic/AuthProvider';
import { useAppTheme } from '../../logic/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfilePage() {
    const { user } = useAuth();
    const { colors, activeTheme } = useAppTheme();
    const [accountType, setAccountType] = useState('Loading...');

    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const expandAnim = React.useRef(new Animated.Value(0)).current;
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

    useEffect(() => {
        const checkAccountType = async () => {
            if (!user) {
                setAccountType('Guest');
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('admin_whitelist')
                    .select('email')
                    .eq('email', user.email)
                    .single();

                if (data) {
                    setAccountType('Admin');
                } else {
                    setAccountType('Student');
                }
            } catch (err) {
                setAccountType('Student');
            }
        };
        checkAccountType();
    }, [user]);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const handleLogout = () => setLogoutModalVisible(true);
    const handleDeleteAccount = () => setDeleteModalVisible(true);

    const confirmLogout = async () => {
        setLogoutModalVisible(false);
        try {
            await supabase.auth.signOut();
            router.replace('/login');
        } catch (err) {
            Alert.alert("Logout Error", err.message);
        }
    };

    const confirmDeleteAccount = async () => {
        setDeleteModalVisible(false);
        try {
            const { error } = await supabase.rpc('delete_user');
            if (error) throw error;
            await supabase.auth.signOut();
            router.replace('/login');
        } catch (err) {
            Alert.alert("Error Deleting Account", err.message);
        }
    };

    if (!user) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <LinearGradient
                    colors={activeTheme === 'dark' ? [colors.accent + '25', 'transparent'] : [colors.accent + '15', 'transparent']}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.4 }}
                />
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <IconArrowLeft size={24} color={colors.textPrimary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profile</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centerBox}>
                    <Text style={[styles.infoText, { color: colors.textPrimary }]}>Not logged in.</Text>
                </View>
            </View>
        );
    }

    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    const initial = user?.email?.charAt(0)?.toUpperCase() ?? "?";
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name;

    const createdAt = user?.created_at 
        ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Unknown';
    
    const lastSignIn = user?.last_sign_in_at 
        ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })
        : 'Unknown';
    
    const provider = user?.app_metadata?.provider || 'Email';
    const prov = provider.toLowerCase();
    const isGoogle = prov === 'google' || user?.email?.endsWith('@diu.edu.bd');
    const isGithub = prov === 'github';

    const renderAvatarInner = () => {
        if (avatarUrl) {
            return <Image source={{ uri: avatarUrl }} style={[styles.avatarImage, { marginRight: 0 }]} />;
        }
        return (
            <View style={[styles.avatarCircle, { backgroundColor: activeTheme === 'dark' ? '#1A3340' : '#F0F8FF', marginRight: 0 }]}>
                <Text style={[styles.avatarText, { color: colors.accent }]}>{initial}</Text>
            </View>
        );
    };

    const renderAvatar = () => {
        if (isGoogle) {
            return (
                <View style={{ width: 65, height: 65, borderRadius: 32.5, overflow: 'hidden', marginRight: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ position: 'absolute', top: 0, left: 0, width: 33, height: 33, backgroundColor: '#EA4335' }} />
                    <View style={{ position: 'absolute', top: 0, right: 0, width: 33, height: 33, backgroundColor: '#4285F4' }} />
                    <View style={{ position: 'absolute', bottom: 0, left: 0, width: 33, height: 33, backgroundColor: '#FBBC05' }} />
                    <View style={{ position: 'absolute', bottom: 0, right: 0, width: 33, height: 33, backgroundColor: '#34A853' }} />
                    {renderAvatarInner()}
                </View>
            );
        }
        
        const githubRing = isGithub ? { borderWidth: 2, borderColor: activeTheme === 'dark' ? '#FFFFFF' : '#24292E' } : {};
        
        return (
            <View style={[githubRing, { borderRadius: 32, marginRight: 16, padding: isGithub ? 2 : 0 }]}>
                {renderAvatarInner()}
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={activeTheme === 'dark' ? [colors.accent + '25', 'transparent'] : [colors.accent + '15', 'transparent']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.4 }}
            />
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconArrowLeft size={24} color={colors.textPrimary} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={{ marginBottom: 24 }}>
                    <AnimatedPressable 
                        style={[
                            styles.profileCard, 
                            { 
                                backgroundColor: colors.card, 
                                borderColor: colors.border, 
                                shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}
                        onPress={toggleExpand}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        {renderAvatar()}
                    
                    <View style={styles.infoContainer}>
                        {name && (
                            <Text style={[styles.nameText, { color: colors.textPrimary }]} numberOfLines={2}>{name}</Text>
                        )}
                        <Text style={[styles.emailText, { color: colors.textSecondary }]} numberOfLines={1}>{user.email}</Text>
                        
                        <View style={{ flexDirection: 'row' }}>
                            <View style={[styles.typeBadge, { backgroundColor: accountType === 'Admin' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(10, 126, 164, 0.1)' }]}>
                                <Text style={[styles.typeText, { color: accountType === 'Admin' ? '#FF4444' : colors.accent }]}>
                                    {accountType}
                                </Text>
                            </View>
                        </View>
                        </View>
                    </AnimatedPressable>

                    <Animated.View 
                        style={[
                            styles.drawerContainer, 
                            { 
                                backgroundColor: colors.card,
                                shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
                                zIndex: -1,
                                opacity: expandAnim,
                                maxHeight: expandAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 100]
                                }),
                                marginTop: expandAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -16]
                                }),
                                paddingTop: expandAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 16]
                                }),
                                paddingBottom: expandAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 8]
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
                        <Pressable style={({ pressed }) => [styles.drawerButton, pressed && { opacity: 0.5 }]} onPress={handleDeleteAccount}>
                            <IconTrash size={20} color={colors.destructive} style={{ marginRight: 8 }} />
                            <Text style={[styles.buttonText, { color: colors.destructive }]}>Delete Account</Text>
                        </Pressable>
                    </Animated.View>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Account Details</Text>
                    
                    <View style={[
                        styles.detailsGroup, 
                        { backgroundColor: colors.card, borderColor: colors.border, shadowOpacity: activeTheme === 'dark' ? 0.2 : 0.04 }
                    ]}>
                        <View style={[styles.detailRowGrouped, { borderBottomColor: colors.border }]}>
                            <View style={[styles.detailIconWrap, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                <IconShieldLock size={20} color={colors.accent} />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Auth Provider</Text>
                                <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{provider.charAt(0).toUpperCase() + provider.slice(1)}</Text>
                            </View>
                        </View>

                        <View style={[styles.detailRowGrouped, { borderBottomColor: colors.border }]}>
                            <View style={[styles.detailIconWrap, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                <IconCalendarStats size={20} color={colors.accent} />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Member Since</Text>
                                <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{createdAt}</Text>
                            </View>
                        </View>

                        <View style={[styles.detailRowGrouped, { borderBottomWidth: 0 }]}>
                            <View style={[styles.detailIconWrap, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                <IconClock size={20} color={colors.accent} />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Last Sign In</Text>
                                <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{lastSignIn}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    {provider.toLowerCase() === 'github' && accountType === 'Admin' && (
                        <Pressable
                            onPress={() => router.push('/Admin')}
                            style={({ pressed }) => [
                                styles.actionButton,
                                { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 12 },
                                pressed && { backgroundColor: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
                            ]}
                        >
                            <View style={[styles.iconWrap, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F2F2F7' }]}>
                                <IconShieldLock size={20} color={colors.textPrimary} />
                            </View>
                            <Text style={[styles.actionText, { color: colors.textPrimary }]}>Admin Portal</Text>
                        </Pressable>
                    )}

                    <Pressable
                        onPress={handleLogout}
                        style={({ pressed }) => [
                            styles.actionButton,
                            { backgroundColor: colors.card, borderColor: colors.border },
                            pressed && { backgroundColor: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
                        ]}
                    >
                        <View style={[styles.iconWrap, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F2F2F7' }]}>
                            <IconLogout size={20} color={colors.textPrimary} />
                        </View>
                        <Text style={[styles.actionText, { color: colors.textPrimary }]}>Log out</Text>
                    </Pressable>

                </View>
            </ScrollView>

            {/* Logout Modal */}
            <Modal transparent={true} visible={logoutModalVisible} animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.5 : 0.2 }]}>
                        <View style={[styles.modalIconWrap, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                            <IconLogout size={32} color={colors.accent} />
                        </View>
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Log out?</Text>
                        <Text style={[styles.modalText, { color: colors.textSecondary }]}>Are you sure you want to log out of your account?</Text>
                        <View style={styles.modalActions}>
                            <Pressable style={[styles.modalButton, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]} onPress={() => setLogoutModalVisible(false)}>
                                <Text style={[styles.modalButtonText, { color: colors.textPrimary }]}>Cancel</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, { backgroundColor: colors.accent }]} onPress={confirmLogout}>
                                <Text style={styles.modalButtonTextDestructive}>Log out</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Delete Account Modal */}
            <Modal transparent={true} visible={deleteModalVisible} animationType="fade" onRequestClose={() => setDeleteModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.5 : 0.2 }]}>
                        <View style={[styles.modalIconWrap, { backgroundColor: activeTheme === 'dark' ? '#4A1C1C' : '#FFEDED' }]}>
                            <IconAlertTriangle size={32} color={colors.destructive} />
                        </View>
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Delete Account?</Text>
                        <Text style={[styles.modalText, { color: colors.textSecondary }]}>Are you absolutely sure you want to permanently delete your account? This action cannot be undone.</Text>
                        <View style={styles.modalActions}>
                            <Pressable style={[styles.modalButton, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]} onPress={() => setDeleteModalVisible(false)}>
                                <Text style={[styles.modalButtonText, { color: colors.textPrimary }]}>Cancel</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, { backgroundColor: colors.destructive }]} onPress={confirmDeleteAccount}>
                                <Text style={styles.modalButtonTextDestructive}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    content: {
        padding: 16,
    },
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 24,
        elevation: 4,
    },
    drawerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 1,
        overflow: 'hidden',
    },
    drawerButton: {
        flexDirection: 'row',
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        elevation: 10,
    },
    modalIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonText: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 15,
    },
    modalButtonTextDestructive: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 15,
        color: '#FFFFFF',
    },
    avatarImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    avatarCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    infoContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    nameText: {
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 2,
    },
    emailText: {
        fontSize: 13,
        marginBottom: 8,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    typeText: {
        fontSize: 12,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    detailsContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 12,
        marginLeft: 4,
    },
    detailsGroup: {
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 2,
    },
    detailRowGrouped: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    detailIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 13,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    actionsContainer: {
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: StyleSheet.hairlineWidth,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    actionText: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Bold',
    },
});
