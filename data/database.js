import mongoose from "mongoose";

const connectedDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`DB connected`);
  } catch (err) {
    console.log(err);
  }
};

export default connectedDB