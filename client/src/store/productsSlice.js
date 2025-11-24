import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/api';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await API.get('/products');
  return res.data;
});

export const createProduct = createAsyncThunk('products/create', async (payload) => {
  const res = await API.post('/products', payload);
  return res.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => { state.items = action.payload; state.status='succeeded'; })
      .addCase(createProduct.fulfilled, (state, action) => { state.items.unshift(action.payload); })
  }
});

export default productsSlice.reducer;
