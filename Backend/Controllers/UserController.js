//Check Auth : /api/user/is-auth
import UserModel from "../Models/userModel.js";
export const isAuth = async (request, response) => {
  try {
    const { userId } = request.user;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return response.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ success: false, message: error.message });
  }
};

//Logout User : /api/user/logout
export const logout = async (request, response) => {
  try {
    response.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return response.json({ success: true, message: " User Logged Out" });
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};
