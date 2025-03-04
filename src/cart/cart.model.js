import { Schema, model } from "mongoose";

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "La cantidad debe ser al menos 1"]
  }
}, { _id: false });

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true  // Cada usuario tiene un carrito único
  },
  items: {
    type: [CartItemSchema],
    default: []
  }
}, {
  timestamps: true,
  versionKey: false
});

export default model("Cart", CartSchema);
