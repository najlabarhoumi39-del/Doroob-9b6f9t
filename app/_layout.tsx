import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { AppProvider } from '@/contexts/AppContext';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <View style={styles.page}>
          <View style={styles.phoneContainer}>
            <AppProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
              </Stack>
            </AppProvider>
          </View>
        </View>
      </SafeAreaProvider>
    </AlertProvider>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  phoneContainer: {
    width: '100%',
    maxWidth: 390,
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
});
