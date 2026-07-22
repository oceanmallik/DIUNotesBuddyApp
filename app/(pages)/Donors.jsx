import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { TitleCard } from '../../appDesign/cards.js';
import Header, { useHeaderHeight } from '../../appDesign/header.js';
import { Planet, Tree, Leaf } from '../../appDesign/texts.js';
import { useAppTheme } from '../../logic/ThemeProvider';
import { supabase } from '../../lib/supabase';
import { IconHeart, IconCoin } from '@tabler/icons-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Donors = () => {
    const tabBarHeight = 100;
    const { colors, activeTheme } = useAppTheme();
    const headerHeight = useHeaderHeight();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            const { data, error } = await supabase
                .from('donations')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setDonations(data);
            }
            setLoading(false);
        };
        fetchDonations();
    }, []);

    const renderItem = ({ item, index }) => {
        const isLatest = index === 0;

        return (
            <View style={styles.bubbleContainer}>
                <View style={[styles.avatarCircle, { backgroundColor: colors.accent + '20' }]}>
                    <Text style={[styles.avatarText, { color: colors.accent }]}>
                        {item.donor_name ? item.donor_name.charAt(0).toUpperCase() : '?'}
                    </Text>
                </View>
                <View style={styles.bubbleContent}>
                    <View
                        style={[
                            styles.card,
                            { 
                                backgroundColor: activeTheme === 'dark' ? '#000000' : colors.card,
                                shadowColor: '#000',
                                borderWidth: 0
                            }
                        ]}
                    >
                        <View style={styles.cardHeader}>
                            <Planet title={item.donor_name || 'Anonymous'} style={{ fontSize: 16 }} />
                            <View style={[styles.amountBadge, { backgroundColor: '#FFA000', shadowColor: '#FFA000', shadowOpacity: 0.4, shadowRadius: 6, elevation: 3 }]}>
                                <IconCoin size={14} color="#FFF" />
                                <Text style={[styles.amountText, { color: '#FFF' }]}>{item.amount}</Text>
                            </View>
                        </View>
                        {item.message ? (
                            <Tree title={`"${item.message}"`} style={{ color: colors.textSecondary, marginTop: 2, fontStyle: 'italic', fontSize: 13 }} />
                        ) : null}
                        <Leaf title={new Date(item.created_at).toLocaleString()} style={{ marginTop: 2, fontSize: 9, color: colors.textSecondary, alignSelf: 'flex-end' }} />
                    </View>
                </View>
            </View>
        );
    };

    const renderHeader = () => (
        <View style={{ marginBottom: 20 }}>
            <TitleCard
                title="Recent Donors"
                description="A big thank you to everyone who supports DIU Notes Buddy. You keep this project alive!"
                icon={IconHeart}
            />
            {donations.length === 0 && !loading && (
                <Tree title="No donations yet. Be the first to support!" style={{ textAlign: 'center', marginTop: 20 }} />
            )}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.bg, { backgroundColor: colors.background }]}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: headerHeight + 50 }} />
                ) : (
                    <FlatList
                        data={donations}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        inverted={true}
                        ListFooterComponent={renderHeader}
                        contentContainerStyle={[styles.scrollContent, { paddingTop: tabBarHeight + 20, paddingBottom: headerHeight + 12 }]}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
            <Header title="Donors" showBack={true} />
        </View>
    );
};

export default Donors;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bg: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    bubbleContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        maxWidth: '95%',
        alignItems: 'flex-end',
    },
    avatarCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginBottom: 4,
    },
    avatarText: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 14,
    },
    bubbleContent: {
        flex: 1,
    },
    card: {
        padding: 14,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        borderBottomLeftRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
        gap: 12,
    },
    amountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    amountText: {
        fontWeight: 'bold',
        fontSize: 13,
    }
});
