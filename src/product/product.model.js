import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      unique: true, // Evita nombres duplicados
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio del producto es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es obligatoria"],
    },
    status: {
      type: Boolean,
      default: true, // Indica si el producto está activo
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt
    versionKey: false,
  }
);

export default model("Product", ProductSchema);