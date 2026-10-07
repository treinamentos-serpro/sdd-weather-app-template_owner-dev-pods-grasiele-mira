# Backlog de Tarefas — Aplicação de previsão do tempo

Tarefas derivadas de [plans/weather-app-plan.md](../plans/weather-app-plan.md) e rastreadas aos requisitos de [specs/weather-app-spec.md](../specs/weather-app-spec.md). As entregas seguem a ordem de implementação; dentro de cada entrega, as dependências explícitas indicam o que precisa estar pronto antes do início de cada tarefa.

**Escalas:** P0 bloqueia a primeira entrega funcional visível; P1 é necessário para robustez e prontidão de release; P2 é uma verificação secundária de menor risco. Tamanho P = escopo focado, M = módulo ou conjunto limitado de cenários, G = orquestração, múltiplas respostas ou fluxo integrado.

## Entrega 1 — Decisões e tipos

### T-01 — Confirmar os dados apresentados
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** M
- **Descrição:** Fechar as decisões de produto que afetam o modelo e a interface, em especial variáveis do clima atual/previsão e contexto geográfico dos resultados de cidades.
- **Critérios de aceite:** A spec registra uma decisão explícita para as perguntas abertas sobre campos do clima e contexto geográfico, ou marca cada pergunta como adiada; enumera os campos e a regra de exibição escolhidos sem contradizer os critérios de FR-1 a FR-3.
- **Requisitos:** FR-1, FR-2, FR-3; US-1, US-2, US-3
- **Dependências:** —
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`

### T-02 — Definir tipos do domínio meteorológico
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M
- **Descrição:** Criar os tipos internos `Unit`, `City`, `CurrentWeather`, `ForecastDay` e `WeatherData`, sem acoplá-los ao formato JSON da Open-Meteo.
- **Critérios de aceite:** `Unit` só aceita `celsius` ou `fahrenheit`; `City`, `CurrentWeather`, `ForecastDay` e `WeatherData` declaram os campos do plano/T-01; temperaturas internas usam Celsius, vento km/h e precipitação mm; metadados opcionais aceitam ausência; `pnpm exec tsc --noEmit --strict src/types/weather.ts` termina com código de saída 0.
- **Requisitos:** FR-1, FR-2, FR-3, FR-4; US-1, US-2, US-3, US-4; NFR-4
- **Dependências:** T-01
- **Arquivos prováveis:** `src/types/weather.ts`

## Entrega 2 — Funções puras

### T-03 — Implementar conversão de temperatura
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** P
- **Descrição:** Criar funções puras para converter Celsius para Fahrenheit e formatar temperatura com a unidade selecionada.
- **Critérios de aceite:** A conversão retorna 32 para 0 °C, 212 para 100 °C e -40 para -40 °C; cobre também entrada decimal; a formatação inclui °C ou °F e arredonda sempre para uma casa decimal; chamadas não alteram o valor recebido.
- **Requisitos:** FR-4; US-4
- **Dependências:** T-02
- **Arquivos prováveis:** `src/lib/temperature.ts`

### T-04 — Mapear códigos meteorológicos WMO
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M
- **Descrição:** Mapear os códigos WMO utilizados pela API para descrições em pt-BR.
- **Critérios de aceite:** Cada código declarado como suportado retorna uma descrição pt-BR não vazia; qualquer código não mapeado retorna o mesmo fallback não vazio; a função produz a mesma saída para a mesma entrada e não executa I/O.
- **Requisitos:** FR-2, FR-3; US-2, US-3; NFR-5
- **Dependências:** T-02
- **Arquivos prováveis:** `src/lib/weatherCode.ts`

### T-05 — Normalizar respostas da Open-Meteo
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** G
- **Descrição:** Implementar mapeadores puros de geocoding, clima atual e previsão para os tipos internos.
- **Critérios de aceite:** Fixtures válidas de geocoding, current e daily produzem os campos internos definidos no plano/T-01; `is_day` 0 e 1 vira `false` e `true`; datas de entrada permanecem iguais após o mapeamento; campo obrigatório ausente, arrays diários de comprimentos diferentes ou menos de cinco datas produzem erro de dados inválidos; nenhum valor ausente é substituído por valor fabricado.
- **Requisitos:** FR-1, FR-2, FR-3, FR-6; US-1, US-2, US-3, US-6; NFR-4
- **Dependências:** T-01, T-02
- **Arquivos prováveis:** `src/lib/openMeteoMappers.ts`

## Entrega 3 — Services

### T-06 — Implementar busca de cidades
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M
- **Descrição:** Criar o serviço de geocoding com URL e parâmetros da Open-Meteo, retornando cidades normalizadas.
- **Critérios de aceite:** `searchCities` aceita consulta e `AbortSignal` opcional; a URL contém `name`, `count`, `language=pt` e `format=json`; resposta válida sem resultados retorna sucesso com `[]`; respostas HTTP não OK, erro do provedor, rejeição de rede, timeout e JSON inválido retornam o `kind` correspondente, sem rejeição não tratada da Promise.
- **Requisitos:** FR-1, FR-6; US-1, US-6; NFR-4
- **Dependências:** T-01, T-02, T-05
- **Arquivos prováveis:** `src/services/geocoding.ts`

### T-07 — Implementar consulta do clima atual
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M
- **Descrição:** Criar o serviço para consultar as condições atuais de uma cidade selecionada.
- **Critérios de aceite:** `getCurrentWeather` aceita `City` e `AbortSignal` opcional; a requisição contém as variáveis decididas em T-01 e os parâmetros Celsius, km/h, mm e `timezone=auto`; resposta válida retorna `CurrentWeather`; falhas de rede, API, timeout e dados inválidos retornam os respectivos tipos de erro.
- **Requisitos:** FR-2, FR-6; US-2, US-6; NFR-4
- **Dependências:** T-01, T-02, T-05
- **Arquivos prováveis:** `src/services/weather.ts`

### T-08 — Implementar consulta de previsão diária
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M
- **Descrição:** Criar o serviço de previsão independente do serviço de clima atual.
- **Critérios de aceite:** `getForecast` aceita `City` e `AbortSignal` opcional; a requisição pede cinco dias incluindo hoje, com Celsius, km/h, mm e `timezone=auto`; resposta válida retorna exatamente cinco `ForecastDay`; resposta com menos de cinco dias ou dados inválidos retorna erro tipado e não cria dias ou valores.
- **Requisitos:** FR-3, FR-6; US-3, US-6; NFR-4
- **Dependências:** T-01, T-02, T-05
- **Arquivos prováveis:** `src/services/weather.ts`

## Entrega 4 — Hook de estado

### T-09 — Implementar o hook `useWeather`
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** G
- **Descrição:** Centralizar consulta, seleção de cidade, estados assíncronos independentes e unidade em um hook.
- **Critérios de aceite:** Consulta vazia ou só com espaços faz zero chamadas a `searchCities`; busca transita por `idle`, `loading`, `success`, `empty` ou `error`; seleção chama current e forecast antes de resolver qualquer uma das Promises; falha em uma seção preserva o sucesso da outra; resposta de consulta anterior não substitui estado da consulta mais recente; cancelamento intencional não gera estado `error`; retry chama somente a operação com falha; unidade inicial é Celsius e alterá-la não chama services.
- **Requisitos:** FR-1, FR-2, FR-3, FR-4, FR-6; US-1, US-2, US-3, US-4, US-6; NFR-4
- **Dependências:** T-02, T-03, T-06, T-07, T-08
- **Arquivos prováveis:** `src/hooks/useWeather.ts`

## Entrega 5 — Componentes de UI

### T-10 — Implementar busca e seleção de cidade
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** M
- **Descrição:** Criar os componentes de entrada e resultados da busca, incluindo os estados da pesquisa.
- **Critérios de aceite:** O campo tem nome acessível consultável por role/label; Enter envia uma consulta não vazia; consulta vazia não chama callback e mostra orientação em pt-BR; loading, empty e error têm conteúdo textual distinto; cada resultado exibe nome e todos os campos geográficos disponíveis; resultados podem ser selecionados por teclado; retry invoca o callback uma vez.
- **Requisitos:** FR-1, FR-6; US-1, US-6; NFR-2, NFR-3, NFR-5
- **Dependências:** T-01, T-02
- **Arquivos prováveis:** `src/components/CitySearch.tsx`, `src/components/CityResults.tsx`

### T-11 — Implementar apresentação do clima atual
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** P
- **Descrição:** Apresentar cidade selecionada, condições atuais e estados da consulta atual.
- **Critérios de aceite:** Para `idle`, `loading`, `success` e `error`, o componente renderiza conteúdo distinto; em `success`, mostra a cidade e os campos de T-01, temperatura com °C/°F e descrição WMO; em `error`, não renderiza valores meteorológicos e o retry aciona apenas o callback de clima atual.
- **Requisitos:** FR-2, FR-6; US-2, US-6; NFR-2, NFR-4, NFR-5
- **Dependências:** T-01, T-02, T-03, T-04
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`

### T-12 — Implementar apresentação da previsão
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** P
- **Descrição:** Apresentar a previsão de cinco dias com data, condição e temperaturas diárias.
- **Critérios de aceite:** Para `idle`, `loading`, `success` e `error`, o componente renderiza conteúdo distinto; em `success`, mostra exatamente cinco dias, cada um com a data e os campos de T-01, e temperaturas com a unidade selecionada; em `error`, não renderiza previsão como válida e o retry aciona apenas o callback de forecast.
- **Requisitos:** FR-3, FR-6; US-3, US-6; NFR-2, NFR-4, NFR-5
- **Dependências:** T-01, T-02, T-03, T-04
- **Arquivos prováveis:** `src/components/ForecastList.tsx`

### T-13 — Implementar controle de unidade
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** P
- **Descrição:** Criar o controle acessível para alternar entre Celsius e Fahrenheit.
- **Critérios de aceite:** O controle renderiza as opções Celsius e Fahrenheit; Celsius está selecionado quando inicializado; cada opção tem nome acessível e estado selecionado exposto; teclado consegue alternar a seleção e o callback recebe a unidade escolhida.
- **Requisitos:** FR-4; US-4; NFR-3
- **Dependências:** T-02, T-03
- **Arquivos prováveis:** `src/components/TemperatureUnitControl.tsx`

## Entrega 6 — Integração

### T-14 — Compor a aplicação Weather App
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** G
- **Descrição:** Integrar busca, seleção, clima atual, previsão e unidade usando o hook como fonte do estado compartilhado.
- **Critérios de aceite:** Selecionar um resultado exibe a cidade selecionada e repassa seus estados meteorológicos; busca e current/forecast podem exibir estados independentes; alternar unidade atualiza temperaturas atual e diária sem alterar cidade/datas nem chamar services; antes da primeira busca, a tela mostra estado inicial sem dados meteorológicos.
- **Requisitos:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6; US-1 a US-6; NFR-2, NFR-5
- **Dependências:** T-09, T-10, T-11, T-12, T-13
- **Arquivos prováveis:** `src/components/WeatherApp.tsx`, `src/App.tsx`

## Entrega 7 — Testes automatizados

### T-15 — Testar conversão de unidade Celsius/Fahrenheit
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** P
- **Descrição:** Testar com Vitest as funções puras de conversão e apresentação entre Celsius e Fahrenheit.
- **Critérios de aceite:** Vitest verifica 0 °C = 32 °F, 100 °C = 212 °F, -40 °C = -40 °F e ao menos um valor decimal; verifica rótulos °C/°F e arredondamento para uma casa decimal; os testes não importam DOM nem fazem requisições.
- **Requisitos:** FR-4; US-4
- **Dependências:** T-03
- **Arquivos prováveis:** `tests/unit/lib/temperature.test.ts`

### T-16 — Testar mapeamento de códigos meteorológicos
- **Tipo:** Test
- **Prioridade:** P2
- **Tamanho:** P
- **Descrição:** Verificar a descrição pt-BR dos códigos WMO e o fallback para código desconhecido.
- **Critérios de aceite:** Vitest verifica a descrição esperada para cada código presente no mapa e que uma entrada não mapeada retorna o fallback definido; as descrições não são vazias e os testes não usam DOM nem rede.
- **Requisitos:** FR-2, FR-3; US-2, US-3; NFR-5
- **Dependências:** T-04
- **Arquivos prováveis:** `tests/unit/lib/weatherCode.test.ts`

### T-17 — Testar normalização de respostas e datas
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** M
- **Descrição:** Cobrir os mapeadores puros dos payloads de geocoding, clima atual e previsão.
- **Critérios de aceite:** Vitest verifica mapeamento dos campos obrigatórios em fixtures válidas, conversão de `is_day` 0/1, preservação literal da data, erro para campo obrigatório ausente, arrays paralelos desalinhados e previsão com menos de cinco dias; testes não usam DOM nem rede.
- **Requisitos:** FR-1, FR-2, FR-3, FR-6; US-1, US-2, US-3, US-6; NFR-4
- **Dependências:** T-05
- **Arquivos prováveis:** `tests/unit/lib/openMeteoMappers.test.ts`

### T-18 — Testar services com mock de fetch
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** G
- **Descrição:** Verificar URLs, parâmetros, normalização e falhas dos services sem chamadas externas, usando `fetch` mockado.
- **Critérios de aceite:** Vitest confirma que todas as chamadas usam o mock e nenhuma requisição real ocorre; verifica URL/parâmetros e payload válido de geocoding, current e forecast; cobre geocoding com lista vazia, HTTP não OK, erro do provedor, rejeição de rede, timeout, JSON/payload inválido e propagação de `AbortSignal`; cancelamento intencional não resulta em erro de serviço.
- **Requisitos:** FR-1, FR-2, FR-3, FR-6; US-1, US-2, US-3, US-6; NFR-4
- **Dependências:** T-06, T-07, T-08
- **Arquivos prováveis:** `tests/unit/services/geocoding.test.ts`, `tests/unit/services/weather.test.ts`

### T-19 — Testar transições do hook
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** G
- **Descrição:** Validar estados, paralelismo, retry e proteção contra respostas obsoletas controlando os serviços assíncronos.
- **Critérios de aceite:** Testes com services controlados verificam: entrada vazia produz zero chamadas; busca percorre os estados esperados; seleção inicia current e forecast em paralelo; erro de um preserva sucesso do outro; retry chama somente o service que falhou; mudança de unidade não chama service; resolução tardia de consulta anterior não substitui a mais recente.
- **Requisitos:** FR-1, FR-2, FR-3, FR-4, FR-6; US-1 a US-4, US-6; NFR-4
- **Dependências:** T-09
- **Arquivos prováveis:** `tests/unit/hooks/useWeather.test.ts`

### T-20 — Testar estados loading/erro/vazio/sucesso da busca
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** M
- **Descrição:** Testar os componentes de entrada e escolha de cidade com Testing Library.
- **Critérios de aceite:** Testing Library verifica `idle` e `loading` em `CitySearch`, e `empty`, `error` e `success` em `CityResults`; confirma que vazio e erro têm mensagens distintas, que sucesso mostra resultados/contexto geográfico, e que seleção por teclado e retry acionam os callbacks esperados.
- **Requisitos:** FR-1, FR-6; US-1, US-6; NFR-2, NFR-3, NFR-5
- **Dependências:** T-10
- **Arquivos prováveis:** `tests/components/CitySearch.test.tsx`, `tests/components/CityResults.test.tsx`

### T-21 — Testar componentes de clima e previsão
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** M
- **Descrição:** Testar apresentação das condições atuais e da previsão, isoladamente, com Testing Library.
- **Critérios de aceite:** Testing Library verifica `idle`, `loading`, `success` e `error` em cada componente; em erro, valores meteorológicos não são renderizados; sucesso apresenta os valores recebidos por props, temperatura com unidade explícita e exatamente cinco itens de previsão com as respectivas datas.
- **Requisitos:** FR-2, FR-3, FR-6; US-2, US-3, US-6; NFR-2, NFR-4, NFR-5
- **Dependências:** T-11, T-12
- **Arquivos prováveis:** `tests/components/CurrentWeather.test.tsx`, `tests/components/ForecastList.test.tsx`

### T-22 — Testar controle de unidade
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** P
- **Descrição:** Verificar o comportamento acessível do controle Celsius/Fahrenheit.
- **Critérios de aceite:** Testing Library verifica Celsius selecionado inicialmente, nome acessível para as duas opções, alternância por teclado, estado selecionado atualizado e callback recebendo `fahrenheit` e depois `celsius`.
- **Requisitos:** FR-4; US-4; NFR-3
- **Dependências:** T-13
- **Arquivos prováveis:** `tests/components/TemperatureUnitControl.test.tsx`

### T-23 — Testar composição e falha parcial
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** M
- **Descrição:** Verificar a integração dos estados do hook nos componentes da aplicação.
- **Critérios de aceite:** Testing Library verifica que selecionar uma cidade exibe dados associados a ela; alternar C/F atualiza temperaturas atual e diária sem chamadas adicionais; falha simulada em current mantém forecast visível e vice-versa; idle, loading e erro mostram estados distintos.
- **Requisitos:** FR-1, FR-2, FR-3, FR-4, FR-6; US-1 a US-4, US-6; NFR-2, NFR-4
- **Dependências:** T-14, T-19, T-21, T-22
- **Arquivos prováveis:** `tests/components/WeatherApp.test.tsx`

### T-24 — Testar fluxo principal E2E, incluindo viewport mobile
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** G
- **Descrição:** Testar fluxos essenciais de ponta a ponta interceptando as APIs com respostas determinísticas.
- **Critérios de aceite:** Playwright intercepta geocoding/current/forecast; o fluxo principal busca e seleciona uma cidade, exibe clima atual e exatamente cinco dias, e alterna C/F; cenários adicionais verificam busca sem resultados, retry após erro e falha isolada de uma seção; o fluxo principal completo também roda a 390 × 844 px, confirma busca, seleção, dados e unidade acessíveis, e não apresenta rolagem horizontal na página.
- **Requisitos:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6; US-1 a US-6; NFR-1, NFR-3, NFR-4
- **Dependências:** T-14, T-20, T-21, T-22, T-23
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`, `playwright.config.ts`

## Entrega 8 — Hardening

### T-25 — Validar busca responsiva e acessível
- **Tipo:** UI
- **Prioridade:** P1
- **Tamanho:** M
- **Descrição:** Ajustar a busca e os resultados para telas móveis e interação por teclado.
- **Critérios de aceite:** Em 390 × 844 px, campo e resultados cabem na viewport sem rolagem horizontal; busca, seleção e retry podem ser operados por teclado com foco visível; estados vazio/erro têm texto além da cor; os textos do componente estão em pt-BR.
- **Requisitos:** FR-1, FR-5, FR-6; US-1, US-5, US-6; NFR-1, NFR-3, NFR-5
- **Dependências:** T-10, T-20, T-24
- **Arquivos prováveis:** `src/components/CitySearch.tsx`, `src/components/CityResults.tsx`

### T-26 — Validar seções meteorológicas em telas móveis
- **Tipo:** UI
- **Prioridade:** P1
- **Tamanho:** M
- **Descrição:** Ajustar a leitura do clima atual e da previsão em viewport móvel retrato.
- **Critérios de aceite:** Em 390 × 844 px, cidade e dados atuais cabem na largura disponível; previsão mostra cinco datas sem rolagem horizontal da página; temperatura/unidade e conteúdo de erro permanecem visíveis, sem texto cortado.
- **Requisitos:** FR-2, FR-3, FR-5, FR-6; US-2, US-3, US-5, US-6; NFR-1, NFR-2, NFR-4
- **Dependências:** T-11, T-12, T-21, T-24
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`, `src/components/ForecastList.tsx`

### T-27 — Validar composição e controle de unidade em mobile
- **Tipo:** UI
- **Prioridade:** P1
- **Tamanho:** M
- **Descrição:** Ajustar a composição da página e o controle C/F para telas estreitas.
- **Critérios de aceite:** Em 390 × 844 px, busca, seções meteorológicas e controle não se sobrepõem nem provocam rolagem horizontal; controle C/F é alcançável e operável por teclado; alternar a unidade mantém cidade e datas inalteradas.
- **Requisitos:** FR-4, FR-5; US-4, US-5; NFR-1, NFR-3
- **Dependências:** T-13, T-14, T-22, T-23, T-24
- **Arquivos prováveis:** `src/components/TemperatureUnitControl.tsx`, `src/components/WeatherApp.tsx`

### T-28 — Confirmar condições de uso da Open-Meteo
- **Tipo:** Infra
- **Prioridade:** P1
- **Tamanho:** M
- **Descrição:** Verificar cobertura, limites e condições de uso da API antes da entrega do produto.
- **Critérios de aceite:** README registra links e data da verificação oficial de cobertura, limites e termos; confirma disponibilidade das consultas geocoding/current/daily e se o acesso direto pelo navegador é permitido; restrições impeditivas são registradas como bloqueio; o cliente não contém chave secreta.
- **Requisitos:** FR-2, FR-3, FR-6; NFR-4, NFR-6
- **Dependências:** T-01, T-06, T-07, T-08
- **Arquivos prováveis:** `README.md`, `plans/weather-app-plan.md`

## Entrega 9 — Gates finais

### T-29 — Validar lint e build
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** P
- **Descrição:** Rodar lint e build após as alterações de implementação e hardening.
- **Critérios de aceite:** `pnpm lint` e `pnpm build` terminam com código de saída 0; qualquer falha bloqueia a conclusão ou é registrada explicitamente como bloqueio, sem ser ignorada.
- **Requisitos:** Transversal — FR-1 a FR-6; NFR-1 a NFR-6
- **Dependências:** T-01 a T-27
- **Arquivos prováveis:** `src/`, `biome.json`, `tsconfig.app.json`

### T-30 — Validar testes unitários e de componentes
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** M
- **Descrição:** Rodar a suíte Vitest e conferir a cobertura dos critérios funcionais e de acessibilidade nos testes unitários e de componentes.
- **Critérios de aceite:** `pnpm test` termina com código de saída 0; existe ao menos um teste identificável para cada critério aplicável de US-1 a US-6 e para os comportamentos de teclado, mensagens acessíveis e falhas parciais; testes ignorados têm justificativa registrada.
- **Requisitos:** Transversal — FR-1 a FR-6; NFR-1, NFR-3, NFR-4, NFR-5
- **Dependências:** T-01 a T-23, T-25 a T-27
- **Arquivos prováveis:** `tests/unit/`, `tests/components/`

### T-31 — Validar testes E2E
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** M
- **Descrição:** Rodar a suíte Playwright após a validação responsiva final.
- **Critérios de aceite:** `pnpm test:e2e` termina com código de saída 0; cenários com APIs interceptadas cobrem busca/seleção, clima atual, previsão, unidade, ausência/erro e viewport 390 × 844 px; testes ignorados têm justificativa registrada.
- **Requisitos:** Transversal — FR-1 a FR-6; NFR-1, NFR-3, NFR-4
- **Dependências:** T-24 a T-27
- **Arquivos prováveis:** `tests/e2e/`, `playwright.config.ts`

## Sequência sugerida de fatias verticais

1. **Fatia P0 — MVP visível:** execute T-01 a T-14 respeitando as dependências. A fatia atravessa tipos, funções puras, services, hook e UI e termina com a busca, seleção, clima atual, previsão de cinco dias e alternância C/F integrados na tela. **T-14 é o primeiro marco realmente visível no grafo atual.**
2. **Fatia P1 — Confiança no fluxo:** comece T-15, T-17, T-18 e T-19 assim que suas dependências estiverem prontas; não é necessário esperar T-14. Execute T-20 a T-22 após os componentes; após T-14, execute T-23 e então T-24 para validar o fluxo principal ponta a ponta.
3. **Fatia P1 — Uso móvel e prontidão externa:** conclua T-25 a T-28 para ajustar busca, leitura meteorológica e composição mobile e verificar as condições de uso da API.
4. **Fatia P1 — Liberação:** finalize T-29 a T-31 após o hardening. T-16 (P2) pode ser executada junto aos testes de funções puras e deve estar concluída antes do gate Vitest T-30.

**Caminho para uma demo ainda mais cedo:** hoje T-09 e T-14 esperam forecast e controle de unidade; portanto, não há uma fatia de busca + clima atual isolada. Se esse marco for prioritário, divida T-09 em hook de busca/current e extensão de forecast, e T-14 em composição inicial e extensão de previsão/unidade antes de iniciar a implementação.

## Rastreabilidade

| Requisito funcional da spec | Tarefas de implementação | Tarefas de teste/validação |
| --- | --- | --- |
| FR-1 — Buscar e selecionar cidades | T-02, T-05, T-06, T-09, T-10, T-14 | T-17, T-18, T-19, T-20, T-23, T-24 |
| FR-2 — Consultar clima atual | T-02, T-03, T-04, T-05, T-07, T-09, T-11, T-14 | T-16, T-17, T-18, T-19, T-21, T-23, T-24 |
| FR-3 — Consultar previsão de cinco dias | T-02, T-03, T-04, T-05, T-08, T-09, T-12, T-14 | T-16, T-17, T-18, T-19, T-21, T-23, T-24 |
| FR-4 — Alternar Celsius/Fahrenheit | T-02, T-03, T-09, T-13, T-14 | T-15, T-19, T-22, T-23, T-24 |
| FR-5 — Usar em dispositivos móveis | T-10 a T-14, T-25 a T-27 | T-24 |
| FR-6 — Comunicar falhas e ausência de dados | T-05 a T-12, T-14 | T-17 a T-21, T-23, T-24 |

Os gates T-29, T-30 e T-31 validam transversalmente a implementação e as suítes; não substituem os testes específicos listados por requisito. T-01 registra decisões de produto que condicionam campos de FR-1 a FR-3, e T-28 verifica a dependência externa da Open-Meteo.

**Lacunas de cobertura:** nenhum requisito funcional FR-1 a FR-6 está sem tarefa de implementação ou validação. FR-5 não especifica uma matriz de dispositivos ou breakpoints; T-24 a T-27 usam 390 × 844 px como viewport móvel representativo, sem presumir cobertura de outras dimensões.