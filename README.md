# Gestio - Projeto do 2º eixo do curso Sistemas para Internet na PUC Minas

Este projeto consiste no desenvolvimento de uma plataforma web destinada à organização e gerenciamento de tarefas e projetos, tanto para equipes quanto para indivíduos. A ferramenta permitirá que os usuários criem quadros para organizar suas atividades, gerenciem listas de tarefas com prazos e descrições detalhadas, e colaborem com outros membros de forma eficiente.

Na época em que desenvolvi este trabalho, meu conhecimento em React era bastante limitado. Eu havia assistido apenas algumas videoaulas introdutórias. O desespero para entregar um projeto funcional, somado à minha rotina atarefada, fez com que eu negligenciasse boas práticas e aprofundamento técnico.

É até engraçado lembrar como, ao finalizá‑lo, mostrei tudo com orgulho para todos os meus amigos; pouco depois, durante o bootcamp de React da XP Educação, percebi como eu tinha feito tudo errado e acabei removendo o repositório do meu GitHub por vergonha. Hoje, ao revisitar este código, vejo claramente minha evolução e entendo o valor de cada erro que cometi. Por isso decidi publicá‑lo novamente, em modo público e sem filtros, como um registro honesto da minha jornada de aprendizado.

## Reflexões sobre o código antigo

### LocalStorage espalhado
Em vez de centralizar a lógica de leitura e gravação no contexto de usuarios, tratei a persistência em localStorage em praticamente todos os componentes. Hoje eu teria criado um único ponto de salvamento e carregamento de dados dentro do contexto, além de criar uma função para validar e exportar o contexto.

### Responsabilidade de componentes mal definida
Muitas funções foram implementadas em componentes que não as utilizavam diretamente, apenas para passá‑las por props a um filho. Hoje eu dividiria melhor as responsabilidades e evitariam componentes que fazem mais do que deveriam.

### Componentes gigantescos
Alguns arquivos ultrapassam 300 linhas!!! Hoje eu fragmentaria em vários componentes menores e reutilizáveis, dando clareza à estrutura e facilitando a manutenção.

### Duplicação de lógica
Criei funções semelhantes em diferentes lugares em vez de extrair essa lógica para um hook personalizado. Um único hook poderia reunir toda essa funcionalidade e evitar repetição de código.

### Prop drilling em excesso
Passei muitas props por várias camadas quando poderia ter pensado em soluções alternativas (como context ou hooks) para obter os dados exatamente onde eram usados.

### Falta de tipagem
Sem TypeScript, meu código ficou suscetível a vários erros de tipo. Hoje reconheço a importância de garantir segurança nos dados e evitar bugs em tempo de compilação.

### Excesso de estados
Havia diversos estados espalhados que poderiam ter sido combinados ou gerenciados de forma mais enxuta. Uma lógica de estado mais bem pensada teria deixado o fluxo de dados mais simples.

## Considerações finais
Este projeto é um registro da minha evolução como desenvolvedora. Ele não está perfeito, mas cada erro foi um passo para eu chegar onde estou hoje. Compartilho aqui com orgulho essa fase de aprendizado.
