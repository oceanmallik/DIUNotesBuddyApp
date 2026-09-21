import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../logic/ThemeProvider';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const TRIVIA_QUESTIONS = [
  {
    image: 'https://picsum.photos/400/300?random=201',
    correctImage: 'https://picsum.photos/400/300?random=301',
    question: 'Who is the bigger foodie among us?',
    options: ['Ocean', 'Nimu', 'We both eat equally'],
    answerIndex: 1,
  },
  {
    image: 'https://picsum.photos/400/300?random=202',
    correctImage: 'https://picsum.photos/400/300?random=302',
    question: 'Who gives the best late-night advice?',
    options: ['Ocean', 'Nimu', 'Google'],
    answerIndex: 0,
  },
  {
    image: 'https://picsum.photos/400/300?random=203',
    correctImage: 'https://picsum.photos/400/300?random=303',
    question: 'Who is more likely to stay up until 4 AM?',
    options: ['Nimu', 'Ocean', 'Neither'],
    answerIndex: 0,
  },
  {
    image: 'https://picsum.photos/400/300?random=204',
    correctImage: 'https://picsum.photos/400/300?random=304',
    question: 'Who is the bigger drama queen?',
    options: ['Ocean', 'Nimu', 'It is a tie'],
    answerIndex: 1,
  },
  {
    image: 'https://picsum.photos/400/300?random=205',
    correctImage: 'https://picsum.photos/400/300?random=305',
    question: 'Who has the worst memory for dates?',
    options: ['Nimu', 'Ocean', 'We both forget'],
    answerIndex: 1,
  },
  {
    image: 'https://picsum.photos/400/300?random=206',
    correctImage: 'https://picsum.photos/400/300?random=306',
    question: 'Who is always running late?',
    options: ['Ocean', 'Nimu', 'Traffic is to blame'],
    answerIndex: 1,
  },
  {
    image: 'https://picsum.photos/400/300?random=207',
    correctImage: 'https://picsum.photos/400/300?random=307',
    question: 'Who is the designated problem solver?',
    options: ['Nimu', 'Ocean', 'We just panic'],
    answerIndex: 0,
  },
  {
    image: 'https://picsum.photos/400/300?random=208',
    correctImage: 'https://picsum.photos/400/300?random=308',
    question: 'Who takes more selfies?',
    options: ['Ocean', 'Nimu', 'We take usies'],
    answerIndex: 1,
  },
  {
    image: 'https://picsum.photos/400/300?random=209',
    correctImage: 'https://picsum.photos/400/300?random=309',
    question: 'Who is more likely to start a random argument for fun?',
    options: ['Nimu', 'Ocean', 'Neither'],
    answerIndex: 0,
  },
  {
    image: 'https://picsum.photos/400/300?random=210',
    correctImage: 'https://picsum.photos/400/300?random=310',
    question: 'Who is the funnier one?',
    options: ['Ocean', 'Nimu', 'We are a comedy duo'],
    answerIndex: 2,
  },
];

// --- Components ---

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
      <Text style={styles.headerTitle}>Memories Trivia: {qIndex + 1}/10</Text>

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

const Screen2Final = ({ colors }) => {
  const styles = getStyles(colors);
  
  return (
    <View style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.headerTitle}>Journey Completed!</Text>
      <Text style={styles.subtitleText}>Here's to all our amazing memories.</Text>
      
      <View style={styles.bondCard}>
        <Image 
          source={{ uri: 'https://picsum.photos/400/400?random=999' }} 
          style={styles.bondImage} 
          contentFit="cover" 
        />
        
        <View style={styles.namesContainer}>
          <Text style={styles.nameText}>Ocean Mallik</Text>
          
          <View style={styles.bondBadge}>
            <Ionicons name="infinite" size={24} color={colors.accent} />
            <Text style={styles.bondBadgeText}>A Bond of Friendship & Siblinghood</Text>
          </View>
          
          <Text style={styles.nameText}>Tasnim Iffat Nimu</Text>
        </View>
      </View>
    </View>
  );
};

// --- Main Container ---

export default function NimuMemories() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  
  const [currentScreen, setCurrentScreen] = useState(1);

  const navigateTo = (screenId) => {
    setCurrentScreen(screenId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentScreen === 1 && <Screen1Trivia onComplete={() => navigateTo(2)} colors={colors} />}
      {currentScreen === 2 && <Screen2Final colors={colors} />}
    </SafeAreaView>
  );
}

// --- Styles ---

const getStyles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
  // Final Screen
  bondCard: {
    backgroundColor: colors.card,
    width: '100%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  bondImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 30,
  },
  namesContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  nameText: {
    fontSize: 26,
    color: colors.textPrimary,
    fontFamily: 'SpaceGrotesk-Bold',
    textAlign: 'center',
  },
  bondBadge: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    gap: 5,
  },
  bondBadgeText: {
    color: colors.accent,
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 14,
    textAlign: 'center',
  }
});
