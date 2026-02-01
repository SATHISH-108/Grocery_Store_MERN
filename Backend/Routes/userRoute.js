import express from "express";
import { Protected, AuthorizedRoles } from "../middlewares/authUser.js";
import { isAuth, logout } from "../Controllers/UserController.js";
import authUser from "../middlewares/authUser.js";
const userRouter = express.Router();
// userRouter.get(
//   "/",
//   Protected,
//   AuthorizedRoles(["User", "Seller"]),
//   (request, response) => {
//     response.send("Welcome To User Dashboard");
//   }
// );

userRouter.get(
  "/",
  Protected,
  AuthorizedRoles(["User", "Seller"]),

  (request, response) => {
    console.log("request_userRoute", request.user);
    response.json({
      success: true,
      message: `Welcome To User Dashboard,  role:${request.user.role}, id:${request.user.id}`,
    });
  },
);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logout);
export default userRouter;
