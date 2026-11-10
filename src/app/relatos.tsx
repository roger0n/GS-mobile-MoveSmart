import { useCallback, useState } from "react";

import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { useFocusEffect } from "expo-router";

import { useAuth } from "../contexts/AuthContext";

import { Relato, TipoRelato, listarRelatos } from "../services/relatosService";

import { LinhaOnibus } from "../mocks/linhas";
import { listarLinhas } from "../services/linhasService";

import { styles } from "../styles/common";
import { relatosStyles } from "../styles/relatosStyles";

export default function Relatos() {
  const { usuario } = useAuth();

  const [relatos, setRelatos] = useState<Relato[]>([]);
  const [linhas, setLinhas] = useState<LinhaOnibus[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const agente = usuario?.perfil === "agente";

  // Atualiza os relatos sempre que a tela recebe foco.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarRelatos() {
        setCarregando(true);
        setErro("");

        try {
          const [dadosRelatos, dadosLinhas] = await Promise.all([
            listarRelatos(),
            listarLinhas(),
          ]);

          // Agente vê todos; cidadão vê apenas os próprios.
          const relatosVisiveis =
            usuario?.perfil === "agente"
              ? dadosRelatos
              : dadosRelatos.filter(
                  (relato) => relato.usuarioId === usuario?.id,
                );

          if (ativo) {
            setRelatos(relatosVisiveis);
            setLinhas(dadosLinhas);
          }
        } catch {
          if (ativo) {
            setErro("Não foi possível carregar os relatos.");
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarRelatos();

      return () => {
        ativo = false;
      };
    }, [usuario?.id, usuario?.perfil]),
  );

  // Converte o tipo do relato para texto.
  function nomeTipo(tipo: TipoRelato) {
    switch (tipo) {
      case "atraso":
        return "Atraso";
      case "lotacao":
        return "Superlotação";
      case "outro":
        return "Outro problema";
    }
  }

  // Procura o código da linha correspondente.
  function buscarCodigoLinha(id: number) {
    const linha = linhas.find((item) => item.id === id);

    return linha ? linha.codigo : `ID ${id}`;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={relatosStyles.container}
    >
      <Text style={relatosStyles.titulo} accessibilityRole="header">
        {agente ? "Relatos Registrados" : "Meus Relatos"}
      </Text>

      <Text style={relatosStyles.subtitulo}>
        {agente
          ? "Acompanhe as ocorrências registradas pelos passageiros."
          : "Consulte o histórico dos problemas que você relatou."}
      </Text>

      <Text style={relatosStyles.aviso}>
        Dados armazenados localmente neste dispositivo.
      </Text>

      {carregando ? (
        <View
          style={{ alignItems: "center", gap: 8 }}
          accessibilityLiveRegion="polite"
        >
          <ActivityIndicator size="large" color="#164E83" />

          <Text style={relatosStyles.informacao}>Carregando relatos...</Text>
        </View>
      ) : erro ? (
        <Text
          style={relatosStyles.erro}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {erro}
        </Text>
      ) : (
        <>
          <Text
            style={relatosStyles.contador}
            accessibilityLiveRegion="polite"
            accessibilityLabel={`Total de relatos disponíveis: ${relatos.length}`}
          >
            Total de relatos: {relatos.length}
          </Text>

          {relatos.length === 0 && (
            <View style={relatosStyles.card}>
              <Text
                style={relatosStyles.vazio}
                accessibilityLiveRegion="polite"
              >
                {agente
                  ? "Nenhum relato foi registrado neste dispositivo."
                  : "Você ainda não registrou nenhum relato."}
              </Text>
            </View>
          )}

          {relatos.map((relato) => (
            <View key={relato.id} style={relatosStyles.card}>
              <Text style={relatosStyles.linha} accessibilityRole="header">
                Linha {buscarCodigoLinha(relato.linhaId)}
              </Text>

              <Text style={relatosStyles.tipo}>
                Problema: {nomeTipo(relato.tipo)}
              </Text>

              <Text style={relatosStyles.informacao}>
                Horário da ocorrência: {relato.horario}
              </Text>

              <Text style={relatosStyles.informacao}>
                Registrado em:{" "}
                {new Date(relato.criadoEm).toLocaleString("pt-BR")}
              </Text>

              {agente && (
                <Text style={relatosStyles.informacao}>
                  Registrado por: {relato.nomeUsuario}
                </Text>
              )}

              <Text style={relatosStyles.descricao}>{relato.descricao}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
