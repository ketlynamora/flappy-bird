console.log('Flappy Bird');

let frames = 0;

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const repeteEm = chao.largura / 2;
            if (chao.x <= -repeteEm)
                return chao.x = 0
            
            chao.x = chao.x - 1;
        },
        desenha() {
            context.drawImage(
                sprites, 
                chao.spriteX, chao.spriteY, // Sprite x, Sprite Y
                chao.largura, chao.altura, // Tamanho do recorte na imagem
                chao.x, chao.y, // Posição x e y
                chao.largura, chao.altura, 
            );
    
            context.drawImage(
                sprites, 
                chao.spriteX, chao.spriteY, // Sprite x, Sprite Y
                chao.largura, chao.altura, // Tamanho do recorte na imagem
                (chao.x + chao.largura), chao.y, // Posição x e y
                chao.largura, chao.altura, 
            );
        }
    }
    return chao;
}

const background = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    
    desenha() {
        context.fillStyle = '#70c5ce';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.drawImage(
            sprites, 
            background.spriteX, background.spriteY, // Sprite x, Sprite Y
            background.largura, background.altura, // Tamanho do recorte na imagem
            background.x, background.y, // Posição x e y
            background.largura, background.altura, 
        );
        context.drawImage(
            sprites, 
            background.spriteX, background.spriteY, // Sprite x, Sprite Y
            background.largura, background.altura, // Tamanho do recorte na imagem
            (background.x + background.largura), background.y, // Posição x e y
            background.largura, background.altura, 
        );
    }
};

const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174, 
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        context.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h,
        );
    }
};

//
// [Telas]
//
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) 
        telaAtiva.inicializa();
    
};

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            background.desenha();
            
            globais.flappyBird.desenha();
            
            
            globais.chao.desenha();

            mensagemGetReady.desenha();
        }, 
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
        }
    }
};

Telas.JOGO = {
    desenha() {
        background.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();

    }
};

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        velocidade: 0,
        gravidade: 0.25,
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        atualiza() {
            if(fazColisao(flappyBird, globais.chao)) {
                som_HIT.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500)
                
                return
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        }, 
        movimentos: [
            { spriteX: 0, spriteY: 0, },
            { spriteX: 0, spriteY: 26, },
            { spriteX: 0, spriteY: 52, },
        ],
        frameAtual: 0,
        atualizaOFrameAtual() {
            const intervaloFrames = 10;
            const passouOIntervalo = frames % intervaloFrames === 0;
            if(passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
        },
        desenha() {
            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            context.drawImage(
                sprites, 
                spriteX, spriteY, // Sprite x, Sprite Y
                flappyBird.largura, flappyBird.altura, // Tamanho do recorte na imagem
                flappyBird.x, flappyBird.y, // Posição x e y
                flappyBird.largura, flappyBird.altura, 
            );
        }
    }
    return flappyBird;
};

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        ceu: {
            spriteX: 52,
            spriteY: 169
        },
        chao: {
            spriteX: 0,
            spriteY: 169
        },
        espaco: 80,
        desenha() {
            
            canos.pares.forEach(function(par) {
                
                const espacamentoEntreCanos = 90;
    
                const canoCeuX = par.x;
                const canoCeuY = par.y;

                context.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY, 
                    canos.largura, canos.altura,
                )
    
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + par.y;
                context.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY, 
                    canos.largura, canos.altura,
                )
                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })
    
        },
        
        temColisaoComOFlappyBird(par) {
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
            
            if(globais.flappyBird.x >= par.x) {

                if(cabecaDoFlappy <= par.canoCeu.y) 
                    return true;
                
                if(peDoFlappy >= par.canoChao.y)
                    return true; 
            }

            return false
        },
        pares: [],
        atualiza() {
            const passou100Frames = frames % 100 === 0;
            if(passou100Frames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }
            canos.pares.forEach(function(par){
                par.x = par.x - 2;

                if(canos.temColisaoComOFlappyBird(par)) {
                    som_HIT.play();

                    setTimeout(() => {
                        mudaParaTela(Telas.INICIO);
                    }, 100)
                }

                if(par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            })

        },
    }
    return canos;
};

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY)
        return true

    return false
};

function loop () {
    
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames++;
    requestAnimationFrame(loop);
};

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);

loop();