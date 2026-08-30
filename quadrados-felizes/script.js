
// -------------------------------  PARTE 1  -------------------------------  
// inicializa o WebGL2
//const canvas = document.querySelector('.example-canvas');
//teste: cria um quadrado 500*500 em uma tela com fundo branco
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

// -------------------------------  PARTE 3  -------------------------------
//Criar o programa WebGL: https://fegemo.github.io/utf-cg/classes/webgl/#4 | optei por não fazer toda a separação do slide
//transforma os textos dos shaders em shaders de verdade e os anexa no programa
const createShader = (type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

//Cria o programa WebGL
const program = gl.creatProgram();

//Cria o vertexShader e insere ele no programa
gl.attachShader (
    program,
    createShader (gl.VERTEX_SHADER, vertexShaderCode)
);

//Cria o fragmentShader e insere ele no programa
gl.attachShader(
    program,
    creatShader (gl.FRAGMENT_SHADER, fragmentShaderCode)
);

gl.linkProgram(program); //Junta os shaders
gl.useProgram(program);//Ativa o programa

// -------------------------------  PARTE 4  -------------------------------
// --------------------------- PROJEÇÃO ORTOGONAL ----------------------------------- 
//https://fegemo.github.io/utf-cg/classes/webgl-handson/#10 | https://fegemo.github.io/utf-cg/classes/webgl-handson/#14
/*Uma ideia é a que vimos na aula: x,y ∈ [0, 100]. Outra, talvez melhor¹: x ∈ [0, gl.canvas.width] e y ∈ [gl.canvas.height, 0]. 
Por ora, mantenha z ∈ [-1, 1].*/
//Converter para NDC
function ortho(left, right, bottom, top, near, far) {
  const tx = -(right + left) / (right - left);
  const ty = -(top + bottom) / (top - bottom);
  const tz = -(far + near) / (far - near);

  return new Float32Array([
    2 / (right - left), 0, 0, 0,
    0, 2 / (top - bottom), 0, 0,
    0, 0, -2 / (far - near), 0,
    tx, ty, tz, 1
  ]);
}

const projecao = ortho(
  0,                    //left
  gl.canvas.width,      //right
  gl.canvas.height,     //bottom
  0,                    //top
  -1,                   //near
  1                     //far
);

//
const projecaoLocation =  gl.getUniformLocation(program, 'projecao'); 
gl.uniformMatrix4fv(projecaoLocation, false, projecao);

// -------------------------------  PARTE 5 -------------------------------


