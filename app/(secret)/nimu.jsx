import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import Header, { useHeaderHeight } from '../../appDesign/header';
import { useAppTheme } from '../../logic/ThemeProvider';

const { width, height } = Dimensions.get('window');

const galleryPhotos = [
    { id: '1', url: 'https://nimu.oceanmallik.com/galleryPhoto/friendphoto-1.jpg', caption: 'Radiant and unapologetically you', icon: 'sunny-outline' },
    { id: '2', url: 'https://nimu.oceanmallik.com/galleryPhoto/friendphoto-2.jpg', caption: 'Grace wears many colors', icon: 'color-palette-outline' },
    { id: '3', url: 'https://nimu.oceanmallik.com/galleryPhoto/friendphoto-3.jpg', caption: 'Warmth in every moment', icon: 'cafe-outline' },
    { id: '4', url: 'https://nimu.oceanmallik.com/galleryPhoto/friendphoto-5.jpg', caption: 'Lost in thought, found in peace', icon: 'leaf-outline' },
    { id: '5', url: 'https://nimu.oceanmallik.com/galleryPhoto/friendphoto-4.jpg', caption: 'Cinematic soul, gentle heart', icon: 'film-outline' },
    { id: '6', url: 'https://nimu.oceanmallik.com/galleryPhoto/friendphoto-6.jpg', caption: 'In your own world, but never alone', icon: 'planet-outline' },
    { id: '7', url: 'https://nimu.oceanmallik.com/galleryPhoto/friendphoto-7.jpg', caption: 'Pure joy, unapologetic smile', icon: 'happy-outline' }
];

const TapEffect = ({ tap }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease)
        }).start();
    }, []);

    const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });
    const opacity = anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
    const scale = anim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.5, 1.3, 1] });

    return (
        <Animated.View style={{
            position: 'absolute',
            left: tap.x - 12, // center the 24px icon
            top: tap.y - 12,
            transform: [{ translateY }, { scale }],
            opacity,
            zIndex: 9999,
            pointerEvents: 'none'
        }}>
            <Ionicons name={tap.icon} size={24} color="#f43f5e" />
        </Animated.View>
    );
};

export default function NimuVault() {
    const { colors, activeTheme } = useAppTheme();
    const headerHeight = useHeaderHeight();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef(null);

    // Tap Effect State
    const [taps, setTaps] = useState([]);
    
    // Audio Player State
    const [sound, setSound] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    const onPlaybackStatusUpdate = (status) => {
        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
            if (status.didJustFinish) {
                setIsPlaying(false);
            }
        }
    };

    async function togglePlayback() {
        if (!sound) {
            const { sound: newSound } = await Audio.Sound.createAsync(
                require('../../assets/audio/song.m4a'),
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );
            setSound(newSound);
            setIsPlaying(true);
        } else {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        }
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const formatTime = (millis) => {
        if (!millis) return '0:00';
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = async (value) => {
        if (sound) {
            await sound.setPositionAsync(value);
        }
    };

    const handleScreenTap = (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const icons = ['happy', 'star', 'sparkles', 'planet', 'flash'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];

        const newTap = {
            id: Date.now().toString() + Math.random(),
            x: pageX,
            y: pageY,
            icon: randomIcon
        };

        setTaps(prev => [...prev, newTap]);

        setTimeout(() => {
            setTaps(prev => prev.filter(t => t.id !== newTap.id));
        }, 1000);
    };

    // Continuous Animations
    const floatAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Floating for chaos cards
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ])
        ).start();

        // Subtle pulsing for the quote
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ])
        ).start();
    }, []);

    // Parallax logic
    const imageTranslateY = scrollY.interpolate({
        inputRange: [0, height * 0.6],
        outputRange: [0, height * 0.3], // Moves up slower than the scroll
        extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, height * 0.5],
        outputRange: [1, 0], // Fades out completely
        extrapolate: 'clamp',
    });

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
            onTouchStart={handleScreenTap}
        >

            {/* Parallax Background Hero */}
            <Animated.View style={[
                styles.parallaxHeroContainer,
                {
                    top: headerHeight,
                    opacity: imageOpacity,
                    transform: [{ translateY: imageTranslateY }]
                }
            ]}>
                <Image
                    source={{ uri: 'https://nimu.oceanmallik.com/bestFriend.jpg' }}
                    style={styles.heroImage}
                />
                <View style={styles.heroOverlay}>
                    <Text style={[styles.heroSubtitle, { color: '#ffffff' }]}>A nostalgic letter in motion</Text>
                    <Text style={[styles.heroTitle, { color: '#ffffff' }]}>
                        Tasnim Iffat Nimu
                    </Text>
                    <Text style={[styles.heroText, { color: '#dddddd' }]}>
                        We met in high school in 2022, and somehow the world made room for a sister disguised as a best friend.
                    </Text>
                </View>
            </Animated.View>

            {/* Scrolling Content */}
            <Animated.ScrollView
                ref={scrollRef}
                contentContainerStyle={{ paddingTop: (height * 0.6) + headerHeight, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Wrap all cards in a solid background so they slide cleanly over the fading hero image */}
                <View style={{ backgroundColor: colors.background, minHeight: height, paddingTop: 20 }}>

                    {/* Info Card */}
                    <View style={[styles.card, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05, marginTop: -40, position: 'relative' }]}>
                        <View style={{ position: 'absolute', top: -15, right: 20, backgroundColor: '#f43f5e', borderRadius: 20, padding: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, transform: [{ rotate: '15deg' }], zIndex: 10 }}>
                            <Ionicons name="sparkles" size={20} color="#fff" />
                        </View>
                        <Text style={[styles.eyebrow, { color: colors.accent }]}>The feeling</Text>
                        <Text style={[styles.heading, { color: colors.textPrimary }]}>Warmth and the kind of trust that does not need explaining.</Text>

                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>First Met</Text>
                                <Text style={[styles.statValue, { color: colors.textPrimary }]}>2022</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Energy</Text>
                                <Text style={[styles.statValue, { color: colors.textPrimary }]}>Chaotic</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Bond</Text>
                                <Text style={[styles.statValue, { color: colors.textPrimary }]}>Brother-Sister</Text>
                            </View>
                        </View>
                    </View>

                    {/* Friendship Stats */}
                    <View style={styles.section}>
                        <Text style={[styles.eyebrow, { color: colors.accent, textAlign: 'center' }]}>The Numbers Don't Lie</Text>
                        <Text style={[styles.heading, { color: colors.textPrimary, textAlign: 'center', marginBottom: 20 }]}>Friendship Stats</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {[
                                { label: 'Hours of nonsense', value: '∞' },
                                { label: 'Fights over nothing', value: '42' },
                                { label: 'Secrets kept', value: '100%' },
                                { label: 'Brain cells shared', value: '1' }
                            ].map((stat, i) => (
                                <View key={i} style={[styles.statCard, { backgroundColor: colors.card }]}>
                                    <Text style={[styles.statValueBig, { color: colors.accent }]}>{stat.value}</Text>
                                    <Text style={[styles.statLabelBig, { color: colors.textSecondary }]}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Timeline Memories */}
                    <View style={styles.section}>
                        <Text style={[styles.eyebrow, { color: colors.accent, textAlign: 'center' }]}>Timeline memories</Text>
                        <Text style={[styles.heading, { color: colors.textPrimary, textAlign: 'center', marginBottom: 20 }]}>A glowing trail through high school.</Text>

                        <View style={[styles.memoryCard, { backgroundColor: colors.card }]}>
                            <View style={{ position: 'relative' }}>
                                <Image source={{ uri: 'https://nimu.oceanmallik.com/timelineMemories/theFirstHello.png' }} style={styles.memoryImage} />
                                <View style={{ position: 'absolute', bottom: 5, right: -5, backgroundColor: '#3b82f6', borderRadius: 20, padding: 6, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 }}>
                                    <Ionicons name="hand-right" size={16} color="#fff" />
                                </View>
                            </View>
                            <Text style={[styles.memoryYear, { color: colors.accent }]}>The Starting Point</Text>
                            <Text style={[styles.memoryTitle, { color: colors.textPrimary }]}>The First Hello</Text>
                            <Text style={[styles.memoryText, { color: colors.textSecondary }]}>Back when we both actually used punctuation and had manners. It’s the calm before the storm—pure, innocent and 1000% deceptive.</Text>
                        </View>

                        <View style={[styles.memoryCard, { backgroundColor: colors.card }]}>
                            <View style={{ position: 'relative' }}>
                                <Image source={{ uri: 'https://nimu.oceanmallik.com/timelineMemories/jokesAbout.png' }} style={styles.memoryImage} />
                                <View style={{ position: 'absolute', bottom: 5, right: -5, backgroundColor: '#eab308', borderRadius: 20, padding: 6, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 }}>
                                    <Ionicons name="flash" size={16} color="#fff" />
                                </View>
                            </View>
                            <Text style={[styles.memoryYear, { color: colors.accent }]}>Rage Bait</Text>
                            <Text style={[styles.memoryTitle, { color: colors.textPrimary }]}>Professional Annoyance</Text>
                            <Text style={[styles.memoryText, { color: colors.textSecondary }]}>Little habits became proof of closeness: the same jokes repeated without getting old, the same glances that said everything before words did.</Text>
                        </View>

                        <View style={[styles.memoryCard, { backgroundColor: colors.card }]}>
                            <View style={{ position: 'relative' }}>
                                <Image source={{ uri: 'https://nimu.oceanmallik.com/timelineMemories/quiteSupport.png' }} style={styles.memoryImage} />
                                <View style={{ position: 'absolute', bottom: 5, right: -5, backgroundColor: '#10b981', borderRadius: 20, padding: 6, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 }}>
                                    <Ionicons name="shield-checkmark" size={16} color="#fff" />
                                </View>
                            </View>
                            <Text style={[styles.memoryYear, { color: colors.accent }]}>The বিপদের বন্ধু</Text>
                            <Text style={[styles.memoryTitle, { color: colors.textPrimary }]}>Quiet Support</Text>
                            <Text style={[styles.memoryText, { color: colors.textSecondary }]}>The peak of trust: asking for "টেহা" because your friend was "starving" and getting it along with a side of mild verbal abuse.</Text>
                        </View>

                        <View style={[styles.memoryCard, { backgroundColor: colors.card }]}>
                            <View style={{ position: 'relative' }}>
                                <Image source={{ uri: 'https://nimu.oceanmallik.com/timelineMemories/amina.png' }} style={styles.memoryImage} />
                                <View style={{ position: 'absolute', bottom: 5, right: -5, backgroundColor: '#8b5cf6', borderRadius: 20, padding: 6, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 }}>
                                    <FontAwesome5 name="user-secret" size={14} color="#fff" />
                                </View>
                            </View>
                            <Text style={[styles.memoryYear, { color: colors.accent }]}>By the end of 2022</Text>
                            <Text style={[styles.memoryTitle, { color: colors.textPrimary }]}>আমিনা!</Text>
                            <Text style={[styles.memoryText, { color: colors.textSecondary }]}>The girl named "Amina" that I never met. Have no clue who she is. 🦊</Text>
                        </View>
                    </View>

                    {/* Chaos Notes */}
                    <View style={styles.section}>
                        <Text style={[styles.eyebrow, { color: colors.accent, textAlign: 'center' }]}>Peak chaos archive</Text>
                        <Text style={[styles.heading, { color: colors.textPrimary, textAlign: 'center', marginBottom: 20 }]}>Proof we had a different bond than others.</Text>

                        <Animated.View style={[styles.chaosCard, { backgroundColor: '#FFEDD5', transform: [{ rotate: '-1deg' }, { translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }] }]}>
                            <View style={{ position: 'relative', marginBottom: 12 }}>
                                <Image source={{ uri: 'https://nimu.oceanmallik.com/itsUs/twoBestFriends.jpg' }} style={[styles.memoryImage, { borderWidth: 4, borderColor: '#fff', marginBottom: 0 }]} />
                                <View style={{ position: 'absolute', bottom: -10, right: -10, backgroundColor: '#fff', borderRadius: 24, padding: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, transform: [{ rotate: '12deg' }] }}>
                                    <FontAwesome5 name="user-friends" size={20} color="#f97316" />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 4 }}>
                                <Text style={[styles.chaosTitle, { color: '#9A3412', marginBottom: 0, marginRight: 6 }]}>একই আত্মার দুই রূপ</Text>
                                <Ionicons name="sparkles" size={18} color="#9A3412" />
                            </View>
                            <Text style={[styles.chaosText, { color: '#9A3412' }]}>বন্ধু তো অনেকেই হয়, কিন্তু বোন পাওয়ার ভাগ্য সবার থাকে না। তুই ঠিক তেমনি একজন। সব পাগলামিতে এভাবেই পাশে থাকিস সবসময়!</Text>
                        </Animated.View>

                        <Animated.View style={[styles.chaosCard, { backgroundColor: '#DBEAFE', transform: [{ rotate: '1deg' }, { translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }) }] }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Ionicons name="build" size={20} color="#1E40AF" style={{ marginRight: 8 }} />
                                <Text style={[styles.chaosTitle, { color: '#1E40AF', marginBottom: 0 }]}>Error fix</Text>
                            </View>
                            <Text style={[styles.chaosText, { color: '#1E40AF' }]}>Error 404: Sister not found... এই সমস্যাটা তুই পারমানেন্টলি সলভ করে দিয়েছিস।</Text>
                        </Animated.View>

                        <Animated.View style={[styles.chaosCard, { backgroundColor: '#DCFCE7', transform: [{ rotate: '-2deg' }, { translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }] }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <FontAwesome5 name="dizzy" size={20} color="#166534" style={{ marginRight: 8 }} />
                                <Text style={[styles.chaosTitle, { color: '#166534', marginBottom: 0 }]}>“পাগল ছাড়া দুনিয়া চলে না!”</Text>
                            </View>
                            <Text style={[styles.chaosText, { color: '#166534' }]}>Stay weird, stay mad, stay chagol!</Text>
                        </Animated.View>
                    </View>

                    {/* Meme Archive */}
                    <View style={styles.section}>
                        <Text style={[styles.eyebrow, { color: colors.accent, textAlign: 'center' }]}>
                            Caution: ইকটু বেশী ফানি মীম, হাঁসতে হাঁসতে পুক্কির রগ ছিঁড়ে গেলে কতৃপক্ষ দায়ী নয়।
                        </Text>
                        <Text style={[styles.heading, { color: colors.textPrimary, textAlign: 'center', marginBottom: 20 }]}>
                            The Meme Archive - অ্যান্টির মেয়ে গাঁজা খায়!!!
                        </Text>

                        <View style={[styles.memeCard, { backgroundColor: colors.card }]}>
                            <Image source={{ uri: 'https://nimu.oceanmallik.com/meme/meme1.jpg' }} style={styles.memeImage} />
                            <Text style={[styles.memoryTitle, { color: colors.textPrimary, textAlign: 'center', marginBottom: 0 }]}>Meme 1</Text>
                        </View>
                        <View style={[styles.memeCard, { backgroundColor: colors.card }]}>
                            <Image source={{ uri: 'https://nimu.oceanmallik.com/meme/meme2.jpg' }} style={styles.memeImage} />
                            <Text style={[styles.memoryTitle, { color: colors.textPrimary, textAlign: 'center', marginBottom: 0 }]}>Meme 2</Text>
                        </View>
                        <View style={[styles.memeCard, { backgroundColor: colors.card }]}>
                            <Image source={{ uri: 'https://nimu.oceanmallik.com/meme/meme3.jpg' }} style={styles.memeImage} />
                            <Text style={[styles.memoryTitle, { color: colors.textPrimary, textAlign: 'center', marginBottom: 0 }]}>Meme 3</Text>
                        </View>
                        <View style={[styles.memeCard, { backgroundColor: colors.card }]}>
                            <Image source={{ uri: 'https://nimu.oceanmallik.com/meme/meme4.jpg' }} style={styles.memeImage} />
                            <Text style={[styles.memoryTitle, { color: colors.textPrimary, textAlign: 'center', marginBottom: 0 }]}>Meme 4</Text>
                        </View>
                    </View>

                    {/* Inside Jokes Dictionary */}
                    <View style={styles.section}>
                        <Text style={[styles.eyebrow, { color: colors.accent, textAlign: 'center' }]}>The Secret Language</Text>
                        <Text style={[styles.heading, { color: colors.textPrimary, textAlign: 'center', marginBottom: 20 }]}>Inside Jokes Dictionary</Text>
                        {[
                            { term: 'Amina', def: 'An imaginary person who randomly became a core lore character by the end of 2022.' },
                            { term: 'টেহা', def: 'Universal currency unit demanded immediately when one of us is slightly hungry.' },
                            { term: 'Error 404', def: 'The state of our brains during exams, somehow fixed by laughing at each other.' }
                        ].map((joke, i) => (
                            <View key={i} style={[styles.dictCard, { backgroundColor: colors.card, borderLeftColor: colors.accent }]}>
                                <Text style={[styles.dictTerm, { color: colors.textPrimary }]}>{joke.term}</Text>
                                <Text style={[styles.dictDef, { color: colors.textSecondary }]}>{joke.def}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Photo Gallery (Horizontal Scroll) */}
                    <View style={[styles.section, { paddingHorizontal: 0 }]}>
                        <Text style={[styles.eyebrow, { color: colors.accent, textAlign: 'center' }]}>Hey, It's you!</Text>
                        <Text style={[styles.heading, { color: colors.textPrimary, textAlign: 'center', marginBottom: 20 }]}>A little photo gallery</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                            {galleryPhotos.map((photo) => (
                                <View key={photo.id} style={styles.galleryItem}>
                                    <View style={{ position: 'relative' }}>
                                        <Image
                                            source={{ uri: photo.url }}
                                            style={styles.galleryImage}
                                        />
                                        <View style={{ position: 'absolute', bottom: 20, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, padding: 6, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 }}>
                                            <Ionicons name={photo.icon} size={14} color="#db2777" />
                                        </View>
                                    </View>
                                    <Text style={[styles.galleryCaption, { color: colors.textSecondary }]}>{photo.caption}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Friendship Awards */}
                    <View style={styles.section}>
                        <Text style={[styles.eyebrow, { color: colors.accent, textAlign: 'center' }]}>Hall of Fame</Text>
                        <Text style={[styles.heading, { color: colors.textPrimary, textAlign: 'center', marginBottom: 20 }]}>The Friendship Awards</Text>
                        <View>
                            {[
                                { title: 'Best Sister-Friend 2026', icon: 'trophy', color: '#eab308', desc: 'For outstanding performance in sibling-like behavior.' },
                                { title: 'Most Likely To Trip Over Air', icon: 'dizzy', color: '#f43f5e', desc: 'Gravity just has a personal vendetta against you.' },
                                { title: 'World Class Terrible Advice', icon: 'comment-dots', color: '#3b82f6', desc: 'Given with 100% confidence, works 0% of the time.' }
                            ].map((award, i) => (
                                <View key={i} style={[styles.awardCard, { backgroundColor: colors.card }]}>
                                    <View style={{ backgroundColor: `${award.color}20`, padding: 16, borderRadius: 24, marginRight: 16 }}>
                                        <FontAwesome5 name={award.icon} size={24} color={award.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.awardTitle, { color: colors.textPrimary, textAlign: 'left', marginBottom: 4 }]}>{award.title}</Text>
                                        <Text style={[styles.awardDesc, { color: colors.textSecondary }]}>{award.desc}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Our Soundtrack */}
                    <View style={styles.section}>
                        <Text style={[styles.eyebrow, { color: colors.accent, textAlign: 'center' }]}>The Vibe</Text>
                        <Text style={[styles.heading, { color: colors.textPrimary, textAlign: 'center', marginBottom: 20 }]}>Our Soundtrack</Text>
                        <View style={[styles.songCard, { backgroundColor: '#1DB954' }]}>
                            <TouchableOpacity activeOpacity={0.8} onPress={togglePlayback}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.songArt}>
                                        <Ionicons name="musical-notes" size={24} color="#1DB954" />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={styles.songTitle}>পাগল ছাড়া দুনিয়া চলে না</Text>
                                        <Text style={styles.songArtist}>{isPlaying ? 'Playing now...' : 'Tap to play in app'}</Text>
                                    </View>
                                    <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={40} color="#fff" />
                                </View>
                            </TouchableOpacity>
                            <View style={{ marginTop: 12 }}>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={0}
                                    maximumValue={duration || 1}
                                    value={position}
                                    onSlidingComplete={handleSeek}
                                    minimumTrackTintColor="#FFFFFF"
                                    maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                                    thumbTintColor="#FFFFFF"
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, marginTop: -8 }}>
                                    <Text style={{ color: '#fff', fontSize: 12, opacity: 0.8 }}>{formatTime(position)}</Text>
                                    <Text style={{ color: '#fff', fontSize: 12, opacity: 0.8 }}>{formatTime(duration)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Gratitude & Farewell */}
                    <View style={[styles.card, { backgroundColor: colors.card, shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05, marginBottom: 20 }]}>
                        <Text style={[styles.eyebrow, { color: colors.accent }]}>Emotional appreciation</Text>
                        <Text style={[styles.heading, { color: colors.textPrimary }]}>You are the person who made ordinary days feel lighter, and hard days feel survivable.</Text>
                        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                            Thank you for the comfort, the laughter, the patience, the unspoken understanding and the kind of loyalty that makes a friendship feel like home.
                        </Text>
                        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                            You are not just a friend from school. You are a safe place, a shared history, a constant in the middle of everything changing and the sister I never had.
                        </Text>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <Image
                            source={{ uri: 'https://nimu.oceanmallik.com/galleryPhoto/friendphoto-end.jpg' }}
                            style={[styles.galleryImage, { height: 250, marginBottom: 24 }]}
                        />

                        <Animated.Text style={[styles.quote, { color: colors.textPrimary, transform: [{ scale: pulseAnim }] }]}>
                            "Some people arrive in your life, but a rare few become part of your soul."
                        </Animated.Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.funnyEnding, { color: colors.textPrimary }]}>
                            Thank you Nimu for being the kind of best friend who feels like family.
                        </Text>
                        <Text style={[styles.funnyEndingBold, { color: colors.accent }]}>
                            ভালো কথা, টাকা নাই পকেটে, বিকাশে ৫০০ টাকা পাঠা! শেষে ১৩ যেইটায় সেই নম্বরে দিস!
                        </Text>

                        <TouchableOpacity 
                            style={{
                                alignSelf: 'center',
                                marginTop: 40,
                                backgroundColor: colors.card,
                                paddingVertical: 12,
                                paddingHorizontal: 24,
                                borderRadius: 30,
                                flexDirection: 'row',
                                alignItems: 'center',
                                elevation: 3,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                            }}
                            onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
                        >
                            <Ionicons name="arrow-up" size={18} color={colors.accent} style={{ marginRight: 8 }} />
                            <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: colors.textPrimary, fontSize: 14 }}>Back to Top</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Tap Effects */}
            {taps.map(tap => <TapEffect key={tap.id} tap={tap} />)}

            {/* Header rendered last to stay absolutely positioned on top of the scroll */}
            <Header title="For Nimu" showBack />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    parallaxHeroContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: width,
        height: height * 0.6,
        zIndex: 0,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
        justifyContent: 'flex-end',
    },
    heroTitle: {
        fontSize: 32,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    heroText: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Regular',
        lineHeight: 24,
    },
    card: {
        margin: 16,
        padding: 24,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
    },
    eyebrow: {
        fontSize: 12,
        fontFamily: 'SpaceGrotesk-Bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
    },
    heading: {
        fontSize: 22,
        fontFamily: 'SpaceGrotesk-Bold',
        lineHeight: 30,
        marginBottom: 16,
    },
    paragraph: {
        fontSize: 15,
        fontFamily: 'SpaceGrotesk-Regular',
        lineHeight: 24,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'SpaceGrotesk-Regular',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    section: {
        padding: 20,
    },
    memoryCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    memoryImage: {
        width: '100%',
        aspectRatio: 4 / 3,
        borderRadius: 24,
        marginBottom: 16,
        resizeMode: 'contain',
    },
    memoryYear: {
        fontSize: 12,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 4,
    },
    memoryTitle: {
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 8,
    },
    memoryText: {
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Regular',
        lineHeight: 22,
    },
    chaosCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        transform: [{ rotate: '-1deg' }],
    },
    chaosTitle: {
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 8,
    },
    chaosText: {
        fontSize: 15,
        fontFamily: 'SpaceGrotesk-Regular',
        lineHeight: 22,
    },
    memeItem: {
        width: width * 0.75,
        marginRight: 16,
        alignItems: 'center',
    },
    memeCard: {
        padding: 12,
        borderRadius: 24,
        marginBottom: 20,
    },
    memeImage: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 16,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    memeCaption: {
        fontSize: 12,
        fontFamily: 'SpaceGrotesk-Bold',
        color: '#9d174d',
        backgroundColor: '#fbcfe8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    galleryItem: {
        width: width * 0.75,
        marginRight: 16,
    },
    galleryImage: {
        width: '100%',
        height: 400,
        borderRadius: 24,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    galleryCaption: {
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Regular',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 20,
    },
    quote: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Regular',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 26,
    },
    funnyEnding: {
        fontSize: 15,
        fontFamily: 'SpaceGrotesk-Regular',
        textAlign: 'center',
        marginBottom: 16,
    },
    funnyEndingBold: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Bold',
        textAlign: 'center',
        lineHeight: 24,
    },
    statCard: {
        width: '48%',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statValueBig: {
        fontSize: 28,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 4,
    },
    statLabelBig: {
        fontSize: 12,
        fontFamily: 'SpaceGrotesk-Regular',
        textAlign: 'center',
    },
    dictCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    dictTerm: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 4,
    },
    dictDef: {
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Regular',
        lineHeight: 20,
    },
    awardCard: {
        width: '100%',
        marginBottom: 12,
        padding: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    awardTitle: {
        fontSize: 15,
        fontFamily: 'SpaceGrotesk-Bold',
        lineHeight: 20,
    },
    awardDesc: {
        fontSize: 13,
        fontFamily: 'SpaceGrotesk-Regular',
        lineHeight: 18,
    },
    songCard: {
        padding: 16,
        borderRadius: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    songArt: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    songTitle: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Bold',
        color: '#fff',
        marginBottom: 2,
    },
    songArtist: {
        fontSize: 13,
        fontFamily: 'SpaceGrotesk-Regular',
        color: 'rgba(255,255,255,0.8)',
    }
});
