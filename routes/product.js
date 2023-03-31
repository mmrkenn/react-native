import express from "express";
import {
  getAllProduct,
  productDetails,
  addProduct,
  updateProduct,
  addProductPic,
  deleteProductPic,
  deleteProduct,
  addCategory,
  fetchCategory,
  deleteCategory,
} from "../controllers/product.js";
import { isAuth } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();

router.get("/allproduct", getAllProduct);
router
  .route("/single/:id")
  .get(productDetails)
  .put(isAuth, updateProduct)
  .delete(isAuth, deleteProduct);
router
  .route("/images/:id")
  .post(isAuth, singleUpload, addProductPic)
  .delete(isAuth, deleteProductPic);
  
router.post("/new", isAuth, singleUpload, addProduct);

// Category route

router
  .route("/category")
  .post(isAuth, addCategory)
  .get(fetchCategory)
  .delete(isAuth, deleteCategory);

export default router;
