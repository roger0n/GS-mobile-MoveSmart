import { useState } from "react";

import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { useRouter } from "expo-router";

import { cadastrarCidadao } from "../services/authService";
import { styles } from "../styles/common";

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  async function criarConta() {
    setErro("");

    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setSalvando(true);

      await cadastrarCidadao(nome, email, senha);

      setConcluido(true);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível criar a conta.");
      }
    } finally {
      setSalvando(false);
    }
  }

  // Mensagem após o cadastro
  if (concluido) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>MoveSmart</Text>

        <View style={styles.card}>
          <Text
            style={styles.cardTitle}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            Conta criada com sucesso!
          </Text>

          <Text style={styles.body}>
            Seu cadastro de Cidadão foi realizado. Agora você já pode entrar no
            aplicativo.
          </Text>

          <Pressable
            style={styles.button}
            accessibilityRole="button"
            onPress={() => router.replace("/")}
          >
            <Text style={styles.buttonText}>Ir para Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title} accessibilityRole="header">
        Criar Conta
      </Text>

      <Text style={styles.subtitle}>Cadastre-se no MoveSmart</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cadastro de Cidadão</Text>

        <Text style={styles.label}>Nome completo</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#777777"
          accessibilityLabel="Nome completo"
          accessibilityHint="Informe seu nome para criar uma conta no MoveSmart"
          autoComplete="name"
          autoCapitalize="words"
          value={nome}
          onChangeText={setNome}
          maxLength={80}
        />

        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#777777"
          accessibilityLabel="E-mail"
          accessibilityHint="Informe um e-mail válido que será utilizado para acessar sua conta"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          maxLength={254}
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Mínimo de 8 caracteres"
          placeholderTextColor="#777777"
          accessibilityLabel="Nova senha"
          accessibilityHint="Crie uma senha com pelo menos 8 caracteres"
          autoComplete="new-password"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          maxLength={72}
        />

        <Text style={styles.label}>Confirmar senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite a senha novamente"
          placeholderTextColor="#777777"
          accessibilityLabel="Confirmar senha"
          accessibilityHint="Repita a senha criada anteriormente para confirmar o cadastro"
          autoComplete="off"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          maxLength={72}
        />

        {erro !== "" && (
          <Text
            style={styles.error}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {erro}
          </Text>
        )}

        <Pressable
          style={[styles.button, salvando && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel="Criar conta de cidadão"
          accessibilityHint="Valida os dados preenchidos e cadastra sua conta no MoveSmart"
          accessibilityState={{
            disabled: salvando,
            busy: salvando,
          }}
          disabled={salvando}
          onPress={criarConta}
        >
          <Text style={styles.buttonText}>
            {salvando ? "Cadastrando..." : "Criar Conta"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          accessibilityRole="button"
          accessibilityLabel="Já tenho uma conta"
          accessibilityHint="Volta para a tela de login do MoveSmart"
          onPress={() => router.replace("/")}
        >
          <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
        </Pressable>
      </View>

      <Text style={styles.note}>
        Cadastro local para demonstração acadêmica.
      </Text>
    </ScrollView>
  );
}
