import React from 'react';
import {StatusBar, StyleSheet, Text, View, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import OnBoarding from './src/modules/onboarding/OnBoarding';

//TODO: Implement authentication logic to determine if the user is logged in or not
const isLoggedIn = false;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isLoggedIn ? <HomeScreen /> : <OnBoarding />}
    </SafeAreaProvider>
  );
}

function HomeScreen() {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeText}>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  homeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
});

export default App;
