// models/Search.js
import mongoose from "mongoose";

const SearchSchema = new mongoose.Schema({
  term: { type: String, required: true },
  date: { type: Date, default: Date.now },
  blocked: { type: Boolean, default: false },
});

export default mongoose.models.Search || mongoose.model("Search", SearchSchema);
