# MoveSmart — Mobilidade Urbana Inteligente

> **FIAP | Global Solution 2026 — CitizenTech**  
> **Disciplina:** Mobile Development & IoT (3ESA)

## Integrantes

- Augusto Ferreira — RM 557709
- Heitor Prestes — RM 554823

O **MoveSmart** é um aplicativo desenvolvido em **React Native, Expo e TypeScript** para ajudar passageiros a consultar linhas de ônibus, visualizar atrasos e níveis de lotação simulados, registrar problemas e acompanhar alertas de superlotação. Um perfil **Agente** pode consultar os relatos locais e operar uma simulação de contagem de passageiros.

> **Aviso importante:** as linhas `SIM-01` a `SIM-04`, os trajetos, horários, atrasos, leituras de ocupação e alertas deste protótipo são **fictícios**. Não há conexão com a API Olho Vivo/SPTrans nem previsões geradas por Machine Learning. **Não utilize essas informações para planejar viagens reais.**

---
## Ficha CitizenTech

### Problema

Passageiros do transporte público de São Paulo enfrentam atrasos, superlotação e falta de informações claras sobre as condições dos ônibus. Essas situações dificultam o planejamento de viagens e podem aumentar o tempo de espera.

### Solução proposta

Um aplicativo mobile que concentra consultas de linhas, atrasos e lotação, permite relatos dos cidadãos e apresenta alertas de superlotação com base em um sensor **simulado** de entrada e saída de passageiros.

### Público beneficiado

- Cidadãos que utilizam ônibus municipais, especialmente trabalhadores, estudantes, idosos e passageiros frequentes.
- Agentes e profissionais responsáveis por acompanhar ocorrências do transporte (perfil demonstrativo).

### Hipóteses do projeto

1. Exibir atraso e ocupação em uma única interface facilita a compreensão da situação de uma linha.
2. Relatos de passageiros podem complementar indicadores de operação e auxiliar no acompanhamento de problemas.
3. Alertas baseados em ocupação estimada ou simulada podem ajudar a identificar situações críticas.
4. Uma interface acessível, com rótulos claros e áreas de toque adequadas, torna a consulta mais simples.

> Essas são **hipóteses de projeto**, não são resultados de pesquisa com usuários.

### Indicadores propostos

| Indicador | Como acompanhar | Situação neste protótipo |
|---|---|---|
| Linhas monitoradas | Quantidade de linhas disponíveis | Contagem de 4 linhas fictícias |
| Linhas com atraso | Quantidade com `atrasoMin > 0` | Calculada a partir de mocks |
| Alertas de superlotação | Quantidade de leituras com ocupação ≥ 85% | Calculada a partir das leituras simuladas |
| Relatos registrados | Quantidade de ocorrências salvas | AsyncStorage; agente vê o total local e cidadão vê as próprias |
| Ocupação por linha | Passageiros ÷ capacidade × 100 | Sensor simulado, não medição real |
| Usabilidade e acessibilidade | Validação de formulários, navegação, rótulos e testes assistivos | Recursos implementados; avaliação completa depende de testes com usuários/leitores de tela |

### Objetivos de Desenvolvimento Sustentável (ODS)

- **ODS 9 — Indústria, Inovação e Infraestrutura:** aplicação de recursos digitais no monitoramento de mobilidade.
- **ODS 11 — Cidades e Comunidades Sustentáveis:** apoio à discussão de mobilidade urbana mais informada e acessível.

---

## Funcionalidades implementadas

| Funcionalidade | Descrição |
|---|---|
| Login | Autenticação local demonstrativa com perfis de **Cidadão** e **Agente** |
| Criar conta | Cadastro local de novos cidadãos; valida nome, e-mail, senha e confirmação |
| Sessão persistente | Recuperação da sessão com **Context API + AsyncStorage** |
| Home | Painel com linhas monitoradas, linhas com atraso, alertas IoT, relatos e acesso rápido |
| Consulta de linhas | Busca por código, origem ou destino; lista de ônibus fictícios |
| Detalhes da linha | Trajeto, previsão de chegada mockada, atraso e ocupação IoT simulada |
| Relatar problema | Formulário de atraso, superlotação ou outro, com máscara de horário `HH:mm` e descrição validada |
| Histórico de relatos | Cidadão consulta seus registros; agente consulta todos os registros locais |
| Monitoramento IoT | Quantidade de passageiros, capacidade, porcentagem de ocupação e níveis de lotação |
| Contagem manual | Agente registra entradas e saídas de **vários passageiros de uma vez** |
| Simulação automática | Movimentações fictícias a cada 3 segundos; permanece associada à linha em que foi iniciada, mesmo se outra linha for selecionada para visualização |
| Alertas de superlotação | Aviso no monitoramento, na lista, nos detalhes e no painel inicial quando a ocupação atinge 85% |
| Acessibilidade | Rótulos para leitores de tela, cabeçalhos, dicas, estados de seleção, mensagens textuais e melhorias nas áreas de toque |

### Perfis e permissões

| Recurso | Cidadão | Agente |
|---|:---:|:---:|
| Consultar linhas e detalhes | ✅ | ✅ |
| Consultar indicadores e alertas IoT | ✅ | ✅ |
| Registrar relatos | ✅ | — |
| Consultar os próprios relatos | ✅ | — |
| Consultar todos os relatos disponíveis localmente | — | ✅ |
| Registrar entradas e saídas de passageiros | — | ✅ |
| Iniciar/parar a simulação automática | — | ✅ |
| Criar uma conta pelo app | ✅ | — |

As permissões acima são aplicadas na interface e na navegação **para demonstração acadêmica**. Não equivalem a autorização segura feita por um servidor.

---

## Tecnologias e bibliotecas utilizadas

| Tecnologia / biblioteca | Uso no MoveSmart |
|---|---|
| **React Native** | Interface mobile com `View`, `Text`, `TextInput`, `Pressable`, `ScrollView` e estilos |
| **Expo** / Expo CLI | Criação e execução do aplicativo em desenvolvimento |
| **TypeScript** | Tipagem de usuários, linhas, relatos e leituras IoT |
| **Expo Router** | Navegação por arquivos, rotas dinâmicas e rotas protegidas com `Stack` |
| **React Context API** | Compartilhamento do usuário autenticado e das ações de login/logout |
| **React Hooks** | `useState`, `useEffect`, `useCallback`, `useRef`, `useFocusEffect` |
| **AsyncStorage** (`@react-native-async-storage/async-storage`) | Persistência de sessão, cadastros, relatos e medições IoT |
| **expo-crypto** | Geração de salt aleatório e hash SHA-256 no cadastro demonstrativo |
| **StyleSheet** | Estilos separados das telas e da lógica |
| **react-native-web** / **react-dom** | Execução e testes no navegador, conforme dependências do projeto |
| **Node.js + npm** | Instalação de dependências e execução do ambiente de desenvolvimento |
| **Visual Studio Code** | Editor utilizado no desenvolvimento |
| **Git / GitHub** | Versionamento e entrega do código |

**Versões:** as versões exatas do Expo, React Native e demais bibliotecas devem ser consultadas no `package.json` e no arquivo de lock (`package-lock.json`) do repositório. Não é necessário instalar cada biblioteca manualmente ao clonar o projeto: o `npm install` instala as dependências declaradas ali.

### Dependências instaladas especificamente para o MoveSmart

```bash
npx expo install @react-native-async-storage/async-storage
npx expo install expo-crypto
```

O Expo Router, React Native, React e demais dependências de base vieram do projeto criado com `create-expo-app` e são gerenciados pelo `package.json`.

---

## Pré-requisitos

Antes de executar, instale:

1. **Node.js (versão LTS)**, que inclui o npm: https://nodejs.org/
2. **Git** para clonar o repositório (ou baixe o ZIP): https://git-scm.com/
3. **Visual Studio Code** ou outro editor, caso queira abrir o código: https://code.visualstudio.com/
4. **Expo Go** no celular para testar em dispositivo físico, quando compatível com o SDK instalado: https://expo.dev/go
5. Um navegador atualizado para a execução **Web**, se desejar testá-la no computador.

**Não é necessário instalar Android Studio, Xcode, banco de dados ou servidor backend** para executar a versão de demonstração pelo Expo Go ou navegador. Emuladores são opcionais.

Confira o Node.js e o npm no terminal:

```bash
node -v
npm -v
```

---

## Como baixar, instalar e executar o projeto

### Baixar o código

**Opção A — Clonar o repositório:**

```bash
git clone URL_DO_REPOSITORIO_GITHUB
cd movesmart
```

Substitua `URL_DO_REPOSITORIO_GITHUB` pelo endereço real do repositório. Se a pasta clonada tiver outro nome, use o nome correspondente no comando `cd`.

**Opção B — Baixar ZIP:** no GitHub, clique em **Code → Download ZIP**, extraia a pasta e abra um terminal dentro dela.

### Instalar as dependências

Na pasta raiz do projeto, onde está o `package.json`, execute:

```bash
npm install
```

Este comando instala as dependências declaradas no projeto. **Não execute `npx create-expo-app` para abrir um projeto já baixado**: isso criaria um projeto novo.

Se houver um `package-lock.json` atualizado e você quiser uma instalação reproduzível, pode usar `npm ci` no lugar de `npm install`.

### Iniciar o servidor Expo

```bash
npx expo start
```

O terminal mostrará um QR Code e as opções de execução.

#### Executar no celular

1. Instale e abra o **Expo Go**.
2. Conecte o computador e o celular **à mesma rede Wi-Fi**.
3. Inicie o projeto com `npx expo start`.
4. Escaneie o QR Code (pelo Expo Go no Android ou pela câmera/fluxo do Expo Go no iOS).
5. O MoveSmart deverá abrir no celular.

Em dispositivos iOS físicos, a versão atual do Expo Go pode exigir login na **mesma conta Expo** no celular e na CLI. Se o app não conectar pela rede local, tente:

```bash
npx expo start --tunnel
```

O modo tunnel pode ser mais lento e pode precisar instalar uma dependência adicional quando solicitado pelo Expo.

#### Executar no navegador (Web)

1. Inicie o servidor:

   ```bash
   npx expo start
   ```
2. Com o terminal do Expo aberto, pressione **`w`**.
3. O navegador abrirá a versão Web. O endereço local normalmente utiliza `localhost:8081`, mas pode variar.

> O foco do projeto é **mobile-first**. A versão Web serve principalmente para desenvolvimento e demonstração.

#### Executar em emulador (opcional)

Com Android Studio/emulador ou Xcode/simulador previamente configurado, use as opções indicadas no terminal do Expo (`a` ou `i`, quando disponíveis).

### Limpar o cache se houver problemas

Pare o servidor com **Ctrl + C** e execute:

```bash
npx expo start -c
```

Esse comando limpa o cache do bundler, mas **não remove os dados já salvos no AsyncStorage**.

### Verificar os tipos do projeto

```bash
npx tsc --noEmit
```

O comando verifica erros de TypeScript sem gerar arquivos de saída.

**Importante:** sempre execute os comandos na **raiz do projeto**, onde está `package.json`.

---

## Contas para demonstração

O projeto mantém duas contas fictícias iniciais, além de permitir o cadastro de novos cidadãos:

| Perfil | E-mail | Senha |
|---|---|---|
| Cidadão | `cidadao@movesmart.com` | `12345678` |
| Agente | `agente@movesmart.com` | `12345678` |

> As contas são **exclusivamente de teste**. As senhas estão presentes no código-fonte dos mocks e não devem ser reutilizadas em contas pessoais.

### Criar uma conta nova

1. Abra o MoveSmart na tela de **Login**.
2. Selecione **Criar Conta**.
3. Informe **nome completo**, **e-mail**, **senha** (8 a 72 caracteres) e **confirmação da senha**.
4. Confirme o cadastro e volte ao Login.
5. Entre usando as credenciais cadastradas.

O cadastro verifica os campos, a correspondência das senhas e a duplicidade de e-mails. **Apenas contas do perfil Cidadão podem ser criadas pela interface**; o perfil Agente é demonstrativo e pré-configurado.

Os cadastros novos ficam no armazenamento local da instalação/navegador. Não são sincronizados com outros dispositivos.

---

## Como demonstrar as funcionalidades

### Jornada do Cidadão

1. Faça login como Cidadão ou crie uma conta.
2. Na **Home**, observe os indicadores gerais e as linhas que precisam de atenção.
3. Acesse **Consultar Linhas** e pesquise um código como `SIM-02` ou uma região como `Centro`.
4. Selecione um card para abrir os **Detalhes da Linha**.
5. Consulte o atraso, o tempo estimado de chegada e a ocupação **simulada**.
6. Toque em **Relatar Problema** e selecione *Atraso*, *Lotação* ou *Outro*.
7. Preencha o horário em formato `HH:mm` (ex.: digitar `1830` gera `18:30`) e uma descrição entre 10 e 500 caracteres.
8. Salve o relato e abra **Meus Relatos** para consultar seu histórico.
9. Abra **Monitoramento IoT** para visualizar as leituras, sem acesso aos controles de simulação.

### Jornada do Agente

1. Faça login com a conta Agente.
2. Na Home, consulte os indicadores e os alertas de superlotação.
3. Acesse **Consultar Relatos** para visualizar as ocorrências armazenadas localmente, incluindo o cidadão que as registrou.
4. Acesse **Monitoramento IoT** e selecione uma linha.
5. Informe uma quantidade e utilize **+ Entrada** ou **− Saída** para simular movimentações em grupo.
6. Inicie a **Simulação Automática** e, se desejar, selecione outra linha para consulta: a simulação permanece ligada à linha em que foi iniciada.
7. Interrompa a simulação pelo botão correspondente.
8. Retorne à Home, à listagem e aos detalhes: as leituras salvas serão consultadas novamente ao entrar nessas telas.

A simulação automática é executada na tela do monitoramento; **não permanece executando em segundo plano** quando a tela deixa de estar ativa.

---

## Como funciona a simulação IoT

Não utilizamos sensores físicos. O MoveSmart **simula** leituras de um contador de passageiros por linha, com capacidade inicial configurada de 60 passageiros por ônibus.

### Dados iniciais

| Linha fictícia | Passageiros iniciais | Capacidade | Ocupação inicial |
|---|---:|---:|---:|
| SIM-01 | 18 | 60 | 30% |
| SIM-02 | 54 | 60 | 90% |
| SIM-03 | 39 | 60 | 65% |
| SIM-04 | 32 | 60 | 53% |

Esses valores são utilizados **somente na primeira inicialização do armazenamento IoT**. Depois disso, o app recupera as últimas leituras gravadas.

### Cálculo e classificação

```text
Ocupação (%) = (quantidade de passageiros / capacidade) × 100
```

| Ocupação | Nível de lotação | Alerta |
|---|---|---|
| Menos de 50% | Baixa | Não |
| De 50% a menos de 80% | Média | Não |
| De 80% a menos de 85% | Alta | Não |
| 85% ou mais | Alta | **Sim — superlotação** |

A ocupação exibida é arredondada para um número inteiro. Os limiares são **regras escolhidas para o protótipo**, não limites oficiais da SPTrans.

### Modos de operação

- **Manual (Agente):** informa uma quantidade inteira positiva e registra entrada ou saída. O sistema impede ultrapassar a capacidade ou retirar mais passageiros do que existem.
- **Automático (Agente):** a cada **3 segundos**, gera uma movimentação aleatória entre **−3 e +5 passageiros**, respeitando os limites de 0 à capacidade.
- **Consulta (Cidadão):** acompanha a última medição simulada, sem controles de alteração.
- **Persistência:** a leitura atualizada é salva no AsyncStorage e reaparece nas telas de Home, Linhas, Detalhes e Monitoramento quando esses dados são recarregados.

Existe **uma simulação automática ativa por vez**. Ela permanece associada à linha em que foi iniciada mesmo que o Agente selecione outra para visualização.

### Diferença entre atraso, lotação e relato

- **Atraso / previsão de chegada:** valores **fixos de demonstração** presentes nos mocks de linhas.
- **Lotação:** estimada a partir da **contagem IoT simulada** e atualizada pelas ações do agente.
- **Relato:** informação inserida manualmente pelo cidadão e armazenada localmente; **não modifica automaticamente** os valores de atraso ou as medições dos sensores.

---

## Persistência de dados (AsyncStorage)

O app organiza a leitura e a gravação dos dados na camada `services`, usando as seguintes chaves:

| Chave | Conteúdo |
|---|---|
| `@movesmart:usuario` | Dados básicos da sessão autenticada |
| `@movesmart:contas` | Contas de cidadãos cadastradas localmente e hashes demonstrativos das senhas |
| `@movesmart:relatos` | Relatos, horários, descrições e identificação de quem registrou |
| `@movesmart:iot` | Quantidade de passageiros, ocupação, alertas e data da última medição por linha |

No navegador, o armazenamento é vinculado à origem do site e ao perfil do navegador. No celular, ele fica associado à instalação do aplicativo. **Não existe sincronização entre dispositivos** nem um banco de dados remoto.

Os dados podem ser perdidos ao apagar os dados do app/navegador ou desinstalar a aplicação. O logout remove a sessão, mas preserva as contas, os relatos e as leituras locais.

### Segurança e limitações da autenticação

O cadastro demonstrativo utiliza `expo-crypto` para gerar um **salt aleatório** e um **hash SHA-256** da senha. Isso evita salvar a senha cadastrada literalmente, mas **SHA-256 com salt não é uma solução adequada de armazenamento de senhas de produção**. O AsyncStorage não é criptografado, e o login e as permissões são controlados localmente.

Em uma aplicação real, seria necessário um backend com autenticação e autorização no servidor, armazenamento seguro e algoritmo de derivação de senha apropriado (por exemplo, Argon2id), além de políticas de privacidade e proteção de dados.

---

## Arquitetura e organização do código

O projeto utiliza uma arquitetura simples, separando **telas, estilos, contextos, serviços e dados simulados**:

```text
movesmart/
├── assets/                         # Imagens e recursos do projeto/Expo
├── src/
│   ├── app/                        # Telas e rotas do Expo Router
│   │   ├── _layout.tsx             # Stack, rotas protegidas e navegação
│   │   ├── index.tsx               # Login
│   │   ├── cadastro.tsx            # Criação de conta de cidadão
│   │   ├── home.tsx                # Painel inicial
│   │   ├── linhas.tsx              # Lista e pesquisa de linhas
│   │   ├── linhas/
│   │   │   └── [id].tsx            # Detalhes de cada linha
│   │   ├── relatar.tsx             # Formulário de relatos
│   │   ├── relatos.tsx             # Histórico/consulta de relatos
│   │   └── iot.tsx                 # Monitoramento e simulação IoT
│   ├── components/                 # Componentes reutilizáveis
│   ├── contexts/
│   │   └── AuthContext.tsx         # Estado de autenticação
│   ├── mocks/
│   │   ├── usuarios.ts             # Contas de teste e tipos de usuário
│   │   └── linhas.ts              # Linhas fictícias e tipos
│   ├── services/
│   │   ├── authService.ts          # Cadastro, login e sessão
│   │   ├── linhasService.ts        # Consulta e integração com leituras IoT
│   │   ├── relatosService.ts       # Validação e persistência dos relatos
│   │   └── iotService.ts           # Cálculo, movimentação e persistência IoT
│   ├── styles/
│   │   ├── common.ts               # Estilos compartilhados
│   │   ├── homeStyles.ts
│   │   ├── linhasStyles.ts
│   │   ├── relatarStyles.ts
│   │   ├── relatosStyles.ts
│   │   └── iotStyles.ts
│   ├── constants/                  # Arquivos auxiliares remanescentes do template
│   └── hooks/                      # Arquivos auxiliares remanescentes do template
├── app.json                        # Configuração do Expo
├── package.json                    # Scripts e dependências
├── package-lock.json               # Versões resolvidas pelo npm, se versionado
├── tsconfig.json                   # Configuração do TypeScript
└── README.md                       # Esta documentação
```

> Algumas pastas do template podem conter arquivos adicionais, conforme a versão do Expo utilizada; a lista acima destaca os arquivos centrais do MoveSmart.

### Fluxos principais

```text
Login/Cadastro → AuthContext → authService → AsyncStorage

Home/Lista/Detalhes → linhasService → mocks de linhas
                                 └→ iotService → AsyncStorage

Relatar Problema → relatosService → AsyncStorage → Meus Relatos / Consultar Relatos

Monitoramento IoT → iotService → cálculo da ocupação → AsyncStorage
                                              └→ alerta quando ≥ 85%
```

### Rotas principais

| Caminho | Tela | Acesso |
|---|---|---|
| `/` | Login / redirecionamento após autenticação | Público |
| `/cadastro` | Cadastro | Não autenticado |
| `/home` | Painel inicial | Autenticado |
| `/linhas` | Consulta de linhas | Autenticado |
| `/linhas/[id]` | Detalhes de uma linha | Autenticado |
| `/relatar` | Novo relato | Cidadão |
| `/relatos` | Consulta de relatos | Autenticado (conteúdo por perfil) |
| `/iot` | Monitoramento IoT | Autenticado (controles do Agente) |

O Expo Router gerencia a navegação com `Stack`, `Stack.Protected` e redirecionamento de sessão. O aplicativo preserva a rota nas atualizações de página enquanto recupera a sessão local.

---

## Validações e acessibilidade

### Validações de formulários

- **Cadastro:** nome de 3 a 80 caracteres, e-mail válido/não duplicado, senha de 8 a 72 caracteres e confirmação igual.
- **Login:** campos obrigatórios, formato de e-mail e verificação das credenciais.
- **Relato:** tipo de problema obrigatório, horário válido em `HH:mm`, descrição entre 10 e 500 caracteres e linha válida.
- **IoT manual:** quantidade inteira positiva e dentro dos limites de ocupação da linha.

### Recursos de acessibilidade implementados

- Uso de `accessibilityRole="header"` em títulos.
- `accessibilityLabel` e `accessibilityHint` nos campos e botões.
- `accessibilityState` para seleção, processamento e ações desabilitadas.
- Mensagens textuais de erro e sucesso, com `accessibilityLiveRegion` em locais adequados.
- Botões e campos com dimensões mínimas para toque e fontes legíveis.
- Alertas descritos por texto, sem depender apenas da cor.
- Campos com preenchimento automático apropriado e teclado numérico quando necessário.
- Layout **mobile-first** e rolagem nas telas com mais conteúdo.

Os recursos foram implementados e verificados funcionalmente durante o desenvolvimento; uma auditoria completa de acessibilidade requer testes adicionais com **TalkBack, VoiceOver, navegação por teclado e pessoas usuárias**.

---

## Testes realizados e como reproduzi-los

O protótipo foi verificado manualmente ao longo do desenvolvimento, incluindo:

1. Cadastro e login com contas locais e com as contas de demonstração.
2. Validação de e-mails, senhas, campos obrigatórios e descrições.
3. Navegação entre Home, Linhas, Detalhes, Relatos, Cadastro e IoT.
4. Preservação da sessão e das rotas ao recarregar a versão Web com `F5`.
5. Busca de linhas por código e região.
6. Registro e consulta de relatos com visualização diferenciada por perfil.
7. Simulação manual de entrada e saída de vários passageiros.
8. Simulação automática por linha e troca da linha visualizada sem interromper a simulação ativa.
9. Ativação e desativação de alertas de superlotação no limiar de 85%.
10. Atualização dos indicadores da Home e dos detalhes após novas leituras.
11. Verificação de tipos com:

   ```bash
   npx tsc --noEmit
   ```

> Esses são **testes manuais e de tipagem**; não se afirma a existência de uma suíte automatizada de testes unitários/E2E.

---

## Capturas de tela (prints)

**Antes da entrega:** crie a pasta `docs/screenshots/` no repositório e adicione prints reais do aplicativo, preferencialmente na visualização mobile.

Sugestões de nomes:

```text
docs/
└── screenshots/
    ├── 01-login.png
    ├── 02-cadastro.png
    ├── 03-home-cidadao.png
    ├── 04-linhas.png
    ├── 05-detalhes-linha.png
    ├── 06-relatar-problema.png
    ├── 07-meus-relatos.png
    ├── 08-home-agente.png
    ├── 09-consulta-relatos-agente.png
    └── 10-monitoramento-iot.png
```

Após colocar os arquivos, adicione imagens ao README com a sintaxe:

```markdown
![Tela de Login](docs/screenshots/01-login.png)
![Home do Cidadão](docs/screenshots/03-home-cidadao.png)
![Monitoramento IoT](docs/screenshots/10-monitoramento-iot.png)
```

**Este README ainda não incorpora prints reais**, pois eles precisam ser adicionados aos caminhos acima no repositório. Evite publicar capturas com informações pessoais, senhas ou dados reais de usuários.

---

## Vídeo de apresentação

**Duração máxima da entrega:** 3 minutos.  
**Link do vídeo:** `ADICIONAR_LINK_DO_VIDEO_AQUI`

---

## Limitações e possíveis evoluções

### Limitações atuais

- Linhas, trajetos, previsões e atrasos são **fictícios**.
- Sem integração com a **SPTrans / API Olho Vivo**.
- Sem **Machine Learning** implementado nesta entrega de Mobile & IoT.
- IoT **simulado por software**; não há sensores físicos, ESP32 ou comunicação MQTT.
- Dados, contas e relatos são armazenados **somente localmente**.
- Sem backend, banco remoto, notificações push ou sincronização entre dispositivos.
- Segurança e autorização demonstrativas, inadequadas para produção.
- Não há mapa ou rastreamento GPS em tempo real.

### Evoluções futuras

- Integração com dados oficiais de ônibus de São Paulo, quando disponíveis e autorizados.
- Backend e autenticação segura com armazenamento remoto de relatos e contas.
- Modelo de estimativa de atraso ou lotação baseado em dados históricos reais e avaliação documentada.
- Integração real com sensores de contagem, ESP32/MQTT ou serviço de telemetria.
- Notificações, favoritos, filtros, mapa e recomendações de alternativas de deslocamento.
- Testes automatizados e avaliação de acessibilidade com usuários.

---
### Referências técnicas

- [Expo — Criar e iniciar um projeto](https://docs.expo.dev/get-started/start-developing/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [AsyncStorage no Expo](https://docs.expo.dev/versions/latest/sdk/async-storage/)
- [expo-crypto](https://docs.expo.dev/versions/latest/sdk/crypto/)
- [Documentação do React Native](https://reactnative.dev/docs/getting-started)
- [API Olho Vivo / SPTrans](https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/) — **referência para possível integração futura; não utilizada nesta versão**

---

**MoveSmart — Mobilidade Urbana Inteligente**  
*Protótipo acadêmico Mobile & IoT para a CitizenTech em São Paulo.*
