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
    "2026-07-04T11:00:00"
  );

  const [tiempo, setTiempo] =
    useState("");

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
        setTiempo(
          "🔒 Pronósticos cerrados"
        );
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

    return () =>
      clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10">
        Cargando...
      </div>
    );
  }

  if (!user) return null;

  const esAdmin =
    ADMINS.includes(user.username);
      return (
    <main className="max-w-6xl mx-auto p-8">

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
          ⏳ Próximo cierre
        </div>

        <div className="text-xl mt-2">
          {tiempo}
        </div>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <Link
          href="/grupos"
          className="bg-blue-600 text-white p-8 rounded-2xl hover:bg-blue-700 transition"
        >
          <div className="text-4xl">
            📋
          </div>

          <h2 className="text-2xl font-bold mt-4">
            Fase de Grupos
          </h2>

          <p className="mt-3 text-blue-100">
            Consulta tu predicción de la fase de grupos.
          </p>
        </Link>

        <Link
          href="/dieciseisavos"
          className="bg-purple-600 text-white p-8 rounded-2xl hover:bg-purple-700 transition"
        >
          <div className="text-4xl">
            ⚽
          </div>

          <h2 className="text-2xl font-bold mt-4">
            Dieciseisavos
          </h2>

          <p className="mt-3 text-purple-100">
            Pronostica los partidos de dieciseisavos.
          </p>
        </Link>

        <Link
          href="/octavos"
          className="bg-indigo-600 text-white p-8 rounded-2xl hover:bg-indigo-700 transition"
        >
          <div className="text-4xl">
            ⚽
          </div>

          <h2 className="text-2xl font-bold mt-4">
            Octavos
          </h2>

          <p className="mt-3 text-indigo-100">
            Pronostica los partidos de octavos.
          </p>
        </Link>

        <Link
          href="/ranking"
          className="bg-yellow-500 text-white p-8 rounded-2xl hover:bg-yellow-600 transition"
        >
          <div className="text-4xl">
            🏆
          </div>

          <h2 className="text-2xl font-bold mt-4">
            Ranking
          </h2>

          <p className="mt-3 text-yellow-100">
            Consulta la clasificación general.
          </p>
        </Link>

        {esAdmin && (
          <Link
            href="/admin"
            className="bg-red-600 text-white p-8 rounded-2xl hover:bg-red-700 transition"
          >
            <div className="text-4xl">
              🔧
            </div>

            <h2 className="text-2xl font-bold mt-4">
              Panel Admin
            </h2>

            <p className="mt-3 text-red-100">
              Gestiona usuarios y resultados oficiales.
            </p>
          </Link>
        )}

      </div>

      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="mt-10 bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700"
      >
        Cerrar Sesión
      </button>

    </main>
  );
}