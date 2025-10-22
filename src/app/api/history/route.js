import connectDB from "@/lib/mongodb";
import Search from "@/models/Search";

export async function GET() {
  await connectDB();

  try {
    const history = await Search.find().sort({ date: -1 }).limit(10);
    return Response.json({ history });
  } catch (error) {
    console.error("Error al obtener el historial:", error);
    return Response.json({ history: [] });
  }
}
