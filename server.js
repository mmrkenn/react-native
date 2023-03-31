import { app } from "./app.js";
import connectedDB from "./data/database.js"
import cloudinary from "cloudinary"

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME , 
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET , 
})

app.listen(process.env.PORT, () => {
  console.log(`Server is now listening ${process.env.PORT} in ${process.env.NODE_ENV} MODE `);
});

connectedDB();