import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  } ,
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  stock: {
    type: Number,
    required: [true, "Stock is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  images: [{public_id: String , url: String }
  ],
  category: {
    type: String,
    ref: "Category"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
} , {collection: "Product"})

schema.pre("save" , async function(next) {
  try {
    const category = await mongoose.model('Category').findOne({category: this.category})
    this.category = category && category._id;
    next()
  } catch(err) {
    console.log(err)
  }
})


export const Product = mongoose.model("Product" , schema)