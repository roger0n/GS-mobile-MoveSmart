import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    justifyContent: "center",
    padding: 24,
    gap: 18,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#164E83",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#555555",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    gap: 12,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#164E83",
  },

  body: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#164E83",
    minHeight: 50,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  secondaryButton: {
    minHeight: 50,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#164E83",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#164E83",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },

  note: {
    fontSize: 14,
    color: "#555555",
    textAlign: "center",
    lineHeight: 21,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B8C4D1",
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#222222",
  },

  error: {
    color: "#B42318",
    fontSize: 14,
    textAlign: "center",
  },
});
