import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useEffect, useState} from 'react';
import {AppButton} from '../../components';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {clearLogoutError, logout} from '../../store/authSlice';
import NativeDeviceInfo from '../../specs/NativeStylishDeviceInfo';

const Settings = () => {
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector(
		state => state.auth.logoutStatus === 'loading',
	);
	const errorMessage = useAppSelector(state => state.auth.logoutError);
	const [deviceModel, setDeviceModel] = useState(strings.deviceInfoLoading);

	useEffect(() => {
		if (Platform.OS !== 'android') {
			setDeviceModel(strings.deviceInfoUnavailable);
			return;
		}

		NativeDeviceInfo?.getDeviceModel()
			.then(setDeviceModel)
			.catch(() => setDeviceModel(strings.deviceInfoError));
	}, []);

	const handleLogout = async () => {
		if (isLoading) {
			return;
		}

		dispatch(clearLogoutError());
		await dispatch(logout());
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>{strings.settingsTitle}</Text>
				<Text style={styles.deviceInfo}>
					{strings.deviceInfoLabel}: {deviceModel}
				</Text>
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
	deviceInfo: {
		marginBottom: 24,
		color: colors.textSecondary,
		fontSize: 16,
	},
	error: {
		color: colors.accentRed,
		marginBottom: 12,
	},
});

export default Settings;
