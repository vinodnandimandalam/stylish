import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from '../../constants/strings';
import {PrivateStackParamList, SCREENS} from '../../routes/Screens';
import {colors} from '../../theme/colors';
import type {Product} from './productTypes';
import {getProductById} from './productService';

type ProductDetailsProps = NativeStackScreenProps<
  PrivateStackParamList,
  typeof SCREENS.PRIVATE.PRODUCT_DETAILS
>;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price);

const ProductDetails = ({route}: ProductDetailsProps) => {
  const {productId} = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);

    getProductById(productId, controller.signal)
      .then(setProduct)
      .catch(error => {
        if (controller.signal.aborted) {
          return;
        }
        setErrorMessage(
          error instanceof Error && error.message
            ? error.message
            : strings.productDetailsError,
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [productId, retryCount]);

  if (isLoading) {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={colors.accentRed} />
      </View>
    );
  }

  if (errorMessage || !product) {
    return (
      <View style={styles.state}>
        <Text style={styles.stateText}>
          {errorMessage ?? strings.productDetailsError}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setRetryCount(count => count + 1)}>
          <Text style={styles.retry}>{strings.productsRetry}</Text>
        </Pressable>
      </View>
    );
  }

  const imageUrl = product.images?.[0] || product.thumbnail;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
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
          {product.category ? (
            <Text style={styles.category}>{product.category}</Text>
          ) : null}
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.description ? (
            <Text style={styles.description}>{product.description}</Text>
          ) : null}
          {product.brand ? (
            <Text style={styles.metadata}>Brand: {product.brand}</Text>
          ) : null}
          {typeof product.stock === 'number' ? (
            <Text style={styles.metadata}>In stock: {product.stock}</Text>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{disabled: true}}
          disabled
          style={[styles.button, styles.secondaryButton]}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            {strings.addToCart}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{disabled: true}}
          disabled
          style={[styles.button, styles.primaryButton]}>
          <Text style={styles.buttonText}>{strings.buyNow}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: colors.inputBackground,
  },
  imagePlaceholder: {
    backgroundColor: colors.inputBackground,
  },
  details: {
    padding: 20,
  },
  category: {
    color: colors.textSecondary,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  title: {
    marginTop: 6,
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  price: {
    marginTop: 10,
    color: colors.accentRed,
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    marginTop: 16,
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  metadata: {
    marginTop: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.inputBackground,
  },
  button: {
    minHeight: 52,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  primaryButton: {
    backgroundColor: colors.accentRed,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.accentRed,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.accentRed,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 24,
  },
  stateText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retry: {
    marginTop: 12,
    color: colors.accentRed,
    fontWeight: '600',
  },
});

export default ProductDetails;
