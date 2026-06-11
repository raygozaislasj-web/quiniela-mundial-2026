"use client";

import { useState, useEffect } from "react";
import { grupos } from "../data/grupos";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabase";

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
  "2026-06-11T13:00:00"
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
        setMensaje("✅ Ya entregaste tu predicción");
      }

      setCargando(false);
    };

    cargarPrediccion();
  }, [user]);

  const mover = (
    grupo: string,
    index: number,
    direccion: "up" | "down"
  ) => {
    if (yaEntrego) return;

    const copia = {
      ...predicciones,
    };

    const equipos = [...copia[grupo]];

    if (direccion === "up" && index > 0) {
      [equipos[index], equipos[index - 1]] = [
        equipos[index - 1],
        equipos[index],
      ];
    }

    if (
      direccion === "down" &&
      index < equipos.length - 1
    ) {
      [equipos[index], equipos[index + 1]] = [
        equipos[index + 1],
        equipos[index],
      ];
    }

    copia[grupo] = equipos;

    setPredicciones(copia);
  };

  const guardarPrediccion = async () => {
    if (!user || yaEntrego) return;

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
      <h1 className="text-4xl font-bold mb-8">
        📋 Fase de Grupos
      </h1>

      <p className="mb-8 text-gray-600">
        Ordena los equipos según cómo crees
        que terminarán los grupos.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grupos.map((grupo) => (
          <div
            key={grupo.letra}
            className="bg-white shadow rounded-xl p-4"
          >
            <h2 className="text-2xl font-bold mb-4">
              Grupo {grupo.letra}
            </h2>

            {predicciones[grupo.letra].map(
              (equipo, index) => (
                <div
                  key={equipo}
                  className="flex items-center justify-between border rounded-lg p-2 mb-2"
                >
                  <span>
                    {index + 1}. {equipo}
                  </span>

                  <div className="flex gap-2">
                    <button
                      disabled={yaEntrego}
                      onClick={() =>
                        mover(
                          grupo.letra,
                          index,
                          "up"
                        )
                      }
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-40"
                    >
                      ⬆️
                    </button>

                    <button
                      disabled={yaEntrego}
                      onClick={() =>
                        mover(
                          grupo.letra,
                          index,
                          "down"
                        )
                      }
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-40"
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        {!yaEntrego ? (
          <button
            onClick={guardarPrediccion}
            disabled={guardando}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700"
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