import { request, response } from "express";
import OrderModel from "../Models/orderModel.js";
import ProductModel from "../Models/productModel.js";
import stripe from "stripe";
import UserModel from "../Models/userModel.js";

//Place Order COD : /api/order/cod

export const placeOrderCOD = async (request, response) => {
  try {
    const userId = request.user.userId; // From JWT
    const { items, address } = request.body;
    if (!address || !items || items.length === 0) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }
    //Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await ProductModel.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);
    await OrderModel.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed",
    });
    return response.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ success: false, message: error.message });
  }
};

// Get Orders by User ID : /api/order/user

export const getUserOrders = async (request, response) => {
  try {
    const userId = request.user.userId;
    // const { userId } = request.body;
    const orders = await OrderModel.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate({
        path: "items.product",
        model: "Product", //  EXPLICIT MODEL
      })
      .populate("address")
      .sort({ createdAt: -1 });
    response.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ success: false, message: error.message });
  }
};

//Get All Orders (for Seller / admin) : /api/order/seller

export const getAllOrders = async (request, response) => {
  try {
    const orders = await OrderModel.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    response.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};

//Place Order Stripe : /api/order/stripe

export const placeOrderStripe = async (request, response) => {
  try {
    const userId = request.user.userId; // From JWT
    const { items, address } = request.body;
    const { origin } = request.headers;
    if (!address || !items || items.length === 0) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }
    let productData = [];
    //Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await ProductModel.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);
    const order = await OrderModel.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      // isPaid: false,
      // status: "Order Placed",
    });
    //Stripe Gateway Initialize
    //using the stripe secret key we created a stripeInstance
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    //create line items for stripe

    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });
    //create session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });
    return response.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ success: false, message: error.message });
  }
};

//Stripe Webhooks to verify Payments Action : /stripe
//we created the function to verify the stripe webhooks
export const stripeWebhooks = async (request, response) => {
  //Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    response.status(400).send(`webhook Error: ${error.message}`);
    console.log(error);
  }
  //Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      //Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId, userId } = session.data[0].metadata;
      //Mark Payment as Paid
      await OrderModel.findByIdAndUpdate(orderId, { isPaid: true });
      //Clear user cart
      await UserModel.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      //Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId, userId } = session.data[0].metadata;
      await OrderModel.findByIdAndDelete(orderId);
      break;
    }
    default:
      console.error(`Unhandled event type ${event.type}`);
      break;
  }
  response.json({ received: true });
};
