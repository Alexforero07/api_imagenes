import axios from "axios";
import connectDB from "@/lib/mongodb";
import Search from "@/models/Search";

const BLOCKED_TERMS = [
  "sexo","sex", "porn", "puta", "mierda", "tetas", "nazi", "violacion",
  "pedofilia", "droga", "muerte", "suicidio", "gay", "homosexual",
  "nigger", "negro", "coño", "culo", "judio", "racismo","pobre",
  "poor","negro","black","african","pobreza"

];

const FILTER_PEOPLE_TERMS = [ "oscuro", "color negro"];

export async function POST(req) {
  const { term } = await req.json();
  const cleanTerm = term.trim().toLowerCase();

  await connectDB();

  //  Si está bloqueado, se guarda en BD y se responde con error
  if (BLOCKED_TERMS.includes(cleanTerm)) {
    await Search.create({
      term: cleanTerm,
      blocked: true,
      resultsCount: 0,
    });

    return Response.json(
      { error: `La búsqueda "${term}" no está permitida.` },
      { status: 403 }
    );
  }

  // 🔍 Buscar en Pixabay
  const params = {
    key: process.env.PIXABAY_API_KEY,
    q: cleanTerm,
    image_type: "photo",
    per_page: 12,
  };

  if (FILTER_PEOPLE_TERMS.includes(cleanTerm)) {
    params.category = "backgrounds";
    params.editors_choice = true;
  }

  try {
    const response = await axios.get("https://pixabay.com/api/", { params });
    let results = response.data.hits;

    if (FILTER_PEOPLE_TERMS.includes(cleanTerm)) {
      results = results.filter(
        (img) =>
          !img.tags.toLowerCase().includes("person") &&
          !img.tags.toLowerCase().includes("people") &&
          !img.tags.toLowerCase().includes("woman") &&
          !img.tags.toLowerCase().includes("man") &&
          !img.tags.toLowerCase().includes("face")
      );
    }

    // Guardar búsqueda válida
    await Search.create({
      term: cleanTerm,
      blocked: false,
      resultsCount: results.length,
    });

    return Response.json({ hits: results });
  } catch (error) {
    console.error("Error buscando en Pixabay:", error);
    return Response.json(
      { error: "Hubo un problema al obtener imágenes." },
      { status: 500 }
    );
  }
}
