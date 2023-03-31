import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: [true , "Name is exsisted"]
  } ,
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true , "Email is exsisted"],
    validate: validator.isEmail
  } ,
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8 , "Password must be at least 8 characters"],
    select: false
  } ,
  city: {
    type: String,
    required: true
  } ,
  country: {
    type: String,
    required: true
  },
  pinCode: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['admin' , 'user'],
    default: 'user',
  },
  avatar: {
    public_id: String,
    url: String
  },
  opt: Number,
  opt_expire: Date,
  }
 , {collection: "User"})


schema.pre("save" , async function (next) {
  if(!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password , salt)
    this.password = hash
    next();
  } catch(err) {
    console.log(err)
    return next(err)

  }
})

schema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword , this.password)
  } catch(err) {
    console.log(err)
  }
}

schema.methods.generateToken =  function () {
  return jwt.sign({_id: this._id} , process.env.JWT_SERCET , {expiresIn: "7d"} )
}

export const User = mongoose.model("User" , schema)