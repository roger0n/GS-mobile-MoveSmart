import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Usuario } from "../mocks/usuarios";

import {
  buscarUsuarioSalvo,
  removerUsuario,
  salvarUsuario,
  validarCredenciais,
} from "../services/authService";

type AuthContextType = {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<boolean>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarSessao() {
      try {
        const usuarioSalvo = await buscarUsuarioSalvo();

        if (ativo) {
          setUsuario(usuarioSalvo);
        }
      } catch {
        if (ativo) {
          setUsuario(null);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarSessao();

    return () => {
      ativo = false;
    };
  }, []);

  async function entrar(email: string, senha: string) {
    const usuarioEncontrado = await validarCredenciais(email, senha);

    if (!usuarioEncontrado) {
      return false;
    }

    await salvarUsuario(usuarioEncontrado);
    setUsuario(usuarioEncontrado);

    return true;
  }

  async function sair() {
    await removerUsuario();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve estar dentro do AuthProvider");
  }

  return contexto;
}
