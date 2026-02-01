//Login Seller : /api/seller/login
import jwt from "jsonwebtoken";
export const sellerLogin = async (request, response) => {
  try {
    const { email, password, role } = request.body;
    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD &&
      role === process.env.SELLER_ROLE
    ) {
      const token = jwt.sign(
        { id: "SELLER_ADMIN", role, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );
      if (!token) {
        return response.json({
          success: false,
          message: `${role} Token Missing`,
        });
      }
      response.cookie("sellerToken", token, {
        httpOnly: true, //Prevent Javascript to access cookie
        secure: process.env.NODE_ENV === "production", //Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, //Cookie expiration time
      });
      return response.json({
        success: true,
        message: `${role} Logged In`,
        sellerToken: token,
      });
    } else {
      return response.json({
        success: false,
        message: "Invalid seller credentials",
      });
    }
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};

//Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (request, response) => {
  try {
    return response.json({ success: true });
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};

//Logout Seller : /api/seller/logout
export const sellerLogout = async (request, response) => {
  try {
    response.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return response.json({
      success: true,
      message: "Seller logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};
