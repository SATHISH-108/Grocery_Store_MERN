import express from "express";
import { authUser } from "../middlewares/authUser.js";
import {
  removeCartItem,
  updateCart,
  getCart,
} from "../Controllers/CartControllers.js";

const cartRouter = express.Router();
cartRouter.get("/", authUser, getCart);
cartRouter.put("/update", authUser, updateCart);
cartRouter.delete("/remove", authUser, removeCartItem);
export default cartRouter;
