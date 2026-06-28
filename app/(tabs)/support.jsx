import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { IconBookUpload, IconBrandGooglePlay, IconFriends, IconHeart, IconServer, IconUsersGroup, IconWorld } from '@tabler/icons-react-native'
import { router } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'
import { AppButton } from '../../appDesign/button.js'
import { TitleCard, TitleCardLinked } from '../../appDesign/cards.js'
import Header, { useHeaderHeight } from '../../appDesign/header.js'
import { Planet, Tree } from '../../appDesign/texts.js'
import useInterstitialAd from '../../hooks/useInterstitialAd'
import { useAppTheme } from '../../logic/ThemeProvider'

const CARD_WIDTH = 340


const SupportUs = () => {
    const tabBarHeight = useBottomTabBarHeight();
    const { colors, activeTheme } = useAppTheme();
    const { showAd, loaded } = useInterstitialAd();
    const headerHeight = useHeaderHeight();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.bg, { backgroundColor: colors.background }]}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight, paddingBottom: tabBarHeight + 20 }]}
                    showsVerticalScrollIndicator={false}>

                    <TitleCard
                        title="Help Keep Us Running"
                        description="DIU Notes Buddy is free for everyone. Your support keeps our servers online and helps us expand resources."
                        icon={IconHeart}
                    />

                    <Planet title="Why Support Matters" style={{ textAlign: 'center', marginTop: 15, marginBottom: 5, marginHorizontal: 16 }} />

                    <View style={styles.bentoGrid}>
                        {/* Top Full Card */}
                        <TitleCard
                            title="Reliable Hosting"
                            description="Keeps our platform fast and available 24/7 for all students."
                            icon={IconServer}
                        />
                        
                        {/* Bottom Row */}
                        <View style={styles.bentoRow}>
                            <View style={[styles.bentoSquare, { backgroundColor: colors.card, borderColor: colors.border, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                                <View style={[styles.squareIconBox, { backgroundColor: activeTheme === 'dark' ? 'rgba(76, 175, 80, 0.15)' : '#E8F5E9' }]}>
                                    <IconBookUpload size={24} color={activeTheme === 'dark' ? '#4CAF50' : '#2E7D32'} />
                                </View>
                                <Tree title="More Resources" style={[styles.bentoTitle, { color: colors.textPrimary }]} />
                                <Tree title="Fund new courses" style={[styles.bentoSubtitle, { color: colors.textSecondary }]} />
                            </View>

                            <View style={[styles.bentoSquare, { backgroundColor: colors.card, borderColor: colors.border, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05 }]}>
                                <View style={[styles.squareIconBox, { backgroundColor: activeTheme === 'dark' ? 'rgba(156, 39, 176, 0.15)' : '#F3E5F5' }]}>
                                    <IconUsersGroup size={24} color={activeTheme === 'dark' ? '#BA68C8' : '#8E24AA'} />
                                </View>
                                <Tree title="Community" style={[styles.bentoTitle, { color: colors.textPrimary }]} />
                                <Tree title="Support the team" style={[styles.bentoSubtitle, { color: colors.textSecondary }]} />
                            </View>
                        </View>
                    </View>

                    <Planet title="Donate & Support" style={{ textAlign: 'center', marginBottom: 10, marginHorizontal: 16 }} />
                    
                    <View style={styles.actionGrid}>
                        <AppButton
                            onPress={() => loaded ? showAd() : null}
                            title={loaded ? "Watch an Ad (Free)" : "Ad Loading..."}
                            style={styles.fullWidthButton}
                        />
                        <View style={styles.buttonRow}>
                            <AppButton
                                onPress={() => router.push('/bKash')}
                                title="bKash"
                                style={styles.halfButton}
                            />
                            <AppButton
                                onPress={() => router.push('/Bank')}
                                title="Bank"
                                style={styles.halfButton}
                            />
                        </View>
                    </View>

                    <Planet title="Other Ways to Help" style={{ textAlign: 'center', marginBottom: 10, marginTop: 15, marginHorizontal: 16 }} />
                    
                    <View style={{ gap: 0, marginBottom: 30 }}>
                        <TitleCardLinked
                            title="Rate Us on Google Play"
                            icon={IconBrandGooglePlay}
                            link="https://play.google.com/store/apps/details?id=com.oceanmallik.diunote"
                        />
                        <TitleCardLinked
                            title="Visit Web Version"
                            icon={IconWorld}
                            link="https://diunotesbuddy.live/"
                        />
                        <TitleCardLinked
                            title="Meet the Team"
                            icon={IconFriends}
                            link="/about"
                        />
                    </View>
                </ScrollView>
            </View>
            <Header title="Fuel Our Journey" />
        </View>
    )
}

export default SupportUs

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    bg: {
        flex: 1,
        width: '100%',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 10,
        justifyContent: 'flex-start',
    },
    bentoGrid: {
        width: '100%',
        marginBottom: 20,
    },
    bentoRow: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 16,
        marginTop: 4,
    },
    bentoSquare: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 2,
    },
    squareIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    bentoTitle: {
        fontSize: 15,
        fontFamily: 'SpaceGrotesk-Bold',
        textAlign: 'center',
    },
    bentoSubtitle: {
        fontSize: 11,
        fontFamily: 'SpaceGrotesk-Regular',
        textAlign: 'center',
        marginTop: 1,
    },
    actionGrid: {
        width: '100%',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    fullWidthButton: {
        width: '100%',
        marginHorizontal: 0,
        marginTop: 0,
        paddingVertical: 16,
    },
    halfButton: {
        flex: 1,
        marginHorizontal: 0,
        marginTop: 0,
        paddingVertical: 16,
    },
})