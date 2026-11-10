import { useCallback, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useFocusEffect } from "expo-router";

import { useAuth } from "../contexts/AuthContext";
import { LinhaOnibus } from "../mocks/linhas";
import { listarLinhas } from "../services/linhasService";

import {
  LeituraIoT,
  Movimento,
  listarLeiturasIoT,
  simularMovimento,
} from "../services/iotService";

import { styles } from "../styles/common";
import { iotStyles } from "../styles/iotStyles";

export default function MonitoramentoIoT() {
  const { usuario } = useAuth();
  const [quantidade, setQuantidade] = useState("5");

  const agente = usuario?.perfil === "agente";

  const [linhas, setLinhas] = useState<LinhaOnibus[]>([]);
  const [leituras, setLeituras] = useState<LeituraIoT[]>([]);

  const [linhaSelecionada, setLinhaSelecionada] = useState(1);

  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [automatico, setAutomatico] = useState(false);
  const [linhaEmSimulacao, setLinhaEmSimulacao] = useState<number | null>(null);

  const [erro, setErro] = useState("");

  const bloqueio = useRef(false);

  // Carrega os dados sempre que a tela recebe foco.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarDados() {
        try {
          setCarregando(true);
          setErro("");

          const [dadosLinhas, dadosIoT] = await Promise.all([
            listarLinhas(),
            listarLeiturasIoT(),
          ]);

          if (ativo) {
            setLinhas(dadosLinhas);
            setLeituras(dadosIoT);
          }
        } catch {
          if (ativo) {
            setErro("Não foi possível carregar os sensores.");
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarDados();

      return () => {
        ativo = false;
        setAutomatico(false);
      };
    }, []),
  );

  // Executa uma movimentação simulada.
  async function movimentar(
    movimento: Movimento,
    linhaIdAlvo: number = linhaSelecionada,
  ) {
    if (!agente || bloqueio.current) {
      return;
    }

    setErro("");

    const numero = Number(quantidade);

    // Valida a quantidade nas movimentações manuais.
    if (
      movimento !== "automatico" &&
      (!/^\d+$/.test(quantidade) || !Number.isInteger(numero) || numero <= 0)
    ) {
      setErro("Informe uma quantidade válida de passageiros.");
      return;
    }

    bloqueio.current = true;
    setProcessando(true);

    try {
      const novaLeitura = await simularMovimento(
        linhaIdAlvo,
        movimento,
        movimento === "automatico" ? 1 : numero,
      );

      setLeituras((anteriores) =>
        anteriores.map((leitura) =>
          leitura.linhaId === novaLeitura.linhaId ? novaLeitura : leitura,
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível atualizar a simulação.");
      }

      setAutomatico(false);
    } finally {
      bloqueio.current = false;
      setProcessando(false);
    }
  }

  // Executa uma simulação a cada 3 segundos.
  useEffect(() => {
    if (!automatico || !agente || linhaEmSimulacao === null) {
      return;
    }

    const intervalo = setInterval(() => {
      void movimentar("automatico", linhaEmSimulacao);
    }, 3000);

    return () => {
      clearInterval(intervalo);
    };
  }, [automatico, agente, linhaEmSimulacao]);

  // Localiza o ônibus selecionado.
  const linhaAtual = linhas.find((linha) => linha.id === linhaSelecionada);

  // Recupera os dados do sensor correspondente.
  const leitura = leituras.find((item) => item.linhaId === linhaSelecionada);

  // Cor conforme o nível de ocupação.
  function corLotacao(ocupacao: number) {
    if (ocupacao >= 80) {
      return "#B42318";
    }

    if (ocupacao >= 50) {
      return "#C27A12";
    }

    return "#16804A";
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

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={iotStyles.container}
    >
      <Text style={iotStyles.titulo} accessibilityRole="header">
        Monitoramento de Lotação
      </Text>

      <Text style={iotStyles.subtitulo}>
        Acompanhe a ocupação dos ônibus por meio de sensores simulados.
      </Text>

      <Text style={iotStyles.aviso}>
        Dados fictícios para demonstração acadêmica.
      </Text>

      {/* Seleção do ônibus */}
      <View style={iotStyles.listaLinhas}>
        {linhas.map((linha) => (
          <Pressable
            key={linha.id}
            style={[
              iotStyles.botaoLinha,
              linhaSelecionada === linha.id && iotStyles.botaoLinhaSelecionada,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Selecionar ônibus ${linha.codigo}`}
            accessibilityHint="Mostra as informações de ocupação deste ônibus"
            accessibilityState={{
              selected: linhaSelecionada === linha.id,
            }}
            onPress={() => {
              setLinhaSelecionada(linha.id);
            }}
          >
            <Text
              style={[
                iotStyles.textoLinha,
                linhaSelecionada === linha.id &&
                  iotStyles.textoLinhaSelecionada,
              ]}
            >
              {linha.codigo}
            </Text>
          </Pressable>
        ))}
      </View>

      {erro !== "" && (
        <Text style={iotStyles.erro} accessibilityRole="alert">
          {erro}
        </Text>
      )}

      {!leitura && (
        <Text style={iotStyles.informacao}>
          Nenhuma leitura disponível para esta linha.
        </Text>
      )}

      {leitura && (
        <>
          <View style={iotStyles.card}>
            <Text style={iotStyles.cardTitulo}>
              Ônibus {linhaAtual?.codigo}
            </Text>

            <Text style={iotStyles.informacao}>
              {linhaAtual?.origem} → {linhaAtual?.destino}
            </Text>

            {/* Quantidade de passageiros */}
            <View style={iotStyles.indicadores}>
              <View style={iotStyles.indicador}>
                <Text style={iotStyles.numero}>{leitura.passageiros}</Text>

                <Text style={iotStyles.informacao}>Passageiros</Text>
              </View>

              <View style={iotStyles.indicador}>
                <Text style={iotStyles.numero}>{leitura.capacidade}</Text>

                <Text style={iotStyles.informacao}>Capacidade</Text>
              </View>
            </View>

            {/* Porcentagem de ocupação */}
            <Text style={iotStyles.informacao}>Ocupação atual</Text>

            <Text
              style={[
                iotStyles.porcentagem,
                { color: corLotacao(leitura.ocupacao) },
              ]}
              accessibilityLabel={`Ocupação simulada de ${leitura.ocupacao} por cento`}
            >
              {leitura.ocupacao}%
            </Text>

            {/* Barra de progresso */}
            <View style={iotStyles.barraFundo}>
              <View
                style={[
                  iotStyles.barraPreenchimento,
                  {
                    width: `${leitura.ocupacao}%` as `${number}%`,
                    backgroundColor: corLotacao(leitura.ocupacao),
                  },
                ]}
              />
            </View>

            <Text style={iotStyles.informacao}>
              Nível de lotação: {leitura.lotacao}
            </Text>

            {/* Alerta automático */}
            {leitura.alerta && (
              <View style={iotStyles.alerta}>
                <Text
                  style={iotStyles.alertaTexto}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                >
                  Atenção! Alerta de superlotação! Ocupação de{" "}
                  {leitura.ocupacao} por cento.
                </Text>

                <Text style={iotStyles.informacao}>
                  O ônibus atingiu 85% ou mais da capacidade.
                </Text>
              </View>
            )}

            <Text style={iotStyles.aviso}>
              Última atualização simulada:{" "}
              {new Date(leitura.atualizadoEm).toLocaleTimeString("pt-BR")}
            </Text>
          </View>

          {/* Controles exclusivos do Agente */}
          {agente && (
            <>
              <View style={iotStyles.card}>
                <Text style={iotStyles.cardTitulo} accessibilityRole="header">
                  Movimentação de Passageiros
                </Text>

                <Text style={iotStyles.informacao}>
                  Informe quantos passageiros entraram ou saíram.
                </Text>

                <Text style={iotStyles.informacao}>
                  Quantidade de passageiros
                </Text>

                <TextInput
                  style={iotStyles.inputQuantidade}
                  placeholder="Ex: 10"
                  placeholderTextColor="#777777"
                  keyboardType="number-pad"
                  maxLength={3}
                  value={quantidade}
                  onChangeText={(texto) =>
                    setQuantidade(texto.replace(/\D/g, "").slice(0, 3))
                  }
                  editable={!automatico && !processando}
                  accessibilityLabel="Quantidade de passageiros"
                  accessibilityHint="Informe o número de passageiros para registrar uma entrada ou saída"
                />
              </View>
              <View style={iotStyles.botoes}>
                <Pressable
                  style={[iotStyles.botao, processando && { opacity: 0.6 }]}
                  accessibilityRole="button"
                  disabled={processando || automatico}
                  onPress={() => movimentar("entrada")}
                  accessibilityLabel={`Registrar entrada de ${quantidade || "zero"} passageiros`}
                  accessibilityHint="Adiciona a quantidade informada à ocupação do ônibus"
                  accessibilityState={{
                    disabled: processando || automatico,
                  }}
                >
                  <Text style={iotStyles.botaoTexto}>+ Entrada</Text>
                </Pressable>

                <Pressable
                  style={[iotStyles.botao, processando && { opacity: 0.6 }]}
                  accessibilityRole="button"
                  disabled={processando || automatico}
                  onPress={() => movimentar("saida")}
                  accessibilityLabel={`Registrar saída de ${quantidade || "zero"} passageiros`}
                  accessibilityHint="Remove a quantidade informada da ocupação do ônibus"
                  accessibilityState={{
                    disabled: processando || automatico,
                  }}
                >
                  <Text style={iotStyles.botaoTexto}>- Saída</Text>
                </Pressable>
              </View>

              {automatico && linhaEmSimulacao !== null && (
                <Text style={iotStyles.informacao}>
                  Simulação automática ativa na linha{" "}
                  {
                    linhas.find((linha) => linha.id === linhaEmSimulacao)
                      ?.codigo
                  }
                </Text>
              )}

              <Pressable
                style={iotStyles.botaoSecundario}
                accessibilityRole="button"
                accessibilityLabel={
                  automatico
                    ? "Parar simulação automática"
                    : "Iniciar simulação automática"
                }
                accessibilityHint="Controla a movimentação automática de passageiros a cada três segundos"
                accessibilityState={{
                  selected: automatico,
                }}
                onPress={() => {
                  if (automatico) {
                    setAutomatico(false);
                    setLinhaEmSimulacao(null);
                  } else {
                    setLinhaEmSimulacao(linhaSelecionada);
                    setAutomatico(true);
                  }
                }}
              >
                <Text style={iotStyles.textoSecundario}>
                  {automatico
                    ? "Parar Simulação Automática"
                    : "Iniciar Simulação Automática"}
                </Text>
              </Pressable>
            </>
          )}

          {!agente && (
            <Text style={iotStyles.aviso}>
              As medições são simuladas e podem ser atualizadas pelo perfil
              Agente.
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
}
