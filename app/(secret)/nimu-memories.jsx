import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SHORT_STORIES = [
  {
    id: 1,
    title: "The Midnight Ramen Adventure",
    content: `ছোট্ট একটা বিদ্যাপীঠ, চারপাশ বেশ শান্ত। মোস্তফা স্যারের ক্লাস চলছে আপন গতিতে। পিনপতন নীরবতার মাঝেই হঠাৎ বেজে উঠল একটা রিংটোন। স্যার তো রীতিমতো চমকে উঠলেন! ভরদুপুরে হঠাৎ কার ফোন? মনে মনে প্রমাদ গুনলেন তিনি, এই বুঝি গিন্নির কল! বুক দুরুদুরু অবস্থায় বাঁ দিকের পকেট থেকে স্যামসাং ফোনটা বের করলেন। স্ক্রিনের দিকে তাকিয়েই ধড়ে প্রাণ ফিরে এলো স্যারের। একটা স্বস্তির দীর্ঘশ্বাস ছাড়লেন। নাহ, গিন্নি নয়, স্ক্রিনে জ্বলজ্বল করছে 'আক্তার হোসেন' নামটা। তবে পরক্ষণেই স্যার বুঝলেন, এই কল আদতে তার জন্য নয়। ক্লাসের প্রথম সারির তৃতীয় বেঞ্চে বসা এক মেয়ের জন্য এসেছে এই তলব। স্যার মেয়েটিকে ডেকে ফোনটা এগিয়ে দিলেন। একটু নিরিবিলিতে কথা বলার জন্য মেয়েটি যেই না বেঞ্চ ছেড়ে উঠে দাঁড়াতে যাবে, ঠিক তখনই ঘটল আসল বিপত্তি! তার ঠিক পেছনেই বসা এক সুদর্শন ছেলে হঠাৎ করে অদ্ভুত আর বিশ্রী একটা শব্দ করে বসল। মুহূর্তেই ক্লাসের পরিবেশ থমথমে! মেয়েটি যাওয়ার পথে থমকে দাঁড়াল। ঘাড় ঘুরিয়ে এমন এক রাগান্বিত, তীক্ষ্ণ আর রক্তচক্ষু দৃষ্টিতে ছেলেটার দিকে তাকাল যে, ছেলেটার আত্মা খাঁচাছাড়া হওয়ার জোগাড়! কোনো কথা না বাড়িয়ে মেয়েটি হনহন করে বাইরে চলে গেল। কিন্তু এদিকে ছেলেটার অবস্থা তখন রীতিমতো শোচনীয়। তার চোখেমুখে স্পষ্ট আতঙ্ক, এই বুঝি মেয়ের বাবা লাঠিসোঁটা নিয়ে স্কুলে এসে হাজির হলো বলে! ভয়ে তার হাত-পা ঠান্ডা, মনে মনে শুধু ভাবছে,"আজ আর রক্ষা নেই, স্কুলে আজ আমার বিচার বসবেই!" কিন্তু কথায় আছে না, রাখে আল্লাহ মারে কে! ছেলেটার কপাল সে যাত্রায় ভালোই ছিল। সারাদিন আতঙ্কে প্রহর গুনলেও শেষমেশ কিছুই হলো না। বিশাল এক কালবৈশাখী ঝড় যেন বিনা মেঘেই শান্ত হয়ে গেল!`
  },
  {
    id: 2,
    title: "The Great Umbrella Mishap",
    content: 'গল্পটা খুব বেশিদিন আগের না, কিন্তু যখনই মনে পড়ে, গায়ের লোম খাড়া হয়ে যায়। আমাদের স্কুলের এক স্যার তার পুরনো, স্যাঁতসেঁতে বাড়িতে আমাদের প্রাইভেট পড়াতেন। আমরা কয়েকজন ছোট ছোট ছেলেমেয়ে ছিলাম। স্যারের কড়া নিয়ম ছিল, ঘরের বাইরে এক কোণে জুতো খুলে তারপর ভেতরে ঢুকতে হবে। যাওয়ার সময় আমাদের সবার জুতো একদম ঝকঝকে পরিষ্কার থাকতো। কিন্তু আসল ভয়ংকর ব্যাপারটা অপেক্ষা করে থাকতো পড়া শেষের মুহূর্তটার জন্য। পড়া শেষে যখন চারপাশটা একদম সুনসান হয়ে যেত, আমরা দরজা খুলে বাইরে আসতেই আমাদের রক্ত হিম হয়ে আসতো। বারান্দার সেই মিটমিটে আলোতে দেখতাম, আমাদের পরিষ্কার জুতোগুলোর ওপর দিয়ে যেন একটা তাণ্ডব বয়ে গেছে! জুতোগুলো স্যাঁতসেঁতে কাদায় মাখামাখি, কিন্তু সেগুলো কোনো সাধারণ কাদা নয়। যেন অতিকায়, বীভৎস কোনো পা আমাদের জুতোগুলোকে চরম আক্রোশে মাড়িয়ে দিয়ে গেছে। আশেপাশে কোনো মানুষের সাড়াশব্দ নেই, বাতাসে শুধু একটা ভ্যাপসা গন্ধ, অথচ জুতোগুলোর ওপর সেই অমানবিক পায়ের ছাপ! যেন কোনো এক অশরীরী ছায়ামূর্তি, যার পায়ের পাতাগুলো স্বাভাবিক মানুষের মতো নয়, সে প্রতিদিন অন্ধকারে দাঁড়িয়ে আমাদের জন্য অপেক্ষা করতো।ওই নোংরা, কাদামাখা জুতো পায়ে দিয়ে ফেরার সময় আমাদের সবার বুকের ভেতরটা ধড়ফড় করতো। মনে হতো অন্ধকারের ভেতর থেকে কেউ একজন আমাদের দিকে তাকিয়ে আছে, আর নিঃশব্দে হাসছে! প্রতিদিনের এই গা ছমছমে আতঙ্কটা আজও আমাদের তাড়া করে ফেরে।'
  },
  {
    id: 3,
    title: "Lost in the City",
    content: "We decided to take a shortcut through a neighborhood we'd never been to. Two hours later, we were hopelessly lost, our phones at 1% battery. We eventually found our way back by following the smell of a familiar bakery."
  },
  {
    id: 4,
    title: "The Mystery of the Missing Keys",
    content: "We searched everywhere: our bags, the car, the entire hallway. We even blamed a stray cat. Turns out, the keys were in the fridge the entire time, sitting perfectly next to the leftover pizza."
  }
];

export default function NimuMemories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const currentStory = SHORT_STORIES[currentIndex];

  const handleNext = () => {
    if (currentIndex < SHORT_STORIES.length - 1) {
      setIsOpen(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      // End of stories, reset to beginning
      setIsOpen(false);
      setCurrentIndex(0);
    }
  };

  const handleReveal = () => {
    setIsOpen(true);
  };

  const renderEnvelope = () => (
    <View style={styles.centerContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleReveal}
        style={styles.envelopeContainer}
      >
        <View style={styles.envelopeTopFlap} />

        <View style={styles.envelopeContent}>
          <View style={styles.waxSeal}>
            <Ionicons name="heart" size={24} color="#FFF" />
          </View>
          <Text style={styles.envelopeTitle}>For Nimu</Text>
          <Text style={styles.envelopeSubtitle}>Memory {currentIndex + 1}</Text>
          <Text style={styles.tapToOpen}>Tap to open letter</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderLetter = () => (
    <View style={styles.letterWrapper}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.paper}>
          <Text style={styles.dateText}>Memory #{currentStory.id}</Text>
          <Text style={styles.letterTitle}>{currentStory.title}</Text>
          <View style={styles.divider} />

          <Text style={styles.letterBody}>
            {currentStory.content}
          </Text>

          <View style={styles.signatureContainer}>
            <Text style={styles.signature}>Written by,</Text>
            <Text style={styles.signatureName}>Ocean</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === SHORT_STORIES.length - 1 ? "Read Again" : "Next Story"}
          </Text>
          {currentIndex !== SHORT_STORIES.length - 1 && (
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          )}
          {currentIndex === SHORT_STORIES.length - 1 && (
            <Ionicons name="refresh" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {isOpen ? renderLetter() : renderEnvelope()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3E3227', // Dark wood desk aesthetic
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Envelope Styles
  envelopeContainer: {
    width: width * 0.85,
    height: width * 0.55,
    backgroundColor: '#EAE0D5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#C8BBAE',
    overflow: 'hidden', // to keep the flap inside the rounded corners
  },
  envelopeTopFlap: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: (width * 0.85) / 2,
    borderRightWidth: (width * 0.85) / 2,
    borderTopWidth: (width * 0.85) * 0.35,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#DFD2C4',
    zIndex: 1,
  },
  envelopeContent: {
    alignItems: 'center',
    zIndex: 2,
    marginTop: 40,
  },
  waxSeal: {
    position: 'absolute',
    top: -65, // Adjust this so it sits near the tip of the flap
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9A2A2A', // Deep red wax color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  envelopeTitle: {
    fontSize: 26,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#4A3B32',
    marginTop: 10,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  envelopeSubtitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#7A6B5C',
    marginBottom: 16,
  },
  tapToOpen: {
    fontSize: 13,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#9E8D7D',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // Letter Styles
  letterWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  paper: {
    width: width * 0.9,
    backgroundColor: '#FDFBF7', // Off-white paper color
    padding: 30,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    minHeight: height * 0.6,
    borderWidth: 1,
    borderColor: '#EFEAE0',
  },
  dateText: {
    fontSize: 13,
    color: '#A08E7D',
    fontFamily: 'SpaceGrotesk-Regular',
    textAlign: 'right',
    marginBottom: 15,
  },
  letterTitle: {
    fontSize: 22,
    color: '#2C241B',
    fontFamily: 'SpaceGrotesk-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAE0D5',
    marginBottom: 25,
    width: '70%',
    alignSelf: 'center',
  },
  letterBody: {
    fontSize: 17,
    color: '#3E3227',
    fontFamily: 'SpaceGrotesk-Regular',
    lineHeight: 30,
  },
  signatureContainer: {
    marginTop: 50,
    alignItems: 'flex-end',
  },
  signature: {
    fontSize: 16,
    color: '#5C4A3D',
    fontFamily: 'SpaceGrotesk-Regular',
  },
  signatureName: {
    fontSize: 20,
    color: '#2C241B',
    fontFamily: 'SpaceGrotesk-Bold',
    fontStyle: 'italic',
    marginTop: 5,
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#8C7A6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    alignSelf: 'center',
    marginBottom: 20,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
  }
});
