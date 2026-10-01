import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {strings} from '../../constants/strings';
import {colors} from '../../theme/colors';
import ProductCard from './ProductCard';
import {getProductListCache, setProductListCache} from './productCache';
import {getProductsPage} from './productService';
import type {Product, ProductSortOrder} from './productTypes';

const PAGE_SIZE = 10;

type ProductListProps = {
  searchQuery: string;
  sortOrder: ProductSortOrder;
};

const ProductList = ({searchQuery, sortOrder}: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [nextSkip, setNextSkip] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestInProgress = useRef(false);
  const activeRequestId = useRef(0);
  const productsRef = useRef<Product[]>([]);

  const loadPage = useCallback(async (
    skip: number,
    query: string,
    replace = false,
    signal?: AbortSignal,
  ) => {
    if (requestInProgress.current) {
      return;
    }

    const requestId = ++activeRequestId.current;
    requestInProgress.current = true;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getProductsPage(
        skip,
        PAGE_SIZE,
        query,
        signal,
      );
      if (requestId !== activeRequestId.current) {
        return;
      }

      const existingIds = new Set(productsRef.current.map(product => product.id));
      const nextProducts = replace
        ? result.products
        : [
            ...productsRef.current,
            ...result.products.filter(product => !existingIds.has(product.id)),
          ];
      const followingSkip = result.skip + result.products.length;
      const hasMore =
        result.products.length > 0 && followingSkip < result.total;

      productsRef.current = nextProducts;
      setProducts(nextProducts);
      setNextSkip(followingSkip);
      setHasNextPage(hasMore);
      setProductListCache(query, {
        products: nextProducts,
        nextSkip: followingSkip,
        total: result.total,
        hasNextPage: hasMore,
      });
    } catch (error) {
      if (signal?.aborted || requestId !== activeRequestId.current) {
        return;
      }

      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : strings.productsError,
      );
    } finally {
      if (requestId === activeRequestId.current) {
        requestInProgress.current = false;
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    activeRequestId.current += 1;
    requestInProgress.current = false;
    const cached = getProductListCache(searchQuery);
    const cachedProducts = cached?.products ?? [];
    productsRef.current = cachedProducts;
    setProducts(cachedProducts);
    setNextSkip(cached?.nextSkip ?? 0);
    setHasNextPage(cached?.hasNextPage ?? true);
    setErrorMessage(null);

    if (cached) {
      setIsLoading(false);
    } else {
      loadPage(0, searchQuery, true, controller.signal);
    }

    return () => {
      controller.abort();
      activeRequestId.current += 1;
      requestInProgress.current = false;
    };
  }, [loadPage, searchQuery]);

  const handleEndReached = () => {
    if (hasNextPage && !requestInProgress.current) {
      loadPage(nextSkip, searchQuery);
    }
  };

  const sortedProducts = useMemo(
    () =>
      [...products].sort((first, second) => {
        const comparison = first.title.localeCompare(second.title);
        return sortOrder === 'asc' ? comparison : -comparison;
      }),
    [products, sortOrder],
  );

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
          <Pressable onPress={() => loadPage(0, searchQuery, true)}>
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
      <Pressable
        onPress={() => loadPage(nextSkip, searchQuery)}
        style={styles.footer}>
        <Text style={styles.retry}>{strings.productsRetry}</Text>
      </Pressable>
    ) : null;

  return (
    <FlashList
      data={sortedProducts}
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