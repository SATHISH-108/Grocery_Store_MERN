// import UserModel from "../Models/userModel.js";
// import mongoose from "mongoose";

// /* ================= UPDATE CART ================= */
// export const updateCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const userId = req.user.userId;
//     console.log("request.body_updateCart_cartControllers", req.body);
//     if (!productId || !quantity) {
//       return res.status(400).json({ success: false, message: "Invalid data" });
//     }

//     // const user = await UserModel.findById(userId);
//     const user = await UserModel.findById(userId).populate(
//       "cartItems.productId",
//     );
//     if (!user) return res.status(404).json({ success: false });

//     // const prodId = new mongoose.Types.ObjectId(productId);

//     // const existing = user.cartItems.find(
//     //   (i) => i.productId._id.toString() === prodId.toString(),
//     // );
//     const existing = user.cartItems.find(
//       (item) => item.productId._id.toString() === productId,
//     );
//     console.log("existing_cartControllers", existing);
//     if (existing) {
//       existing.quantity = quantity;
//     } else {
//       user.cartItems.push({ productId: prodId, quantity });
//     }

//     await user.save();

//     const populatedUser = await UserModel.findById(userId).populate(
//       "cartItems.productId",
//     );
//     console.log("populatedUser_cartController", populatedUser);
//     // const formattedCart = user.cartItems.map((item) => ({
//     const formattedCart = populatedUser.cartItems.map((item) => ({
//       _id: item.productId._id,
//       name: item.productId.name,
//       price: item.productId.price,
//       offerPrice: item.productId.offerPrice,
//       image: item.productId.image[0],
//       category: item.productId.category,
//       quantity: item.quantity,
//     }));

//     res.json({ success: true, cartItems: formattedCart });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ================= REMOVE CART ITEM ================= */
// export const removeCartItem = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const userId = req.user.userId;

//     const user = await UserModel.findById(userId).populate(
//       "cartItems.productId",
//     );

//     user.cartItems = user.cartItems.filter(
//       (i) => i.productId._id.toString() !== productId,
//     );

//     await user.save();

//     const formattedCart = user.cartItems.map((item) => ({
//       _id: item.productId._id,
//       name: item.productId.name,
//       price: item.productId.price,
//       offerPrice: item.productId.offerPrice,
//       image: item.productId.image[0],
//       category: item.productId.category,
//       quantity: item.quantity,
//     }));

//     res.json({ success: true, cartItems: formattedCart });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ================= GET CART ================= */
// export const getCart = async (req, res) => {
//   const user = await UserModel.findById(req.user.userId).populate(
//     "cartItems.productId",
//   );

//   const formattedCart = user.cartItems.map((i) => ({
//     _id: i.productId._id,
//     name: i.productId.name,
//     price: i.productId.price,
//     offerPrice: i.productId.offerPrice,
//     image: i.productId.image[0],
//     category: i.productId.category,
//     quantity: i.quantity,
//   }));

//   res.json({ success: true, cartItems: formattedCart });
// };

import UserModel from "../Models/userModel.js";

/* ===== ADD / UPDATE CART ===== */
export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    const user = await UserModel.findById(userId).populate(
      "cartItems.productId",
    );

    if (!user) {
      return res.status(404).json({ success: false });
    }

    const item = user.cartItems.find(
      (i) => i.productId._id.toString() === productId,
    );

    if (item) {
      item.quantity = quantity;
    } else {
      user.cartItems.push({ productId, quantity });
    }

    await user.save();

    const formattedCart = user.cartItems.map((i) => ({
      _id: i.productId._id,
      name: i.productId.name,
      price: i.productId.price,
      offerPrice: i.productId.offerPrice,
      image: i.productId.image[0],
      category: i.productId.category,
      quantity: i.quantity,
    }));

    res.json({ success: true, cartItems: formattedCart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===== REMOVE ITEM ===== */
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const user = await UserModel.findById(userId).populate(
      "cartItems.productId",
    );

    user.cartItems = user.cartItems.filter(
      (i) => i.productId._id.toString() !== productId,
    );

    await user.save();

    const formattedCart = user.cartItems.map((i) => ({
      _id: i.productId._id,
      name: i.productId.name,
      price: i.productId.price,
      offerPrice: i.productId.offerPrice,
      image: i.productId.image[0],
      category: i.productId.category,
      quantity: i.quantity,
    }));

    res.json({ success: true, cartItems: formattedCart });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* ===== GET CART ===== */
export const getCart = async (req, res) => {
  const user = await UserModel.findById(req.user.userId).populate(
    "cartItems.productId",
  );

  const formattedCart = user.cartItems.map((i) => ({
    _id: i.productId._id,
    name: i.productId.name,
    price: i.productId.price,
    offerPrice: i.productId.offerPrice,
    image: i.productId.image[0],
    category: i.productId.category,
    quantity: i.quantity,
  }));

  res.json({ success: true, cartItems: formattedCart });
};
