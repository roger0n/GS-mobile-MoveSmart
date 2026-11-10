import { Stack, useRouter } from "expo-router";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AuthProvider, useAuth } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Navegacao />
    </AuthProvider>
  );
}

function Navegacao() {
  const { usuario, carregando } = useAuth();
  const router = useRouter();

  // Volta para a Home, mesmo sem histórico.
  function botaoInicio() {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar para o início"
        onPress={() => router.dismissTo("/home")}
        style={{ paddingRight: 12 }}
      >
        <Text style={styles.textoVoltar}>‹ Início</Text>
      </Pressable>
    );
  }

  // Volta para a listagem de linhas.
  function botaoLinhas() {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar para linhas"
        onPress={() => router.dismissTo("/linhas")}
        style={{ paddingRight: 12 }}
      >
        <Text style={styles.textoVoltar}>‹ Linhas</Text>
      </Pressable>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#164E83",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#F4F6F8",
          },
        }}
      >
        {/* Login */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Protected guard={!usuario}>
          <Stack.Screen
            name="cadastro"
            options={{
              headerShown: false,
            }}
          />
        </Stack.Protected>

        {/* Telas de usuários autenticados */}
        <Stack.Protected guard={carregando || !!usuario}>
          <Stack.Screen
            name="home"
            options={{
              title: "Início",
              headerLeft: () => null,
            }}
          />

          <Stack.Screen
            name="linhas"
            options={{
              title: "Linhas de Ônibus",
              headerLeft: botaoInicio,
            }}
          />

          <Stack.Screen
            name="linhas/[id]"
            options={{
              title: "Detalhes da Linha",
              headerLeft: botaoLinhas,
            }}
          />

          <Stack.Screen
            name="relatos"
            options={{
              title: "Relatos",
              headerLeft: botaoInicio,
            }}
          />

          <Stack.Screen
            name="iot"
            options={{
              title: "Monitoramento IoT",
              headerLeft: botaoInicio,
            }}
          />
        </Stack.Protected>

        {/* Tela exclusiva do Cidadão */}
        <Stack.Protected guard={carregando || usuario?.perfil === "cidadao"}>
          <Stack.Screen
            name="relatar"
            options={{
              title: "Relatar Problema",
              headerLeft: botaoLinhas,
            }}
          />
        </Stack.Protected>
      </Stack>

      {carregando && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#164E83" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F4F6F8",
    alignItems: "center",
    justifyContent: "center",
  },

  textoVoltar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
