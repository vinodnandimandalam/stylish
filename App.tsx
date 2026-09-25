import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PrivateNavigator, PublicNavigator} from './src/routes/Routes';

// TODO: Implement authentication logic to determine if the user is logged in or not
const isLoggedIn = false;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        {isLoggedIn ? <PrivateNavigator /> : <PublicNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
