"use client";

import { useState, useEffect } from "react";
import { grupos } from "../data/grupos";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabase";
import GrupoSortable from "../components/GrupoSortable";

export default function GruposPage() {
  const { user } = useAuth();

  const [predicciones, setPredicciones] = useState(
    Object.fromEntries(
      grupos.map((g) => [g.letra, [...g.equipos]])
    )
  );

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [yaEntrego, setYaEntrego] = useState(false);
  const [cargando, setCargando] = useState(true);

  const FECHA_CIERRE = new Date(
    "2026-06-12T13:00:00"
  );

  const [tiempoRestante, setTiempoRestante] =
    useState("");

  const cerrado =
    new Date() > FECHA_CIERRE;

  useEffect(() => {
    const cargarPrediccion = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("predictions")
        .select("*")
        .eq("username", user.username)
        .eq("stage", "grupos")
        .maybeSingle();

      if (data) {
        setPredicciones(data.data);
        setYaEntrego(true);
        setMensaje(
          "✅ Ya entregaste tu predicción"
        );
      }

      setCargando(false);
    };

    cargarPrediccion();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = new Date();

      const diferencia =
        FECHA_CIERRE.getTime() -
        ahora.getTime();

      if (diferencia <= 0) {
        setTiempoRestante(
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

      setTiempoRestante(
        `${dias}d ${horas}h ${minutos}m`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const guardarPrediccion = async () => {
    if (
      !user ||
      yaEntrego ||
      cerrado
    )
      return;

    setGuardando(true);
    setMensaje("");

    const { error } = await supabase
      .from("predictions")
      .insert([
        {
          username: user.username,
          stage: "grupos",
          data: predicciones,
        },
      ]);

    if (error) {
      console.error(error);
      setMensaje("❌ Error al guardar");
    } else {
      setYaEntrego(true);
      setMensaje(
        "✅ Predicción guardada correctamente"
      );
    }

    setGuardando(false);
  };

  if (cargando) {
    return (
      <div className="text-center mt-10">
        Cargando...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">
        📋 Fase de Grupos
      </h1>

      <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 mb-8">
        <div className="font-bold">
          ⏳ Cierre de pronósticos
        </div>

        <div className="text-xl mt-2">
          {cerrado
            ? "🔒 Pronósticos cerrados"
            : tiempoRestante}
        </div>
      </div>

      <p className="mb-8 text-gray-600">
        Arrastra los equipos para
        ordenar cómo crees que
        terminarán los grupos.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grupos.map((grupo) => (
          <div
            key={grupo.letra}
            className="bg-white shadow-lg rounded-2xl p-5"
          >
            <h2 className="text-2xl font-bold mb-4">
              Grupo {grupo.letra}
            </h2>

            <GrupoSortable
              equipos={
                predicciones[
                  grupo.letra
                ]
              }
              disabled={
                yaEntrego ||
                cerrado
              }
              onChange={(
                nuevosEquipos
              ) => {
                setPredicciones({
                  ...predicciones,
                  [grupo.letra]:
                    nuevosEquipos,
                });
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        {!yaEntrego ? (
          <button
            onClick={
              guardarPrediccion
            }
            disabled={
              guardando ||
              cerrado
            }
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {guardando
              ? "Guardando..."
              : "Guardar Predicción"}
          </button>
        ) : (
          <div className="inline-block bg-green-100 text-green-700 px-6 py-4 rounded-xl font-bold">
            ✅ Predicción enviada
          </div>
        )}

        {mensaje && (
          <p className="mt-4 font-semibold">
            {mensaje}
          </p>
        )}
      </div>
    </main>
  );
}