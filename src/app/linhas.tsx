import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
} from "react-native";

import { useFocusEffect, useRouter } from "expo-router";

import {
  LinhaMonitorada,
  listarLinhasMonitoradas,
} from "../services/linhasService";

import { styles } from "../styles/common";
import { linhasStyles } from "../styles/linhasStyles";

export default function Linhas() {
  const router = useRouter();

  const [linhas, setLinhas] = useState<LinhaMonitorada[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Atualiza as linhas quando a tela recebe foco.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarLinhas() {
        try {
          setCarregando(true);
          setErro("");

          const dados = await listarLinhasMonitoradas();

          if (ativo) {
            setLinhas(dados);
          }
        } catch {
          if (ativo) {
            setErro("Não foi possível carregar as linhas.");
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarLinhas();

      return () => {
        ativo = false;
      };
    }, []),
  );

  // Filtra as linhas pelo texto pesquisado.
  const linhasFiltradas = linhas.filter((linha) => {
    const texto = (
      linha.codigo +
      " " +
      linha.origem +
      " " +
      linha.destino
    ).toLowerCase();

    return texto.includes(busca.trim().toLowerCase());
  });

  // Abre os detalhes da linha selecionada.
  function abrirDetalhes(id: number) {
    router.push({
      pathname: "/linhas/[id]",
      params: { id: String(id) },
    });
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={linhasStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={linhasStyles.titulo} accessibilityRole="header">
        Linhas de Ônibus
      </Text>

      <Text style={linhasStyles.descricao}>
        Consulte as condições das linhas de São Paulo.
      </Text>

      <Text style={linhasStyles.descricao}>Pesquisar linhas</Text>

      <TextInput
        style={linhasStyles.pesquisa}
        placeholder="Pesquisar linha ou região..."
        placeholderTextColor="#777777"
        accessibilityLabel="Pesquisar linhas de ônibus"
        accessibilityHint="Digite o código da linha, a origem ou o destino"
        returnKeyType="search"
        autoCorrect={false}
        value={busca}
        onChangeText={setBusca}
      />

      <Text style={linhasStyles.aviso}>
        Dados simulados para demonstração acadêmica.
      </Text>

      {carregando && <ActivityIndicator size="large" color="#164E83" />}

      {erro !== "" && <Text style={linhasStyles.alerta}>{erro}</Text>}

      {!carregando && !erro && linhasFiltradas.length === 0 && (
        <Text style={linhasStyles.descricao} accessibilityLiveRegion="polite">
          Nenhuma linha encontrada para esta pesquisa.
        </Text>
      )}

      {!carregando &&
        !erro &&
        linhasFiltradas.map((linha) => {
          const leitura = linha.leituraIoT;

          return (
            <Pressable
              key={linha.id}
              style={linhasStyles.card}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={[
                `Linha ${linha.codigo}`,
                `${linha.origem} para ${linha.destino}`,
                linha.atrasoMin > 0
                  ? `Atraso estimado de ${linha.atrasoMin} minutos`
                  : "Sem atraso estimado",
                linha.leituraIoT
                  ? `Lotação ${linha.leituraIoT.lotacao}, ocupação de ${linha.leituraIoT.ocupacao} por cento`
                  : "Medição de lotação indisponível",
                linha.leituraIoT?.alerta ? "Alerta de superlotação" : "",
              ]
                .filter(Boolean)
                .join(". ")}
              accessibilityHint="Abre os detalhes desta linha"
              onPress={() => abrirDetalhes(linha.id)}
            >
              <Text style={linhasStyles.codigo}>{linha.codigo}</Text>

              <Text style={linhasStyles.trajeto}>
                {linha.origem} → {linha.destino}
              </Text>

              <Text style={linhasStyles.informacao}>
                Próxima chegada estimada: {linha.chegadaMin} min
              </Text>

              <Text
                style={
                  linha.atrasoMin > 0
                    ? linhasStyles.alerta
                    : linhasStyles.normal
                }
              >
                {linha.atrasoMin > 0
                  ? `Atraso estimado: ${linha.atrasoMin} min`
                  : "Sem atraso estimado"}
              </Text>

              {/* Informações atualizadas pelo IoT */}
              {leitura ? (
                <>
                  <Text style={linhasStyles.informacao}>
                    Lotação simulada: {leitura.lotacao}
                  </Text>

                  <Text style={linhasStyles.informacao}>
                    Ocupação: {leitura.ocupacao}% ({leitura.passageiros}/
                    {leitura.capacidade})
                  </Text>

                  {leitura.alerta && (
                    <Text style={linhasStyles.alerta} accessibilityRole="alert">
                      Alerta de superlotação!
                    </Text>
                  )}
                </>
              ) : (
                <Text style={linhasStyles.informacao}>
                  Medição IoT não disponível.
                </Text>
              )}

              <Text style={linhasStyles.aviso}>Toque para ver detalhes</Text>
            </Pressable>
          );
        })}
    </ScrollView>
  );
}
