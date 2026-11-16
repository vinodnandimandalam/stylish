import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Product} from '../modules/dashboard/productTypes';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        item => item.product.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({product: action.payload, quantity: 1});
      }
    },
    incrementCartItem: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        cartItem => cartItem.product.id === action.payload,
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decrementCartItem: (state, action: PayloadAction<number>) => {
      const itemIndex = state.items.findIndex(
        cartItem => cartItem.product.id === action.payload,
      );
      if (itemIndex === -1) {
        return;
      }

      const item = state.items[itemIndex];
      if (item.quantity <= 1) {
        state.items.splice(itemIndex, 1);
      } else {
        item.quantity -= 1;
      }
    },
  },
});

export const {
  addProductToCart,
  incrementCartItem,
  decrementCartItem,
} = cartSlice.actions;
export default cartSlice.reducer;
