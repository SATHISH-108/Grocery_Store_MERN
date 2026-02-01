// // const express = require("express");
// // const cors = require("cors");
import DBConnection from "./Config/db.js";
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRouter from "./Routes/usersRoute.js";
import userRouter from "./Routes/userRoute.js";
import sellerRouter from "./Routes/sellerRoute.js";
import connectCloudinary from "./Config/cloudinary.js";
import productRouter from "./Routes/productRoute.js";
import cartRouter from "./Routes/cartRoute.js";
import addressRouter from "./Routes/addressRoute.js";
import orderRouter from "./Routes/orderRoute.js";
import { stripeWebhooks } from "./Controllers/orderController.js";

//app configuration
const app = express();
const PORT = process.env.PORT || 7002;
await DBConnection(); //Calling the Database
await connectCloudinary();
//Allow multiple origins
app.use(cors({ origin: ["http://localhost:5173"], credentials: true })); // allows you to connect Frontend to Backend

app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Middleware Configuration
app.use(express.json()); // pasre request bodies // helps to access request.body
app.use(cookieParser());

//API End Points (Testing Routes)
app.get("/", async (request, response) => {
  response.send("Home Page");
});
app.get("/company", async (request, response) => {
  response.send("Company Page");
});

//routes
app.use("/api/users", usersRouter);
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
//Run The Server
app.listen(PORT, () => {
  console.log(`Server Is Running At http://localhost:${PORT}`);
});
