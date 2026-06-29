import notifee, { AndroidImportance } from '@notifee/react-native';
import Slider from '@react-native-community/slider';
import { IconClock, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../logic/ThemeProvider';
import { AppButton } from './button.js';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FocusTimer() {
    const { colors, activeTheme } = useAppTheme();
    const [isFocusing, setIsFocusing] = useState(false);
    const [totalTime, setTotalTime] = useState(25 * 60); // Default 25 mins
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [customMinutes, setCustomMinutes] = useState(25);
    const endTimeRef = useRef(null);
    const lastNotifiedMinuteRef = useRef(null);

    // Animated progress width (0 to 100%)
    const progressAnim = useRef(new Animated.Value(0)).current;



    const updateNotification = async (currentLeft, total, endTimeMs) => {
        const channelId = await notifee.createChannel({
            id: 'focus_mode',
            name: 'Reading Mode',
            importance: AndroidImportance.DEFAULT,
        });

        const percent = total > 0 ? ((total - currentLeft) / total) * 100 : 0;
        const safePercent = Math.max(0, Math.min(100, percent));

        await notifee.displayNotification({
            id: 'focus_mode_timer',
            title: 'লেখাপড়া মোড 📚',
            body: 'প্রোগ্রেস বার শেষ হয়ে গেলে বিরতি 📚✍️',
            android: {
                channelId,
                ongoing: true,
                onlyAlertOnce: true,
                showChronometer: true,
                chronometerDirection: 'down',
                timestamp: endTimeMs,
                progress: {
                    max: 100,
                    current: Math.round(safePercent),
                }
            },
        });
    };

    const clearNotification = async () => {
        await notifee.cancelNotification('focus_mode_timer');
    };

    useEffect(() => {
        let interval = null;
        if (isFocusing && endTimeRef.current) {
            // Trigger first immediate update if not set
            const initialPercent = totalTime > 0 ? Math.round(((totalTime - timeLeft) / totalTime) * 100) : 0;
            if (lastNotifiedMinuteRef.current !== initialPercent) {
                updateNotification(timeLeft, totalTime, endTimeRef.current);
                lastNotifiedMinuteRef.current = initialPercent;
            }

            interval = setInterval(async () => {
                const now = Date.now();
                const remainingMs = endTimeRef.current - now;

                if (remainingMs <= 0) {
                    setTimeLeft(0);
                    setIsFocusing(false);
                    endTimeRef.current = null;
                    clearNotification();

                    const completeChannelId = await notifee.createChannel({
                        id: 'focus_mode_alerts',
                        name: 'Reading Mode Alerts',
                        importance: AndroidImportance.HIGH,
                        sound: 'default',
                        vibration: true,
                        vibrationPattern: [300, 500, 300, 500],
                    });

                    await notifee.displayNotification({
                        title: "পড়ালেখার সময় শেষ, চিল করো! 🎉",
                        body: "কিছুক্ষন পর আবার পড়তে বসতে হবে 😌🛋️",
                        android: {
                            channelId: completeChannelId,
                            sound: 'default',
                        }
                    });

                    clearInterval(interval);
                } else {
                    const remainingSeconds = Math.ceil(remainingMs / 1000);
                    setTimeLeft(remainingSeconds);

                    // Update notification whenever the progress percentage changes
                    const currentPercent = totalTime > 0 ? Math.round(((totalTime - remainingSeconds) / totalTime) * 100) : 0;
                    if (lastNotifiedMinuteRef.current !== currentPercent) {
                        updateNotification(remainingSeconds, totalTime, endTimeRef.current);
                        lastNotifiedMinuteRef.current = currentPercent;
                    }
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isFocusing, totalTime]);

    useEffect(() => {
        // Animate progress bar smoothly
        const progressPercentage = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
        Animated.timing(progressAnim, {
            toValue: progressPercentage,
            duration: 1000,
            useNativeDriver: false, // Width animation cannot use native driver
        }).start();
    }, [timeLeft, totalTime]);

    const startFocus = async (minutes) => {
        await notifee.requestPermission();
        const seconds = minutes * 60;
        setTotalTime(seconds);
        setTimeLeft(seconds);
        endTimeRef.current = Date.now() + seconds * 1000;
        lastNotifiedMinuteRef.current = null;
        setIsFocusing(true);
    };

    const stopFocus = () => {
        setIsFocusing(false);
        endTimeRef.current = null;
        setTimeLeft(totalTime);
        clearNotification();
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.card,
                borderColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
            }
        ]}>
            <View style={styles.header}>
                <View style={[styles.iconWrap, { backgroundColor: activeTheme === 'dark' ? 'rgba(76, 175, 80, 0.15)' : '#E8F5E9' }]}>
                    <IconClock size={20} color={activeTheme === 'dark' ? '#4CAF50' : '#2E7D32'} />
                </View>
                <Text style={[styles.title, { color: colors.textPrimary }]}>লেখাপড়া মোড</Text>
            </View>

            {isFocusing ? (
                <View style={styles.activeContainer}>
                    <Text style={[styles.timerText, { color: colors.textPrimary }]}>{formatTime(timeLeft)}</Text>

                    {/* Progress Bar Background */}
                    <View style={[styles.progressTrack, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F2F2F7' }]}>
                        {/* Progress Bar Fill */}
                        <Animated.View style={[
                            styles.progressFill,
                            {
                                backgroundColor: colors.accent,
                                width: progressAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%']
                                })
                            }
                        ]} />
                    </View>

                    <Pressable
                        onPress={stopFocus}
                        style={({ pressed }) => [
                            styles.stopButton,
                            pressed && { opacity: 0.8 },
                            { backgroundColor: activeTheme === 'dark' ? 'rgba(255, 69, 58, 0.15)' : '#FFEDED' }
                        ]}
                    >
                        <IconPlayerStop size={18} color={colors.destructive} />
                        <Text style={[styles.stopButtonText, { color: colors.destructive }]}>Stop</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.idleContainer}>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>ঘড়ি ধরে পড়ালেখা করতে নিচের টাইমার ব্যবহার করো 📚.</Text>

                    <View style={styles.customTimerContainer}>
                        <View style={styles.sliderHeader}>
                            <Text style={[styles.sliderLabel, { color: colors.textPrimary }]}>{customMinutes} Minutes</Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={1}
                            maximumValue={120}
                            step={1}
                            value={customMinutes}
                            onValueChange={(val) => setCustomMinutes(val)}
                            minimumTrackTintColor={colors.accent}
                            maximumTrackTintColor={activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F2F2F7'}
                            thumbTintColor={colors.accent}
                        />
                        <AppButton
                            title='Start your "লেখাপড়া" timer'
                            onPress={() => startFocus(customMinutes)}
                            icon={IconPlayerPlay}
                            style={styles.startButton}
                            variant="primary"
                        />
                    </View>

                    <Text style={[styles.orText, { color: colors.textSecondary }]}>Or choose a preset:</Text>
                    <View style={styles.presets}>
                        <Pressable style={[styles.presetButton, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F2F2F7' }]} onPress={() => startFocus(25)}>
                            <Text style={[styles.presetText, { color: colors.textPrimary }]}>25m</Text>
                        </Pressable>
                        <Pressable style={[styles.presetButton, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F2F2F7' }]} onPress={() => startFocus(50)}>
                            <Text style={[styles.presetText, { color: colors.textPrimary }]}>50m</Text>
                        </Pressable>
                        <Pressable style={[styles.presetButton, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F2F2F7' }]} onPress={() => startFocus(120)}>
                            <Text style={[styles.presetText, { color: colors.textPrimary }]}>120m</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    subtitle: {
        fontSize: 13,
        fontFamily: 'SpaceGrotesk-Regular',
        marginBottom: 16,
    },
    idleContainer: {
        marginTop: 4,
    },
    presets: {
        flexDirection: 'row',
        gap: 12,
    },
    presetButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    presetText: {
        fontSize: 15,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    activeContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    timerText: {
        fontSize: 48,
        fontFamily: 'SpaceGrotesk-Bold',
        marginBottom: 20,
    },
    progressTrack: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 24,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 16,
    },
    stopButtonText: {
        fontSize: 15,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    customTimerContainer: {
        marginBottom: 20,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },
    sliderLabel: {
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 16,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 16,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    orText: {
        fontSize: 13,
        fontFamily: 'SpaceGrotesk-Regular',
        marginBottom: 12,
        textAlign: 'center',
    },
});
