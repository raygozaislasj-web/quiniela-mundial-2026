"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const ADMINS = ["admin"];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const FECHA_CIERRE = new Date(
    "2026-06-11T13:00:00"
  );

  const [tiempo, setTiempo] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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

  if (loading) {
    return (
      <div className="text-center mt-10">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const esAdmin =
    ADMINS.includes(user.username);

  return (
    <main className="max-w-5xl mx-auto p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          🏆 Quiniela Mundial 2026
        </h1>

        <p className="text-gray-600 mt-2">
          Bienvenido, {user.username}
        </p>
      </div>

      <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 mb-8">
        <div className="font-bold">
          ⏳ Cierre de pronósticos
        </div>

        <div className="text-xl mt-2">
          {tiempo}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <Link
          href="/grupos"
          className="bg-blue-600 text-white p-8 rounded-2xl hover:bg-blue-700 transition"
        >
          <div className="text-3xl mb-2">
            📋
          </div>

          <div className="text-2xl font-bold">
            Fase de Grupos
          </div>

          <div className="mt-2 text-blue-100">
            Realiza tu predicción.
          </div>
        </Link>

        <Link
          href="/ranking"
          className="bg-yellow-500 text-white p-8 rounded-2xl hover:bg-yellow-600 transition"
        >
          <div className="text-3xl mb-2">
            🏆
          </div>

          <div className="text-2xl font-bold">
            Ranking
          </div>

          <div className="mt-2 text-yellow-100">
            Consulta la clasificación.
          </div>
        </Link>

        {esAdmin && (
          <Link
            href="/admin"
            className="bg-red-600 text-white p-8 rounded-2xl hover:bg-red-700 transition md:col-span-2"
          >
            <div className="text-3xl mb-2">
              🔧
            </div>

            <div className="text-2xl font-bold">
              Panel de Administración
            </div>

            <div className="mt-2 text-red-100">
              Gestiona usuarios y resultados oficiales.
            </div>
          </Link>
        )}
      </div>

      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="mt-8 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
      >
        Cerrar Sesión
      </button>

    </main>
  );
}