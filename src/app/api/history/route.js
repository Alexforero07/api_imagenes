// app/api/history/route.js
import connectDB from "@/lib/mongodb";
import Search from "@/models/Search";

export async function GET() {
  await connectDB();
  const history = await Search.find().sort({ date: -1 }).limit(10);
  return Response.json(history);
}
