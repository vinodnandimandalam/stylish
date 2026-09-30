import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton} from '../../components';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import {logoutUser} from './logoutService';

type DashboardProps = {
  onLogoutSuccess: () => void;
};

const Dashboard = ({onLogoutSuccess}: DashboardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleLogout = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      await logoutUser();
      onLogoutSuccess();
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : strings.logoutFailed,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{strings.dashboardTitle}</Text>
        {errorMessage ? (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {errorMessage}
          </Text>
        ) : null}
        <AppButton
          title={strings.logoutButton}
          onPress={handleLogout}
          loading={isLoading}
          disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  error: {
    color: colors.accentRed,
    marginBottom: 12,
  },
});

export default Dashboard;