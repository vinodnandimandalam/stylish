import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Icon, Input, type InputProps} from '@rneui/themed';
import {strings} from '../constants/strings';
import {colors} from '../theme/colors';

type AuthInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: InputProps['onBlur'];
  errorMessage?: string;
  onSubmitEditing?: InputProps['onSubmitEditing'];
};

type BaseInputProps = AuthInputProps & {
  mode: 'email' | 'password';
  secureTextEntry?: boolean;
  onTogglePasswordVisibility?: () => void;
  passwordVisible?: boolean;
};

const BaseAuthInput = ({
  mode,
  value,
  onChangeText,
  onBlur,
  errorMessage,
  onSubmitEditing,
  secureTextEntry,
  onTogglePasswordVisibility,
  passwordVisible,
}: BaseInputProps) => (
  <Input
    value={value}
    onChangeText={onChangeText}
    onBlur={onBlur}
    onSubmitEditing={onSubmitEditing}
    placeholder={
      mode === 'email'
        ? strings.loginEmailPlaceholder
        : strings.loginPasswordPlaceholder
    }
    keyboardType={mode === 'email' ? 'email-address' : 'default'}
    autoCapitalize="none"
    autoCorrect={false}
    textContentType={mode === 'email' ? 'emailAddress' : 'password'}
    secureTextEntry={secureTextEntry}
    leftIcon={
      <Icon
        type="material"
        iconProps={{
          name: mode === 'email' ? 'person' : 'lock',
          size: 22,
          color: colors.textSecondary,
        }}
      />
    }
    rightIcon={
      mode === 'password' ? (
        <Icon
          type="material"
          iconProps={{
            name: passwordVisible ? 'visibility-off' : 'visibility',
            size: 22,
            color: colors.textSecondary,
          }}
          onPress={onTogglePasswordVisibility}
          pressableProps={{
            accessibilityRole: 'button',
            accessibilityLabel: passwordVisible
              ? strings.loginHidePassword
              : strings.loginShowPassword,
          }}
        />
      ) : undefined
    }
    errorMessage={errorMessage}
    errorStyle={styles.error}
    containerStyle={styles.container}
    inputContainerStyle={styles.inputContainer}
    inputStyle={styles.input}
    leftIconContainerStyle={styles.leftIconContainer}
    rightIconContainerStyle={styles.rightIconContainer}
    placeholderTextColor={colors.textSecondary}
  />
);

export const EmailInput = (props: AuthInputProps) => (
  <BaseAuthInput mode="email" {...props} />
);

export const PasswordInput = (props: AuthInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <BaseAuthInput
      mode="password"
      {...props}
      secureTextEntry={!isVisible}
      passwordVisible={isVisible}
      onTogglePasswordVisibility={() => setIsVisible(visible => !visible)}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  inputContainer: {
    height: 66,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderRadius: 15,
    backgroundColor: colors.inputBackground,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 16,
    paddingLeft: 12,
  },
  leftIconContainer: {
    marginRight: 2,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
  error: {
    color: colors.accentRed,
    marginHorizontal: 0,
  },
});