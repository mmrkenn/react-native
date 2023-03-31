import mongoose from "mongoose";

const schema = new mongoose.Schema({
  category: {
    type: String,
    unique: true,
    required: [true, "Caegroy is required!"]
  }
} , {collection: "Category"})

export const Category = mongoose.model("Category" , schema)