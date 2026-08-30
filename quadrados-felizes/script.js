
// -------------------------------  PARTE 1  -------------------------------  
// inicializa o WebGL2
//const canvas = document.querySelector('.example-canvas');
const canvas = document.getElementById ('canvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
  console.error('WebGL2 não está disponível');
  throw new Error('WebGL2 não suportado');
}

//fixar a tela de pintura (viewport) | https://fegemo.github.io/utf-cg/classes/webgl-handson/#22 
gl.viewport (0, 0, canvas.Width, canvas.height);

//define a cor de fundo como cor borracha: branco | https://fegemo.github.io/utf-cg/classes/webgl/#20
gl.clearColor (1.0, 1.0, 1.0, 1.0);

//limpa o canvas | https://fegemo.github.io/utf-cg/classes/webgl/#31
gl.clear(gl.COLOR_BUFFER_BIT) 

// -------------------------------  PARTE 2  -------------------------------

//------------------------------  VERTEX SHADER  -------------------------------
//PENSANDO QUE FAREMOS UM QUADRADO, REPLICAREMOS E FUTURAMENTE O DESLOCAREMOS. EX NA AULA
//in vec2 position é a posição de cada vértice | x,y pois é 2D | https://fegemo.github.io/utf-cg/classes/webgl-handson/#12
//uniform mat4 é a matriz de projeção ortogonal
//Projetando os Vértices | Se é uma operação por vértice e envolve multiplicação de matriz
//DESLOCAMENTO: https://fegemo.github.io/utf-cg/classes/webgl-handson2/#26 | 
const vertexShaderCode = `#version 300 es
  in vec2 posicao;
  uniform mat4 projecao;
  uniform vec2 deslocamento;

  void main() {
    vec2 posicaoFinal = posicao + deslocamento;
    gl_Position = projecao * vec4( posicaoFinal, 0.0, 1.0);
  }
`; 


//------------------------------  FRAGMENT SHADER  -------------------------------------
//https://fegemo.github.io/utf-cg/classes/webgl/#4
// outColor=cor permite que o código seja mais flexível para alterarmos a cor de cada quadrado futuramente sem criar novos shaders.
const fragmentShaderCode = `#version 300 es
    precision highp float;
    uniform vec4 cor;
    out vec4 outColor;

    void main() {
    outColor = cor; 
  }
`;


