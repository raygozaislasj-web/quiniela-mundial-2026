"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const ADMINS = ["admin"];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <nav className="bg-slate-900 text-white px-6 py-4">
        Cargando...
      </nav>
    );
  }

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/dashboard"
          className="text-xl font-bold"
        >
          🏆 Quiniela Mundial 2026
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <Link
                href="/dashboard"
                className="hover:text-yellow-300"
              >
                🏠 Inicio
              </Link>

              <Link
                href="/grupos"
                className="hover:text-yellow-300"
              >
                📋 Grupos
              </Link>

              <Link
                href="/ranking"
                className="hover:text-yellow-300"
              >
                🏆 Ranking
              </Link>

              {ADMINS.includes(
                user.username
              ) && (
                <Link
                  href="/admin"
                  className="hover:text-red-300"
                >
                  🔧 Admin
                </Link>
              )}

              <span className="bg-slate-700 px-3 py-1 rounded-lg">
                👤 {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700"
              >
                Salir
              </button>
            </>
          )}

          {!user && (
            <>
              <Link
                href="/login"
                className="hover:text-yellow-300"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/registro"
                className="bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}