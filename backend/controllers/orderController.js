import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    // ✅ Create new order using userId from auth middleware
    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    // ✅ Clear user cart after order creation
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // ✅ Create Stripe line items
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe works in cents
      },
      quantity: item.quantity,
    }));

    // ✅ Add delivery charges
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 20 * 100,
      },
      quantity: 1,
    });

    // ✅ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    // Make sure orderId exists
    if (!orderId) return res.status(400).json({ success: false, message: "Order ID missing" });

    if (success === "true" || success === true) {
      // Payment successful, update order
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      // Payment failed or canceled, remove order
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Order canceled and deleted" });
    }
  } catch (error) {
    console.log("Verify Order Error:", error);
    res.status(500).json({ success: false, message: "Error verifying order" });
  }
};
// users order for frontend 
const userOrder = async (req,res) => {
    try {
        const orders = await  orderModel.find({userId:req.userId})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}    

// listing order for admin panel
const listOrders = async (req,res) => {
  try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:" "})
  }
}

// api for updating order status 
const updateStatus = async (req,res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({success:true,message:"Status Updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

export { placeOrder,verifyOrder,userOrder,listOrders,updateStatus };
