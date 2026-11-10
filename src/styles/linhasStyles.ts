import { StyleSheet } from "react-native";

export const linhasStyles = StyleSheet.create({
  content: {
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

  descricao: {
    fontSize: 15,
    color: "#555555",
  },

  pesquisa: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B8C4D1",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#222222",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    gap: 10,
  },

  codigo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#164E83",
  },

  trajeto: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 22,
  },

  informacao: {
    fontSize: 14,
    color: "#333333",
  },

  alerta: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#B42318",
  },

  normal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#16804A",
  },

  aviso: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
  },
});
