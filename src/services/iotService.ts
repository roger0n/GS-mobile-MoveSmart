import AsyncStorage from "@react-native-async-storage/async-storage";
import { NivelLotacao } from "../mocks/linhas";

// Estrutura das informações geradas pelo sensor simulado
export type LeituraIoT = {
  linhaId: number;
  passageiros: number;
  capacidade: number;
  ocupacao: number;
  lotacao: NivelLotacao;
  alerta: boolean;
  atualizadoEm: string;
};

// Tipos de movimentação de passageiros
export type Movimento = "entrada" | "saida" | "automatico";

const CHAVE_IOT = "@movesmart:iot";

// Estado inicial dos ônibus simulados
const sensoresIniciais = [
  { linhaId: 1, passageiros: 18, capacidade: 60 },
  { linhaId: 2, passageiros: 54, capacidade: 60 },
  { linhaId: 3, passageiros: 39, capacidade: 60 },
  { linhaId: 4, passageiros: 32, capacidade: 60 },
];

// Calcula as informações de ocupação
function calcularLeitura(
  linhaId: number,
  passageiros: number,
  capacidade: number,
): LeituraIoT {
  const ocupacao = Math.round((passageiros / capacidade) * 100);

  let lotacao: NivelLotacao = "Baixa";

  if (ocupacao >= 80) {
    lotacao = "Alta";
  } else if (ocupacao >= 50) {
    lotacao = "Média";
  }

  return {
    linhaId,
    passageiros,
    capacidade,
    ocupacao,
    lotacao,
    alerta: ocupacao >= 85,
    atualizadoEm: new Date().toISOString(),
  };
}

// Recupera todas as leituras salvas
export async function listarLeiturasIoT(): Promise<LeituraIoT[]> {
  const dados = await AsyncStorage.getItem(CHAVE_IOT);

  if (dados) {
    return JSON.parse(dados) as LeituraIoT[];
  }

  // Cria os dados iniciais na primeira execução
  const leituras = sensoresIniciais.map((sensor) =>
    calcularLeitura(sensor.linhaId, sensor.passageiros, sensor.capacidade),
  );

  await AsyncStorage.setItem(CHAVE_IOT, JSON.stringify(leituras));

  return leituras;
}

// Consulta a leitura de um ônibus específico
export async function buscarLeituraIoT(
  linhaId: number,
): Promise<LeituraIoT | null> {
  const leituras = await listarLeiturasIoT();

  return leituras.find((item) => item.linhaId === linhaId) ?? null;
}

// Simula entradas e saídas de passageiros.
export async function simularMovimento(
  linhaId: number,
  movimento: Movimento,
  quantidade: number = 1,
): Promise<LeituraIoT> {
  const leituras = await listarLeiturasIoT();

  const indice = leituras.findIndex((item) => item.linhaId === linhaId);

  if (indice === -1) {
    throw new Error("Sensor da linha não encontrado.");
  }

  const sensor = leituras[indice];

  let variacao = 0;

  if (movimento === "automatico") {
    // Simula movimentação entre -3 e +5 passageiros.
    variacao = Math.floor(Math.random() * 9) - 3;
  } else {
    // Valida a quantidade informada pelo agente.
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new Error("Informe uma quantidade inteira maior que zero.");
    }

    if (movimento === "entrada") {
      const vagasDisponiveis = sensor.capacidade - sensor.passageiros;

      if (quantidade > vagasDisponiveis) {
        throw new Error(
          `Existem apenas ${vagasDisponiveis} vagas disponíveis.`,
        );
      }

      variacao = quantidade;
    } else if (movimento === "saida") {
      if (quantidade > sensor.passageiros) {
        throw new Error(
          `Existem apenas ${sensor.passageiros} passageiros no ônibus.`,
        );
      }

      variacao = -quantidade;
    }
  }

  // Mantém a quantidade dentro dos limites do veículo.
  const passageiros = Math.max(
    0,
    Math.min(sensor.capacidade, sensor.passageiros + variacao),
  );

  const novaLeitura = calcularLeitura(linhaId, passageiros, sensor.capacidade);

  leituras[indice] = novaLeitura;

  // Salva a medição atualizada no AsyncStorage.
  await AsyncStorage.setItem(CHAVE_IOT, JSON.stringify(leituras));

  return novaLeitura;
}
