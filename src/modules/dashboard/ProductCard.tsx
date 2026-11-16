import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from '@rneui/themed';
import Card from '../../components/Card';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {toggleWishlistProduct} from '../../store/wishlistSlice';
import {colors} from '../../theme/colors';
import type {Product} from './productTypes';

type ProductCardProps = {
  product: Product;
  onPress: () => void;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price);

const ProductCard = ({product, onPress}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(state =>
    state.wishlist.products.some(item => item.id === product.id),
  );
  const imageUrl = product.thumbnail || product.images?.[0];

  return (
    <Card style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${product.title}`}
        onPress={onPress}>
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.name}>
            {product.title}
          </Text>
          {product.category ? (
            <Text numberOfLines={1} style={styles.category}>
              {product.category}
            </Text>
          ) : null}
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isWishlisted
            ? `Remove ${product.title} from wishlist`
            : `Add ${product.title} to wishlist`
        }
        accessibilityState={{selected: isWishlisted}}
        onPress={() => dispatch(toggleWishlistProduct(product))}
        style={styles.wishlistButton}
        hitSlop={8}>
        <Icon
          type="material"
          iconProps={{
            name: isWishlisted ? 'favorite' : 'favorite-border',
            size: 22,
            color: isWishlisted ? colors.accentRed : colors.textPrimary,
          }}
        />
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 6,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.inputBackground,
  },
  imagePlaceholder: {
    backgroundColor: colors.inputBackground,
  },
  details: {
    padding: 8,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  category: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 13,
  },
  price: {
    marginTop: 5,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: colors.white,
    elevation: 2,
  },
});

export default ProductCard;