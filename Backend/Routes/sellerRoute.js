import expres from "express";
import { AuthorizedRoles, Protected } from "../middlewares/authUser.js";
import { isSellerAuth, sellerLogout } from "../Controllers/SellerController.js";
// import { Protected, AuthorizedRoles } from "../middleware/authSeller.js";

import authSeller from "../middlewares/authSeller.js";

const sellerRouter = expres.Router();
sellerRouter.get(
  "/",
  Protected,
  AuthorizedRoles(["Seller"]),
  (request, response) => {
    response.json({
      success: true,
      message: `Welcome To Seller Dashboard, role:${request.user.role}, id:${request.user.id}`,
    });
  },
);
sellerRouter.get("/is-auth", authSeller, isSellerAuth);
sellerRouter.get("/logout", authSeller, sellerLogout);

export default sellerRouter;
