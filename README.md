# Mecânica do Zé v2.6.0 — Correções PC + Celular

Esta versão parte da v2.2 original e mantém o conteúdo do jogo, mas reorganiza o projeto em CSS/JS separados.

Principais correções:
- pausa mobile corrigida (estados string, sem comparação 1/2);
- loop fixo em 60 Hz para a velocidade do jogo não depender de 30/60/120/144 FPS;
- novo jogo e troca de slots limpam efeitos de upgrades anteriores;
- carregamento reconstrói os efeitos dos upgrades;
- save v4 com migração das versões anteriores, preservando valores zero, stamina e estados adicionais;
- correção da conquista "Ninguém Foi Embora";
- controles mobile usando Pointer Events e multitouch mais seguro;
- orientação vertical mostra aviso para girar o celular;
- controles mobile sobrepostos e responsivos, com safe areas;
- limpeza de teclas/joystick ao perder foco;
- partículas, vinheta e qualidade gráfica passam a afetar a renderização;
- sliders de SFX/ambiente passam a atuar no motor de áudio e ficam salvos;
- cache/PWA atualizado para v4 e caminhos relativos compatíveis com GitHub Pages;
- tela duplicada de conquistas removida;
- arquivos separados em css/ e js/ para facilitar manutenção.

Estrutura:
- index.html
- css/game.css
- css/mobile.css
- js/game.js
- js/mobile-controls.js
- js/pwa.js
- manifest.json
- sw.js
- ícones PWA


## Revisão 2.3.2
- save v4 preserva dia/tick, clima, relatório e carros ativos;
- corrige save durante pausa que escondia o menu e deixava o jogo congelado;
- peças específicas são consumidas somente ao concluir o serviço;
- desconto de peças agora vale também para peças genéricas e para o ajudante;
- ajudante compra a peça específica necessária em vez de entrar em loop;
- preços da loja respeitam a dificuldade;
- sons duplicados de carro/conserto/upgrade removidos;
- volume ambiente e configurações de áudio sincronizados;
- Campanha de Fim de Semana agora realmente aumenta o fluxo aos sábados/domingos;
- Inspeção Prévia agora exibe risco de falha em cadeia;
- rádio afeta também a velocidade do ajudante;
- relatório diário usa faturamento real e mantém o dia após recarregar;
- controles/ratio/input receberam correções adicionais.


## v2.4.0 — sprites do Zé e do ajudante
- Zé agora usa spritesheet PNG otimizado e transparente com 4 direções × 4 frames;
- ajudante ganhou spritesheet próprio, visual verde e animação direcional;
- hitboxes e colisões continuam usando as dimensões originais para não alterar a jogabilidade;
- render procedural antigo permanece como fallback caso o asset não carregue;
- sprites adicionados ao precache do PWA (cache v6);
- ícones de estado do ajudante reposicionados para não cobrir a cabeça do sprite.


## v2.5.0 — animações de trabalho
- Zé ganhou estados visuais de conserto, diagnóstico, reabastecimento e cansaço;
- ajudante muda automaticamente entre animação de conserto, diagnóstico e transporte de peça conforme a IA;
- novo spritesheet `assets/sprites/actions.png` com chave, scanner, pneu e caixa de ferramentas;
- ações usam animação curta sem alterar hitbox, velocidade ou regras de economia;
- fallback procedural e sprites direcionais anteriores continuam ativos;
- PWA atualizado para cache v7 incluindo o novo asset.


## v2.6.0 — pontos de trabalho por defeito
- Zé caminha automaticamente até o ponto correto do veículo ao diagnosticar ou consertar;
- controles ficam temporariamente travados durante aproximação e animação de serviço;
- Motor, Óleo, Bateria, Elétrica, Correia, Radiador e Superaquecimento usam a região dianteira;
- Pneu, Freio e Aquaplanagem usam a roda/lateral mais próxima;
- Transmissão usa a parte traseira;
- Farol usa o canto dianteiro mais próximo;
- sprite vira automaticamente para o carro;
- cada defeito usa a ferramenta visual adequada (chave, scanner, pneu ou caixa);
- ajudante também se posiciona no ponto exato e fica orientado para o veículo;
- hitboxes, custos, peças e progresso de reparo permanecem iguais à v2.5.0;
- PWA atualizado para cache v8.
