"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const FECHA_CIERRE = new Date(
    "2026-06-11T13:00:00"
  );

  const [tiempo, setTiempo] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = new Date();

      const diferencia =
        FECHA_CIERRE.getTime() -
        ahora.getTime();

      if (diferencia <= 0) {
        setTiempo("🔒 Pronósticos cerrados");
        return;
      }

      const dias = Math.floor(
        diferencia /
          (1000 * 60 * 60 * 24)
      );

      const horas = Math.floor(
        (diferencia %
          (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );

      const minutos = Math.floor(
        (diferencia %
          (1000 * 60 * 60)) /
          (1000 * 60)
      );

      setTiempo(
        `${dias}d ${horas}h ${minutos}m`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-2xl">

        <h1 className="text-5xl font-bold mb-6 text-black">
          🏆 Quiniela Mundial 2026
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Compite con tus amigos y demuestra
          quién sabe más de fútbol.
        </p>

        <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 mb-8">
          <div className="font-bold">
            ⏳ Cierre de pronósticos
          </div>

          <div className="text-xl mt-2">
            {tiempo}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/registro"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Registrarse
          </Link>

          <Link
            href="/login"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </main>
  );
}