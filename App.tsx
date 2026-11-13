import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, StatusBar, StyleSheet, View, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PrivateNavigator, PublicNavigator} from './src/routes/Routes';
import {SCREENS} from './src/routes/Screens';
import {useAppDispatch, useAppSelector} from './src/store/hooks';
import {restoreSession} from './src/store/authSlice';
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
  const dispatch = useAppDispatch();
  const isDarkMode = useColorScheme() === 'dark';
  const isAuthenticated = useAppSelector(
    state => state.auth.isAuthenticated,
  );
  const isAuthInitialized = useAppSelector(
    state => state.auth.isAuthInitialized,
  );
  const hasSeenOnboarding =
    getBoolean(STORAGE_KEYS.HAS_SEEN_ONBOARDING) ?? false;
  const initialPublicRoute = hasSeenOnboarding
    ? SCREENS.PUBLIC.LOGIN
    : SCREENS.PUBLIC.ONBOARDING;

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        {!isAuthInitialized ? (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        ) : isAuthenticated ? (
          <PrivateNavigator />
        ) : (
          <PublicNavigator initialRouteName={initialPublicRoute} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
