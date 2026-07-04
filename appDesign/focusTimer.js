import notifee, { AndroidImportance } from '@notifee/react-native';
import { IconClock, IconPlayerPlay, IconPlayerStop, IconBell } from '@tabler/icons-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../logic/ThemeProvider';
import { AppButton } from './button.js';
import Svg, { Circle, Path, Defs, ClipPath } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SVG_SIZE = 220;
const STROKE_WIDTH = 14;
const RADIUS = (SVG_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function WavySlider({ value, onValueChange, minimumValue, maximumValue, activeColor, inactiveColor }) {
    const [containerWidth, setContainerWidth] = useState(0);
    const containerWidthRef = useRef(0);
    const pan = useRef(new Animated.Value(0)).current;
    const panOffset = useRef(0);
    const lastHapticValue = useRef(value);
    const isDraggingRef = useRef(false);

    // Sync external value changes (like presets) to the slider position
    useEffect(() => {
        if (containerWidth > 0 && lastHapticValue.current !== value && !isDraggingRef.current) {
            const percentage = (value - minimumValue) / (maximumValue - minimumValue);
            const newX = percentage * containerWidth;
            Animated.timing(pan, {
                toValue: newX,
                duration: 200,
                useNativeDriver: false,
            }).start();
            panOffset.current = newX;
            lastHapticValue.current = value;
        }
    }, [value, containerWidth, minimumValue, maximumValue]);

    const updateValue = (xPos) => {
        if (containerWidthRef.current === 0) return;
        const percentage = xPos / containerWidthRef.current;
        let newValue = Math.round(minimumValue + percentage * (maximumValue - minimumValue));
        if (newValue !== lastHapticValue.current) {
            if (Math.floor(newValue / 10) !== Math.floor(lastHapticValue.current / 10)) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            lastHapticValue.current = newValue;
            if (onValueChange) onValueChange(newValue);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                isDraggingRef.current = true;
                const touchX = Math.max(0, Math.min(evt.nativeEvent.locationX, containerWidthRef.current));
                pan.setValue(touchX);
                panOffset.current = touchX;
                updateValue(touchX);
            },
            onPanResponderMove: (evt, gestureState) => {
                const newX = Math.max(0, Math.min(panOffset.current + gestureState.dx, containerWidthRef.current));
                pan.setValue(newX);
                updateValue(newX);
            },
            onPanResponderRelease: (evt, gestureState) => {
                const newX = Math.max(0, Math.min(panOffset.current + gestureState.dx, containerWidthRef.current));
                panOffset.current = newX;
                // Ignore any delayed state updates that arrive right after we let go
                setTimeout(() => {
                    isDraggingRef.current = false;
                }, 150);
            }
        })
    ).current;

    const generateWavyPath = (width, height) => {
        if (width === 0) return '';
        const amplitude = 3;
        const frequency = 0.2; 
        let path = `M 0 ${height / 2}`;
        for (let x = 0; x <= width; x += 2) {
            const y = height / 2 + Math.sin(x * frequency) * amplitude;
            path += ` L ${x} ${y}`;
        }
        return path;
    };

    return (
        <View 
            style={styles.wavySliderContainer} 
            onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                setContainerWidth(w);
                containerWidthRef.current = w;
                const percentage = (value - minimumValue) / (maximumValue - minimumValue);
                const startX = percentage * w;
                pan.setValue(startX);
                panOffset.current = startX;
            }}
            {...panResponder.panHandlers}
        >
            {containerWidth > 0 && (
                <View style={styles.wavySliderInner} pointerEvents="none">
                    {/* Inactive Straight Track Layer (Starts from Thumb) */}
                    <Animated.View style={{ 
                        position: 'absolute', 
                        height: 40, 
                        left: pan, 
                        right: 0,
                        overflow: 'hidden' 
                    }}>
                        <Svg width={containerWidth} height={40} style={{ position: 'absolute', left: 0 }}>
                            <Path 
                                d={`M 0 20 L ${containerWidth} 20`}
                                stroke={inactiveColor}
                                strokeWidth={4}
                                strokeLinecap="round"
                            />
                        </Svg>
                    </Animated.View>
                    
                    {/* Active Wavy Track Layer (Masked by Animated.View) */}
                    <Animated.View style={{ 
                        position: 'absolute', 
                        height: 40, 
                        width: pan, 
                        overflow: 'hidden' 
                    }}>
                        <Svg width={containerWidth} height={40} style={{ position: 'absolute', left: 0 }}>
                            <Path 
                                d={generateWavyPath(containerWidth, 40)}
                                stroke={activeColor}
                                strokeWidth={4}
                                strokeLinecap="round"
                            />
                        </Svg>
                    </Animated.View>
                    
                    {/* Thumb Layer */}
                    <Animated.View 
                        style={[
                            styles.wavySliderThumb,
                            {
                                backgroundColor: activeColor,
                                shadowColor: activeColor,
                                transform: [{ translateX: pan }, { translateX: -10 }] 
                            }
                        ]} 
                    />
                </View>
            )}
        </View>
    );
}

export default function FocusTimer() {
    const { colors, activeTheme } = useAppTheme();
    const [isFocusing, setIsFocusing] = useState(false);
    const [totalTime, setTotalTime] = useState(60 * 60); // Default 60 mins
    const [timeLeft, setTimeLeft] = useState(60 * 60);
    const [customMinutes, setCustomMinutes] = useState(60);
    const [hasNotificationPermission, setHasNotificationPermission] = useState(true);
    const endTimeRef = useRef(null);
    const lastNotifiedMinuteRef = useRef(null);

    useEffect(() => {
        notifee.getNotificationSettings().then(settings => {
            setHasNotificationPermission(settings.authorizationStatus >= 1);
        });
    }, []);

    const enableNotifications = async () => {
        const settings = await notifee.requestPermission();
        setHasNotificationPermission(settings.authorizationStatus >= 1);
        if (settings.authorizationStatus >= 1) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
                    <View style={styles.svgContainer}>
                        <Svg width={SVG_SIZE} height={SVG_SIZE}>
                            <Circle
                                stroke={activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F2F2F7'}
                                fill="none"
                                cx={SVG_SIZE / 2}
                                cy={SVG_SIZE / 2}
                                r={RADIUS}
                                strokeWidth={STROKE_WIDTH}
                            />
                            <AnimatedCircle
                                stroke={colors.accent}
                                fill="none"
                                cx={SVG_SIZE / 2}
                                cy={SVG_SIZE / 2}
                                r={RADIUS}
                                strokeWidth={STROKE_WIDTH}
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={progressAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [CIRCUMFERENCE, 0]
                                })}
                                strokeLinecap="round"
                                rotation="-90"
                                origin={`${SVG_SIZE / 2}, ${SVG_SIZE / 2}`}
                            />
                        </Svg>
                        <View style={styles.timeTextContainer}>
                            <Text style={[styles.timerText, { color: colors.textPrimary }]}>{formatTime(timeLeft)}</Text>
                            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>REMAINING</Text>
                        </View>
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
                    <View style={styles.topSection}>
                        <View style={styles.sidePresets}>
                            {[5, 20, 40].map(preset => {
                                const isActive = customMinutes === preset;
                                return (
                                    <Pressable 
                                        key={preset}
                                        style={[
                                            styles.sidePresetButton, 
                                            { 
                                                backgroundColor: isActive 
                                                    ? colors.accent 
                                                    : (activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F2F2F7') 
                                            }
                                        ]} 
                                        onPress={() => {
                                            setCustomMinutes(preset);
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        }}
                                    >
                                        <Text style={[
                                            styles.sidePresetText, 
                                            { color: isActive ? '#FFF' : colors.textPrimary }
                                        ]}>{preset}m</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <View style={styles.massiveTimeDisplay}>
                            <Text style={[styles.massiveTimeText, { color: colors.textPrimary }]}>{customMinutes}</Text>
                            <Text style={[styles.massiveTimeLabel, { color: colors.textSecondary }]}>MINUTES</Text>
                        </View>

                        <View style={styles.sidePresets}>
                            {[60, 90, 120].map(preset => {
                                const isActive = customMinutes === preset;
                                return (
                                    <Pressable 
                                        key={preset}
                                        style={[
                                            styles.sidePresetButton, 
                                            { 
                                                backgroundColor: isActive 
                                                    ? colors.accent 
                                                    : (activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F2F2F7') 
                                            }
                                        ]} 
                                        onPress={() => {
                                            setCustomMinutes(preset);
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        }}
                                    >
                                        <Text style={[
                                            styles.sidePresetText, 
                                            { color: isActive ? '#FFF' : colors.textPrimary }
                                        ]}>{preset}m</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.customTimerContainer}>
                        <WavySlider
                            minimumValue={1}
                            maximumValue={120}
                            value={customMinutes}
                            onValueChange={(val) => setCustomMinutes(val)}
                            activeColor={colors.accent}
                            inactiveColor={activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F2F2F7'}
                        />

                        <AppButton
                            title='Start Session'
                            onPress={() => {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                startFocus(customMinutes);
                            }}
                            icon={IconPlayerPlay}
                            style={styles.startButton}
                            variant="primary"
                        />

                        {!hasNotificationPermission && (
                            <Pressable 
                                onPress={enableNotifications}
                                style={{ marginTop: 16, alignItems: 'center' }}
                            >
                                <Text style={{ 
                                    fontFamily: 'SpaceGrotesk-Bold', 
                                    fontSize: 14, 
                                    color: colors.accent,
                                    textDecorationLine: 'underline' 
                                }}>
                                    enable notification to see the progress
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        marginBottom: 16,
        borderRadius: 20,
        padding: 12,
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
    svgContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    timeTextContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        fontSize: 44,
        fontFamily: 'SpaceGrotesk-Bold',
        lineHeight: 50,
    },
    timeLabel: {
        fontSize: 12,
        fontFamily: 'SpaceGrotesk-Bold',
        letterSpacing: 2,
        marginTop: 4,
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
    topSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10,
        position: 'relative',
        minHeight: 110,
    },
    massiveTimeDisplay: {
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        zIndex: -1,
    },
    massiveTimeText: {
        fontSize: 64,
        fontFamily: 'SpaceGrotesk-Bold',
        lineHeight: 70,
    },
    massiveTimeLabel: {
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Bold',
        letterSpacing: 3,
    },
    sidePresets: {
        gap: 8,
    },
    sidePresetButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sidePresetText: {
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    customTimerContainer: {
        marginTop: 5,
    },
    wavySliderContainer: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        marginVertical: 10,
    },
    wavySliderInner: {
        position: 'relative',
        width: '100%',
        height: 40,
    },
    wavySliderThumb: {
        position: 'absolute',
        top: 10, 
        width: 20,
        height: 20,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 4,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 5,
    },
});
