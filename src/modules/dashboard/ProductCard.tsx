import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Card from '../../components/Card';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import type {Product} from './productTypes';

type ProductCardProps = {
  product: Product;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price);

const ProductCard = ({product}: ProductCardProps) => {
  const previousPrice =
    product.discountPercentage > 0 && product.discountPercentage < 100
      ? product.price / (1 - product.discountPercentage / 100)
      : undefined;
  const imageUrl = product.thumbnail || product.images?.[0];

  return (
    <Card style={styles.card}>
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
        <Text numberOfLines={2} style={styles.description}>
          {product.description}
        </Text>
        <Text style={styles.price}>
          {formatPrice(product.price)}
        </Text>
        {previousPrice ? (
          <View style={styles.discountRow}>
            <Text style={styles.previousPrice}>{formatPrice(previousPrice)}</Text>
            <Text style={styles.discount}>
              {Math.round(product.discountPercentage)}% off
            </Text>
          </View>
        ) : null}
        <Text style={styles.rating}>
          {strings.productRatingLabel} {product.rating.toFixed(1)}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
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
  description: {
    minHeight: 38,
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  price: {
    marginTop: 5,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  previousPrice: {
    color: colors.disabled,
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  discount: {
    color: colors.accentRed,
    fontSize: 12,
  },
  rating: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default ProductCard;