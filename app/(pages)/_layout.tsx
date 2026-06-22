import { Stack } from 'expo-router';

export default function PagesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="ads" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="bKash" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Bank" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}