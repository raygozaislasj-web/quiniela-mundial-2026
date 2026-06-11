"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await register(
      username,
      password
    );

    if (result.success) {
      router.push("/login");
    } else {
      setError(
        result.error ||
          "Error al registrar"
      );
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Registro
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
            minLength={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading
            ? "Registrando..."
            : "Registrarse"}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-blue-600"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}