import { StyleSheet } from "react-native";

export const relatarStyles = StyleSheet.create({
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    gap: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B8C4D1",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#222222",
  },

  descricao: {
    minHeight: 120,
    textAlignVertical: "top",
  },

  tipos: {
    flexDirection: "row",
    gap: 8,
  },

  tipoBotao: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#B8C4D1",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  tipoSelecionado: {
    backgroundColor: "#E5F0FA",
    borderColor: "#164E83",
    borderWidth: 2,
  },

  tipoTexto: {
    color: "#164E83",
    fontSize: 14,
    fontWeight: "600",
  },

  contador: {
    textAlign: "right",
    fontSize: 12,
    color: "#666666",
  },

  erro: {
    color: "#B42318",
    fontSize: 14,
  },

  sucesso: {
    color: "#16804A",
    fontSize: 16,
    fontWeight: "bold",
  },

  botao: {
    backgroundColor: "#164E83",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
