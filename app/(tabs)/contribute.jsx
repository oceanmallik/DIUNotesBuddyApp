import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { IconSend, IconUpload, IconUserCheck } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { AppButton } from '../../appDesign/button.js';
import { TitleCard } from '../../appDesign/cards.js';
import Header from '../../appDesign/header.js';
import { Planet, Tree } from '../../appDesign/texts.js';
import { supabase } from '../../lib/supabase';
import { useAppTheme } from '../../logic/ThemeProvider';

const Contribute = () => {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors } = useAppTheme();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthButton = async () => {
    if (session) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Error logging out', error.message);
      } else {
        Alert.alert('Logged Out', 'You have been successfully logged out.');
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.bg, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: 90, paddingBottom: tabBarHeight + 20 }]}
          showsVerticalScrollIndicator={false}>

          <Planet title="Become a Contributor" style={{ textAlign: 'center', marginTop: 10, marginBottom: 5, color: colors.textPrimary }} />
          
          <TitleCard
            title="Your Contribution Matters"
            description="Every note you share helps build a stronger, more helpful resource for all DIU students."
            icon={IconSend}
          />

          {/* Core Actions */}
          <View style={styles.actionGrid}>
            <AppButton
              onPress={() => router.push('/Submit')}
              title="Submit Notes"
              style={styles.fullWidthButton}
            />
            <View style={styles.buttonRow}>
              <AppButton
                onPress={handleAuthButton}
                title={session ? "Logout" : "Login"}
                style={styles.halfButton}
              />
              <AppButton
                onPress={() => router.push('/Admin')}
                title="Admin Portal"
                style={styles.halfButton}
              />
            </View>
            <AppButton
              onPress={() => router.push('mailto:oceanmallik@oceanmallik.com')}
              title="Need Assistance?"
              style={styles.secondaryButton}
            />
          </View>

          {/* Easter Egg Meme */}
          <Image 
            source={require('../../assets/images/tom_meme.png')} 
            style={[styles.meme, { borderColor: colors.border }]} 
            contentFit="contain" 
          />

          {/* Simple Instructions */}
          <View style={[styles.instructionsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Planet title="How it works" style={{ fontSize: 18, marginBottom: 15, color: colors.textPrimary }} />
            
            <View style={styles.stepRow}>
              <IconUserCheck size={24} color={colors.accent} />
              <Tree title="1. Log in using your university @diu.edu.bd account." style={[styles.stepText, { color: colors.textSecondary }]} />
            </View>
            
            <View style={styles.stepRow}>
              <IconUpload size={24} color={colors.accent} />
              <Tree title="2. Tap 'Submit Notes' and attach your clean PDF file." style={[styles.stepText, { color: colors.textSecondary }]} />
            </View>

            <View style={styles.stepRow}>
              <IconSend size={24} color={colors.accent} />
              <Tree title="3. Wait for admin approval to see your notes live!" style={[styles.stepText, { color: colors.textSecondary }]} />
            </View>
          </View>

        </ScrollView>
      </View>

      <Header title="Want to become a part?" />
    </View>
  )
}

export default Contribute

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
    padding: 2,
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },
  actionGrid: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    gap: 12,
  },
  fullWidthButton: {
    width: '100%',
    marginHorizontal: 0,
    marginTop: 0,
    paddingVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfButton: {
    flex: 1,
    marginHorizontal: 0,
    marginTop: 0,
  },
  secondaryButton: {
    width: '100%',
    marginHorizontal: 0,
    marginTop: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  instructionsContainer: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 60,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
  },
  meme: {
    width: '90%',
    height: 280,
    marginTop: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 16,
    opacity: 0.8,
  },
})