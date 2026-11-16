import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Card from '../../components/Card';
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
  const imageUrl = product.thumbnail || product.images?.[0];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${product.title}`}
      onPress={onPress}>
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
          {product.category ? (
            <Text numberOfLines={1} style={styles.category}>
              {product.category}
            </Text>
          ) : null}
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>
      </Card>
    </Pressable>
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
});

export default ProductCard;