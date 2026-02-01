import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

/* ================= INITIAL STATE ================= */
const initialState = {
  orders: [],
  loading: false,
  error: null,
  backendUrl: import.meta.env.VITE_BACKEND_URL,
};

/* ================= THUNKS ================= */

// 🔹 Fetch orders for the logged-in user

// const fetchMyOrders = async () => {
//   try {
//     const { data } = await axios.get(`${backend}/api/order/user`);
//     if (data.success) {
//       setMyOrders(data.orders);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  // async (_, { getState, rejectWithValue }) => {
  async (name, thunkAPI) => {
    try {
      const { backendUrl } = thunkAPI.getState().order;
      const { userToken } = thunkAPI.getState().user;

      const res = await axios.get(`${backendUrl}/api/order/user`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      return res.data.orders;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchSellerOrders = createAsyncThunk(
  "orders/fetchSellerOrders",
  async (_, thunkAPI) => {
    try {
      const { backendUrl } = thunkAPI.getState().orders;
      const { sellerToken } = thunkAPI.getState().seller;

      const res = await axios.get(`${backendUrl}/api/order/seller`, {
        headers: { Authorization: `Bearer ${sellerToken}` },
        withCredentials: true,
      });

      return res.data.orders;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 🔹 Place order (COD)
export const placeOrderCOD = createAsyncThunk(
  "orders/placeOrderCOD",
  async ({ items, address }, { name, thunkAPI }) => {
    try {
      const { backendUrl } = thunkAPI.getState().order;
      const { userToken } = thunkAPI.getState().user;

      const res = await axios.post(
        `${backendUrl}/api/order/cod`,
        { items, address },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }

      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

/* ================= SLICE ================= */

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrders: (state, action) => {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders

      /* ================= USER ORDERS ================= */
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= SELLER ORDERS ================= */
      .addCase(fetchSellerOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload;
        toast.error(action.payload || "Failed to fetch orders");
      })

      /* ================= PLACE ORDER (COD) ================= */
      .addCase(placeOrderCOD.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrderCOD.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(placeOrderCOD.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
