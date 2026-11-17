import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PrivateNavigator, PublicNavigator} from './src/routes/Routes';
import {SCREENS} from './src/routes/Screens';
import NativeStylishStartup from './src/specs/NativeStylishStartup';
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
  const navigation = (
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
  );

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthInitialized || Platform.OS !== 'android') {
      return;
    }

    const frame = requestAnimationFrame(() => {
      NativeStylishStartup?.reportAppReady();
    });

    return () => cancelAnimationFrame(frame);
  }, [isAuthInitialized]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {Platform.OS === 'android' ? (
        <View
          style={styles.navigation}
          testID={
            isAuthInitialized ? 'benchmark-app-ready' : undefined
          }>
          {navigation}
        </View>
      ) : (
        navigation
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  navigation: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
