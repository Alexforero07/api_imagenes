"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [term, setTerm] = useState("");
  const [images, setImages] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(""); // 🔹 Estado para manejar errores

  // 🔹 Cargar historial al iniciar
  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setHistory(data.history || []))
      .catch(() => console.error("Error cargando historial"));
  }, []);

  // 🔹 Buscar imágenes
  const searchImages = async (e) => {
    e.preventDefault();
    setImages([]);
    setError(""); // Limpia el error anterior

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 🚫 Mostrar error si la palabra está bloqueada
        setError(data.error || "Hubo un problema con la búsqueda.");
        return;
      }

      setImages(data.hits || []);

      // 🔹 Actualizar historial
      const histRes = await fetch("/api/history");
      const histData = await histRes.json();
      setHistory(histData.history || []);
    } catch (error) {
      setError("Hubo un error al conectar con el servidor.");
    }
  };

  // 🔹 Guardar imagen
const saveImage = async (img) => {
  try {
    const res = await fetch("/api/saveImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(img),
    });

    const data = await res.json();
    if (data.message) {
      alert(data.message);
    } else if (data.error) {
      alert("❌ " + data.error);
    }
  } catch (err) {
    console.error("Error guardando imagen:", err);
    alert("⚠️ No se pudo guardar la imagen.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
      {/* 🔹 Encabezado */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Buscador de Imágenes
        </h1>
        <p className="text-gray-600 text-lg">
          Encuentra fotos impresionantes con la API de{" "}
          <span className="font-semibold text-blue-600">Pixabay</span>
        </p>
      </header>

      {/* 🔹 Formulario */}
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

      {/* 🔹 Error */}
      {error && (
        <div className="text-center mb-8">
          <p className="bg-red-100 text-red-700 p-3 rounded-xl inline-block font-medium">
            {error}
          </p>
        </div>
      )}

      {/* 🔹 Historial */}
      <section className="mb-10 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Últimas búsquedas
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No hay búsquedas recientes.</p>
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

      {/* 🔹 Resultados */}
      <section>
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-[1.02] transition duration-300 cursor-pointer"
                onClick={() => saveImage(img)}
              >
                <img
                  src={img.webformatURL}
                  alt={img.tags}
                  className="w-full h-56 object-cover"
                />
                <div className="p-3 text-center">
                  <p className="text-gray-700 text-sm font-medium truncate">
                    {img.tags}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">📸 {img.user}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <p className="text-center text-gray-500 mt-10 text-lg">
              No hay resultados. Intenta buscar algo diferente.
            </p>
          )
        )}
      </section>

      {/* 🔹 Footer */}
      <footer className="text-center mt-16 text-gray-500 text-sm">
        © {new Date().getFullYear()} Pixabay Finder — Creado por{" "}
        <span className="font-semibold text-gray-700">AlexCompany</span>
      </footer>
    </div>
  );
}
