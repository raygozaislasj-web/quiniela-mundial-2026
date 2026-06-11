"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const ADMINS = ["admin"];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const [resultadosGrupos, setResultadosGrupos] =
    useState("");

  const [mensajeResultados, setMensajeResultados] =
    useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      if (loading) return;

      if (!user || !ADMINS.includes(user.username)) {
        router.push("/");
        return;
      }

      const { data: usuariosDB } = await supabase
        .from("users")
        .select("username");

      const { data: prediccionesDB } = await supabase
        .from("predictions")
        .select("username,stage");

      const usuariosConEstado =
        (usuariosDB || []).map((u) => {
          const entregoGrupos =
            prediccionesDB?.some(
              (p) =>
                p.username === u.username &&
                p.stage === "grupos"
            ) || false;

          return {
            username: u.username,
            grupos: entregoGrupos,
          };
        });

      setUsuarios(usuariosConEstado);

      const { data: resultados } = await supabase
        .from("official_results")
        .select("*")
        .eq("stage", "grupos")
        .maybeSingle();

      if (resultados) {
        setResultadosGrupos(
          JSON.stringify(
            resultados.data,
            null,
            2
          )
        );
      }

      setCargando(false);
    };

    cargarDatos();
  }, [user, loading, router]);

  const guardarResultados = async () => {
    try {
      const json =
        JSON.parse(resultadosGrupos);

      const { data: existente } =
        await supabase
          .from("official_results")
          .select("id")
          .eq("stage", "grupos")
          .maybeSingle();

      let error = null;

      if (existente) {
        const respuesta = await supabase
          .from("official_results")
          .update({
            data: json,
          })
          .eq("id", existente.id);

        error = respuesta.error;
      } else {
        const respuesta = await supabase
          .from("official_results")
          .insert([
            {
              stage: "grupos",
              data: json,
            },
          ]);

        error = respuesta.error;
      }

      if (error) {
        console.error(error);
        setMensajeResultados(
          "❌ Error al guardar"
        );
        return;
      }

      setMensajeResultados(
        "✅ Resultados guardados correctamente"
      );
    } catch {
      setMensajeResultados(
        "❌ JSON inválido"
      );
    }
  };

  if (loading || cargando) {
    return (
      <div className="p-10 text-center">
        Cargando...
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold">
        🔧 Panel Admin
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">
          👥 Usuarios
        </h2>

        <div className="space-y-3">
          {usuarios.map((usuario) => (
            <div
              key={usuario.username}
              className="flex justify-between border p-4 rounded-lg"
            >
              <span>
                {usuario.username}
              </span>

              <span>
                {usuario.grupos
                  ? "✅ Entregó grupos"
                  : "❌ Pendiente"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          🏆 Resultados Oficiales
        </h2>

        <p className="text-gray-600 mb-4">
          Pega aquí el resultado oficial de
          los grupos.
        </p>

        <textarea
          value={resultadosGrupos}
          onChange={(e) =>
            setResultadosGrupos(
              e.target.value
            )
          }
          className="w-full h-96 border rounded-lg p-4 font-mono"
          placeholder={`{
  "A": [
    "México",
    "Uruguay",
    "Corea del Sur",
    "República Checa"
  ],
  "B": [
    "Suiza",
    "Canadá",
    "Qatar",
    "Bosnia y Herzegovina"
  ]
}`}
        />

        <button
          onClick={guardarResultados}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Guardar Resultados Oficiales
        </button>

        {mensajeResultados && (
          <p className="mt-4 font-semibold">
            {mensajeResultados}
          </p>
        )}
      </div>
    </main>
  );
}
