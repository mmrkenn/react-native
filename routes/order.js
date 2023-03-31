import { isAuth } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import { createOrder , getMyOrders , myOrder} from "../controllers/order.js";
import express from "express";

const router = express.Router()

router.post("/neworder" , isAuth , createOrder)
router.get("/getmyorders" , isAuth , getMyOrders)
router.route("/myorder/:id").get(isAuth , myOrder)

export default router