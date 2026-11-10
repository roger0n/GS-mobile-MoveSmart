import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },

  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#164E83",
  },

  subtitulo: {
    fontSize: 15,
    color: "#555555",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    gap: 10,
  },

  cardTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#164E83",
  },

  texto: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 23,
  },

  secaoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#164E83",
  },

  indicadores: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  indicador: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },

  numero: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#164E83",
  },

  legenda: {
    fontSize: 13,
    color: "#555555",
    lineHeight: 19,
  },

  linha: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#164E83",
  },

  alerta: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B42318",
  },

  normal: {
    fontSize: 14,
    color: "#16804A",
  },

  aviso: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
  },

  erro: {
    fontSize: 14,
    color: "#B42318",
  },
});
