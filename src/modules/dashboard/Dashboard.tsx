import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDebouncedCallback} from 'use-debounce';
import {ProductSearchInput} from '../../components';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import ProductList from './ProductList';

const Dashboard = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debouncedSearch = useDebouncedCallback((query: string) => {
    setDebouncedQuery(query.trim());
  }, 400);

  return (
    <SafeAreaView style={styles.container}>
      <ProductSearchInput
        value={searchText}
        onChangeText={value => {
          setSearchText(value);
          debouncedSearch(value);
        }}
      />
      <Text style={styles.sectionTitle}>{strings.productsTitle}</Text>
      <ProductList searchQuery={debouncedQuery} />
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