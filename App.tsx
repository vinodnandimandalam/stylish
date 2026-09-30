import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PrivateNavigator, PublicNavigator} from './src/routes/Routes';
import {SCREENS} from './src/routes/Screens';
import {getBoolean, setBoolean, STORAGE_KEYS} from './src/utils/MMKVStorage';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => getBoolean(STORAGE_KEYS.IS_LOGGED_IN) ?? false,
  );
  const hasSeenOnboarding = getBoolean(STORAGE_KEYS.HAS_SEEN_ONBOARDING) ?? false;
  const initialPublicRoute = hasSeenOnboarding
    ? SCREENS.PUBLIC.LOGIN
    : SCREENS.PUBLIC.ONBOARDING;

  const handleLoginSuccess = () => {
    setBoolean(STORAGE_KEYS.IS_LOGGED_IN, true);
    setIsLoggedIn(true);
  };

  const handleLogoutSuccess = () => {
    setBoolean(STORAGE_KEYS.IS_LOGGED_IN, false);
    setIsLoggedIn(false);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        {isLoggedIn ? (
          <PrivateNavigator onLogoutSuccess={handleLogoutSuccess} />
        ) : (
          <PublicNavigator
            initialRouteName={initialPublicRoute}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
