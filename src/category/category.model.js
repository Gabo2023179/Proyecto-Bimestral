import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la categoría es obligatorio"],
      trim: true,
      unique: true, // Evita nombres duplicados
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Solo usuarios autorizados pueden crear categorías
    },
    status: {
      type: Boolean,
      default: true, // Indica si la categoría está activa
    },
  },
  {
    timestamps: true, // Añade automáticamente "createdAt" y "updatedAt"
    versionKey: false,
  }
);

export default model("Category", CategorySchema);
