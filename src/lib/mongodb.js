// lib/mongodb.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🟢 MongoDB conectado");
  } catch (err) {
    console.error("🔴 Error al conectar MongoDB:", err);
  }
};

export default connectDB;
