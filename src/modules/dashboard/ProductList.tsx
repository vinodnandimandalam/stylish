import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import ProductCard from './ProductCard';
import {getProductsPage} from './productService';
import type {Product} from './productTypes';

const PAGE_SIZE = 10;

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [nextSkip, setNextSkip] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  const loadPage = useCallback(async (skip: number, replace = false) => {
    if (requestInProgress.current) {
      return;
    }

    requestInProgress.current = true;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getProductsPage(skip, PAGE_SIZE);
      setProducts(current => {
        if (replace) {
          return result.products;
        }

        const existingIds = new Set(current.map(product => product.id));
        return [
          ...current,
          ...result.products.filter(product => !existingIds.has(product.id)),
        ];
      });
      const followingSkip = result.skip + result.products.length;
      setNextSkip(followingSkip);
      setHasNextPage(
        result.products.length > 0 && followingSkip < result.total,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : strings.productsError,
      );
    } finally {
      requestInProgress.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(0, true);
  }, [loadPage]);

  const handleEndReached = () => {
    if (hasNextPage && !requestInProgress.current) {
      loadPage(nextSkip);
    }
  };

  const renderItem = ({item}: {item: Product}) => (
    <ProductCard product={item} />
  );

  const emptyState = () => {
    if (isLoading) {
      return <ActivityIndicator color={colors.accentRed} style={styles.state} />;
    }

    if (errorMessage) {
      return (
        <View style={styles.state}>
          <Text style={styles.stateText}>{errorMessage}</Text>
          <Pressable onPress={() => loadPage(0, true)}>
            <Text style={styles.retry}>{strings.productsRetry}</Text>
          </Pressable>
        </View>
      );
    }

    return <Text style={[styles.state, styles.stateText]}>{strings.productsEmpty}</Text>;
  };

  const footer = () =>
    isLoading && products.length > 0 ? (
      <ActivityIndicator color={colors.accentRed} style={styles.footer} />
    ) : errorMessage && products.length > 0 ? (
      <Pressable onPress={() => loadPage(nextSkip)} style={styles.footer}>
        <Text style={styles.retry}>{strings.productsRetry}</Text>
      </Pressable>
    ) : null;

  return (
    <FlashList
      data={products}
      renderItem={renderItem}
      keyExtractor={item => String(item.id)}
      numColumns={2}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={emptyState}
      ListFooterComponent={footer}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 12,
  },
  state: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stateText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retry: {
    marginTop: 8,
    color: colors.accentRed,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default ProductList;