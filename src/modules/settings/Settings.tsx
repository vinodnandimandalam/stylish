import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useEffect, useState} from 'react';
import {AppButton} from '../../components';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {clearLogoutError, logout} from '../../store/authSlice';
import NativeDeviceInfo from '../../specs/NativeStylishDeviceInfo';
import NativeStylishStorage from '../../specs/NativeStylishStorage';

const BYTES_PER_MIB = 1024 * 1024;
const BYTES_PER_GIB = 1024 * BYTES_PER_MIB;

const Settings = () => {
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector(
		state => state.auth.logoutStatus === 'loading',
	);
	const errorMessage = useAppSelector(state => state.auth.logoutError);
	const [deviceModel, setDeviceModel] = useState(strings.deviceInfoLoading);
	const [availableBytes, setAvailableBytes] = useState<number | null>(null);
	const [storageStatus, setStorageStatus] = useState<
		'loading' | 'ready' | 'error' | 'unavailable'
	>('loading');
	const [storageRefreshCount, setStorageRefreshCount] = useState(0);

	useEffect(() => {
		if (Platform.OS !== 'android') {
			setDeviceModel(strings.deviceInfoUnavailable);
			return;
		}

		NativeDeviceInfo?.getDeviceModel()
			.then(setDeviceModel)
			.catch(() => setDeviceModel(strings.deviceInfoError));
	}, []);

	useEffect(() => {
		let active = true;

		if (Platform.OS !== 'android') {
			setStorageStatus('unavailable');
			return () => {
				active = false;
			};
		}

		if (!NativeStylishStorage) {
			setStorageStatus('error');
			return () => {
				active = false;
			};
		}

		setStorageStatus('loading');
		NativeStylishStorage.getAvailableBytes()
			.then(bytes => {
				if (!Number.isFinite(bytes) || bytes < 0) {
					throw new Error('Invalid available storage value.');
				}
				if (active) {
					setAvailableBytes(bytes);
					setStorageStatus('ready');
				}
			})
			.catch(() => {
				if (active) {
					setStorageStatus('error');
				}
			});

		return () => {
			active = false;
		};
	}, [storageRefreshCount]);

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
				<View style={styles.storage}>
					<Text style={styles.storageTitle}>{strings.storageTitle}</Text>
					<Text style={styles.storageValue} accessibilityLiveRegion="polite">
						{storageStatus === 'loading' && strings.storageLoading}
						{storageStatus === 'unavailable' && strings.storageUnavailable}
						{storageStatus === 'error' && strings.storageError}
						{storageStatus === 'ready' && availableBytes !== null &&
							(availableBytes < BYTES_PER_GIB
								? `${(availableBytes / BYTES_PER_MIB).toFixed(1)} MiB`
								: `${(availableBytes / BYTES_PER_GIB).toFixed(1)} GiB`)}
					</Text>
					{storageStatus === 'ready' &&
					availableBytes !== null &&
					availableBytes < BYTES_PER_GIB ? (
						<Text style={styles.error}>{strings.storageLowWarning}</Text>
					) : null}
					{storageStatus !== 'unavailable' ? (
						<Pressable
							accessibilityRole="button"
							accessibilityState={{disabled: storageStatus === 'loading'}}
							disabled={storageStatus === 'loading'}
							onPress={() => setStorageRefreshCount(count => count + 1)}
							style={styles.storageRefresh}>
							<Text style={styles.storageRefreshText}>{strings.storageRefresh}</Text>
						</Pressable>
					) : null}
				</View>
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
	storage: {
		marginBottom: 24,
	},
	storageTitle: {
		color: colors.textPrimary,
		fontSize: 18,
		fontWeight: '600',
	},
	storageValue: {
		color: colors.textSecondary,
		fontSize: 16,
		marginTop: 8,
		marginBottom: 8,
	},
	storageRefresh: {
		alignSelf: 'flex-start',
		paddingVertical: 8,
	},
	storageRefreshText: {
		color: colors.accentRed,
		fontSize: 16,
	},
	error: {
		color: colors.accentRed,
		marginBottom: 12,
	},
});

export default Settings;
