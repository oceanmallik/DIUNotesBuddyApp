import { IconArrowLeft, IconLogout, IconTrash, IconUser } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../logic/AuthProvider';
import { useAppTheme } from '../../logic/ThemeProvider';

export default function ProfilePage() {
    const { user } = useAuth();
    const { colors, activeTheme } = useAppTheme();
    const [accountType, setAccountType] = useState('Loading...');

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

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            router.replace('/login');
        } catch (err) {
            Alert.alert("Logout Error", err.message);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to permanently delete your account?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { error } = await supabase.rpc('delete_user');

                            if (error) throw error;

                            await supabase.auth.signOut();
                            router.replace('/login');
                        } catch (err) {
                            Alert.alert("Error Deleting Account", err.message);
                        }
                    },
                },
            ]
        );
    };

    if (!user) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
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

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconArrowLeft size={24} color={colors.textPrimary} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                    ) : (
                        <View style={[styles.avatarCircle, { backgroundColor: activeTheme === 'dark' ? '#1A3340' : '#F0F8FF' }]}>
                            <Text style={[styles.avatarText, { color: colors.accent }]}>{initial}</Text>
                        </View>
                    )}
                    
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
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Account Details</Text>
                    
                    <View style={[styles.detailRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.detailTextContainer}>
                            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Auth Provider</Text>
                            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{provider.charAt(0).toUpperCase() + provider.slice(1)}</Text>
                        </View>
                    </View>

                    <View style={[styles.detailRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.detailTextContainer}>
                            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Member Since</Text>
                            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{createdAt}</Text>
                        </View>
                    </View>

                    <View style={[styles.detailRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.detailTextContainer}>
                            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Last Sign In</Text>
                            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{lastSignIn}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionsContainer}>
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

                    <Pressable
                        onPress={handleDeleteAccount}
                        style={({ pressed }) => [
                            styles.actionButton,
                            { backgroundColor: colors.card, borderColor: colors.border, marginTop: 12 },
                            pressed && { backgroundColor: activeTheme === 'dark' ? 'rgba(255, 69, 58, 0.2)' : 'rgba(255, 59, 48, 0.1)' }
                        ]}
                    >
                        <View style={[styles.iconWrap, { backgroundColor: activeTheme === 'dark' ? '#4A1C1C' : '#FFEDED' }]}>
                            <IconTrash size={20} color={colors.destructive} />
                        </View>
                        <Text style={[styles.actionText, { color: colors.destructive }]}>Delete Account</Text>
                    </Pressable>
                </View>
            </ScrollView>
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
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 24,
        elevation: 4,
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
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        marginBottom: 10,
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
