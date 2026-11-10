import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipos de problemas que o cidadão pode registrar
export type TipoRelato = "atraso" | "lotacao" | "outro";

// Estrutura de um relato
export type Relato = {
  id: string;
  linhaId: number;
  usuarioId: number;
  nomeUsuario: string;
  tipo: TipoRelato;
  descricao: string;
  horario: string;
  criadoEm: string;
};

// Informações necessárias para cadastrar um relato
export type NovoRelato = Omit<Relato, "id" | "criadoEm">;

// Chave utilizada no armazenamento local
const CHAVE_RELATOS = "@movesmart:relatos";

// Busca todos os relatos armazenados
export async function listarRelatos(): Promise<Relato[]> {
  const dados = await AsyncStorage.getItem(CHAVE_RELATOS);

  if (!dados) {
    return [];
  }

  const relatos = JSON.parse(dados);

  if (!Array.isArray(relatos)) {
    throw new Error("Dados de relatos inválidos.");
  }

  return relatos as Relato[];
}

// Registra um novo relato
export async function salvarRelato(dados: NovoRelato): Promise<Relato> {
  if (!Number.isInteger(dados.linhaId) || dados.linhaId <= 0) {
    throw new Error("Selecione uma linha válida.");
  }

  if (
    dados.descricao.trim().length < 10 ||
    dados.descricao.trim().length > 500
  ) {
    throw new Error("A descrição deve ter entre 10 e 500 caracteres.");
  }

  // Validação do horário no formato HH:mm
  const formatoHorario = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!formatoHorario.test(dados.horario)) {
    throw new Error("Informe um horário válido (HH:mm).");
  }

  // Cria o novo relato
  const novoRelato: Relato = {
    ...dados,
    descricao: dados.descricao.trim(),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    criadoEm: new Date().toISOString(),
  };

  // Recupera os relatos já existentes
  const relatos = await listarRelatos();

  // Adiciona o novo relato à lista
  relatos.unshift(novoRelato);

  // Salva a lista atualizada
  await AsyncStorage.setItem(CHAVE_RELATOS, JSON.stringify(relatos));

  return novoRelato;
}
