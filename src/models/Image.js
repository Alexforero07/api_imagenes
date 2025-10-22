import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  idPixabay: { type: Number, required: true },
  url: { type: String, required: true },
  tags: { type: String },
  user: { type: String },
  downloads: { type: Number },
  likes: { type: Number },
  views: { type: Number },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
