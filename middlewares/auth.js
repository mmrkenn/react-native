import jwt from "jsonwebtoken"
import ErrorHandler from "../utils/error.js"
import { User } from "../models/user.js"
import {asyncErrorHandler} from "./errorHandler.js"

export const isAuth = asyncErrorHandler (async (req,res,next) => {
  const {token}  = req.cookies
  if(!token) return next(ErrorHandler("Not Authorized" , 401))
  const decoded = jwt.verify(token , process.env.JWT_SERCET)
   req.user = await User.findById(decoded._id)
  next();
})