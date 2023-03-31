import express from 'express'
import cookieParser from 'cookie-parser'
import {config} from 'dotenv'
import {errorMiddleware} from "./middlewares/errorHandler.js"
import cors from "cors"

config({
  path: "./data/config.env"
})

export const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  methods: ["GET" , "PUT" , "POST" , "DELETE"],
  origin: [process.env.FRONT_URL_1 , process.env.FRONT_URL_2]
}))

// Import router 

import user from "./routes/user.js" // can name whatever
import product from "./routes/product.js"
import order from "./routes/order.js"

app.use('/api/user', user) // show on URL default 
app.use('/api/product' , product)
app.use('/api/order' , order)
app.use(errorMiddleware)
