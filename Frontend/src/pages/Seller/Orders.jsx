import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assets, dummyOrders } from "../../assets/groceries_assets/assets";
import { fetchSellerOrders } from "../../features/seller/sellerSlice";

const Orders = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { orders, ordersLoading } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);
  if (ordersLoading) {
    return <p className="p-10">Loading orders...</p>;
  }
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>
        {orders.length === 0 && (
          <p className="text-gray-500">No orders found</p>
        )}
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
          >
            {/* Items */}
            <div className="flex gap-5 max-w-80">
              <img
                className="w-12 h-12 object-cover"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex flex-col justify-center">
                    <p className="font-medium">
                      {item.product.name}{" "}
                      <span className="text-primary">x {item.quantity}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Address */}
            <div className="text-sm md:text-base text-black/60">
              <p className="text-black/80">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                {order.address.street}, {order.address.city}
              </p>

              <p>
                {order.address.state},{order.address.zipcode},{" "}
                {order.address.country}
              </p>
              <p></p>
              <p>{order.address.phone}</p>
            </div>
            {/* Amount */}
            <p className="font-medium text--lg my-auto">
              {currency}
              {order.amount}
            </p>
            {/* Meta */}
            <div className="flex flex-col text-sm md:text-base text-black/60">
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Orders;
