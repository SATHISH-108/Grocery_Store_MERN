import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dummyOrders } from "../../assets/groceries_assets/assets";
import axios from "axios";
import toast from "react-hot-toast";
/* ================= INITIAL STATE ================= */
const initialState = {
  sellerToken:
    (localStorage.getItem("SellerToken") &&
      JSON.parse(localStorage.getItem("SellerToken"))) ||
    "",
  sellerProfileInfo: {},
  isSeller: false,
  orders: [],
  ordersLoading: false,
  ordersError: null,
  backendUrl: import.meta.env.VITE_BACKEND_URL,
};

/* ================= THUNKS ================= */

//Fetch Seller Status
const getSellerStatus = createAsyncThunk(
  "sellerStatus",
  async (name, thunkAPI) => {
    //instead of name you can give any name
    try {
      const state = thunkAPI.getState();
      const { isSeller, backendUrl } = state.seller;
      //call backend API
      const response = await axios.get(`${backendUrl}/api/seller/is-auth`, {
        withCredentials: true, // Very Important
      });
      console.log("response_getSellerStatus", response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
);

//Seller Logout
export const sellerLogout = createAsyncThunk(
  "sellerLogout",
  async (name, thunkAPI) => {
    try {
      const { backendUrl } = thunkAPI.getState().seller;
      let response = await axios.get(`${backendUrl}/api/seller/logout`, {
        withCredentials: true,
      });
      console.log("response_sellerLogout", response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { success: false },
      );
    }
  },
);

// Fetch all orders for seller
export const fetchSellerOrders = createAsyncThunk(
  "seller/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const { backendUrl } = thunkAPI.getState().seller;

      const { data } = await axios.get(`${backendUrl}/api/order/seller`, {
        withCredentials: true, // IMPORTANT for cookies/JWT
      });

      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

/* ================= SLICE ================= */
const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setLoginSellerDetails: (state, action) => {
      const { success, message, loginUser, token } = action.payload;
      if (success) {
        state.sellerProfileInfo = loginUser;
        state.sellerToken = token;
        state.isSeller = true;
      }
    },
    setIsSeller: (state, action) => {
      console.log("setIsSeller", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSellerStatus.pending, (state) => {
        state.isSeller = false;
      })
      .addCase(getSellerStatus.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        // {success: true, message: 'Seller Login successfully / JWT Token generated', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N…jE5fQ.ecq_m3dOuhD2QqBmkrRhaSCRbXeNosgIJ-XM0bnAGB8',
        // loginUser: {_id: '6953d7cb785e710a118fb3fc', username: 'seller', email: 'seller@grocery.com', password: '$2b$10$q.kXBlmAcjChYlcGaLRr8.g81Pp0pxOcYADFp0E3.S17/BpROLYHW', role: 'Seller',message: "Seller Login successfully / JWT Token generated"success:
        // truetoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTNkN2NiNzg1ZTcxMGExMThmYjNmYyIsImVtYWlsIjoic2VsbGVyQGdyb2NlcnkuY29tIiwicm9sZSI6IlNlbGxlciIsImlhdCI6MTc2ODg4NzQxOSwiZXhwIjoxNzY5NDkyMjE5fQ.ecq_m3dOuhD2QqBmkrRhaSCRbXeNosgIJ-XM0bnAGB8"

        if (action.payload?.success) {
          state.isSeller = true;
        } else {
          state.isSeller = false;
        }
      })
      .addCase(getSellerStatus.rejected, (state, action) => {
        state.isSeller = false;
      })
      .addCase(sellerLogout.fulfilled, (state, action) => {
        console.log("action.payload_sellerLogout", action.payload);
        if (action.payload?.success) {
          state.isSeller = false;
          state.sellerToken = "";
          state.sellerProfileInfo = {};
          localStorage.removeItem("SellerDetails");
          toast.success(action.payload.message);
        } else {
          toast.error(action.payload?.message || "Logout failed");
        }
      })
      /* ========== FETCH SELLER ORDERS ========== */
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
      });
  },
});
export const { setLoginSellerDetails, setIsSeller, setSellerLogout } =
  sellerSlice.actions;

export default sellerSlice.reducer;
