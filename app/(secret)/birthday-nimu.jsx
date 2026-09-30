import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useRef, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {
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
  }
];

const LETTER_CARD = {
  id: 7,
  frontImage: 'https://picsum.photos/400/500?random=99',
  prompt: 'A Simple Letter',
  text: "শুভ জন্মদিন প্রিয় বন্ধু, \n\nরক্তের সম্পর্ক না থাকলেও তুই যে আমার নিজের বোনের চেয়েও বেশি কিছু, সেটা নতুন করে বলার দরকার নেই। রাত দুইটার পাগলামি থেকে শুরু করে মন খারাপের দিনে ভরসা হওয়া, সবকিছুতেই তুই আমার সবচেয়ে বড় শক্তি। \n\nতুই যেভাবে নিজের স্বপ্ন নিয়ে লড়ছিস, তোকে নিয়ে সত্যি অনেক গর্ব হয়। জীবনে যাই ঘটুক, জেনে রাখিস তোর এই ভাই/বন্ধুটা যেকোনো পরিস্থিতিতে তোর পাশে আছে আর থাকবে। তোর এই সুন্দর হাসিমুখটা যেন কখনো না হারায়। শুভ জন্মদিন, ছাগল! অনেক ভালো থাকিস সবসময়। \n\n— তোর বন্ধু",
  isLetter: true,
};

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
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Ionicons name="trophy" size={80} color={colors.accent} style={{ marginBottom: 20, marginTop: 20 }} />
      <Text style={styles.headerTitle}>You Did It!</Text>

      <View style={styles.trophyBanner}>
        <Text style={styles.trophyScore}>Score: 5 / 5</Text>
      </View>

      <View style={styles.bondCard}>
        <Text style={styles.bondTitle}>Friendship Bond:</Text>
        <Text style={styles.bondValue}>Unbreakable (S-Tier) 💖</Text>
      </View>

      <View style={{ width: '100%', gap: 12, paddingBottom: 10 }}>
        <View style={[styles.badgeItem, { width: '100%', flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }]}>
          <Ionicons name="trash-bin-outline" size={26} color={colors.accent} />
          <Text style={[styles.badgeText, { marginTop: 0, marginLeft: 15, flex: 1, textAlign: 'left', fontSize: 15 }]}>ডাস্টবিন থেকে কুড়িয়ে পাওয়া রত্ন</Text>
        </View>
        <View style={[styles.badgeItem, { width: '100%', flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }]}>
          <Ionicons name="color-palette-outline" size={26} color={colors.accent} />
          <Text style={[styles.badgeText, { marginTop: 0, marginLeft: 15, flex: 1, textAlign: 'left', fontSize: 15 }]}>যার হিজাবের রঙে আকাশ নীল</Text>
        </View>
        <View style={[styles.badgeItem, { width: '100%', flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }]}>
          <Ionicons name="fast-food-outline" size={26} color={colors.accent} />
          <Text style={[styles.badgeText, { marginTop: 0, marginLeft: 15, flex: 1, textAlign: 'left', fontSize: 15 }]}>ঢাকাগামী বাসের ছোলা খাদক</Text>
        </View>
        <View style={[styles.badgeItem, { width: '100%', flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }]}>
          <Ionicons name="medal-outline" size={26} color={colors.accent} />
          <Text style={[styles.badgeText, { marginTop: 0, marginLeft: 15, flex: 1, textAlign: 'left', fontSize: 15 }]}>ওশানকে ভালো মানুষের স্বীকৃতিদাতা</Text>
        </View>
        <View style={[styles.badgeItem, { width: '100%', flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }]}>
          <Ionicons name="cut-outline" size={26} color={colors.destructive} />
          <Text style={[styles.badgeText, { marginTop: 0, marginLeft: 15, flex: 1, textAlign: 'left', fontSize: 15 }]}>আগামী কোরবানির প্রধান আকর্ষণ</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.primaryBtn, { marginTop: 30, width: '100%' }]} onPress={onNext}>
        <Text style={styles.primaryBtnText}>Open Memory Vault</Text>
        <Ionicons name="lock-open-outline" size={20} color="#FFF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </ScrollView>
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

  const cardDimensions = card.isLetter ? { width: width - 40, height: 600 } : {};
  const wrapperHeight = card.isLetter ? { height: 620 } : {};

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
              <Image source={{ uri: card.frontImage }} style={styles.polaroidImg} contentFit="cover" blurRadius={25} />
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

const Screen4Letter = ({ onNext, colors }) => {
  const styles = getStyles(colors);

  const [step, setStep] = useState(0); // 0 = closed, 1 = opened (letter out), 2 = reading (expanded)

  const flapAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const envelopeOpacity = useRef(new Animated.Value(1)).current;

  const handleTap = () => {
    if (step === 0) {
      setStep(1);
      Animated.sequence([
        Animated.timing(flapAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 1, duration: 500, useNativeDriver: false })
      ]).start();
    } else if (step === 1) {
      setStep(2);
      Animated.parallel([
        Animated.timing(envelopeOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(expandAnim, { toValue: 1, duration: 600, useNativeDriver: false })
      ]).start();
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Animated.View style={{ opacity: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>
        <Text style={styles.headerTitle}>{step === 0 ? "A Special Message" : "Read It"}</Text>
        <Text style={styles.subtitleText}>{step === 0 ? "Tap the envelope to open it." : "Tap the letter to unfold."}</Text>
      </Animated.View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <TouchableWithoutFeedback onPress={handleTap}>
          <View style={{ width: 300, height: 200, alignItems: 'center', justifyContent: 'flex-end', marginTop: 40 }}>

            {/* Envelope Back */}
            <Animated.View style={{
              position: 'absolute', bottom: 0, width: 300, height: 200,
              backgroundColor: '#D4AF37', borderRadius: 10,
              opacity: envelopeOpacity
            }} />

            {/* Letter Paper */}
            <Animated.View style={{
              position: 'absolute',
              bottom: 10,
              width: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [270, width - 40] }),
              height: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [180, 480] }),
              backgroundColor: '#FFF0F5',
              borderRadius: 8,
              padding: 20,
              borderWidth: 1.5, borderColor: '#F48FB1', borderStyle: 'dashed',
              zIndex: step === 0 ? 2 : 6,
              transform: [
                { translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -120] }) },
                { translateY: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }) }
              ],
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5,
              overflow: 'hidden'
            }}>

              {/* Full Text */}
              <Animated.View style={{ opacity: expandAnim, flex: 1 }} pointerEvents={step === 2 ? 'auto' : 'none'}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                  <Text style={styles.letterText}>{LETTER_CARD.text}</Text>
                </ScrollView>
              </Animated.View>

              {/* Mini Lines (folded look) */}
              <Animated.View style={{
                position: 'absolute', top: 30, left: 20, right: 20,
                opacity: expandAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] })
              }}>
                <View style={{ height: 6, backgroundColor: '#FFD1DC', marginBottom: 15, width: '40%', borderRadius: 3 }} />
                <View style={{ height: 6, backgroundColor: '#FFD1DC', marginBottom: 15, width: '80%', borderRadius: 3 }} />
                <View style={{ height: 6, backgroundColor: '#FFD1DC', marginBottom: 15, width: '90%', borderRadius: 3 }} />
                <View style={{ height: 6, backgroundColor: '#FFD1DC', marginBottom: 15, width: '75%', borderRadius: 3 }} />
              </Animated.View>

            </Animated.View>

            {/* Left Flap */}
            <Animated.View style={{
              position: 'absolute', left: 0, top: 0,
              width: 0, height: 0,
              borderTopWidth: 100, borderBottomWidth: 100, borderLeftWidth: 150,
              borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#CFA768',
              zIndex: 7, opacity: envelopeOpacity
            }} />

            {/* Right Flap */}
            <Animated.View style={{
              position: 'absolute', right: 0, top: 0,
              width: 0, height: 0,
              borderTopWidth: 100, borderBottomWidth: 100, borderRightWidth: 150,
              borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#CFA768',
              zIndex: 7, opacity: envelopeOpacity
            }} />

            {/* Bottom Flap */}
            <Animated.View style={{
              position: 'absolute', bottom: 0,
              width: 0, height: 0,
              borderLeftWidth: 150, borderRightWidth: 150, borderBottomWidth: 120,
              borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#B8860B',
              zIndex: 8, opacity: envelopeOpacity
            }} />

            {/* Top Flap (Hinged) */}
            <Animated.View style={{
              position: 'absolute', top: 0,
              width: 0, height: 0,
              borderLeftWidth: 150, borderRightWidth: 150, borderTopWidth: 110,
              borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#DAA520',
              zIndex: step === 0 ? 10 : 5,
              opacity: envelopeOpacity,
              transform: [
                { translateY: -55 },
                { rotateX: flapAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-180deg'] }) },
                { translateY: 55 }
              ]
            }} />

          </View>
        </TouchableWithoutFeedback>
      </View>

      <Animated.View style={[styles.vaultFooter, { opacity: expandAnim }]} pointerEvents={step === 2 ? 'auto' : 'none'}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={onNext}
        >
          <Text style={styles.primaryBtnText}>Proceed to Next Surprise</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const Screen5TapReveal = ({ colors }) => {
  const styles = getStyles(colors);

  const [taps, setTaps] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString('memories22');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const MAX_TAPS = 5;
  const coverOpacity = 1 - (taps / MAX_TAPS);
  const isRevealed = taps >= MAX_TAPS;

  const handleTap = () => {
    if (taps < MAX_TAPS) {
      const newTaps = taps + 1;
      setTaps(newTaps);

      if (newTaps >= MAX_TAPS) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <View style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.headerTitle}>One Last Surprise...</Text>
      <Text style={[styles.subtitleText, { textAlign: 'center', marginBottom: 40 }]}>
        Tap the mystery box 5 times to reveal your final clue!
      </Text>

      <View style={{ width: 300, height: 150, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.card, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, marginBottom: 40 }}>
        {/* Secret Content */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card }}>
          <Text style={{ fontSize: 16, color: colors.textSecondary, fontFamily: 'SpaceGrotesk-Regular', marginBottom: 10 }}>Secret Code:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border }}>
            <Text selectable={true} style={{ fontSize: 26, color: colors.accent, fontFamily: 'SpaceGrotesk-Bold', marginRight: 15 }}>memories22</Text>
            <TouchableOpacity onPress={handleCopy} style={{ backgroundColor: copied ? '#4CAF50' : colors.accent, padding: 8, borderRadius: 8 }}>
              <Ionicons name={copied ? "checkmark-outline" : "copy-outline"} size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cover Layer */}
        {!isRevealed && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleTap}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#B0BEC5', justifyContent: 'center', alignItems: 'center', opacity: coverOpacity }}
          >
            <Text style={{ color: '#455A64', fontSize: 24, fontFamily: 'SpaceGrotesk-Bold' }}>TAP TO REVEAL</Text>
            <Text style={{ color: '#455A64', fontSize: 14, fontFamily: 'SpaceGrotesk-Regular', marginTop: 5 }}>({MAX_TAPS - taps} taps left)</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Revealed Clue */}
      <Animated.View style={{ opacity: fadeAnim, width: '100%', alignItems: 'center' }}>
        <Ionicons name="sparkles" size={40} color={colors.accent} style={{ marginBottom: 15 }} />
        <Text style={[styles.subtitleText, { fontSize: 18, color: colors.textPrimary, fontFamily: 'SpaceGrotesk-Bold' }]}>Code Unlocked!</Text>
        <Text style={[styles.subtitleText, { paddingHorizontal: 20 }]}>
          Clue: Tap on @oceanmallik
        </Text>
      </Animated.View>
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
      {currentScreen === 4 && <Screen4Letter onNext={() => navigateTo(5)} colors={colors} />}
      {currentScreen === 5 && <Screen5TapReveal colors={colors} />}
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
    height: 520,
    alignItems: 'center',
    justifyContent: 'center',
  },
  polaroidCard: {
    width: 320,
    height: 480,
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
    height: 320,
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
    width: 170,
    height: 170,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    transform: [{ rotate: '-2deg' }],
    elevation: 5,
  },
  captionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
    fontFamily: 'SpaceGrotesk-Regular',
    fontStyle: 'italic',
    paddingHorizontal: 10,
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
