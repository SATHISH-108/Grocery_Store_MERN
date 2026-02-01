// COOKIE + BEARER
import express from "express";
import UserModel from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//Users Register => http://localhost:7001/api/users/signup
export const usersSignup = async (request, response) => {
  try {
    const { username, email, password, role } = request.body;
    if (!username || !email || !password || !role) {
      return response.json({
        success: false,
        message: "All fields are required*",
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.json({ success: false, message: "User already exists" });
    }
    //Bcrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Insert Into Database
    const users = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    console.log("users_usersControllers.js", users);
    return response.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      users,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Something went wrong" });
  }
};
//Users Login => http://localhost:7001/api/users/signin
export const usersSignin = async (request, response) => {
  try {
    const { email, password, role } = request.body;
    if (!email || !password || !role) {
      return response.json({
        success: false,
        message: "All fields are required*",
      });
    }
    const user = await UserModel.findOne({ email, role });
    if (!user) {
      return response.json({
        success: false,
        message: `${role} Not found / Not matched credentials`,
      });
    }
    //compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    if (!token) {
      return response.json({
        success: false,
        message: "JWT Token missing / JWT Token not found",
      });
    }
    // console.log("jwt", token);
    //  CLEAR ALL OLD COOKIES (VERY IMPORTANT)
    response.clearCookie("false", { path: "/" });
    (response.clearCookie("userToken", { path: "/" }),
      response.clearCookie("sellerToken", { path: "/" }));
    // COOKIE MODE // //  SINGLE AUTH COOKIE
    if (role === "User") {
      response.cookie("userToken", token, {
        httpOnly: true, //Prevent Javascript to access cookie
        secure: process.env.NODE_ENV === "production", //Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, //Cookie expiration time
      });
    }
    if (role === "Seller") {
      response.cookie("sellerToken", token, {
        httpOnly: true, //Prevent Javascript to access cookie
        secure: process.env.NODE_ENV === "production", //Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, //Cookie expiration time
      });
    }

    return response.json({
      success: true,
      message: `${role} Login successfully / JWT Token generated`,
      token, // for Bearer usage
      loginUser: user,
    });
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};

// export const isAuth = async (req, res) => {
//   const user = await UserModel.findById(req.user.id).select("-password");
//   res.json({ success: true, user });
// };

// export const logout = (req, res) => {
//   res.clearCookie("token");
//   res.json({ success: true, message: "Logged out" });
// };
