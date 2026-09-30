import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton, EmailInput, PasswordInput} from '../../components';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {clearLoginError, login} from '../../store/authSlice';
import {validateIdentifier, validatePassword} from './validations';

const Login = () => {
    const dispatch = useAppDispatch();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [identifierTouched, setIdentifierTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const isLoading = useAppSelector(state => state.auth.loginStatus === 'loading');
    const requestError = useAppSelector(state => state.auth.loginError);

    const identifierError = validateIdentifier(identifier);
    const passwordError = validatePassword(password);

    const handleLoginPress = async () => {
        setIdentifierTouched(true);
        setPasswordTouched(true);
        if (identifierError || passwordError || isLoading) {
            return;
        }

        await dispatch(
            login({
                username: identifier.trim(),
                password,
            }),
        );
    };

    return (
        <SafeAreaView>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>{strings.loginWelcomeBack}</Text>
                <View>
                    <EmailInput
                        value={identifier}
                        onChangeText={value => {
                            setIdentifier(value);
                            dispatch(clearLoginError());
                        }}
                        onBlur={() => setIdentifierTouched(true)}
                        errorMessage={
                            identifierTouched ? identifierError : undefined
                        }
                    />
                    <PasswordInput
                        value={password}
                        onChangeText={value => {
                            setPassword(value);
                            dispatch(clearLoginError());
                        }}
                        onBlur={() => setPasswordTouched(true)}
                        errorMessage={passwordTouched ? passwordError : undefined}
                        onSubmitEditing={handleLoginPress}
                    />
                </View>
                {requestError ? (
                    <Text style={styles.requestError} accessibilityLiveRegion="polite">
                        {requestError}
                    </Text>
                ) : null}
                <AppButton
                    title={strings.loginButton}
                    onPress={handleLoginPress}
                    loading={isLoading}
                    disabled={isLoading}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
    },
    title: {
        maxWidth: 320,
        marginBottom: 24,
        color: colors.textPrimary,
        fontSize: 36,
        fontWeight: '700',
        lineHeight: 48,
    },
    fields: {
        gap: 5,
    },
    requestError: {
        color: colors.accentRed,
        marginBottom: 12,
        textAlign: 'center',
    },
});

export default Login;