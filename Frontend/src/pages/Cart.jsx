import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  // calculateTotals,
  // getCartCount,
  // removeFromCart,
  // updateQuantityLocal,
  // syncCartQuantity,
  removeCartItemBackend,
  loadCart,
  updateCartBackend,
  getCartCount,
  calculateTotals,
} from "../features/cart/cartSlice";
import { assets, dummyAddress } from "../assets/groceries_assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

const Cart = () => {
  const [paymentOption, setPaymentOption] = useState("COD");
  // const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  // console.log("selectedAddress_cart.jsx_21stline", selectedAddress);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    backendUrl,
    cartItems,
    cartTotal,
    tax,
    shipping,
    orderTotal,
    numItemsInCart,
  } = useSelector((state) => state.cart);
  const { userProfileData, userToken } = useSelector((state) => state.user);
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const getUserAddress = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/address/get`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      // console.log("response_cart.jsx", response);
      if (response.data.success) {
        setAddresses(response.data.addresses);
        if (response.data.addresses.length > 0) {
          setSelectedAddress(response.data.addresses[0]);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      //Place Order with COD
      if (paymentOption === "COD") {
        const { data } = await axios.post(
          `${backendUrl}/api/order/cod`,
          {
            userId: userProfileData._id,
            items: cartItems.map((item) => ({
              product: item._id,
              quantity: item.quantity,
            })),
            address: selectedAddress._id,
          },
          { headers: { Authorization: `Bearer ${userToken}` } }, //Required
        );
        if (data.success) {
          toast.success(data.message);
          // dispatch(setCartItems({}));
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else {
        //Place Order with Stripe
        const { data } = await axios.post(
          `${backendUrl}/api/order/stripe`,
          {
            userId: userProfileData._id,
            items: cartItems.map((item) => ({
              product: item._id,
              quantity: item.quantity,
            })),
            address: selectedAddress._id,
          },
          { headers: { Authorization: `Bearer ${userToken}` } }, //Required
        );
        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  /*  Recalculate totals whenever cart changes */
  // useEffect(() => {
  //   dispatch(calculateTotals());
  //   dispatch(getCartCount());
  // }, [cartItems, dispatch]);

  useEffect(() => {
    if (userProfileData && userToken) {
      getUserAddress();
    }
  }, [userProfileData, userToken]);
  useEffect(() => {
    if (userToken) {
      dispatch(loadCart());
    }
  }, [dispatch, userToken]);
  useEffect(() => {
    dispatch(getCartCount());
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);
  /* =============================
     EMPTY CART VIEW
  ============================== */
  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-500">Your cart is empty</p>
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-auto flex items-center mt-8 gap-2  text-primary font-medium"
        >
          <img
            className="grou-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 py-16 max-w-6xl mx-auto px-6">
      {/* ================= CART ITEMS ================= */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart
          <span className="text-sm text-indigo-500 ml-2">
            ({numItemsInCart} items)
          </span>
        </h1>
        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>
        {cartItems.map((item) => {
          // console.log("item", item);
          return (
            <div
              key={item._id}
              className="flex justify-between items-center py-4 border-t"
            >
              {/* Product info */}
              <div className="flex gap-4">
                <img
                  onClick={() => {
                    navigate(
                      `/products/${item.category.toLowerCase()}/${item._id}`,
                    );
                    scrollTo(0, 0);
                  }}
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover border cursor-pointer"
                />
                {/* Product-name, Quantity, Quantity*Price */}
                <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
                  <p className="font-semibold">{item.name}</p>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-2 mt-2">
                    <span>Qty:</span>
                    {/* <select
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(
                        updateQuantityLocal({
                          productId: item._id,
                          quantity: Number(e.target.value),
                        }),
                      )
                    }
                    className="border px-2 py-1"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select> */}
                    {/* <select
                      value={item.quantity}
                      onChange={(e) => {
                        const qty = Number(e.target.value);

                        dispatch(
                          updateQuantityLocal({
                            productId: item._id,
                            quantity: qty,
                          }),
                        );
                        dispatch(
                          syncCartQuantity({
                            productId: item._id,
                            quantity: qty,
                          }),
                        );
                      }}
                      className="border px-2 py-1"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select> */}

                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          updateCartBackend({
                            productId: item._id,
                            quantity: Number(e.target.value),
                          }),
                          // syncCartQuantity({
                          //   productId: item._id,
                          //   quantity: Number(e.target.value),
                          // }),
                        )
                      }
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item subtotal */}
                  <p className="font-medium">
                    {item.quantity} * {item.offerPrice ?? item.price} =
                    {currency}
                    {(item.offerPrice ?? item.price) * item.quantity}
                  </p>
                </div>
              </div>
              {/* Remove */}
              <button
                onClick={() => dispatch(removeCartItemBackend(item._id))}
                className="text-red-500 cursor-pointer"
              >
                Remove
                <img
                  src={assets.refresh_icon}
                  alt="remove"
                  className="inline-block w-6 h-6"
                />
              </button>
            </div>
          );
        })}
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      {/* ================= ORDER SUMMARY ================= */}
      <div className="w-full md:w-[360px] bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />
        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {addresses.map((address, index) => (
                  <p
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country}{" "}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2 text-gray-700">
          <p className="text-sm font-medium uppercase">Paymenyt Method</p>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 mb-4 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {currency}
              {cartTotal}
            </span>
          </p>

          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span>
              {currency}
              {shipping}
            </span>
          </p>

          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {tax.toFixed(2)}
            </span>
          </p>

          <p className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>
              {currency}
              {orderTotal}
            </span>
          </p>
        </div>
        <button
          onClick={placeOrder}
          className="w-full mt-6 py-3 bg-primary text-white font-medium cursor-pointer hover:bg-primary-dull transition"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed To Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
