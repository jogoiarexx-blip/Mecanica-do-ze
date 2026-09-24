# Mecânica do Zé v2.4.0 — Correções PC + Celular

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
- ícones de estado do ajudante reposicionados para não cobrir a cabeça do sprite;
- integração validada em Chromium com movimento, troca de direção e render dos 8 testes de direção.
