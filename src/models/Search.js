import mongoose from "mongoose";

const SearchSchema = new mongoose.Schema({
  term: { type: String, required: true },
  resultsCount: { type: Number, required: true },
  imageUrls: { type: [String], default: [] }, // 🔹 Nuevo campo
  date: { type: Date, default: Date.now },
});

// Usa el modelo si ya existe (evita errores en hot reload)
export default mongoose.models.Search || mongoose.model("Search", SearchSchema);
