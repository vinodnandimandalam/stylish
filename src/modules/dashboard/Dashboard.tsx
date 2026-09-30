import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import ProductList from './ProductList';

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>{strings.productsTitle}</Text>
      <ProductList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 8,
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
});

export default Dashboard;