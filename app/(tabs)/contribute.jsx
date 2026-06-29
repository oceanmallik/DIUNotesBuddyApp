import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { IconSend, IconUpload, IconUserCheck } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppButton } from '../../appDesign/button.js';
import { TitleCard } from '../../appDesign/cards.js';
import Header, { useHeaderHeight } from '../../appDesign/header.js';
import { Planet, Tree } from '../../appDesign/texts.js';
import { supabase } from '../../lib/supabase';
import { useAppTheme } from '../../logic/ThemeProvider';

const Contribute = () => {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors } = useAppTheme();
  const headerHeight = useHeaderHeight();
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

  const handleAuthButton = () => {
    if (session) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.bg, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 12, paddingBottom: tabBarHeight + 20 }]}
          showsVerticalScrollIndicator={false}>
  
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
              icon={IconUpload}
              style={[styles.fullWidthButton, { borderRadius: 16 }]}
            />
            <View style={styles.buttonRow}>
              <AppButton
                onPress={handleAuthButton}
                title={session ? "Profile" : "Login"}
                style={styles.halfButton}
                variant="secondary"
              />
              <AppButton
                onPress={() => router.push('/Admin')}
                title="Admin Portal"
                style={styles.halfButton}
                variant="secondary"
              />
            </View>
            <AppButton
              onPress={() => router.push('mailto:oceanmallik@oceanmallik.com')}
              title="Need Assistance?"
              style={styles.tertiaryButton}
              variant="tertiary"
            />
          </View>

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

      <Header title="Shape the Future" />
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
    marginBottom: 5,
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
  tertiaryButton: {
    width: '100%',
    marginHorizontal: 0,
    marginTop: 0,
  },
  instructionsContainer: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
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
})