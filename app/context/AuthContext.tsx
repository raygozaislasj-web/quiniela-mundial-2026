"use client";

import {
createContext,
useContext,
useEffect,
useState,
ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";

type User = {
username: string;
};

type AuthContextType = {
user: User | null;
loading: boolean;
login: (
username: string,
password: string
) => Promise<boolean>;
register: (
username: string,
password: string
) => Promise<{
success: boolean;
error?: string;
}>;
logout: () => void;
};

const AuthContext = createContext<
AuthContextType | undefined

> (undefined);

function simpleHash(str: string): string {
let hash = 0;

for (let i = 0; i < str.length; i++) {
const char = str.charCodeAt(i);


hash = ((hash << 5) - hash) + char;
hash = hash & hash;


}

return hash.toString();
}

export function AuthProvider({
children,
}: {
children: ReactNode;
}) {
const [user, setUser] =
useState<User | null>(null);

const [loading, setLoading] =
useState(true);

useEffect(() => {
const savedUser =
localStorage.getItem("loggedUser");


if (savedUser) {
  setUser(JSON.parse(savedUser));
}

setLoading(false);

}, []);

const register = async (
username: string,
password: string
) => {
try {
if (!username.trim()) {
return {
success: false,
error:
"El nombre de usuario no puede estar vacío",
};
}


  if (password.length < 4) {
    return {
      success: false,
      error:
        "La contraseña debe tener al menos 4 caracteres",
    };
  }

  const { data: existente } =
    await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .maybeSingle();

  if (existente) {
    return {
      success: false,
      error: "El usuario ya existe",
    };
  }

  const { error } = await supabase
    .from("users")
    .insert([
      {
        username,
        password: simpleHash(password),
      },
    ]);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
} catch (error: any) {
  return {
    success: false,
    error:
      error?.message ||
      "Error al registrar usuario",
  };
}


};

const login = async (
username: string,
password: string
) => {
try {
const { data, error } =
await supabase
.from("users")
.select("*")
.eq("username", username)
.maybeSingle();


  if (error || !data) {
    return false;
  }

  const hashIngresado =
    simpleHash(password);

  if (
    data.password !== hashIngresado
  ) {
    return false;
  }

  const userData = {
    username: data.username,
  };

  setUser(userData);

  localStorage.setItem(
    "loggedUser",
    JSON.stringify(userData)
  );

  return true;
} catch {
  return false;
}


};

const logout = () => {
setUser(null);
localStorage.removeItem(
"loggedUser"
);
};

return (
<AuthContext.Provider
value={{
user,
loading,
login,
register,
logout,
}}
>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
const context =
useContext(AuthContext);

if (!context) {
throw new Error(
"useAuth must be used within AuthProvider"
);
}

return context;
}
