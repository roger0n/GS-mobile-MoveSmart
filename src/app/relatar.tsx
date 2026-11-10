import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useAuth } from "../contexts/AuthContext";
import { LinhaOnibus } from "../mocks/linhas";
import { buscarLinhaPorId } from "../services/linhasService";
import { salvarRelato, TipoRelato } from "../services/relatosService";

import { relatarStyles } from "../services/relatarStyles";
import { styles } from "../styles/common";

export default function RelatarProblema() {
  const router = useRouter();
  const { usuario } = useAuth();

  const { linhaId } = useLocalSearchParams<{
    linhaId: string;
  }>();

  const [linha, setLinha] = useState<LinhaOnibus | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [tipo, setTipo] = useState<TipoRelato | null>(null);
  const [horario, setHorario] = useState("");
  const [descricao, setDescricao] = useState("");

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Busca a linha selecionada.
  useEffect(() => {
    let ativo = true;

    async function carregarLinha() {
      try {
        const id = Number(linhaId);

        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("Linha inválida.");
        }

        const resultado = await buscarLinhaPorId(id);

        if (ativo) {
          setLinha(resultado);

          if (!resultado) {
            setErro("Linha não encontrada.");
          }
        }
      } catch {
        if (ativo) {
          setErro("Não foi possível carregar a linha.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarLinha();

    return () => {
      ativo = false;
    };
  }, [linhaId]);

  // Aplica a máscara HH:mm.
  function aplicarMascaraHorario(texto: string) {
    const numeros = texto.replace(/\D/g, "").slice(0, 4);

    if (numeros.length > 2) {
      setHorario(numeros.slice(0, 2) + ":" + numeros.slice(2));
    } else {
      setHorario(numeros);
    }
  }

  // Valida e salva o formulário.
  async function registrarRelato() {
    setErro("");

    if (!usuario || usuario.perfil !== "cidadao") {
      setErro("Apenas cidadãos podem registrar relatos.");
      return;
    }

    if (!linha) {
      setErro("Selecione uma linha válida.");
      return;
    }

    if (!tipo) {
      setErro("Selecione o tipo de problema.");
      return;
    }

    const formatoHorario = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!formatoHorario.test(horario)) {
      setErro("Informe um horário válido (HH:mm).");
      return;
    }

    if (descricao.trim().length < 10) {
      setErro("A descrição precisa ter pelo menos 10 caracteres.");
      return;
    }

    try {
      setSalvando(true);

      await salvarRelato({
        linhaId: linha.id,
        usuarioId: usuario.id,
        nomeUsuario: usuario.nome,
        tipo,
        horario,
        descricao: descricao.trim(),
      });

      setSucesso(true);
    } catch {
      setErro("Não foi possível salvar o relato.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View
        style={[
          styles.screen,
          {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color="#164E83" />
      </View>
    );
  }

  if (!linha) {
    return (
      <View style={[styles.screen, { padding: 24 }]}>
        <Text style={relatarStyles.erro}>
          {erro || "Linha não encontrada."}
        </Text>
      </View>
    );
  }

  if (sucesso) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={relatarStyles.container}
      >
        <View style={relatarStyles.card}>
          <Text
            style={relatarStyles.sucesso}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            Relato registrado com sucesso!
          </Text>

          <Text>
            Seu relato da linha {linha.codigo} foi salvo no dispositivo.
          </Text>

          <Pressable
            style={relatarStyles.botao}
            accessibilityRole="button"
            onPress={() => router.back()}
          >
            <Text style={relatarStyles.botaoTexto}>Voltar para a Linha</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={relatarStyles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={relatarStyles.titulo} accessibilityRole="header">
        Novo Relato
      </Text>

      <Text>
        Linha {linha.codigo}: {linha.origem} → {linha.destino}
      </Text>

      <View style={relatarStyles.card}>
        <Text style={relatarStyles.label}>Tipo do problema</Text>

        <View style={relatarStyles.tipos}>
          {(
            [
              { valor: "atraso", nome: "Atraso" },
              { valor: "lotacao", nome: "Lotação" },
              { valor: "outro", nome: "Outro" },
            ] as { valor: TipoRelato; nome: string }[]
          ).map((opcao) => (
            <Pressable
              key={opcao.valor}
              style={[
                relatarStyles.tipoBotao,
                tipo === opcao.valor && relatarStyles.tipoSelecionado,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Tipo de problema: ${opcao.nome}`}
              accessibilityHint="Seleciona este tipo de ocorrência"
              accessibilityState={{
                selected: tipo === opcao.valor,
              }}
              onPress={() => setTipo(opcao.valor)}
            >
              <Text style={relatarStyles.tipoTexto}>{opcao.nome}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={relatarStyles.label}>Horário da ocorrência</Text>

        <TextInput
          style={relatarStyles.input}
          placeholder="HH:mm"
          placeholderTextColor="#777777"
          keyboardType="number-pad"
          maxLength={5}
          value={horario}
          onChangeText={aplicarMascaraHorario}
          accessibilityLabel="Horário da ocorrência"
          accessibilityHint="Digite quatro números no formato hora e minuto. Por exemplo, 1830 para 18 horas e 30 minutos"
        />

        <Text style={relatarStyles.label}>Descrição do problema</Text>

        <TextInput
          style={[relatarStyles.input, relatarStyles.descricao]}
          placeholder="Descreva o que aconteceu..."
          placeholderTextColor="#777777"
          multiline
          maxLength={500}
          value={descricao}
          onChangeText={setDescricao}
          accessibilityLabel="Descrição do problema"
          accessibilityHint="Descreva o problema ocorrido no ônibus utilizando entre 10 e 500 caracteres"
        />

        <Text style={relatarStyles.contador}>
          {descricao.length}/500 caracteres
        </Text>

        {erro !== "" && (
          <Text
            style={relatarStyles.erro}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {erro}
          </Text>
        )}

        <Pressable
          style={[relatarStyles.botao, salvando && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel="Registrar relato de problema"
          accessibilityHint="Valida as informações e salva o relato no dispositivo"
          accessibilityState={{
            disabled: salvando,
            busy: salvando,
          }}
          disabled={salvando}
          onPress={registrarRelato}
        >
          <Text style={relatarStyles.botaoTexto}>
            {salvando ? "Salvando..." : "Registrar Relato"}
          </Text>
        </Pressable>
      </View>

      <Text style={{ color: "#666666", fontSize: 13 }}>
        Relatos armazenados localmente para demonstração acadêmica.
      </Text>
    </ScrollView>
  );
}
