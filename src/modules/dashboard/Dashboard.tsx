import React, {useState} from 'react';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from '@rneui/themed';
import {useDebouncedCallback} from 'use-debounce';
import {ProductSearchInput} from '../../components';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import ProductList from './ProductList';
import type {Product, ProductSortOrder} from './productTypes';
import {
  PrivateStackParamList,
  PrivateTabParamList,
  SCREENS,
} from '../../routes/Screens';

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<PrivateTabParamList, typeof SCREENS.PRIVATE.HOME>,
  NativeStackNavigationProp<PrivateStackParamList>
>;

const Dashboard = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<ProductSortOrder>('asc');
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
      <View style={styles.productsToolbar}>
        <Text style={styles.sectionTitle}>{strings.productsTitle}</Text>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              sortOrder === 'asc'
                ? strings.sortTitleAscending
                : strings.sortTitleDescending
            }
            onPress={() =>
              setSortOrder(current => (current === 'asc' ? 'desc' : 'asc'))
            }
            style={styles.actionButton}>
            <Text style={styles.actionText}>{strings.sortButton}</Text>
            <Icon
              type="material"
              iconProps={{
                name: sortOrder === 'asc' ? 'arrow-upward' : 'arrow-downward',
                size: 18,
                color: colors.textPrimary,
              }}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{disabled: true}}
            disabled
            style={[styles.actionButton, styles.disabledButton]}>
            <Text style={[styles.actionText, styles.disabledText]}>
              {strings.filterButton}
            </Text>
            <Icon
              type="material"
              iconProps={{
                name: 'filter-list',
                size: 18,
                color: colors.disabled,
              }}
            />
          </Pressable>
        </View>
      </View>
      <ProductList
        searchQuery={debouncedQuery}
        sortOrder={sortOrder}
        onProductPress={(product: Product) =>
          navigation.navigate(SCREENS.PRIVATE.PRODUCT_DETAILS, {
            productId: product.id,
          })
        }
      />
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
  productsToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 1,
    shadowColor: colors.textPrimary,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.55,
  },
  disabledText: {
    color: colors.textSecondary,
  },
});

export default Dashboard;