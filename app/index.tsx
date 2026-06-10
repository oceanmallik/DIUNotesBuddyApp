// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // This instantly forwards the user to your main tabs layout on startup
  return <Redirect href="/(tabs)" />;
}