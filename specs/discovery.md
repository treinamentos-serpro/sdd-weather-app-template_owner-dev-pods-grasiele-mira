# Discovery — Aplicação de previsão do tempo

## Contexto

A empresa solicitou uma aplicação de previsão do tempo para que usuários possam consultar condições meteorológicas de cidades de seu interesse. A experiência principal deve permitir buscar uma cidade, conferir o clima atual e consultar a previsão dos próximos cinco dias. O produto também deve oferecer alternância entre Celsius e Fahrenheit e funcionar em dispositivos móveis.

O briefing não define público-alvo, fonte de dados, idiomas, plataforma além do uso em dispositivos móveis, nem critérios quantitativos de desempenho ou disponibilidade. Essas decisões precisam ser esclarecidas ou tratadas como hipóteses nas próximas etapas.

## Requisitos Funcionais

- **RF1 — Busca de cidades:** permitir que o usuário pesquise uma cidade pelo nome e selecione a cidade desejada.
- **RF2 — Clima atual:** apresentar as condições meteorológicas atuais da cidade selecionada.
- **RF3 — Previsão:** apresentar a previsão do tempo para cinco dias da cidade selecionada.
- **RF4 — Unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit e atualizar os valores de temperatura exibidos.
- **RF5 — Uso móvel:** permitir executar as funções de busca e consulta em dispositivos móveis.

## Requisitos Não-Funcionais

- **RNF1 — Responsividade:** adaptar o conteúdo e os controles a telas de dispositivos móveis, mantendo as funções essenciais utilizáveis.
- **RNF2 — Usabilidade:** tornar a busca e a leitura do clima atual e da previsão claras e diretas.
- **RNF3 — Acessibilidade:** disponibilizar controles identificáveis e utilizáveis por tecnologias assistivas e navegação por teclado.
- **RNF4 — Resiliência:** comunicar falhas de busca ou indisponibilidade dos dados sem deixar o usuário sem indicação do que ocorreu.

Os níveis mensuráveis de desempenho, acessibilidade e disponibilidade ainda não foram definidos.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação inicial |
| --- | --- | --- | --- |
| Resultados ambíguos para cidades com nomes iguais ou semelhantes | Média | Médio | Exibir contexto suficiente nos resultados, como estado ou país, e permitir que o usuário escolha. |
| Fonte de dados indisponível ou com limites de uso | Média | Alto | Avaliar a fonte antes da implementação e prever estados de erro e nova tentativa. |
| Interpretação divergente do período de cinco dias | Média | Médio | Confirmar se a contagem inclui o dia atual e explicitar as datas exibidas. |
| Conversão ou rotulagem incorreta entre Celsius e Fahrenheit | Baixa | Alto | Definir uma unidade de referência e validar a conversão e os rótulos com testes. |
| Interface difícil de usar em telas pequenas | Média | Alto | Adotar abordagem mobile-first e validar os fluxos em larguras móveis representativas. |
| Informações meteorológicas insuficientes para a tomada de decisão | Média | Médio | Confirmar quais variáveis devem compor as telas de clima atual e previsão. |

## Perguntas em Aberto

1. Qual fonte de dados meteorológicos deve ser usada? Há restrições de custo, licença ou chave de API?
2. Os cinco dias incluem o dia atual ou correspondem aos cinco dias seguintes?
3. Quais informações, além da temperatura e da condição do tempo, devem aparecer no clima atual e na previsão?
4. Como os resultados da busca devem distinguir cidades homônimas (por exemplo, país, estado ou região)?
5. Qual unidade deve ser selecionada por padrão? A preferência deve ser lembrada entre sessões?
6. Quais idiomas e convenções regionais devem ser suportados?
7. A aplicação deve funcionar também em desktop ou o escopo se limita a dispositivos móveis?
8. Há metas específicas para desempenho, acessibilidade, disponibilidade ou suporte a navegadores?
9. São necessários recursos adicionais, como geolocalização, cidades favoritas, cache ou uso offline?

## Suposições

- A busca é feita por nome de cidade, conforme indicado no briefing.
- O usuário escolhe a cidade quando a busca retorna mais de um resultado plausível.
- A alternância entre Celsius e Fahrenheit afeta os valores de temperatura, sem alterar os dados meteorológicos subjacentes.
- A previsão de cinco dias é apresentada para a cidade selecionada; a definição exata do intervalo permanece pendente.
- O uso móvel é um requisito obrigatório, mas o suporte a desktop ainda não foi confirmado.
- A disponibilidade de uma conexão com a internet e de um serviço de dados meteorológicos é necessária para consultar informações atualizadas.