export type NivelLotacao = "Baixa" | "Média" | "Alta";

export type LinhaOnibus = {
  id: number;
  codigo: string;
  origem: string;
  destino: string;
  chegadaMin: number;
  atrasoMin: number;
  lotacao: NivelLotacao;
};

export const linhasMock: LinhaOnibus[] = [
  {
    id: 1,
    codigo: "SIM-01",
    origem: "Centro",
    destino: "Av. Paulista",
    chegadaMin: 8,
    atrasoMin: 0,
    lotacao: "Baixa",
  },
  {
    id: 2,
    codigo: "SIM-02",
    origem: "Santana",
    destino: "Centro",
    chegadaMin: 15,
    atrasoMin: 7,
    lotacao: "Alta",
  },
  {
    id: 3,
    codigo: "SIM-03",
    origem: "Pinheiros",
    destino: "Vila Mariana",
    chegadaMin: 12,
    atrasoMin: 3,
    lotacao: "Média",
  },
  {
    id: 4,
    codigo: "SIM-04",
    origem: "Tatuapé",
    destino: "Mooca",
    chegadaMin: 5,
    atrasoMin: 0,
    lotacao: "Média",
  },
];
