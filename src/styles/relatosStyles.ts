import { StyleSheet } from "react-native";

export const relatosStyles = StyleSheet.create({
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    gap: 10,
  },

  linha: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#164E83",
  },

  tipo: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333333",
  },

  informacao: {
    fontSize: 14,
    color: "#444444",
    lineHeight: 22,
  },

  descricao: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 23,
  },

  contador: {
    fontSize: 14,
    color: "#555555",
  },

  vazio: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },

  erro: {
    fontSize: 14,
    color: "#B42318",
    textAlign: "center",
  },

  aviso: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
  },
});
