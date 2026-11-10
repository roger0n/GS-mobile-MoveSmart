import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { useAuth } from "../contexts/AuthContext";
import { styles } from "../styles/common";

import { Redirect, useRouter } from "expo-router";

export default function Login() {
  const { entrar, usuario } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function fazerLogin() {
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email.trim())) {
      setErro("Digite um e-mail válido.");
      return;
    }

    try {
      setEnviando(true);

      const sucesso = await entrar(email, senha);

      if (!sucesso) {
        setErro("E-mail ou senha inválidos.");
        return;
      }
    } catch {
      setErro("Não foi possível salvar a sessão.");
    } finally {
      setEnviando(false);
    }
  }

  if (usuario) {
    return <Redirect href="/home" />;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title} accessibilityRole="header">
        MoveSmart
      </Text>

      <Text style={styles.subtitle}>Mobilidade Urbana Inteligente</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Acesse sua conta</Text>

        <Text style={styles.body}>
          Entre para acompanhar o transporte público de São Paulo.
        </Text>

        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#777777"
          accessibilityLabel="E-mail"
          accessibilityHint="Digite o e-mail cadastrado no MoveSmart"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#777777"
          accessibilityLabel="Senha"
          accessibilityHint="Digite a senha da sua conta MoveSmart"
          secureTextEntry
          autoComplete="current-password"
          value={senha}
          onChangeText={setSenha}
        />

        {erro ? (
          <Text
            style={styles.error}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {erro}
          </Text>
        ) : null}

        <Pressable
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel="Entrar no MoveSmart"
          accessibilityHint="Valida seu e-mail e senha para acessar o aplicativo"
          accessibilityState={{
            disabled: enviando,
            busy: enviando,
          }}
          disabled={enviando}
          onPress={fazerLogin}
        >
          <Text style={styles.buttonText}>
            {enviando ? "Entrando..." : "Entrar"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          accessibilityRole="button"
          accessibilityLabel="Criar uma nova conta"
          accessibilityHint="Abre o formulário de cadastro de cidadão"
          onPress={() => router.push("/cadastro")}
        >
          <Text style={styles.secondaryButtonText}>Criar Conta</Text>
        </Pressable>
      </View>

      <Text style={styles.note}>São Paulo - SP | Acesso demonstrativo</Text>
    </ScrollView>
  );
}
