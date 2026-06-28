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

  // ======== GRUPOS ========

  const [resultadosGrupos, setResultadosGrupos] =
    useState("");

  const [mensajeGrupos, setMensajeGrupos] =
    useState("");

  // ======== DIECISEISAVOS ========

  const [resultados16, setResultados16] =
    useState("");

  const [mensaje16, setMensaje16] =
    useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      if (loading) return;

      if (
        !user ||
        !ADMINS.includes(user.username)
      ) {
        router.push("/");
        return;
      }

      // Usuarios

      const { data: usuariosDB } =
        await supabase
          .from("users")
          .select("username");

      const {
        data: prediccionesDB,
      } = await supabase
        .from("predictions")
        .select("username,stage");

      const usuariosConEstado =
        (usuariosDB || []).map((u) => {
          return {
            username: u.username,

            grupos:
              prediccionesDB?.some(
                (p) =>
                  p.username ===
                    u.username &&
                  p.stage ===
                    "grupos"
              ) || false,

            dieciseisavos:
              prediccionesDB?.some(
                (p) =>
                  p.username ===
                    u.username &&
                  p.stage ===
                    "dieciseisavos"
              ) || false,
          };
        });

      setUsuarios(
        usuariosConEstado
      );

      // Resultados grupos

      const {
        data:
          resultadosGruposDB,
      } = await supabase
        .from(
          "official_results"
        )
        .select("*")
        .eq(
          "stage",
          "grupos"
        )
        .maybeSingle();

      if (
        resultadosGruposDB
      ) {
        setResultadosGrupos(
          JSON.stringify(
            resultadosGruposDB.data,
            null,
            2
          )
        );
      }

      // Resultados 16vos

      const {
        data:
          resultados16DB,
      } = await supabase
        .from(
          "official_results"
        )
        .select("*")
        .eq(
          "stage",
          "dieciseisavos"
        )
        .maybeSingle();

      if (
        resultados16DB
      ) {
        setResultados16(
          JSON.stringify(
            resultados16DB.data,
            null,
            2
          )
        );
      }

      setCargando(false);
    };

    cargarDatos();
  }, [loading, user, router]);

  const guardarResultados =
    async (
      stage: string,
      texto: string,
      setMensaje: any
    ) => {
      try {
        const json =
          JSON.parse(texto);

        const {
          data: existente,
        } = await supabase
          .from(
            "official_results"
          )
          .select("id")
          .eq(
            "stage",
            stage
          )
          .maybeSingle();

        let error = null;

        if (existente) {
          const respuesta =
            await supabase
              .from(
                "official_results"
              )
              .update({
                data: json,
              })
              .eq(
                "id",
                existente.id
              );

          error =
            respuesta.error;
        } else {
          const respuesta =
            await supabase
              .from(
                "official_results"
              )
              .insert([
                {
                  stage,
                  data: json,
                },
              ]);

          error =
            respuesta.error;
        }

        if (error) {
          setMensaje(
            "❌ Error al guardar"
          );
          return;
        }

        setMensaje(
          "✅ Resultados guardados"
        );
      } catch {
        setMensaje(
          "❌ JSON inválido"
        );
      }
    };

  if (loading || cargando) {
    return (
      <div className="text-center mt-10">
        Cargando...
      </div>
    );
  }
    return (
    <main className="max-w-7xl mx-auto p-8 space-y-8">

      <h1 className="text-4xl font-bold">
        🔧 Panel de Administración
      </h1>

      {/* USUARIOS */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          👥 Usuarios
        </h2>

        <div className="space-y-3">

          {usuarios.map((usuario) => (

            <div
              key={usuario.username}
              className="border rounded-xl p-4 flex justify-between items-center"
            >

              <div className="font-semibold">
                {usuario.username}
              </div>

              <div className="flex gap-6 text-sm">

                <span>

                  Grupos:

                  {" "}

                  {usuario.grupos
                    ? "✅"
                    : "❌"}

                </span>

                <span>

                  16vos:

                  {" "}

                  {usuario.dieciseisavos
                    ? "✅"
                    : "❌"}

                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* RESULTADOS GRUPOS */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          🏆 Resultados Oficiales - Grupos
        </h2>

        <textarea
          value={resultadosGrupos}
          onChange={(e) =>
            setResultadosGrupos(
              e.target.value
            )
          }
          className="w-full h-80 border rounded-lg p-4 font-mono"
        />

        <button
          onClick={() =>
            guardarResultados(
              "grupos",
              resultadosGrupos,
              setMensajeGrupos
            )
          }
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >

          Guardar Resultados

        </button>

        {mensajeGrupos && (

          <p className="mt-4 font-semibold">

            {mensajeGrupos}

          </p>

        )}

      </div>

      {/* RESULTADOS 16VOS */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          ⚽ Resultados Oficiales - Dieciseisavos
        </h2>

        <p className="text-gray-600 mb-3">

          Ejemplo:

        </p>

<pre className="bg-gray-100 rounded-lg p-3 text-sm overflow-auto mb-4">
{`{
  "79": {
    "homeGoals":2,
    "awayGoals":1,
    "winner":"México"
  },
  "80":{
    "homeGoals":1,
    "awayGoals":1,
    "winner":"Inglaterra"
  }
}`}
</pre>

        <textarea
          value={resultados16}
          onChange={(e)=>
            setResultados16(
              e.target.value
            )
          }
          className="w-full h-80 border rounded-lg p-4 font-mono"
        />

        <button
          onClick={() =>
            guardarResultados(
              "dieciseisavos",
              resultados16,
              setMensaje16
            )
          }
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
        >

          Guardar Resultados

        </button>

        {mensaje16 && (

          <p className="mt-4 font-semibold">

            {mensaje16}

          </p>

        )}

      </div>

    </main>

  );

}