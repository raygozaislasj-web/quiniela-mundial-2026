"use client";

import { useEffect } from "react";

interface Partido {
  id: number;
  local: string;
  visitante: string;
}

interface Prediccion {
  homeGoals: number | "";
  awayGoals: number | "";
  winner: string;
}

interface Props {
  partido: Partido;
  value: Prediccion;
  disabled: boolean;
  onChange: (value: Prediccion) => void;
}

export default function KnockoutMatch({
  partido,
  value,
  disabled,
  onChange,
}: Props) {
  const empate =
    value.homeGoals !== "" &&
    value.awayGoals !== "" &&
    value.homeGoals === value.awayGoals;

  useEffect(() => {
    if (
      value.homeGoals === "" ||
      value.awayGoals === ""
    )
      return;

    if (value.homeGoals > value.awayGoals) {
      if (value.winner !== partido.local) {
        onChange({
          ...value,
          winner: partido.local,
        });
      }
    }

    if (value.awayGoals > value.homeGoals) {
      if (value.winner !== partido.visitante) {
        onChange({
          ...value,
          winner: partido.visitante,
        });
      }
    }
  }, [value.homeGoals, value.awayGoals]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6">

      <div className="text-center text-lg font-bold mb-5">
        Partido #{partido.id}
      </div>

      <div className="grid grid-cols-3 items-center gap-4">

        <div className="text-center">
          <div className="font-semibold text-lg mb-2">
            {partido.local}
          </div>

          <input
            type="number"
            min={0}
            disabled={disabled}
            value={value.homeGoals}
            onChange={(e) =>
              onChange({
                ...value,
                homeGoals:
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value),
              })
            }
            className="w-20 text-center border rounded-lg p-2 text-xl"
          />
        </div>

        <div className="text-center text-2xl font-bold">
          VS
        </div>

        <div className="text-center">
          <div className="font-semibold text-lg mb-2">
            {partido.visitante}
          </div>

          <input
            type="number"
            min={0}
            disabled={disabled}
            value={value.awayGoals}
            onChange={(e) =>
              onChange({
                ...value,
                awayGoals:
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value),
              })
            }
            className="w-20 text-center border rounded-lg p-2 text-xl"
          />
        </div>

      </div>

      {!empate &&
        value.homeGoals !== "" &&
        value.awayGoals !== "" && (
          <div className="mt-6 bg-green-100 rounded-xl p-3 text-center">
            <div className="font-semibold text-green-700">
              Avanza
            </div>

            <div className="text-xl font-bold">
              {value.winner}
            </div>
          </div>
        )}

      {empate && (
        <div className="mt-6">

          <div className="font-semibold mb-3">
            Ganador en penales
          </div>

          <label className="flex items-center gap-2 mb-2">

            <input
              type="radio"
              checked={
                value.winner === partido.local
              }
              disabled={disabled}
              onChange={() =>
                onChange({
                  ...value,
                  winner: partido.local,
                })
              }
            />

            {partido.local}

          </label>

          <label className="flex items-center gap-2">

            <input
              type="radio"
              checked={
                value.winner === partido.visitante
              }
              disabled={disabled}
              onChange={() =>
                onChange({
                  ...value,
                  winner: partido.visitante,
                })
              }
            />

            {partido.visitante}

          </label>

        </div>
      )}

    </div>
  );
}