import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la categoría es obligatorio"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    status: {
      type: Boolean,
      default: true, 
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Category", CategorySchema);
