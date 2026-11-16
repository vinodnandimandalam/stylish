import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {SafeAreaView} from 'react-native-safe-area-context';
import Card from '../../components/Card';
import {strings} from '../../constants/strings';
import {
  decrementCartItem,
  incrementCartItem,
} from '../../store/cartSlice';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {colors} from '../../theme/colors';
import type {CartItem} from '../../store/cartSlice';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price);

const Cart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.cart.items);
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const renderItem = ({item}: {item: CartItem}) => {
    const {product, quantity} = item;
    const imageUrl = product.thumbnail || product.images?.[0];

    return (
      <Card style={styles.itemCard}>
        <View style={styles.itemRow}>
          {imageUrl ? (
            <Image
              source={{uri: imageUrl}}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]} />
          )}
          <View style={styles.itemDetails}>
            <Text numberOfLines={2} style={styles.title}>
              {product.title}
            </Text>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <View style={styles.quantityControls}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Decrease ${product.title} quantity`}
                onPress={() => dispatch(decrementCartItem(product.id))}
                style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>−</Text>
              </Pressable>
              <Text
                accessibilityLabel={`${quantity} items`}
                style={styles.quantity}>
                {quantity}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Increase ${product.title} quantity`}
                onPress={() => dispatch(incrementCartItem(product.id))}
                style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{strings.cartEmpty}</Text>
        </View>
      ) : (
        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => String(item.product.id)}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <View style={styles.subtotal}>
              <Text style={styles.subtotalLabel}>{strings.cartSubtotal}</Text>
              <Text style={styles.subtotalPrice}>{formatPrice(subtotal)}</Text>
            </View>
          }
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
    padding: 12,
    paddingBottom: 20,
  },
  itemCard: {
    padding: 12,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: colors.inputBackground,
    borderRadius: 6,
  },
  imagePlaceholder: {
    backgroundColor: colors.inputBackground,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  price: {
    marginTop: 6,
    color: colors.accentRed,
    fontSize: 15,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 12,
    marginTop: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  quantityButtonText: {
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 24,
  },
  quantity: {
    minWidth: 16,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.inputBackground,
  },
  subtotalLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  subtotalPrice: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
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

export default Cart;
