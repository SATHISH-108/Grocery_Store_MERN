import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setLoginSellerDetails } from "../../features/seller/sellerSlice";
import { userLogout } from "../../features/user/userSlice";
import axios from "axios";
const SellerSignIn = () => {
  const { isSeller, backendUrl } = useSelector((state) => state.seller);
  const [seller, setSeller] = useState({
    email: "",
    password: "",
    role: "Seller",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller]);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(`${backendUrl}/api/users/signin`, seller);
      console.log("sellerlogin_Signin", data);
      if (
        data.data.success &&
        data.status === 200 &&
        data.data.loginUser.role === "Seller"
      ) {
        dispatch(setLoginSellerDetails(data.data));
        dispatch(userLogout());
        localStorage.removeItem("UserDetails");
        localStorage.setItem(
          "SellerDetails",
          JSON.stringify({
            role: data.data.loginUser.role,
            sellerToken: data.data.token,
          }),
        );
        toast.success(data.data.message);
        navigate("/seller");
      }
      if (!data.data.success) {
        toast.error(data.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    !isSeller && (
      <form
        onSubmit={onSubmitHandler}
        className="min-h-screen flex items-center text-sm text-gray-600"
      >
        <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">Seller&nbsp;</span>SignIn
          </p>
          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setSeller({ ...seller, email: e.target.value })}
              value={seller.email}
              type="email"
              autoComplete="current-password"
              placeholder="enter your email"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input
              type="password"
              autoComplete="current-password"
              onChange={(e) =>
                setSeller({ ...seller, password: e.target.value })
              }
              value={seller.password}
              placeholder="enter your password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white w-full py-2 rounded-md cursor-pointer"
          >
            SignIn
          </button>
        </div>
      </form>
    )
  );
};

export default SellerSignIn;
