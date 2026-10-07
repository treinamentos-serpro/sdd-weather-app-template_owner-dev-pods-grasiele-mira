# Especificação de Produto — Aplicação de previsão do tempo

## Overview

Aplicação em pt-BR para consultar o clima de cidades escolhidas pelo usuário. A experiência principal permite buscar uma cidade, selecionar o resultado correto, consultar as condições atuais e ver a previsão para hoje e os quatro dias seguintes. O usuário pode alternar entre Celsius e Fahrenheit.

### Objetivos

- Tornar a consulta do clima de uma cidade direta e compreensível.
- Apresentar condições atuais e previsão de cinco dias, contando hoje.
- Permitir que a consulta e a busca sejam utilizadas em dispositivos móveis.
- Comunicar situações sem resultados ou sem dados disponíveis.

### Decisões de produto

- Fonte de dados meteorológicos: Open-Meteo, sem chave de API.
- Idioma da interface: pt-BR.
- Unidade selecionada inicialmente: Celsius.
- Período da previsão: hoje e os quatro dias seguintes.
- Não haverá autenticação nem persistência de dados no servidor.

## Functional Requirements

- **FR-1 — Buscar cidades:** o usuário deve poder pesquisar uma cidade pelo nome e selecionar a cidade desejada entre os resultados disponíveis.
- **FR-2 — Consultar clima atual:** após selecionar uma cidade, o usuário deve poder consultar as condições meteorológicas atuais correspondentes a ela.
- **FR-3 — Consultar previsão:** após selecionar uma cidade, o usuário deve poder consultar a previsão para hoje e os quatro dias seguintes, com as datas identificáveis.
- **FR-4 — Alternar unidade:** o usuário deve poder alternar a temperatura apresentada entre Celsius e Fahrenheit, com Celsius selecionado por padrão.
- **FR-5 — Usar em dispositivos móveis:** as funções essenciais de busca, seleção da cidade e consulta do clima atual e da previsão devem estar disponíveis em dispositivos móveis.
- **FR-6 — Comunicar falhas e ausência de dados:** a aplicação deve informar quando a busca não encontrar cidades ou quando não for possível obter dados meteorológicos, sem deixar o usuário sem indicação do ocorrido.

## User Stories

- **US-1:** Como pessoa que quer planejar atividades, quero buscar uma cidade pelo nome e escolher o resultado correto para consultar o clima do local de meu interesse.
- **US-2:** Como pessoa que consulta o tempo, quero ver as condições atuais da cidade selecionada para entender como está o clima agora.
- **US-3:** Como pessoa que planeja os próximos dias, quero ver a previsão de hoje e dos quatro dias seguintes para antecipar as condições do tempo.
- **US-4:** Como pessoa que prefere outra escala de temperatura, quero alternar entre Celsius e Fahrenheit para interpretar os valores na unidade que uso.
- **US-5:** Como pessoa que consulta o tempo pelo celular, quero buscar cidades e ler as informações meteorológicas em uma tela móvel para usar o serviço fora de casa.
- **US-6:** Como pessoa que consulta o tempo, quero receber uma mensagem clara quando não houver resultados ou dados disponíveis para saber que a consulta não foi concluída.

## Acceptance Criteria

### US-1 — Busca de cidades (FR-1)

- Dada uma consulta com um nome de cidade, quando a busca for concluída com resultados, então a aplicação apresenta os resultados para seleção.
- Quando houver mais de um resultado plausível, então cada resultado exibe contexto suficiente para o usuário distinguir as cidades, incluindo país e estado ou região quando disponível.
- Quando o usuário selecionar um resultado, então esse resultado passa a ser a cidade consultada para clima atual e previsão.
- Quando a consulta não corresponder a uma cidade, então a aplicação informa que não foram encontrados resultados.

### US-2 — Clima atual (FR-2)

- Dada uma cidade selecionada e dados meteorológicos atuais disponíveis, então a aplicação apresenta as condições atuais associadas àquela cidade.
- A unidade de temperatura exibida corresponde à unidade selecionada; inicialmente, Celsius.
- Se os dados atuais não puderem ser obtidos, então a aplicação informa que não foi possível carregar o clima atual.

### US-3 — Previsão (FR-3)

- Dada uma cidade selecionada e dados de previsão disponíveis, então a aplicação apresenta cinco dias: hoje e os quatro dias seguintes.
- Cada dia apresentado tem uma data identificável e informações de previsão associadas à cidade selecionada.
- A temperatura da previsão usa a unidade selecionada pelo usuário.
- Se a previsão não puder ser obtida, então a aplicação informa que não foi possível carregar a previsão.

### US-4 — Unidade de temperatura (FR-4)

- Ao iniciar uma consulta sem preferência previamente definida, a unidade exibida é Celsius.
- Quando o usuário alterna para Fahrenheit, os valores de temperatura exibidos passam a usar Fahrenheit e são identificados como tal.
- Quando o usuário alterna de volta para Celsius, os valores passam a usar Celsius e são identificados como tal.
- A alternância atualiza os valores apresentados tanto no clima atual quanto na previsão, sem alterar a cidade ou o período consultado.
- A persistência da escolha após encerrar ou recarregar a sessão não é exigida por esta especificação; ver Open Questions.

### US-5 — Uso móvel (FR-5)

- Em um dispositivo móvel, o usuário consegue acessar a busca, inserir uma cidade e selecionar um resultado.
- Em um dispositivo móvel, o usuário consegue consultar e ler as informações de clima atual e a previsão sem que controles ou dados essenciais fiquem inacessíveis.
- Os fluxos essenciais permanecem utilizáveis em orientação retrato; o comportamento em outras orientações e dimensões depende da resposta às Open Questions.

### US-6 — Falhas e ausência de dados (FR-6)

- Se uma busca bem-sucedida não retornar cidades, a aplicação apresenta uma mensagem que distingue ausência de resultados de uma busca ainda não realizada.
- Se a fonte de dados estiver indisponível, ocorrer uma falha ou a consulta exceder o tempo limite, a aplicação informa que os dados não puderam ser carregados.
- Uma falha na consulta de clima atual ou de previsão não deve ser apresentada como se fossem dados meteorológicos válidos.
- Quando a consulta puder ser repetida, a interface deve oferecer um meio identificável de tentar novamente.

## Non-Functional Requirements

- **NFR-1 — Responsividade:** busca, seleção e leitura das informações essenciais devem funcionar em dispositivos móveis, sem conteúdo ou controles essenciais inacessíveis.
- **NFR-2 — Usabilidade:** a cidade selecionada, a condição atual, as datas da previsão e a unidade da temperatura devem ser identificáveis na interface.
- **NFR-3 — Acessibilidade:** controles devem ter nomes identificáveis por tecnologias assistivas, ser utilizáveis por teclado e manter uma ordem de navegação compreensível. Mensagens de falha e de ausência de resultados devem ser perceptíveis sem depender apenas de cor.
- **NFR-4 — Resiliência:** falhas de busca e indisponibilidade dos dados devem produzir mensagens compreensíveis; dados indisponíveis não devem ser confundidos com valores válidos.
- **NFR-5 — Idioma:** textos apresentados pela interface devem estar em pt-BR.
- **NFR-6 — Privacidade e acesso:** não deve ser exigida autenticação e não deve haver persistência de dados de usuário no servidor.
- **NFR-7 — Desempenho e disponibilidade:** metas quantitativas ainda não foram definidas e precisam ser acordadas antes de serem usadas como critério de aceite; ver Open Questions.

## Edge Cases

- Campo de busca vazio ou contendo apenas espaços: não deve iniciar uma busca de cidade; a interface deve orientar o usuário a informar um nome.
- Nenhuma cidade correspondente: informar que não há resultados, sem apresentar dados meteorológicos de outra cidade.
- Cidades com nomes iguais ou semelhantes: apresentar contexto geográfico para permitir a escolha correta.
- Falha, indisponibilidade ou timeout na busca: informar que a busca não pôde ser concluída e permitir nova tentativa quando disponível.
- Cidade selecionada sem dados atuais, sem previsão ou com apenas uma das consultas indisponível: identificar qual informação não foi carregada e não inventar ou reutilizar dados de outra cidade.
- Falha na fonte de dados: não mostrar valores antigos ou incompletos como se fossem atuais; qualquer comportamento de cache permanece em aberto.
- Mudança da unidade enquanto resultados estão visíveis: atualizar as temperaturas do clima atual e da previsão sem mudar cidade ou datas.
- Datas da previsão próximas à mudança de dia ou em fuso horário diferente: exibir datas associadas à cidade consultada de forma coerente; a convenção de fuso e formatação regional precisa ser confirmada.
- Consulta em tela móvel estreita: busca, seleção e dados essenciais permanecem acessíveis, sem depender de controles disponíveis apenas em telas grandes.

## Assumptions

- O usuário informa o nome da cidade na busca, conforme o escopo da discovery.
- O usuário escolhe entre resultados quando mais de uma cidade puder corresponder à busca.
- O contexto geográfico disponível nos resultados (como país, estado ou região) é suficiente para auxiliar a desambiguação.
- A troca de unidade altera a apresentação das temperaturas, não a cidade nem os dados meteorológicos subjacentes.
- Celsius é a unidade inicial; não se presume que a preferência será lembrada entre sessões.
- A aplicação requer conectividade e disponibilidade da fonte de dados para obter informações atualizadas.
- A previsão contempla hoje e os quatro dias seguintes, totalizando cinco dias.
- A interface inicial será em pt-BR; convenções regionais detalhadas para datas, horários e outras unidades além da escala de temperatura ainda não foram definidas.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Resultados ambíguos para cidades homônimas ou semelhantes | Média | Médio | Exibir contexto geográfico nos resultados e exigir que o usuário selecione a cidade desejada. |
| Indisponibilidade da Open-Meteo, cobertura insuficiente ou limites de uso | Média | Alto | Verificar cobertura, limites e condições de uso; comunicar falhas e oferecer nova tentativa quando possível. |
| Interpretação incorreta do período de cinco dias | Média | Médio | Manter explícito que o período inclui hoje e exibir a data de cada dia. |
| Conversão ou rotulagem incorreta de Celsius e Fahrenheit | Baixa | Alto | Validar valores e rótulos em ambas as unidades no clima atual e na previsão. |
| Dificuldade de uso em telas pequenas | Média | Alto | Projetar para uso móvel e validar busca e leitura em dimensões móveis representativas. |
| Informações meteorológicas insuficientes para decisões do usuário | Média | Médio | Definir, com as partes interessadas, quais variáveis devem compor clima atual e previsão. |

## Out of Scope

- Autenticação, contas de usuário e armazenamento de dados pessoais em servidor.
- Geolocalização automática.
- Cidades favoritas ou gerenciamento de uma lista persistente de cidades.
- Funcionamento offline ou garantia de consulta sem conexão com a internet.
- Suporte a idiomas diferentes de pt-BR nesta versão.
- Decisões sobre armazenamento local ou sincronização da preferência de unidade entre sessões.
- Compromissos quantitativos de desempenho, disponibilidade ou cobertura de navegadores antes de serem definidos.
- Definição de variáveis meteorológicas específicas além da temperatura e da condição do tempo, até que a pergunta correspondente seja respondida.
- Exclusão de suporte a desktop: esse limite não foi decidido e permanece uma Open Question.

## Open Questions

1. Quais informações, além da temperatura e da condição do tempo, devem aparecer no clima atual e na previsão?
2. Quais campos geográficos devem ser exibidos para distinguir cidades homônimas (país, estado, região ou combinação)?
3. A preferência de unidade deve ser lembrada entre sessões? Se sim, por quanto tempo e onde?
4. Quais convenções regionais devem ser aplicadas a datas, horários, fuso horário e unidades além da temperatura?
5. O produto deve oferecer suporte a desktop além dos dispositivos móveis? Quais larguras ou dispositivos devem ser cobertos?
6. Quais metas mensuráveis de desempenho, acessibilidade, disponibilidade e suporte a navegadores são necessárias?
7. Há requisitos adicionais de geolocalização, cidades favoritas, cache ou uso offline?
8. Qual comportamento de nova tentativa é esperado após falhas ou timeout, e existe um limite de espera a partir do qual a falha deve ser informada?
9. Quais limites de uso, cobertura e condições de uso da Open-Meteo são aceitáveis para o produto?