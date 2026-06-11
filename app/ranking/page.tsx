"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UsuarioRanking = {
  username: string;
  puntos: number;
};

export default function RankingPage() {
  const [ranking, setRanking] = useState<UsuarioRanking[]>([]);
  const [cargando, setCargando] = useState(true);
  const [hayResultados, setHayResultados] =
    useState(false);

  useEffect(() => {
    const calcularRanking = async () => {
      const { data: resultadosOficiales } =
        await supabase
          .from("official_results")
          .select("*")
          .eq("stage", "grupos")
          .maybeSingle();

      if (!resultadosOficiales) {
        setHayResultados(false);
        setCargando(false);
        return;
      }

      setHayResultados(true);

      const oficiales =
        resultadosOficiales.data;

      const { data: predicciones } =
        await supabase
          .from("predictions")
          .select("*")
          .eq("stage", "grupos");

      const resultados: UsuarioRanking[] =
        [];

      for (const prediccion of
        predicciones || []) {

        let puntos = 0;

        const usuario =
          prediccion.username;

        const gruposUsuario =
          prediccion.data;

        Object.keys(oficiales).forEach(
          (grupo) => {
            const oficial =
              oficiales[grupo];

            const usuarioGrupo =
              gruposUsuario[grupo];

            if (
              !oficial ||
              !usuarioGrupo
            ) {
              return;
            }

            const clasificadosOficial =
              [
                oficial[0],
                oficial[1],
              ];

            const clasificadosUsuario =
              [
                usuarioGrupo[0],
                usuarioGrupo[1],
              ];

            const aciertaClasificados =
              clasificadosOficial.every(
                (equipo: string) =>
                  clasificadosUsuario.includes(
                    equipo
                  )
              );

            if (
              aciertaClasificados
            ) {
              puntos += 10;

              if (
                oficial[0] ===
                  usuarioGrupo[0] &&
                oficial[1] ===
                  usuarioGrupo[1]
              ) {
                puntos += 5;
              }
            }
          }
        );

        resultados.push({
          username: usuario,
          puntos,
        });
      }

      resultados.sort(
        (a, b) =>
          b.puntos - a.puntos
      );

      setRanking(resultados);
      setCargando(false);
    };

    calcularRanking();
  }, []);

  if (cargando) {
    return (
      <div className="text-center py-10">
        Cargando ranking...
      </div>
    );
  }

  if (!hayResultados) {
    return (
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6">
          🏆 Ranking Fase de Grupos
        </h1>

        <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6">
          ⏳ Aún no se han publicado los
          resultados oficiales.
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        🏆 Ranking Fase de Grupos
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {ranking.map(
          (usuario, index) => (
            <div
              key={usuario.username}
              className="flex justify-between items-center p-5 border-b last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : "🏅"}
                </span>

                <div>
                  <div className="font-bold text-lg">
                    {
                      usuario.username
                    }
                  </div>

                  <div className="text-gray-500 text-sm">
                    Lugar #
                    {index + 1}
                  </div>
                </div>
              </div>

              <div className="text-2xl font-bold text-blue-600">
                {usuario.puntos} pts
              </div>
            </div>
          )
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h2 className="font-bold mb-2">
          Sistema de puntuación
        </h2>

        <ul className="list-disc ml-5">
          <li>
            10 puntos por acertar
            los dos clasificados.
          </li>

          <li>
            5 puntos extra por
            acertar el orden exacto.
          </li>
        </ul>
      </div>
    </main>
  );
}