import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, type ButtonProps} from '@rneui/themed';
import {colors} from '../theme/colors';

type AppButtonProps = {
  title: string;
  onPress: ButtonProps['onPress'];
  disabled?: boolean;
  loading?: boolean;
};

const AppButton = ({title, onPress, disabled, loading}: AppButtonProps) => (
  <Button
    title={title}
    onPress={onPress}
    disabled={disabled}
    loading={loading}
    uppercase={false}
    buttonStyle={styles.button}
    titleStyle={styles.title}
    containerStyle={styles.container}
  />
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    height: 66,
    borderRadius: 8,
    backgroundColor: colors.accentRed,
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '600',
  },
});

export default AppButton;