import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dummyProducts } from "../../assets/groceries_assets/assets";
import { toast } from "react-hot-toast";
import axios from "axios";
import { data } from "react-router-dom";

const initialState = {
  isLoading: true,
  products: [],
  cartItems: [],
  searchQuery: "",
  numItemsInCart: 0,
  cartTotal: 0,
  shipping: 500,
  tax: 0,
  orderTotal: 0,
  backendUrl: import.meta.env.VITE_BACKEND_URL,
};
//Fetch Products
export const fetchProducts = createAsyncThunk(
  "fetchProducts",
  async (name, thunkAPI) => {
    try {
      const { backendUrl } = thunkAPI.getState().product;
      const response = await axios.get(`${backendUrl}/api/product/list`);
      // console.log("response_fetchProducts_productSlice", response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
);
//{id, stock}
export const toggleStock = createAsyncThunk(
  "product/toggleStock",
  async ({ id, inStock }, thunkAPI) => {
    try {
      const { backendUrl } = thunkAPI.getState().product;
      let response = await axios.post(`${backendUrl}/api/product/stock`, {
        id,
        inStock,
      });
      console.log("response_toggleStock_productSlice", response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
const productSlice = createSlice({
  name: "grocery",
  initialState,
  reducers: {
    addProduct: (state, action) => {},
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { products, success } = action.payload;
        if (success) {
          state.isLoading = false;
          state.products = products;
        }
        // else {
        //   toast.error(data.message);
        // }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading;
      })
      .addCase(toggleStock.fulfilled, (state, action) => {
        console.log("action.payload_fulfilled_productSlice", action.payload);
        const { success, product } = action.payload;
        if (success) {
          const item = state.products.find((p) => p._id === product._id);
          console.log("item_fulfilled_toggleStock", item);
          if (item) {
            item.inStock = product.inStock;
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }
        }
      });
  },
});

export const { addProduct, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;
