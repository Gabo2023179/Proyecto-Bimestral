import { Schema, model } from "mongoose";

const InvoiceItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "La cantidad debe ser al menos 1"]
  },
  price: {
    type: Number,
    required: true,
    min: [0, "El precio no puede ser negativo"]
  }
}, { _id: false });

const InvoiceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"]
    },
    items: {
      type: [InvoiceItemSchema],
      required: true,
      validate: {
        validator: (array) => array.length > 0,
        message: "Debe haber al menos un producto en la factura"
      }
    },
    total: {
      type: Number,
      required: [true, "El total es obligatorio"],
      min: [0, "El total no puede ser negativo"]
    },
    status: {
      type: String,
      enum: ["Pendiente", "Pagada", "Cancelada"],
      default: "Pendiente"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model("Invoice", InvoiceSchema);
