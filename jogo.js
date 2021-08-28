console.log('Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    
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
};

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

const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    velocidade: 0,
    gravidade: 0.25,

    atualiza() {
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
    }, 
    desenha() {
        context.drawImage(
            sprites, 
            flappyBird.spriteX, flappyBird.spriteY, // Sprite x, Sprite Y
            flappyBird.largura, flappyBird.altura, // Tamanho do recorte na imagem
            flappyBird.x, flappyBird.y, // Posição x e y
            flappyBird.largura, flappyBird.altura, 
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
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
}

const Telas = {
    INICIO: {
        desenha() {
            background.desenha();
            
            chao.desenha();
            
            flappyBird.desenha();

            mensagemGetReady.desenha();
        }, 
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {

        }
    }
};

Telas.JOGO = {
    desenha() {
        background.desenha();

        chao.desenha();

        flappyBird.desenha();
    },
    atualiza() {
        flappyBird.atualiza();
    }
};

function loop () {
    
    telaAtiva.desenha();
    telaAtiva.atualiza();
    requestAnimationFrame(loop);
};

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
})

mudaParaTela(Telas.INICIO);

loop();