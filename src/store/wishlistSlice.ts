import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Product} from '../modules/dashboard/productTypes';

type WishlistState = {
  products: Product[];
};

const initialState: WishlistState = {
  products: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistProduct: (state, action: PayloadAction<Product>) => {
      const productIndex = state.products.findIndex(
        product => product.id === action.payload.id,
      );

      if (productIndex === -1) {
        state.products.push(action.payload);
      } else {
        state.products.splice(productIndex, 1);
      }
    },
  },
});

export const {toggleWishlistProduct} = wishlistSlice.actions;
export default wishlistSlice.reducer;
