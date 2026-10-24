import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#E3350D' },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'PokéDex Explorer', headerShown: false }}
        />
        <Stack.Screen
          name="detail"
          options={{ title: 'Ficha' }}
        />
      </Stack>
    </>
  );
}
