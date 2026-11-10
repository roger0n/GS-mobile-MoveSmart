import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import {
  LinhaMonitorada,
  buscarLinhaMonitorada,
} from "../../services/linhasService";
import { styles } from "../../styles/common";
import { linhasStyles } from "../../styles/linhasStyles";

export default function DetalhesLinha() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { usuario } = useAuth();

  const [linha, setLinha] = useState<LinhaMonitorada | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarDetalhes() {
        try {
          setCarregando(true);
          setErro("");
          setLinha(null);

          const idNumero = Number(id);

          if (!id || !Number.isInteger(idNumero) || idNumero <= 0) {
            throw new Error("Identificador inválido.");
          }

          const resultado = await buscarLinhaMonitorada(idNumero);

          if (ativo) {
            if (resultado) {
              setLinha(resultado);
            } else {
              setErro("Linha não encontrada.");
            }
          }
        } catch {
          if (ativo) {
            setErro("Não foi possível carregar esta linha.");
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarDetalhes();

      return () => {
        ativo = false;
      };
    }, [id]),
  );

  if (carregando) {
    return (
      <View
        style={[
          styles.screen,
          {
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#164E83" />

        <Text style={linhasStyles.informacao} accessibilityLiveRegion="polite">
          Carregando informações da linha...
        </Text>
      </View>
    );
  }

  if (erro || !linha) {
    return (
      <View
        style={[
          styles.screen,
          {
            justifyContent: "center",
            padding: 24,
          },
        ]}
      >
        <Text style={linhasStyles.alerta}>
          {erro || "Linha não encontrada."}
        </Text>
      </View>
    );
  }

  const temAtraso = linha.atrasoMin > 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={linhasStyles.content}
    >
      <Text style={linhasStyles.titulo} accessibilityRole="header">
        Detalhes da Linha
      </Text>

      <Text style={linhasStyles.aviso}>
        Dados simulados para demonstração acadêmica.
      </Text>

      {/* Informações da linha */}
      <View style={linhasStyles.card}>
        <Text style={linhasStyles.codigo} accessibilityRole="header">
          Linha {linha.codigo}
        </Text>

        <Text style={linhasStyles.trajeto}>Origem: {linha.origem}</Text>

        <Text style={linhasStyles.trajeto}>Destino: {linha.destino}</Text>
      </View>

      {/* Previsão de chegada */}
      <View style={linhasStyles.card}>
        <Text style={linhasStyles.codigo} accessibilityRole="header">
          Previsão de Chegada
        </Text>

        <Text style={linhasStyles.informacao}>
          Próximo ônibus em aproximadamente:
        </Text>

        <Text style={linhasStyles.titulo}>{linha.chegadaMin} minutos</Text>
      </View>

      {/* Situação do transporte */}
      <View style={linhasStyles.card}>
        <Text style={linhasStyles.codigo} accessibilityRole="header">
          Situação da Linha
        </Text>

        <Text style={temAtraso ? linhasStyles.alerta : linhasStyles.normal}>
          {temAtraso
            ? `Atraso estimado: ${linha.atrasoMin} minutos`
            : "Sem atraso estimado"}
        </Text>

        <Text style={linhasStyles.informacao}>
          {temAtraso
            ? "Atenção: considere mais tempo para sua viagem."
            : "Não há atrasos indicados na simulação."}
        </Text>
      </View>

      {/* Nível de lotação */}
      <View style={linhasStyles.card}>
        <Text style={linhasStyles.codigo} accessibilityRole="header">
          Lotação do Ônibus
        </Text>

        {linha.leituraIoT ? (
          <>
            <Text style={linhasStyles.informacao}>
              Nível de lotação: {linha.leituraIoT.lotacao}
            </Text>

            <Text
              style={linhasStyles.informacao}
              accessibilityLabel={`Ocupação simulada de ${linha.leituraIoT.ocupacao} por cento`}
            >
              Ocupação atual: {linha.leituraIoT.ocupacao}%
            </Text>

            <Text
              style={linhasStyles.informacao}
              accessibilityLabel={`${linha.leituraIoT.passageiros} passageiros de uma capacidade total de ${linha.leituraIoT.capacidade}`}
            >
              Passageiros: {linha.leituraIoT.passageiros}/
              {linha.leituraIoT.capacidade}
            </Text>

            {linha.leituraIoT.alerta ? (
              <Text
                style={linhasStyles.alerta}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                Atenção! Alerta de superlotação! Ocupação de{" "}
                {linha.leituraIoT.ocupacao}%.
              </Text>
            ) : (
              <Text style={linhasStyles.normal}>
                Sem alerta de superlotação.
              </Text>
            )}

            <Text style={linhasStyles.aviso}>
              Última medição simulada:{" "}
              {new Date(linha.leituraIoT.atualizadoEm).toLocaleTimeString(
                "pt-BR",
              )}
            </Text>
          </>
        ) : (
          <Text style={linhasStyles.informacao}>
            Medição IoT não disponível.
          </Text>
        )}
      </View>

      {usuario?.perfil === "cidadao" && (
        <Pressable
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel={`Relatar problema na linha ${linha.codigo}`}
          accessibilityHint="Abre o formulário para registrar atrasos ou superlotação"
          onPress={() =>
            router.push({
              pathname: "/relatar",
              params: { linhaId: String(linha.id) },
            })
          }
        >
          <Text style={styles.buttonText}>Relatar Problema</Text>
        </Pressable>
      )}

      <Text style={linhasStyles.aviso}>
        Estas informações são fictícias e não devem ser utilizadas para planejar
        viagens reais.
      </Text>
    </ScrollView>
  );
}
