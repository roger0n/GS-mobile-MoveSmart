import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useFocusEffect, useRouter } from "expo-router";

import { useAuth } from "../contexts/AuthContext";

import {
  LinhaMonitorada,
  listarLinhasMonitoradas,
} from "../services/linhasService";

import { listarRelatos } from "../services/relatosService";

import { styles } from "../styles/common";
import { homeStyles } from "../styles/homeStyles";

export default function Home() {
  const router = useRouter();
  const { usuario, sair } = useAuth();

  const agente = usuario?.perfil === "agente";

  const [linhas, setLinhas] = useState<LinhaMonitorada[]>([]);
  const [totalRelatos, setTotalRelatos] = useState(0);

  const [carregando, setCarregando] = useState(true);
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState("");

  // Atualiza os indicadores ao acessar a Home.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarPainel() {
        try {
          setCarregando(true);
          setErro("");

          const [dadosLinhas, dadosRelatos] = await Promise.all([
            listarLinhasMonitoradas(),
            listarRelatos(),
          ]);

          const relatosVisiveis =
            usuario?.perfil === "agente"
              ? dadosRelatos
              : dadosRelatos.filter(
                  (relato) => relato.usuarioId === usuario?.id,
                );

          if (ativo) {
            setLinhas(dadosLinhas);
            setTotalRelatos(relatosVisiveis.length);
          }
        } catch {
          if (ativo) {
            setErro("Não foi possível carregar o resumo.");
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarPainel();

      return () => {
        ativo = false;
      };
    }, [usuario?.id, usuario?.perfil]),
  );

  // Linhas com atraso simulado.
  const linhasAtrasadas = linhas.filter((linha) => linha.atrasoMin > 0);

  // Linhas com alerta de superlotação.
  const linhasComAlerta = linhas.filter(
    (linha) => linha.leituraIoT?.alerta === true,
  );

  // Linhas que precisam de atenção.
  const linhasComProblemas = linhas.filter(
    (linha) => linha.atrasoMin > 0 || linha.leituraIoT?.alerta === true,
  );

  // Encerra a sessão.
  async function fazerLogout() {
    try {
      setSaindo(true);
      setErro("");

      await sair();
    } catch {
      setErro("Não foi possível sair da conta.");
      setSaindo(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={homeStyles.container}
    >
      {/* Cabeçalho */}
      <View>
        <Text style={homeStyles.titulo}>MoveSmart</Text>

        <Text style={homeStyles.subtitulo}>Mobilidade Urbana Inteligente</Text>
      </View>

      {/* Identificação do usuário */}
      <View style={homeStyles.card}>
        <Text style={homeStyles.cardTitulo}>Olá, {usuario?.nome}!</Text>

        <Text style={homeStyles.texto}>
          Perfil: {agente ? "Agente" : "Cidadão"}
        </Text>

        <Text style={homeStyles.texto}>
          {agente
            ? "Acompanhe as condições do transporte e os relatos dos passageiros."
            : "Consulte as condições dos ônibus e planeje melhor seus deslocamentos."}
        </Text>
      </View>

      {/* Indicadores */}
      <Text style={homeStyles.secaoTitulo}>Resumo do Transporte</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#164E83" />
      ) : erro ? (
        <Text style={homeStyles.erro}>{erro}</Text>
      ) : (
        <>
          <View style={homeStyles.indicadores}>
            <View style={homeStyles.indicador}>
              <Text style={homeStyles.numero}>{linhas.length}</Text>

              <Text style={homeStyles.legenda}>Linhas monitoradas</Text>
            </View>

            <View style={homeStyles.indicador}>
              <Text style={homeStyles.numero}>{linhasAtrasadas.length}</Text>

              <Text style={homeStyles.legenda}>Linhas com atraso</Text>
            </View>

            <View style={homeStyles.indicador}>
              <Text style={homeStyles.numero}>{linhasComAlerta.length}</Text>

              <Text style={homeStyles.legenda}>Alertas de lotação</Text>
            </View>

            <View style={homeStyles.indicador}>
              <Text style={homeStyles.numero}>{totalRelatos}</Text>

              <Text style={homeStyles.legenda}>
                {agente ? "Relatos registrados" : "Meus relatos"}
              </Text>
            </View>
          </View>

          {/* Situação das linhas */}
          <Text style={homeStyles.secaoTitulo}>
            Linhas que Precisam de Atenção
          </Text>

          {linhasComProblemas.length === 0 ? (
            <View style={homeStyles.card}>
              <Text style={homeStyles.normal}>
                Nenhum alerta identificado na simulação.
              </Text>
            </View>
          ) : (
            linhasComProblemas.map((linha) => (
              <View key={linha.id} style={homeStyles.card}>
                <Text style={homeStyles.linha}>Linha {linha.codigo}</Text>

                <Text style={homeStyles.texto}>
                  {linha.origem} → {linha.destino}
                </Text>

                {linha.atrasoMin > 0 && (
                  <Text style={homeStyles.alerta}>
                    Atraso estimado: {linha.atrasoMin} min
                  </Text>
                )}

                {linha.leituraIoT?.alerta && (
                  <Text style={homeStyles.alerta} accessibilityRole="alert">
                    Alerta de superlotação! Ocupação:{" "}
                    {linha.leituraIoT.ocupacao}%
                  </Text>
                )}
              </View>
            ))
          )}
        </>
      )}

      {/* Navegação */}
      <Text style={homeStyles.secaoTitulo}>Acesso Rápido</Text>

      <Pressable
        style={styles.button}
        accessibilityRole="button"
        onPress={() => router.push("/linhas")}
      >
        <Text style={styles.buttonText}>Consultar Linhas</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        accessibilityRole="button"
        onPress={() => router.push("/relatos")}
      >
        <Text style={styles.buttonText}>
          {agente ? "Consultar Relatos" : "Meus Relatos"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        accessibilityRole="button"
        onPress={() => router.push("/iot")}
      >
        <Text style={styles.buttonText}>Monitoramento IoT</Text>
      </Pressable>

      <Pressable
        style={[styles.secondaryButton, saindo && { opacity: 0.6 }]}
        accessibilityRole="button"
        disabled={saindo}
        onPress={fazerLogout}
      >
        <Text style={styles.secondaryButtonText}>
          {saindo ? "Saindo..." : "Sair da Conta"}
        </Text>
      </Pressable>

      <Text style={homeStyles.aviso}>
        Informações simuladas e armazenadas localmente para demonstração
        acadêmica.
      </Text>
    </ScrollView>
  );
}
