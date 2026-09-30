import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PrivateNavigator, PublicNavigator} from './src/routes/Routes';
import {SCREENS} from './src/routes/Screens';
import {useAppSelector} from './src/store/hooks';
import {store} from './src/store/store';
import {getBoolean, STORAGE_KEYS} from './src/utils/MMKVStorage';

function App() {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}

function AppNavigation() {
  const isDarkMode = useColorScheme() === 'dark';
  const isAuthenticated = useAppSelector(
    state => state.auth.isAuthenticated,
  );
  const hasSeenOnboarding =
    getBoolean(STORAGE_KEYS.HAS_SEEN_ONBOARDING) ?? false;
  const initialPublicRoute = hasSeenOnboarding
    ? SCREENS.PUBLIC.LOGIN
    : SCREENS.PUBLIC.ONBOARDING;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        {isAuthenticated ? (
          <PrivateNavigator />
        ) : (
          <PublicNavigator initialRouteName={initialPublicRoute} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
