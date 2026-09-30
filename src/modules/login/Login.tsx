import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton, EmailInput, PasswordInput} from '../../components';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import {loginUser} from './loginService';
import {validateIdentifier, validatePassword} from './validations';

type LoginProps = {
    onLoginSuccess: () => void;
};

const Login = ({onLoginSuccess}: LoginProps) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [identifierTouched, setIdentifierTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [requestError, setRequestError] = useState<string>();

    const identifierError = validateIdentifier(identifier);
    const passwordError = validatePassword(password);

    const handleLoginPress = async () => {
        setIdentifierTouched(true);
        setPasswordTouched(true);
        setRequestError(undefined);

        if (identifierError || passwordError || isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            await loginUser({
                username: identifier.trim(),
                password,
            });
            onLoginSuccess();
        } catch (error) {
            setRequestError(
                error instanceof Error && error.message
                    ? error.message
                    : strings.loginNetworkError,
            );
        } finally {
            setIsLoading(false);
        }
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
                            setRequestError(undefined);
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
                            setRequestError(undefined);
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