"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage() {
  const [term, setTerm] = useState("");
  const [images, setImages] = useState([]);
  const [history, setHistory] = useState([]);

  const searchImages = async (e) => {
    e.preventDefault();
    setImages([]);
    try {
      const res = await axios.post("/api/search", { term });
      if (res.data.error) {
        alert(res.data.error);
      } else {
        setImages(res.data.hits);
        fetchHistory();
      }
    } catch {
      alert(" Error al buscar imágenes.");
    }
  };

  const fetchHistory = async () => {
    const res = await axios.get("/api/history");
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
    {/* 🔹 Encabezado */}
    <header className="text-center mb-10">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
        Buscador de Imagenes
      </h1>
      <p className="text-gray-600 text-lg">
        Encuentra fotos impresionantes con la API de <span className="font-semibold text-blue-600">Pixabay</span>
      </p>
    </header>

    {/* 🔹 Formulario de búsqueda */}
    <form
      onSubmit={searchImages}
      className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-10"
    >
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Escribe algo como 'paisajes', 'autos', 'tecnología'..."
        className="bg-white text-black placeholder-gray-400 border border-gray-600 rounded-xl p-3 w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
        required
      />
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 transition-transform hover:scale-105"
      >
        Buscar
      </button>
    </form>

    {/* 🔹 Historial de búsquedas */}
    <section className="mb-10 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
         Ultimas búsquedas
      </h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No hay busquedas recientes.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          {history.map((h) => (
            <span
              key={h._id}
              onClick={() => setTerm(h.term)}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
                h.blocked
                  ? "bg-red-100 text-red-600 line-through"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              {h.term}
            </span>
          ))}
        </div>
      )}
    </section>

    {/* 🔹 Resultados de imágenes */}
    <section>
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-[1.02] transition duration-300"
            >
              <img
                src={img.webformatURL}
                alt={img.tags}
                className="w-full h-56 object-cover"
              />
              <div className="p-3 text-center">
                <p className="text-gray-700 text-sm font-medium truncate">{img.tags}</p>
                <p className="text-gray-500 text-xs mt-1">📸 {img.user}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No hay resultados. Intenta buscar algo diferente.
        </p>
      )}
    </section>

    {/* 🔹 Footer */}
    <footer className="text-center mt-16 text-gray-500 text-sm">
      © {new Date().getFullYear()} Pixabay Finder — Creado por <span className="font-semibold text-gray-700">AlexCompany</span>
    </footer>
  </div>
);
}
