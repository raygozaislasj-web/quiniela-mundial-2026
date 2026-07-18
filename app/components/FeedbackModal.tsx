"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabase";

interface Props {
  children: ReactNode;
}

export default function FeedbackModal({ children }: Props) {
  const { user } = useAuth();

  const [mostrar, setMostrar] = useState(false);
  const [agradecimiento, setAgradecimiento] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState("");
  const [improve, setImprove] = useState("");

  useEffect(() => {
    if (!user) return;
    verificar();
  }, [user]);

  async function verificar() {
    setCargando(true);

    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("username", user?.username)
      .maybeSingle();

    if (error) {
      console.error("Error verificando feedback:", error);
    }

    if (!data) {
      setMostrar(true);
    }

    setCargando(false);
  }

  async function enviar() {
    if (!user?.username) {
      alert("No se encontró el usuario.");
      return;
    }

    if (rating === 0) {
      alert("Selecciona una calificación.");
      return;
    }

    setEnviando(true);

    const { error } = await supabase
      .from("feedback")
      .insert([
        {
          username: user.username,
          rating,
          liked,
          improve,
        },
      ]);

    if (error) {
      console.error(error);

      alert(
        `Error al guardar\n\nMensaje: ${error.message}\nCódigo: ${
          error.code ?? "Sin código"
        }`
      );

      setEnviando(false);
      return;
    }

    setAgradecimiento(true);
    setEnviando(false);
  }

  if (cargando) {
    return <>{children}</>;
  }

  if (!mostrar) {
    return <>{children}</>;
  }

  if (agradecimiento) {
        return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">

          <div className="space-y-4 text-gray-700">

            <div className="flex justify-center text-7xl mb-2">
              🏆
            </div>

            <p className="text-center text-xl font-bold text-green-700">
              ¡El que gane , que invite un six!
            </p>

            <p>
              Hola <strong>{user?.username}</strong>.
            </p>

            <p>
              Antes que nada quiero agradecerte por participar en la
              <strong> Quiniela Mundial 2026.</strong>
            </p>

            <p>
              Si pusiste cosas malas , quiero decirte que tu opinion
              <strong> ¡ME VALE MADRES!</strong>,Si fue algo bueno
              <strong>¡Diosito y la virgen te cuiden!</strong>.
            </p>

            <p>
              Por ultimo quisiera recordarte que:
              <p>LA DECIMA YA DUERME EN LA NORIAAAAAAA 🐰🏆</p>
              <p>PUMAS NO VA HACER NUNCA CAMPEON DE LA LIGA</p>
              Y 
              ¡QUE CHINGUE A SU MADRE EL AMERICA , PINCHES MUGROSOS!
            </p>

            <p>
              Tu opinión es muy importante nene .
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">

              <p className="font-semibold text-green-700 text-lg">
                🐰 ¡Ahora sí!
              </p>

              <p className="mt-2">
                Disfruta de esta ultima fase y atinale al pronostico...
              </p>

              <p className="mt-3 text-2xl font-bold text-yellow-600">
                🏆 ¡Que gane el mejor! 🏆
              </p>

            </div>

          </div>

          <button
            onClick={() => setMostrar(false)}
            className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
          >
            Comenzar mis pronósticos
          </button>

        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">

          <h1 className="text-3xl font-bold text-center mb-2">
            ⭐ Alto pito CHICO ⭐
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Tu opinión me ayudará a mejorar en futuras versiones 
          </p>

          <h2 className="font-semibold mb-4">
            ¿Qué calificación le das a la página?
          </h2>

          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-5xl transition ${
                  rating >= n
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <label className="font-semibold block mb-2">
            ¿Qué fue lo que más te gustó y porque mi RIATA?
          </label>

          <textarea
            value={liked}
            onChange={(e) => setLiked(e.target.value)}
            rows={4}
            className="w-full border rounded-xl p-3 mb-6"
            placeholder="Escribe aquí tu respuesta..."
          />

          <label className="font-semibold block mb-2">
            ¿Quien se llevara el primer lugar del Ranking? (quitandote)
          </label>

          <textarea
            value={improve}
            onChange={(e) => setImprove(e.target.value)}
            rows={4}
            className="w-full border rounded-xl p-3"
            placeholder="Quien sera el ultimo del ranking porque no le sabe..."
          />

          <button
            onClick={enviar}
            disabled={enviando}
            className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar opinión"}
          </button>

        </div>

      </div>

      {children}
    </>
  );
}