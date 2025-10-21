// app/api/search/route.js
import axios from "axios";
import connectDB from "@/lib/mongodb";
import Search from "@/models/Search";

// Listas de moderación
const BLOCKED_TERMS = [
  "sexo","marica","culo","tetas", "porn", "mierda", "puta", "coño", "nazi", "violacion", "pedofilia",
  "gay", "homosexual", "nigger", "judio", "suicidio", "droga", "muerte","sex"
];

const FILTER_PEOPLE_TERMS = [ "pobre","pobreza","black","oscuro","color negro",];

export async function POST(req) {
  const { term } = await req.json();
  await connectDB();

  const cleanTerm = term.trim().toLowerCase();

  // Bloqueo de términos
  if (BLOCKED_TERMS.includes(cleanTerm)) {
    await Search.create({ term: cleanTerm, blocked: true });
    return Response.json({
      error: `No se permite buscar contenido inapropiado o sensible: "${term}".`,
    });
  }

  // Guardar búsqueda válida
  await Search.create({ term: cleanTerm, blocked: false });

  const params = {
    key: process.env.PIXABAY_API_KEY,
    q: cleanTerm,
    image_type: "photo",
    per_page: 12,
  };

  // Filtro especial sin personas
  if (FILTER_PEOPLE_TERMS.includes(cleanTerm)) {
    params.category = "backgrounds";
    params.editors_choice = true;
  }

  try {
    const response = await axios.get("https://pixabay.com/api/", { params });
    let results = response.data.hits;

    // Si la búsqueda es sensible, eliminamos imágenes con personas
    if (FILTER_PEOPLE_TERMS.includes(cleanTerm)) {
      results = results.filter(
        (img) =>
          !img.tags.toLowerCase().includes("person") &&
          !img.tags.toLowerCase().includes("personas") &&
          !img.tags.toLowerCase().includes("mujeres") &&
          !img.tags.toLowerCase().includes("people") &&
          !img.tags.toLowerCase().includes("man") &&
          !img.tags.toLowerCase().includes("face") &&
          !img.tags.toLowerCase().includes("child") &&
          !img.tags.toLowerCase().includes("woman") 

      );
    }

    return Response.json({ hits: results });
  } catch (error) {
    console.error("Error buscando en Pixabay:", error);
    return Response.json({ error: "Hubo un problema al obtener imágenes." });
  }
}
