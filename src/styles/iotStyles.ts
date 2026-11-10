import { StyleSheet } from "react-native";

export const iotStyles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#164E83",
  },

  subtitulo: {
    fontSize: 15,
    color: "#555555",
    lineHeight: 22,
  },

  listaLinhas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  botaoLinha: {
    borderWidth: 1,
    borderColor: "#B8C4D1",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
  },

  botaoLinhaSelecionada: {
    backgroundColor: "#164E83",
    borderColor: "#164E83",
  },

  textoLinha: {
    color: "#164E83",
    fontSize: 14,
    fontWeight: "bold",
  },

  textoLinhaSelecionada: {
    color: "#FFFFFF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    gap: 16,
  },

  cardTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#164E83",
  },

  indicadores: {
    flexDirection: "row",
    gap: 12,
  },

  indicador: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },

  numero: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#164E83",
  },

  informacao: {
    fontSize: 14,
    color: "#555555",
  },

  porcentagem: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#164E83",
  },

  barraFundo: {
    height: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },

  barraPreenchimento: {
    height: "100%",
    borderRadius: 10,
  },

  alerta: {
    backgroundColor: "#FCEAE8",
    borderRadius: 10,
    padding: 14,
    gap: 6,
  },

  alertaTexto: {
    color: "#B42318",
    fontSize: 15,
    fontWeight: "bold",
  },

  botoes: {
    flexDirection: "row",
    gap: 12,
  },

  botao: {
    flex: 1,
    backgroundColor: "#164E83",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },

  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  botaoSecundario: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#164E83",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },

  textoSecundario: {
    color: "#164E83",
    fontSize: 15,
    fontWeight: "bold",
  },

  aviso: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
  },

  erro: {
    fontSize: 14,
    color: "#B42318",
    textAlign: "center",
  },

  inputQuantidade: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B8C4D1",
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: "#222222",
    textAlign: "center",
  },
});
