export type Perfil = "cidadao" | "agente";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
};

type UsuarioTeste = Usuario & {
  senha: string;
};

export const usuariosTeste: UsuarioTeste[] = [
  {
    id: 1,
    nome: "João Silva",
    email: "cidadao@movesmart.com",
    senha: "12345678",
    perfil: "cidadao",
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    email: "agente@movesmart.com",
    senha: "12345678",
    perfil: "agente",
  },
];
