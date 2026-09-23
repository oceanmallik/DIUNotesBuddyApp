import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useAppTheme } from '../../logic/ThemeProvider';

const { width } = Dimensions.get('window');

// --- trivia Data ---
const TRIVIA_QUESTIONS = [
  {
    image: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimu1.jpeg',
    correctImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimu1alt.jpeg',
    question: 'তোর মা-বাবা তোকে কোথায় পেয়েছিল?',
    options: ['ডাস্টবিনের জঞ্জাল থেকে', 'স্বাভাবিক জন্মে', 'আনেনি, তুই নিজেই চলে এসেছিস'],
    answerIndex: 0,
  },
  {
    image: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimu2.jpeg',
    correctImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimu2alt.jpeg',
    question: 'আকাশ কেন নীল হয়?',
    options: ['সূর্যের আলোর তরঙ্গদৈর্ঘ্যের কারণে', 'তোর হিজাবের রঙের কারণে', 'ওপরের কোনোটিই নয়'],
    answerIndex: 1,
  },
  {
    image: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimu3.jpeg',
    correctImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimu3alt.jpeg',
    question: 'বাসে করে ঢাকায় যাওয়ার সময় কী খেয়েছিলিস?',
    options: ['ছোলা', 'আমার মাথা', 'নিজের মাথা'],
    answerIndex: 0,
  },
  {
    image: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimu4.jpeg',
    correctImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimu4alt.jpeg',
    question: 'আপনি Ocean-কে মানুষ হিসেবে কেমন দেখেন?',
    options: ['বদমাইশ একটা', 'ছাগল একটা', 'পৃথিবীর সবচেয়ে ভালো এবং সৎ মানুষদের মধ্যে একজন'],
    answerIndex: 2,
  },
  {
    image: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimu5.png',
    correctImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimu5alt.png',
    question: 'কোরবানিতে কাকে কোরবানি দেওয়া উচিত?',
    options: ['গরু', 'ছাগল', 'Tasnim Iffat Nimu'],
    answerIndex: 2,
  },
];

const MEMORY_CARDS = [
  {
    id: 1,
    frontImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/s1.jpg',
    prompt: 'Summer Memory',
    text: 'গ্রীষ্ম (Summer) : তোর তেজ আর আত্মবিশ্বাস ঠিক দুপুরের রোদ, কখনো জেদি, কিন্তু সবসময় উজ্জ্বল।',
    isLetter: false,
  },
  {
    id: 2,
    frontImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/s2.jpg',
    prompt: 'Monsoon Memory',
    text: 'বর্ষা (Monsoon) : বৃষ্টির মতো হঠাৎ আসা তোর সব পাগলামি, যা নিমেষেই মন ভালো করে দেয়।',
    isLetter: false,
  },
  {
    id: 3,
    frontImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/s3.jpg',
    prompt: 'Autumn Memory',
    text: 'শরৎ (Autumn) : কাশফুলের মতো শান্ত আর স্নিগ্ধ তোর হাসি, মেঘলা দিনেও এক চিলতে নীল আকাশ।',
    isLetter: false,
  },
  {
    id: 4,
    frontImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/s4.jpg',
    prompt: 'Late Autumn Memory',
    text: 'হেমন্ত (Late Autumn) : শিশিরভেজা সকালের মতোই মিষ্টি আর মায়াবী তোর উপস্থিতি।',
    isLetter: false,
  },
  {
    id: 5,
    frontImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/s5.jpg',
    prompt: 'Winter Memory',
    text: 'শীত (Winter) : কনকনে শীতে এক কাপ গরম চায়ের মতো ভরসা, সব ঝড়ে আমার পাশে তুই।',
    isLetter: false,
  },
  {
    id: 6,
    frontImage: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/s6.jpg',
    prompt: 'Spring Memory',
    text: 'বসন্ত (Spring) : যেখানে তুই আছিস, সেখানেই রঙের ছোঁয়া। তুই নিজেই আমার জীবনের বসন্ত।',
    isLetter: false,
  },
  {
    id: 7,
    frontImage: 'https://picsum.photos/400/500?random=99',
    prompt: 'A Simple Letter',
    text: "শুভ জন্মদিন প্রিয় বন্ধু, \n\nরক্তের সম্পর্ক না থাকলেও তুই যে আমার নিজের বোনের চেয়েও বেশি কিছু, সেটা নতুন করে বলার দরকার নেই। রাত দুইটার পাগলামি থেকে শুরু করে মন খারাপের দিনে ভরসা হওয়া, সবকিছুতেই তুই আমার সবচেয়ে বড় শক্তি। \n\nতুই যেভাবে নিজের স্বপ্ন নিয়ে লড়ছিস, তোকে নিয়ে সত্যি অনেক গর্ব হয়। জীবনে যাই ঘটুক, জেনে রাখিস তোর এই ভাই/বন্ধুটা যেকোনো পরিস্থিতিতে তোর পাশে আছে আর থাকবে। তোর এই সুন্দর হাসিমুখটা যেন কখনো না হারায়। শুভ জন্মদিন, পাগলী! অনেক ভালো থাকিস সবসময়। \n\n— তোর বন্ধু",
    isLetter: true,
  }
];

// --- Components ---

const Screen0Intro = ({ onNext, colors }) => {
  const styles = getStyles(colors);

  return (
    <View style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
      <View style={styles.introPhotoCard}>
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/oceanmallik/bestFriend/refs/heads/main/appPhotoBirthday/nimuIntro.jpeg' }}
          style={styles.introPhoto}
          contentFit="cover"
        />
        <View style={styles.introPin} />
      </View>

      <Text style={styles.headerTitle}>Happy 21st Birthday! Kmne kih! </Text>
      <Text style={[styles.subtitleText, { color: colors.textPrimary, fontSize: 24, fontFamily: 'SpaceGrotesk-Bold' }]}>Tasnim Iffat Nimu</Text>
      <Text style={styles.subtitleText}>(aka "Nimu Chalak")</Text>
      <Text style={[styles.subtitleText, { color: colors.accent, fontFamily: 'SpaceGrotesk-Bold' }]}>10 October 2005</Text>

      <View style={styles.jokeBox}>
        <Text style={styles.jokeText}>"One of my favourite Ramchagol"</Text>
      </View>

      <TouchableOpacity style={[styles.primaryBtn, { marginTop: 30, width: '100%' }]} onPress={onNext}>
        <Text style={styles.primaryBtnText}>Start Adventure</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  );
};

const Screen1Trivia = ({ onComplete, colors }) => {
  const styles = getStyles(colors);
  const [qIndex, setQIndex] = useState(0);
  const [wrongSelections, setWrongSelections] = useState([]);
  const [correctSelected, setCorrectSelected] = useState(false);

  const currentQ = TRIVIA_QUESTIONS[qIndex];

  const handleOptionPress = (idx) => {
    if (correctSelected) return;
    if (idx === currentQ.answerIndex) {
      setCorrectSelected(true);
    } else {
      if (!wrongSelections.includes(idx)) {
        setWrongSelections([...wrongSelections, idx]);
      }
    }
  };

  const handleNext = () => {
    if (qIndex < TRIVIA_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
      setWrongSelections([]);
      setCorrectSelected(false);
    } else {
      onComplete();
    }
  };

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Trivia Game: {qIndex + 1}/5</Text>

      <View style={styles.questionCard}>
        <Image source={{ uri: currentQ.image }} style={styles.questionImage} contentFit="cover" />
        <Text style={styles.questionText}>{currentQ.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQ.options.map((opt, idx) => {
          const isCorrect = correctSelected && idx === currentQ.answerIndex;
          const isWrong = wrongSelections.includes(idx);
          let btnStyle = styles.optionBtn;
          if (isCorrect) btnStyle = [styles.optionBtn, styles.optionCorrect];
          if (isWrong) btnStyle = [styles.optionBtn, styles.optionWrong];

          return (
            <TouchableOpacity
              key={idx}
              style={btnStyle}
              onPress={() => handleOptionPress(idx)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {correctSelected && (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={[styles.headerTitle, { fontSize: 20, marginBottom: 15 }]}>You got it!</Text>
          <Image source={{ uri: currentQ.correctImage }} style={styles.questionImage} contentFit="cover" />
        </View>
      )}

      {correctSelected && (
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.primaryBtnText}>
            {qIndex < TRIVIA_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Trivia'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const Screen2Trophy = ({ onNext, colors }) => {
  const styles = getStyles(colors);
  return (
    <View style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
      <Ionicons name="trophy" size={80} color={colors.accent} style={{ marginBottom: 20 }} />
      <Text style={styles.headerTitle}>You Did It!</Text>

      <View style={styles.trophyBanner}>
        <Text style={styles.trophyScore}>Score: 5 / 5</Text>
      </View>

      <View style={styles.bondCard}>
        <Text style={styles.bondTitle}>Friendship Bond:</Text>
        <Text style={styles.bondValue}>Unbreakable (S-Tier) 💖</Text>
      </View>

      <View style={styles.badgesGrid}>
        <View style={styles.badgeItem}>
          <Ionicons name="moon" size={32} color={colors.accent} />
          <Text style={styles.badgeText}>Certified 2 AM Therapist</Text>
        </View>
        <View style={styles.badgeItem}>
          <Ionicons name="car" size={32} color={colors.destructive} />
          <Text style={styles.badgeText}>Ride-or-Die Clearance</Text>
        </View>
        <View style={styles.badgeItem}>
          <Ionicons name="star" size={32} color={colors.accent} />
          <Text style={styles.badgeText}>Honorary Sister</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.primaryBtn, { marginTop: 40, width: '100%' }]} onPress={onNext}>
        <Text style={styles.primaryBtnText}>Open Memory Vault</Text>
        <Ionicons name="lock-open-outline" size={20} color="#FFF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  );
};

const PolaroidCard = ({ card, onViewed, colors }) => {
  const styles = getStyles(colors);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      if (!isFlipped) onViewed(card.id);
      setIsFlipped(!isFlipped);
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }], position: 'absolute' };

  const cardDimensions = card.isLetter ? { width: width - 60, height: 520 } : {};
  const wrapperHeight = card.isLetter ? { height: 540 } : {};

  return (
    <View style={[styles.cardWrapper, wrapperHeight]}>
      {/* Front */}
      <TouchableWithoutFeedback onPress={flip}>
        <Animated.View
          pointerEvents={isFlipped ? "none" : "auto"}
          style={[styles.polaroidCard, cardDimensions, frontAnimatedStyle, { backfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 1 }]}
        >
          {/* Tape graphic at the top */}
          {!card.isLetter && <View style={styles.tapeGraphic} />}
          <View style={[
            styles.polaroidImagePlaceholder,
            card.isLetter && { flex: 1, backgroundColor: '#FFF0F5', borderRadius: 8, borderWidth: 1.5, borderColor: '#F48FB1', borderStyle: 'dashed' }
          ]}>
            {card.isLetter ? (
              <Ionicons name="mail-unread" size={80} color={colors.accent} />
            ) : (
              <Image source={{ uri: card.frontImage }} style={styles.polaroidImg} contentFit="cover" />
            )}
          </View>
          <Text style={styles.polaroidPrompt}>{card.prompt}</Text>
          <Text style={styles.tapToFlip}>{card.isLetter ? '(Tap to open)' : '(Tap to flip)'}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Back */}
      <Animated.View
        pointerEvents={isFlipped ? "auto" : "none"}
        style={[styles.polaroidCard, cardDimensions, styles.polaroidBack, card.isLetter && styles.letterBack, backAnimatedStyle, { backfaceVisibility: 'hidden', zIndex: isFlipped ? 1 : 0 }]}
      >
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={card.isLetter}
        >
          <TouchableWithoutFeedback onPress={flip}>
            <View style={{ flexGrow: 1, width: '100%', alignItems: card.isLetter ? 'flex-start' : 'center', justifyContent: card.isLetter ? 'flex-start' : 'center' }}>
              {card.isLetter ? (
                <View style={styles.letterContainer}>
                  <View style={styles.letterDecorationTop}>
                    <Ionicons name="mail-open-outline" size={28} color={colors.accent} />
                  </View>
                  <Text style={styles.letterText}>{card.text}</Text>
                  <View style={styles.letterDecorationBottom}>
                    <Ionicons name="heart-half-outline" size={24} color={colors.accent} />
                  </View>
                </View>
              ) : (
                <View style={styles.memoryBackContainer}>
                  <View style={styles.tapeGraphic} />
                  <Image source={{ uri: card.frontImage }} style={styles.polaroidImgSmall} contentFit="cover" />
                  <Text style={{ fontSize: 36, color: colors.border, fontFamily: 'SpaceGrotesk-Bold', height: 28, opacity: 0.5 }}>"</Text>
                  <Text style={styles.captionText}>{card.text}</Text>
                  <View style={styles.memoryTag}>
                    <Text style={styles.memoryTagText}>Captured Moment</Text>
                  </View>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const Screen3MemoryVault = ({ onNext, colors }) => {
  const styles = getStyles(colors);
  const [viewedCards, setViewedCards] = useState(new Set());

  const handleCardViewed = (id) => {
    setViewedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const canProceed = viewedCards.size >= MEMORY_CARDS.length;

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.headerTitle}>Memory Vault</Text>
      <Text style={styles.subtitleText}>Swipe to view. Tap a card to flip it and read the memory.</Text>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}
      >
        {MEMORY_CARDS.map(card => (
          <View key={card.id} style={{ width: width - 40, paddingHorizontal: 10 }}>
            <PolaroidCard card={card} onViewed={handleCardViewed} colors={colors} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.vaultFooter}>
        <Text style={styles.progressText}>{viewedCards.size} / {MEMORY_CARDS.length} Memories Unlocked</Text>
        <TouchableOpacity
          style={[styles.primaryBtn, !canProceed && styles.btnDisabled]}
          onPress={onNext}
          disabled={!canProceed}
        >
          <Text style={styles.primaryBtnText}>Proceed to Next Surprise</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Screen4VoiceNote = ({ colors }) => {
  const styles = getStyles(colors);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [duration, setDuration] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [audioComplete, setAudioComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let soundRef = null;
    const loadAudio = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { shouldPlay: false }
        );
        soundRef = newSound;
        setSound(newSound);
        setIsLoading(false);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setDuration(status.durationMillis || 1);
            if (!isSeeking) {
              const currentProgress = status.positionMillis / (status.durationMillis || 1);
              setProgress(currentProgress);
            }

            if (status.didJustFinish) {
              setIsPlaying(false);
              setAudioComplete(true);
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }).start();
            }
          }
        });
      } catch (error) {
        console.error("Error loading audio", error);
        setIsLoading(false);
      }
    };

    loadAudio();

    return () => {
      if (soundRef) {
        soundRef.unloadAsync();
      }
    };
  }, []);

  const togglePlayback = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <View style={[styles.screenContainer, { justifyContent: 'center' }]}>
      <Text style={styles.headerTitle}>A message just for you</Text>
      <Text style={[styles.subtitleText, { textAlign: 'center', marginBottom: 40 }]}>
        Plug in your headphones and hit play. Listen to the full audio to get a secret code for the next adventure!
      </Text>

      <View style={styles.audioPlayerCard}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ padding: 20 }} />
        ) : (
          <>
            <TouchableOpacity onPress={togglePlayback} style={styles.playBtn}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="#FFF" />
            </TouchableOpacity>

            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={progress}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.accent}
              onSlidingStart={() => setIsSeeking(true)}
              onValueChange={(val) => setProgress(val)}
              onSlidingComplete={async (val) => {
                if (sound) {
                  await sound.setPositionAsync(val * duration);
                }
                setIsSeeking(false);
              }}
            />
          </>
        )}
      </View>

      {audioComplete && (
        <Animated.View style={[styles.secretModal, { opacity: fadeAnim }]}>
          <Ionicons name="sparkles" size={40} color={colors.accent} style={{ marginBottom: 10 }} />
          <Text style={styles.secretTitle}>Secret Code Unlocked!</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>memories22</Text>
          </View>
          <Text style={styles.riddleText}>
            Clue: Where do you go when you want to change your identity?
            Find the hidden input to continue the adventure.
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

// --- Main Container with State Persistance ---

export default function BirthdayNimu() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  const [currentScreen, setCurrentScreen] = useState(0);

  const navigateTo = (screenId) => {
    setCurrentScreen(screenId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentScreen === 0 && <Screen0Intro onNext={() => navigateTo(1)} colors={colors} />}
      {currentScreen === 1 && <Screen1Trivia onComplete={() => navigateTo(2)} colors={colors} />}
      {currentScreen === 2 && <Screen2Trophy onNext={() => navigateTo(3)} colors={colors} />}
      {currentScreen === 3 && <Screen3MemoryVault onNext={() => navigateTo(4)} colors={colors} />}
      {currentScreen === 4 && <Screen4VoiceNote colors={colors} />}
    </SafeAreaView>
  );
}

// --- Styles ---

const getStyles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Intro Screen
  introPhotoCard: {
    width: 200,
    height: 200,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 30,
    transform: [{ rotate: '-3deg' }]
  },
  introPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border
  },
  introPin: {
    position: 'absolute',
    top: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.destructive,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4
  },
  jokeBox: {
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10
  },
  jokeText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontStyle: 'italic',
    fontFamily: 'SpaceGrotesk-Regular'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 28,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
    fontFamily: 'SpaceGrotesk-Bold'
  },
  subtitleText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'SpaceGrotesk-Regular'
  },
  // Trivia
  questionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  questionImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: colors.border,
  },
  questionText: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: 'SpaceGrotesk-Bold',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 30,
  },
  optionBtn: {
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk-Bold'
  },
  optionCorrect: {
    backgroundColor: '#2E7D32',
    borderColor: '#4CAF50',
  },
  optionWrong: {
    backgroundColor: colors.destructive,
    borderColor: colors.destructive,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  btnDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  // Trophy
  trophyBanner: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  trophyScore: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk-Bold',
    color: colors.accent,
  },
  bondCard: {
    backgroundColor: colors.card,
    width: '100%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bondTitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'SpaceGrotesk-Regular'
  },
  bondValue: {
    color: colors.accent,
    fontSize: 22,
    fontFamily: 'SpaceGrotesk-Bold'
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    width: '100%',
  },
  badgeItem: {
    width: '45%',
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    color: colors.textPrimary,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Bold'
  },
  // Polaroid
  cardWrapper: {
    width: '100%',
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
  },
  polaroidCard: {
    width: 280,
    height: 380,
    backgroundColor: '#FFFFFF', // Keep physical polaroid white even in dark mode for aesthetic
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  polaroidImagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#EEE',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  polaroidImg: {
    width: '100%',
    height: '100%',
  },
  polaroidPrompt: {
    fontSize: 22,
    color: '#333',
    fontFamily: 'SpaceGrotesk-Bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tapToFlip: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'SpaceGrotesk-Regular'
  },
  polaroidBack: {
    backgroundColor: '#FAF8F5',
    padding: 25,
  },
  polaroidImgSmall: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  captionText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: 'SpaceGrotesk-Regular',
    fontStyle: 'italic',
    paddingHorizontal: 15,
  },
  tapeGraphic: {
    position: 'absolute',
    top: -15,
    width: 110,
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transform: [{ rotate: '-2deg' }],
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  memoryBackContainer: {
    alignItems: 'center',
    paddingTop: 15,
    width: '100%',
  },
  memoryTag: {
    marginTop: 25,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memoryTagText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'SpaceGrotesk-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  letterText: {
    fontSize: 16,
    color: '#222',
    lineHeight: 24,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  letterBack: {
    backgroundColor: '#FFF0F5',
    padding: 15,
  },
  letterContainer: {
    flexGrow: 1,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#F48FB1',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  letterDecorationTop: {
    alignItems: 'center',
    marginBottom: 15,
  },
  letterDecorationBottom: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  vaultFooter: {
    marginTop: 10,
    alignItems: 'center',
  },
  progressText: {
    color: colors.textPrimary,
    marginBottom: 15,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold'
  },
  // Audio Player
  audioPlayerCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  secretModal: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  secretTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontFamily: 'SpaceGrotesk-Bold',
    marginBottom: 15,
  },
  codeBox: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: 15,
  },
  codeText: {
    color: colors.accent,
    fontSize: 24,
    fontFamily: 'SpaceGrotesk-Bold',
    letterSpacing: 2,
  },
  riddleText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'SpaceGrotesk-Regular'
  }
});
