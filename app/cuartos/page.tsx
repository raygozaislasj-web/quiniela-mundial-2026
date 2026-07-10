"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabase";
import KnockoutMatch from "../components/KnockoutMatch";
import { partidos } from "../data/cuartos";

export default function CuartosPage() {
  const { user } = useAuth();

  const FECHA_CIERRE = new Date(
    "2026-07-10T13:10:00"
  );

  const cerrado =
    new Date() > FECHA_CIERRE;

  const [tiempoRestante, setTiempoRestante] =
    useState("");

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  const [yaEntrego, setYaEntrego] =
    useState(false);

  const [cargando, setCargando] =
    useState(true);

  const [predicciones, setPredicciones] =
    useState(() => {
      const inicial: any = {};

      partidos.forEach((p) => {
        inicial[p.id] = {
          homeGoals: "",
          awayGoals: "",
          winner: "",
        };
      });

      return inicial;
    });

  useEffect(() => {
    const cargar = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("predictions")
        .select("*")
        .eq("username", user.username)
        .eq("stage", "cuartos")
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

    cargar();
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

    return () =>
      clearInterval(interval);
  }, []);

  const guardarPrediccion =
    async () => {
      if (
        !user ||
        yaEntrego ||
        cerrado
      )
        return;

      setGuardando(true);
      setMensaje("");

      const { error } =
        await supabase
          .from("predictions")
          .insert([
            {
              username:
                user.username,
              stage: "cuartos",
              data: predicciones,
            },
          ]);

      if (error) {
        console.error(error);

        setMensaje(
          "❌ Error al guardar"
        );
      } else {
        setYaEntrego(true);

        setMensaje(
          "✅ Predicción guardada"
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
        ⚽ Cuartos de Final
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

      <p className="text-gray-600 mb-8">
        Pronostica el marcador de los Cuartos de Final.
        Si el partido termina empatado, selecciona quién
        avanza a semifinales.
      </p>

      <div className="grid md:grid-cols-2 gap-6">

        {partidos.map((partido) => (

          <KnockoutMatch
            key={partido.id}
            partido={partido}
            disabled={
              yaEntrego || cerrado
            }
            value={predicciones[partido.id]}
            onChange={(nuevoValor) =>

              setPredicciones({
                ...predicciones,

                [partido.id]:
                  nuevoValor,

              })

            }
          />

        ))}

      </div>

      <div className="mt-10 text-center">

        {!yaEntrego ? (

          <button
            onClick={guardarPrediccion}
            disabled={
              guardando ||
              cerrado
            }
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-xl disabled:opacity-50"
          >

            {guardando
              ? "Guardando..."
              : "Guardar Pronósticos"}

          </button>

        ) : (

          <div className="inline-block bg-green-100 text-green-700 px-6 py-4 rounded-xl font-bold">

            ✅ Pronósticos enviados

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