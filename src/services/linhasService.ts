import { LinhaOnibus, linhasMock } from "../mocks/linhas";

import { buscarLeituraIoT, LeituraIoT, listarLeiturasIoT } from "./iotService";

// Estrutura de uma linha com informações do sensor.
export type LinhaMonitorada = LinhaOnibus & {
  leituraIoT: LeituraIoT | null;
};

// Retorna todas as linhas cadastradas.
export async function listarLinhas(): Promise<LinhaOnibus[]> {
  return [...linhasMock];
}

// Busca uma linha específica pelo ID.
export async function buscarLinhaPorId(
  id: number,
): Promise<LinhaOnibus | null> {
  const linha = linhasMock.find((item) => item.id === id);

  return linha ?? null;
}

// Retorna as linhas junto com suas leituras IoT.
export async function listarLinhasMonitoradas(): Promise<LinhaMonitorada[]> {
  const linhas = await listarLinhas();
  const leituras = await listarLeiturasIoT();

  return linhas.map((linha) => {
    const leitura = leituras.find((item) => item.linhaId === linha.id);

    return {
      ...linha,
      leituraIoT: leitura ?? null,
    };
  });
}

// Busca uma linha específica e sua leitura IoT.
export async function buscarLinhaMonitorada(
  id: number,
): Promise<LinhaMonitorada | null> {
  const linha = await buscarLinhaPorId(id);

  if (!linha) {
    return null;
  }

  const leitura = await buscarLeituraIoT(id);

  return {
    ...linha,
    leituraIoT: leitura,
  };
}
