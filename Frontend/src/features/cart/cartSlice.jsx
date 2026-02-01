//1.
// // ✅ What ?? means (in simple terms)
// // Use the left value ONLY if it is NOT null or undefined; otherwise use the right value.
// // So in your case:
// // If offerPrice exists, use it
// // If offerPrice is missing (null or undefined), fall back to price

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { act } from "react";
// import toast from "react-hot-toast";
// //INITIAL STATE
// const initialState = {
//   cartItems: [],
//   numItemsInCart: 0,
//   cartTotal: 0,
//   shipping: 100,
//   tax: 0,
//   orderTotal: 0,
//   backendUrl: import.meta.env.VITE_BACKEND_URL,
// };
// /**
//  * Async thunk
//  */
// /* ========== ADD TO CART ========== */
// export const addToCart = createAsyncThunk(
//   "addToCart",
//   async (productId, thunkAPI) => {
//     const { cart, product, seller, user } = thunkAPI.getState();
//     const productItem = product.products.find((item) => item._id === productId);
//     if (!productItem) {
//       throw new Error("Product not found");
//     }
//     return productItem;
//   },
// );
// /* ========== LOAD CART FROM BACKEND ========== */
// export const loadCart = createAsyncThunk(
//   "cart/load",
//   async (name, thunkAPI) => {
//     const { backendUrl } = thunkAPI.getState().cart;
//     const { userToken } = thunkAPI.getState().user;
//     const response = await axios.get(`${backendUrl}/api/cart`, {
//       headers: { Authorization: `Bearer ${userToken}` },
//     });
//     console.log("response_loadCart_cartSlice", response);
//     return response.data.cartItems;
//   },
// );
// /* UPDATE CART QUANTITY  WITH BACKEND */
// export const syncCartQuantity = createAsyncThunk(
//   "cart/syncQuantity",
//   async ({ productId, quantity }, thunkAPI) => {
//     console.log(
//       `productId : ${productId}, quantity: ${quantity}`,
//       "syncCartQuantity_cartSlice",
//     );
//     const { userToken } = thunkAPI.getState().user;
//     console.log("userToken_syncCartQuantity_cartSlice", userToken);
//     const { backendUrl } = thunkAPI.getState().cart;
//     // const user = JSON.parse(localStorage.getItem("UserDetails"));
//     // if (!user?.userToken || !user?._id) {
//     if (!userToken) {
//       throw new Error("User token missing");
//     }
//     const response = await axios.put(
//       `${backendUrl}/api/cart/update`,
//       {
//         productId,
//         quantity,
//       },
//       { headers: { Authorization: `Bearer ${userToken}` } },
//       // { headers: { Authorization: `Bearer ${user?.userToken}` } },
//     );
//     console.log("response_syncCartQuantity_cartSlice", response);
//     // return { productId, quantity };
//     return response.data.cartItems; //FULL CART
//   },
// );
// //Remove Item from cart & In MongoDB also
// export const removeCartItemBackend = createAsyncThunk(
//   "cart/removeItemBackend",
//   async (productId, thunkAPI) => {
//     const { backendUrl } = thunkAPI.getState().cart;
//     const { userToken } = thunkAPI.getState().user;

//     if (!userToken) throw new Error("User not logged in");

//     const response = await axios.delete(`${backendUrl}/api/cart/remove`, {
//       headers: { Authorization: `Bearer ${userToken}` },
//       data: { productId },
//     });
//     console.log("response_removeCartItemBackend_cartSlice", response);
//     return response.data.cartItems; // backend is source of truth
//   },
// );

// // CART SLICE
// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     // UPDATE QUANTITY (LOCAL)
//     updateQuantityLocal: (state, action) => {
//       const { productId, quantity } = action.payload;

//       const item = state.cartItems.find((i) => i._id === productId);
//       if (item) {
//         item.quantity = quantity;
//       }
//     },
//     // //REMOVE PRODUCT FROM CART
//     // removeFromCart: (state, action) => {
//     //   const productId = action.payload;
//     //   const filteredItems = state.cartItems.filter(
//     //     (item) => item._id !== productId,
//     //   );
//     //   toast.success("Product Removed From Cart");
//     //   state.cartItems = filteredItems;
//     // },
//     //Get Cart Item Count
//     getCartCount: (state, action) => {
//       state.numItemsInCart = state.cartItems.reduce(
//         (total, item) => total + item.quantity,
//         0, // <-- REQUIRED if cartItems empty returns 0 (show on Cart icon)
//       );
//     },
//     //Get Cart Total Amount
//     calculateTotals: (state, action) => {
//       // 1️⃣ Calculate cart subtotal
//       const cartTotal = state.cartItems.reduce((total, item) => {
//         const price = item.offerPrice ?? item.price;
//         return total + price * item.quantity;
//       }, 0);
//       // 2️⃣ Calculate tax (example: 2%)
//       const tax = cartTotal * 0.02;
//       // 3️⃣ Calculate order total
//       const orderTotal = cartTotal + tax + state.shipping;
//       // 4️⃣ Update state
//       state.cartTotal = cartTotal;
//       state.tax = tax;
//       state.orderTotal = orderTotal;
//     },
//     // add hydrateCart =>cartSlice is now ready to receive backend cart data.
//     hydrateCart: (state, action) => {
//       state.cartItems = action.payload || [];
//     },
//   },
//   //EXTRA REDUCERS
//   extraReducers: (builder) => {
//     builder
//       .addCase(addToCart.fulfilled, (state, action) => {
//         const product = action.payload;
//         // console.log("product_cartSlice_extraReducer", product);
//         // {_id: 'in04i28r', name: 'Yippee Noodles 260g', category: 'Instant', price: 50, offerPrice: 45, category : "Instant" ,createdAt : "2025-03-25T07:17:46.018Z"
//         // description : (3) ['Non-fried noodles for healthier choice', 'Tasty and filling', 'Convenient for busy schedules']
//         // image : ['/src/assets/groceries_assets/yippee_image.png'] , inStock : true ,name :"Yippee Noodles 260g" ,offerPrice : 45
//         // price : 50 , updatedAt :"2025-03-25T07:18:13.103Z", _id :  "in04i28r"

//         const existingProduct = state.cartItems.find(
//           (item) => item._id === product._id,
//         );
//         if (existingProduct) {
//           existingProduct.quantity += 1;
//         } else {
//           state.cartItems.push({
//             _id: product._id,
//             name: product.name,
//             price: product.price,
//             offerPrice: product.offerPrice,
//             image: product.image[0],
//             category: product.category,
//             quantity: 1, // <-- quantity starts here
//           });
//         }
//         toast.success("Product Added To Cart");
//       })
//       .addCase(addToCart.rejected, (state, action) => {
//         toast.error(action.payload || "Unable To Add Item");
//       })
//       .addCase(loadCart.fulfilled, (state, action) => {
//         console.log("action.payload_loadCart_cartSlice", action.payload);
//         state.cartItems = action.payload;
//       })
//       .addCase(syncCartQuantity.fulfilled, (state, action) => {
//         state.cartItems = action.payload;
//       })
//       // .addCase(syncCartQuantity.fulfilled, (state, action) => {
//       //   // const { productId, quantity } = action.payload;
//       //   state.cartItems = action.payload; // ✅ BACKEND SOURCE OF TRUTH
//       //   // const item = state.cartItems.find((i) => i._id === productId);
//       //   // if (item) {
//       //   //   item.quantity = quantity;
//       //   // }
//       //   // toast.success("Cart updated");
//       // })
//       .addCase(removeCartItemBackend.fulfilled, (state, action) => {
//         state.cartItems = action.payload;
//         toast.success("Product removed from cart");
//       });
//   },
// });
// export const {
//   // addToCart,
//   removeFromCart,
//   updateQuantityLocal,
//   getCartCount,
//   calculateTotals,
//   hydrateCart, // Add This (cartSlice is now ready to receive backend cart data.)
// } = cartSlice.actions;
// export default cartSlice.reducer;

//2.
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import toast from "react-hot-toast";

// const initialState = {
//   cartItems: [],
//   numItemsInCart: 0,
//   cartTotal: 0,
//   tax: 0,
//   shipping: 100,
//   orderTotal: 0,
//   backendUrl: import.meta.env.VITE_BACKEND_URL,
// };

// /* ========== ADD TO CART (LOCAL ONLY) ========== */
// export const addToCart = createAsyncThunk(
//   "cart/add",
//   async (productId, { getState }) => {
//     const product = getState().product.products.find(
//       (p) => p._id === productId,
//     );
//     return product;
//   },
// );

// /* ========== SYNC QUANTITY ========== */
// export const syncCartQuantity = createAsyncThunk(
//   "cart/syncQuantity",
//   async ({ productId, quantity }, { getState }) => {
//     const { backendUrl } = getState().cart;
//     const { userToken } = getState().user;

//     const res = await axios.put(
//       `${backendUrl}/api/cart/update`,
//       { productId, quantity },
//       { headers: { Authorization: `Bearer ${userToken}` } },
//     );

//     return res.data.cartItems;
//   },
// );

// /* ========== REMOVE ITEM ========== */
// export const removeCartItemBackend = createAsyncThunk(
//   "cart/remove",
//   async (productId, { getState }) => {
//     const { backendUrl } = getState().cart;
//     const { userToken } = getState().user;

//     const res = await axios.delete(`${backendUrl}/api/cart/remove`, {
//       headers: { Authorization: `Bearer ${userToken}` },
//       data: { productId },
//     });

//     return res.data.cartItems;
//   },
// );

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     hydrateCart: (state, action) => {
//       state.cartItems = action.payload || [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addToCart.fulfilled, (state, action) => {
//         const p = action.payload;
//         const found = state.cartItems.find((i) => i._id === p._id);

//         if (found) found.quantity += 1;
//         else
//           state.cartItems.push({
//             _id: p._id,
//             name: p.name,
//             price: p.price,
//             offerPrice: p.offerPrice,
//             image: p.image[0],
//             category: p.category,
//             quantity: 1,
//           });

//         toast.success("Added to cart");
//       })

//       .addCase(syncCartQuantity.fulfilled, (state, action) => {
//         state.cartItems = action.payload;
//       })

//       .addCase(removeCartItemBackend.fulfilled, (state, action) => {
//         state.cartItems = action.payload;
//         toast.success("Removed from cart");
//       });
//   },
// });

// export const { hydrateCart } = cartSlice.actions;
// export default cartSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
  cartItems: [],
  numItemsInCart: 0,
  cartTotal: 0,
  tax: 0,
  shipping: 50,
  orderTotal: 0,
  backendUrl: import.meta.env.VITE_BACKEND_URL,
};
/* ================= THUNKS ================= */
export const loadCart = createAsyncThunk(
  "cart/load",
  // async (name, thunkAPI)=>{
  //   const {backendUrl}= thunkAPI.getState().cart
  //   const {userToken}= thunkAPI.getState().user
  // }
  async (_, { getState }) => {
    const { backendUrl } = getState().cart;
    const { userToken } = getState().user;

    const res = await axios.get(`${backendUrl}/api/cart`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    return res.data.cartItems;
  },
);

export const addToCartBackend = createAsyncThunk(
  "cart/addToCartBackend",
  // async (name, thunkAPI)=>{
  //   const {backendUrl}= thunkAPI.getState().cart
  //   const {userToken}= thunkAPI.getState().user
  // }
  async (productId, { getState }) => {
    const { backendUrl } = getState().cart;
    const { userToken } = getState().user;

    if (!userToken) throw new Error("User not logged in");

    const res = await axios.put(
      `${backendUrl}/api/cart/update`,
      { productId, quantity: 1 },
      { headers: { Authorization: `Bearer ${userToken}` } },
    );

    return res.data.cartItems; // BACKEND SOURCE OF TRUTH
  },
);

export const updateCartBackend = createAsyncThunk(
  "cart/update",
  // async (name, thunkAPI)=>{
  //   const {backendUrl}= thunkAPI.getState().cart
  //   const {userToken}= thunkAPI.getState().user
  // }
  async ({ productId, quantity }, { getState }) => {
    const { backendUrl } = getState().cart;
    const { userToken } = getState().user;

    const res = await axios.put(
      `${backendUrl}/api/cart/update`,
      { productId, quantity },
      { headers: { Authorization: `Bearer ${userToken}` } },
    );

    return res.data.cartItems;
  },
);

export const removeCartItemBackend = createAsyncThunk(
  "cart/remove",
  // async (name, thunkAPI)=>{
  //   const {backendUrl}= thunkAPI.getState().cart
  //   const {userToken}= thunkAPI.getState().user
  // }
  async (productId, { getState }) => {
    const { backendUrl } = getState().cart;
    const { userToken } = getState().user;

    const res = await axios.delete(`${backendUrl}/api/cart/remove`, {
      headers: { Authorization: `Bearer ${userToken}` },
      data: { productId },
    });

    return res.data.cartItems;
  },
);

/* ================= SLICE ================= */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action) => {
      state.cartItems = action.payload || [];
    },
    updateQuantityLocal: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i._id === productId);
      if (item) item.quantity = quantity;
    },
    // selectCartCount: (state) => {
    //   state.cartItems.reduce((total, item) => total + item.quantity, 0);
    // },
    getCartCount: (state) => {
      state.numItemsInCart = state.cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );
    },
    calculateTotals: (state) => {
      const subtotal = state.cartItems.reduce((sum, item) => {
        const price = item.offerPrice ?? item.price;
        return sum + price * item.quantity;
      }, 0);

      state.cartTotal = subtotal;
      state.tax = subtotal * 0.02;
      state.orderTotal = subtotal + state.tax + state.shipping;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.numItemsInCart = state.cartItems.reduce(
          (total, item) => total + item.quantity,
          0,
        );
        toast.success("Product added to cart");
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.numItemsInCart = state.cartItems.reduce(
          (total, item) => total + item.quantity,
          0,
        );
      })
      .addCase(updateCartBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.numItemsInCart = state.cartItems.reduce(
          (total, item) => total + item.quantity,
          0,
        );
      })
      .addCase(removeCartItemBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.numItemsInCart = state.cartItems.reduce(
          (total, item) => total + item.quantity,
          0,
        );
      });
  },
});

export const {
  updateQuantityLocal,
  getCartCount,
  calculateTotals,
  hydrateCart,
} = cartSlice.actions;
export default cartSlice.reducer;
