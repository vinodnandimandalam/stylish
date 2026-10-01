import React from 'react';
import {StyleSheet} from 'react-native';
import {SearchBar} from '@rneui/themed';
import {strings} from '../constants/strings';
import {colors} from '../theme/colors';

type ProductSearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
};

const ProductSearchInput = ({value, onChangeText}: ProductSearchInputProps) => {
  return (
    <SearchBar
      platform="default"
      lightTheme
      round
      value={value}
      placeholder={strings.productSearchPlaceholder}
      onChangeText={onChangeText}
      onClear={() => onChangeText('')}
      autoCorrect={false}
      accessibilityLabel={strings.productSearchPlaceholder}
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.backgroundLight,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.textPrimary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 15,
  },
});

export default ProductSearchInput;