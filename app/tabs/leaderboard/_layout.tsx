import { Stack } from 'expo-router';

export default function LeaderboardLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="share" options={{ headerShown: false }} />
      <Stack.Screen name="friend" options={{ headerShown: false }} />
    </Stack>
  );
}
