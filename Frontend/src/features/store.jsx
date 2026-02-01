import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import productSlice from "./product/productSlice";
import sellerSlice from "./seller/sellerSlice";
import cartSlice from "./cart/cartSlice";
import orderSlice from "./order/orderSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    seller: sellerSlice,
    product: productSlice,
    cart: cartSlice,
    order: orderSlice,
  },
});

export default store;
