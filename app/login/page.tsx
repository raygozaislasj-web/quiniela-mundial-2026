"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    const success = await login(
      username,
      password
    );

    if (success) {
      router.push("/dashboard");
    } else {
      setError(
        "Usuario o contraseña incorrectos"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Iniciar Sesión
      </h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block mb-2 text-black">
            Usuario
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="w-full border rounded p-2 text-black"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-black">
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full border rounded p-2 text-black"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Entrar
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link
          href="/registro"
          className="text-blue-600"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}