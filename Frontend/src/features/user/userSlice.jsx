import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dummyOrders } from "../../assets/groceries_assets/assets";
import axios from "axios";
import toast from "react-hot-toast";
/* ✅ FIX: restore token correctly */
const storedUser = localStorage.getItem("UserDetails")
  ? JSON.parse(localStorage.getItem("UserDetails"))
  : null;
const initialState = {
  currenctSymbol: "$",
  backendUrl: import.meta.env.VITE_BACKEND_URL,
  // userToken:
  //   (localStorage.getItem("UserDetails") &&
  //     JSON.parse(localStorage.getItem("UserDetails"))) ||
  //   "",
  userToken: storedUser?.userToken || "",
  userProfileData: {},
  loading: false,
  error: null,
  myOrders: dummyOrders || [],
  cartItems: [],
};
//Fetch User Auth Status , User Data and Cart Items
export const fetchUser = createAsyncThunk(
  "fetchUser",
  async (name, thunkAPI) => {
    try {
      const { backendUrl, userToken } = thunkAPI.getState().user;
      const response = await axios.get(`${backendUrl}/api/user/is-auth`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      // console.log("response_fetchUser_userSlice.js", response);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);
export const userLogout = createAsyncThunk(
  "userLogout",
  async (name, thunkAPI) => {
    try {
      const { backendUrl } = thunkAPI.getState().user;
      const response = await axios.get(`${backendUrl}/api/user/logout`);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  },
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoginUserDetails: (state, action) => {
      const { success, token, loginUser } = action.payload;
      if (action.payload?.success) {
        state.userToken = action.payload.token;
        state.userProfileData = loginUser;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        // const { success, user } = action.payload;
        if (action.payload?.success) {
          state.userProfileData = action.payload?.user;
          state.cartItems = action.payload.user.cartItems || [];
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Auth failed";
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        console.log("trigger_userLogout_userSlice");
        // const { success, message } = action.payload;
        if (action.payload?.success) {
          state.userToken = "";
          state.userProfileData = {};
          state.cartItems = [];
          localStorage.removeItem("UserDetails");
          toast.success(action.payload?.message);
        }
      });
  },
});

export const { setLoginUserDetails, setUserLogout } = userSlice.actions;

export default userSlice.reducer;
