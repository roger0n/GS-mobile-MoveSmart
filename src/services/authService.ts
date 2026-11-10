import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

import { Usuario, usuariosTeste } from "../mocks/usuarios";

const CHAVE_USUARIO = "@movesmart:usuario";
const CHAVE_CONTAS = "@movesmart:contas";

// Estrutura das contas cadastradas localmente
type ContaLocal = {
  usuario: Usuario;
  salt: string;
  senhaHash: string;
};

// Busca as contas criadas pelo usuário
async function listarContasLocais(): Promise<ContaLocal[]> {
  const dados = await AsyncStorage.getItem(CHAVE_CONTAS);

  if (!dados) {
    return [];
  }

  const contas: unknown = JSON.parse(dados);

  if (!Array.isArray(contas)) {
    throw new Error("Dados de contas inválidos.");
  }

  return contas as ContaLocal[];
}

// Gera o hash da senha
async function gerarHash(senha: string, salt: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${senha}`,
  );
}

// Cadastra um novo cidadão
export async function cadastrarCidadao(
  nome: string,
  email: string,
  senha: string,
): Promise<Usuario> {
  const nomeLimpo = nome.trim().replace(/\s+/g, " ");
  const emailLimpo = email.trim().toLowerCase();

  // Valida o nome
  if (nomeLimpo.length < 3 || nomeLimpo.length > 80) {
    throw new Error("O nome deve ter entre 3 e 80 caracteres.");
  }

  // Valida o e-mail
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoEmail.test(emailLimpo)) {
    throw new Error("Digite um e-mail válido.");
  }

  // Valida a senha
  if (senha.length < 8 || senha.length > 72) {
    throw new Error("A senha deve ter entre 8 e 72 caracteres.");
  }

  const contas = await listarContasLocais();

  // Verifica se o e-mail já está cadastrado
  const emailExistente =
    usuariosTeste.some(
      (usuario) => usuario.email.toLowerCase() === emailLimpo,
    ) || contas.some((conta) => conta.usuario.email === emailLimpo);

  if (emailExistente) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  // Gera um ID numérico que não conflita com os mocks
  const novoId = Math.max(2, ...contas.map((conta) => conta.usuario.id)) + 1;

  const novoUsuario: Usuario = {
    id: novoId,
    nome: nomeLimpo,
    email: emailLimpo,
    perfil: "cidadao",
  };

  // Salt aleatório para cada conta
  const bytes = Crypto.getRandomBytes(16);

  const salt = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  const senhaHash = await gerarHash(senha, salt);

  const novaConta: ContaLocal = {
    usuario: novoUsuario,
    salt,
    senhaHash,
  };

  // Salva as contas no AsyncStorage
  contas.push(novaConta);

  await AsyncStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));

  return novoUsuario;
}

// Verifica o login nos mocks e nas contas cadastradas
export async function validarCredenciais(
  email: string,
  senha: string,
): Promise<Usuario | null> {
  const emailLimpo = email.trim().toLowerCase();

  // Primeiro procura nas contas criadas
  const contas = await listarContasLocais();

  const contaLocal = contas.find((conta) => conta.usuario.email === emailLimpo);

  if (contaLocal) {
    const hashDigitado = await gerarHash(senha, contaLocal.salt);

    if (hashDigitado === contaLocal.senhaHash) {
      return contaLocal.usuario;
    }

    return null;
  }

  // Depois verifica os usuários mockados
  const contaMock = usuariosTeste.find(
    (usuario) =>
      usuario.email.toLowerCase() === emailLimpo && usuario.senha === senha,
  );

  if (!contaMock) {
    return null;
  }

  return {
    id: contaMock.id,
    nome: contaMock.nome,
    email: contaMock.email,
    perfil: contaMock.perfil,
  };
}

// Salva a sessão do usuário autenticado
export async function salvarUsuario(usuario: Usuario) {
  await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

// Recupera a sessão armazenada
export async function buscarUsuarioSalvo(): Promise<Usuario | null> {
  const dados = await AsyncStorage.getItem(CHAVE_USUARIO);

  return dados ? (JSON.parse(dados) as Usuario) : null;
}

// Remove a sessão durante o logout
export async function removerUsuario() {
  await AsyncStorage.removeItem(CHAVE_USUARIO);
}
