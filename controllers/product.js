import { Product } from "../models/product.js";
import { Category } from "../models/category.js";
import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import ErrorHandler from "../utils/error.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

export const getAllProduct = asyncErrorHandler(async (req, res, next) => {

  const {keyword , category} = req.query


  const categories = await Category.findOne({category})

   const catId = categories && categories._id.toString()

  const products = await Product.find({
    name: {
      $regex: keyword ? keyword : "",
      $options: "i"
    } ,
    category: category ?  catId : { $exists: true }  }).populate("category");

  res.status(200).json({
    sucess: true,
    products,
  })
});

export const productDetails = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) return next(ErrorHandler("No product found!", 400));

  res.status(200).json({
    sucess: true,
    product,
  });
});

export const addProduct = asyncErrorHandler(async (req, res, next) => {
  const { name, price, stock, description, category } = req.body;

  let image = null;
  if (req.file) {
    const file = getDataUri(req.file);
    const productPic = await cloudinary.v2.uploader.upload(file.content);
    image = {
      public_id: productPic.public_id,
      url: productPic.secure_url,
    };
  }

  await Product.create({
    name,
    price,
    stock,
    description,
    category,
    images: image ? [image] : undefined,
  });

  res.status(200).json({
    sucess: true,
    message: "Sucessfully created!",
  });
});

export const addProductPic = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  const file = getDataUri(req.file);

  let newImage = null;

  const image = await cloudinary.v2.uploader.upload(file.content);

  newImage = {
    public_id: image.public_id,
    url: image.secure_url,
  };

  product.images.push(newImage);

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product image is added",
  });
});

export const updateProduct = asyncErrorHandler(async (req, res, next) => {
  const { name, price, stock, description, category } = req.body;
  const product = await Product.findById(req.params.id);

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (description) product.description = description;
  if (category) product.category = category;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product Updated!",
  });
});

export const deleteProductPic = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const id = req.query.id;

  const index = product.images.findIndex(
    (item) => item._id.toString() === id.toString()
  ); // query img index

  if (index < 0) return next(ErrorHandler("Image is not found", 404));

  await cloudinary.v2.uploader.destroy(product.images[index].public_id);

  product.images.splice(index, 1);

  await product.save();

  res.status(200).json({
    success: true,
    messagge: "Image Deleted!",
  });
});

export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) next(ErrorHandler("No product found", 404));

  if (product.images.length > 0) {
    product.images.forEach((item) =>
      cloudinary.v2.uploader.destroy(item.public_id)
    );
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    messagge: "Product Deleted!",
  });
});

// Add , Get , Gelete Category

export const addCategory = asyncErrorHandler(async (req, res, next) => {
  const { category } = req.body;

  if (!category) return next(ErrorHandler("Please enter a category", 404));

  const isNew = await Category.findOne({ category });

  if (isNew == null)
    await Category.create({
      category,
    });

  res.status(200).json({
    success: true,
    message: "Category added!",
  });
});

export const fetchCategory = asyncErrorHandler(async (req, res, next) => {
  const allCategory = await Category.find({});

  if (!allCategory || allCategory == null)
    return next(ErrorHandler("No category found", 400));

  res.status(200).json({
    success: true,
    allCategory,
  });
});

export const deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const data = await Category.findOne(req.body);
  console.log(data._id.toString())

  const products = await Product.find({ category: data._id.toString() });

  products.forEach( async (item) => {
    item.category = undefined;
    await item.save()
  });

  await Category.findByIdAndDelete(data._id);

  res.status(200).json({
    success: true,
    message: "Category deleted!",
  });
});
