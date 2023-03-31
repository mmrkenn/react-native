import mongoose from "mongoose";

const schema = new mongoose.Schema({
  shippingInfo: 
    {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
  
  orderItems: [{
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"Product"
    },
    image: {
      type: String,
    }
  }],
  orderStatus: {
    type: String,
    enum: ["Processing" , "Completed"],
    default: "Processing",
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["COD" , "CREDIT CARD"],
    default: "COD",
    required: true,
  },
  paymentInfo: {
    id: String,
    status: String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  shippingCharges: {
    type: Number,
    required: true,
  }
} , {collection: "Order"});

export const Order = mongoose.model("Order", schema);
