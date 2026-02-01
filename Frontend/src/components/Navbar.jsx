import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/groceries_assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../features/product/productSlice";
import { userLogout } from "../features/user/userSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, userToken, userProfileData } = useSelector(
    (state) => state.user,
  );
  const { sellerToken, sellerProfileInfo } = useSelector(
    (state) => state.seller,
  );
  const { searchQuery } = useSelector((state) => state.product);
  const { numItemsInCart, cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Proper logout handler
  const handleLogout = () => {
    // dispatch(setUserLogout());
    dispatch(userLogout());
    navigate("/signin");
    setOpen(false);
  };
  const isAuthenticated =
    (!!userToken && Object.keys(userProfileData).length > 0) ||
    (!sellerToken && Object.keys(sellerProfileInfo).length > 0);
  // userProfileData is an object
  // In JavaScript:
  // {} === true
  // Even an empty object is truthy
  // const userDetails =
  //   localStorage.getItem("UserDetails") &&
  //   JSON.parse(localStorage.getItem("UserDetails"));
  // const userRole = userDetails.role;
  // const SellerDetails =
  //   localStorage.getItem("SellerDetails") &&
  //   JSON.parse(localStorage.getItem("SellerDetails"));
  // const sellerRole = SellerDetails.role;
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative">
      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img src={assets.logo} alt="logo" className="h-9" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Product</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 border border-gray-300 px-3 rounded-full">
          <input
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="py-1.5 w-full bg-transparent outline-none"
            placeholder="Search products"
          />
          <img src={assets.search_icon} className="w-4 h-4" />
        </div>

        {/* Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img src={assets.nav_cart_icon} className="w-6 opacity-80" />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {numItemsInCart}
          </span>
        </div>

        {/* User  Desktop*/}
        {!isAuthenticated ? (
          <button
            onClick={() => navigate("/signin")}
            className="px-8 py-2 bg-indigo-500 text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} className="w-10 cursor-pointer" />
            {userProfileData && <p>{userProfileData.username}</p>}
            {sellerProfileInfo && <p>{sellerProfileInfo.username}</p>}

            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border py-2 w-32 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("/my-orders")}
                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={handleLogout}
                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Icons */}
      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img src={assets.nav_cart_icon} className="w-6" />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {numItemsInCart}
          </span>
        </div>

        <button onClick={() => setOpen(!open)}>
          <img src={assets.menu_icon} />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 flex flex-col gap-3 px-5 text-sm sm:hidden">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            All Product
          </NavLink>
          {user && (
            <NavLink to="/my-orders" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>

          {!isAuthenticated ? (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/signin");
              }}
              className="mt-2 px-6 py-2 bg-indigo-500 text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="mt-2 px-6 py-2 bg-indigo-500 text-white rounded-full"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
