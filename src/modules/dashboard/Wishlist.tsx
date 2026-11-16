import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import type {CompositeNavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from '../../constants/strings';
import {useAppSelector} from '../../store/hooks';
import {colors} from '../../theme/colors';
import {
  PrivateStackParamList,
  PrivateTabParamList,
  SCREENS,
} from '../../routes/Screens';
import ProductCard from './ProductCard';
import type {Product} from './productTypes';

type WishlistNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<
    PrivateTabParamList,
    typeof SCREENS.PRIVATE.WISHLIST
  >,
  NativeStackNavigationProp<PrivateStackParamList>
>;

const Wishlist = () => {
  const navigation = useNavigation<WishlistNavigationProp>();
  const products = useAppSelector(state => state.wishlist.products);

  const openProduct = (product: Product) =>
    navigation.navigate(SCREENS.PRIVATE.PRODUCT_DETAILS, {
      productId: product.id,
    });

  return (
    <SafeAreaView style={styles.container}>
      {products.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{strings.wishlistEmpty}</Text>
        </View>
      ) : (
        <FlashList
          data={products}
          renderItem={({item}) => (
            <ProductCard product={item} onPress={() => openProduct(item)} />
          )}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default Wishlist;
