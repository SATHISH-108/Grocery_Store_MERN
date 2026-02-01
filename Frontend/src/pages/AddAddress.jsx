import React, { useEffect, useState } from "react";
import { assets } from "../assets/groceries_assets/assets";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AddAddress = () => {
  const [address, setAddresses] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const { userProfileData, backendUrl, userToken } = useSelector(
    (state) => state.user,
  );
  const navigate = useNavigate();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/address/add`,
        {
          address,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }, // Required,
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/cart");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    if (!userProfileData || !userToken) {
      navigate("/signin");
    }
  }, [navigate, userProfileData, userToken]);
  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping &nbsp;
        <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                type="text"
                placeholder="First Name"
                onChange={(e) =>
                  setAddresses({ ...address, firstName: e.target.value })
                }
                required
              />
              <input
                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                type="text"
                placeholder="last Name"
                onChange={(e) =>
                  setAddresses({ ...address, lastName: e.target.value })
                }
                required
              />
            </div>
            <input
              className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
              type="text"
              placeholder="Email Address"
              onChange={(e) =>
                setAddresses({ ...address, email: e.target.value })
              }
              required
            />
            <input
              className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
              type="text"
              placeholder="Street"
              onChange={(e) =>
                setAddresses({ ...address, street: e.target.value })
              }
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                type="text"
                placeholder="City"
                onChange={(e) =>
                  setAddresses({ ...address, city: e.target.value })
                }
                required
              />
              <input
                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                type="text"
                placeholder="State"
                onChange={(e) =>
                  setAddresses({ ...address, state: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                type="number"
                placeholder="Zip code"
                onChange={(e) =>
                  setAddresses({ ...address, zipcode: e.target.value })
                }
                required
              />
              <input
                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                type="text"
                placeholder="Country"
                onChange={(e) =>
                  setAddresses({ ...address, country: e.target.value })
                }
                required
              />
            </div>
            <input
              className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
              type="number"
              placeholder="Phone"
              onChange={(e) =>
                setAddresses({ ...address, phone: e.target.value })
              }
              required
            />

            <input
              className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase"
              type="submit"
              value="Save address"
            />
          </form>
        </div>
        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
