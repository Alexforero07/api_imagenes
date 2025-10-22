import connectDB from "@/lib/mongodb";
import Image from "@/models/Image";

export async function POST(req) {
  try {
    const data = await req.json();
    await connectDB();

    const { id, webformatURL, tags, user, downloads, likes, views } = data;

    // Evita duplicados (si ya fue guardada antes)
    const exists = await Image.findOne({ idPixabay: id });
    if (exists) {
      return Response.json({ message: "📸 Imagen ya guardada previamente." });
    }

    const newImage = await Image.create({
      idPixabay: id,
      url: webformatURL,
      tags,
      user,
      downloads,
      likes,
      views,
    });

    console.log("✅ Imagen guardada:", newImage);
    return Response.json({ message: "✅ Imagen guardada correctamente." });
  } catch (error) {
    console.error("❌ Error al guardar imagen:", error);
    return Response.json({ error: "Error al guardar la imagen." }, { status: 500 });
  }
}
