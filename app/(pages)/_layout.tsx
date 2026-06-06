import { Stack } from 'expo-router';

export default function PagesLayout() {
  return (
    <Stack>
      {/* You don't strictly have to list every screen here, 
        but it's where you configure their headers. 
      */}
      <Stack.Screen 
        name="ads" 
        options={{ title: 'Watch an Ad' }} 
      />
    </Stack>
  );
}