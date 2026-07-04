import { Stack } from 'expo-router';

export default function PagesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="bKash" />
      <Stack.Screen name="Bank" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="[subject]" />
      <Stack.Screen name="Viewer" />
      <Stack.Screen name="SavedNotes" />
    </Stack>
  );
}