// const mongoose = require("mongoose");
import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  products: [
    {
      prod_name: { type: String,},
      quantity: { type: Number },
      options_id: { type: String },
      price: { type: Number },
    },
  ],
  address: { type: String, required: true },
  date: { type: String },
});
const buyingSchema = new mongoose.Schema({
  email: { type: String, required: true},
  username: { type: String, required: true },
  orders: [orderSchema],
});
module.exports = mongoose.model("BuyingModule", buyingSchema);
