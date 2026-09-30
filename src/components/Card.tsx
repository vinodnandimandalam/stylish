import React from 'react';
import {StyleSheet, type StyleProp, type ViewStyle} from 'react-native';
import {Card as RNECard} from '@rneui/themed';
import {colors} from '../theme/colors';

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Card = ({children, style}: CardProps) => (
  <RNECard
    containerStyle={[styles.card, style]}
    wrapperStyle={styles.wrapper}>
    {children}
  </RNECard>
);

const styles = StyleSheet.create({
  card: {
    margin: 0,
    marginBottom: 0,
    padding: 0,
    borderWidth: 1,
    borderColor: colors.inputBackground,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: colors.white,
    elevation: 1,
    shadowColor: colors.textPrimary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  wrapper: {
    flex: 1,
  },
});

export default Card;