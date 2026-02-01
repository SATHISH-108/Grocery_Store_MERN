import express from "express";
import { usersSignup, usersSignin } from "../Controllers/UsersControllers.js";
const usersRouter = express.Router();
usersRouter.post("/signup", usersSignup);
usersRouter.post("/signin", usersSignin);

export default usersRouter;
