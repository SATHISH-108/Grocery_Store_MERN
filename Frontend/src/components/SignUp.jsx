import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const SignUp = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
  });
  const { showUserLogin, backendUrl } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const data = await axios.post(`${backendUrl}/api/users/signup`, user);
      console.log("registeredUser_SignUp", data);
      if (data.data.success && data.status === 201) {
        toast.success(data.data.message);
        navigate("/signin");
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
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50">
      <p>User SignUp</p>
      <form
        onSubmit={onSubmitHandler}
        // onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          User&nbsp;
          <span className="text-primary">SignUp</span>
        </p>
        <div className="w-full">
          <p>Name</p>
          <input
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            value={user.name}
            placeholder="type here"
            autoComplete="current-password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="text"
            required
          />
        </div>

        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            value={user.email}
            placeholder="type here"
            autoComplete="current-password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            value={user.password}
            placeholder="type here"
            autoComplete="current-password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>
        <p>
          Already have account?{" "}
          <Link to="/signIn" className="text-primary cursor-pointer">
            click here
          </Link>
        </p>
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};
export default SignUp;
