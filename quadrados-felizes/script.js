
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
gl.viewport (0, 0, canvas.width, canvas.height);

//defini a cor de inicialmente fundo como cor borracha: branco | https://fegemo.github.io/utf-cg/classes/webgl/#20
//alterei para um cinza claro para poder ver o quadradinho de fundo branco
gl.clearColor (0.9, 0.9, 0.9, 1.0);

//limpa o canvas | https://fegemo.github.io/utf-cg/classes/webgl/#31
//gl.clear(gl.COLOR_BUFFER_BIT) 






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


//--------------------------------  FRAGMENT SHADER  -------------------------------------
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



// -----------------------------------------  PARTE 3  -----------------------------------------
//Criar o programa WebGL e os shaders: https://fegemo.github.io/utf-cg/classes/webgl/#4 | optei por não fazer toda a separação do slide
//transforma os textos dos shaders em shaders de verdade e os anexa no programa
const createShader = (type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

//Cria o programa WebGL
const program = gl.createProgram();

//Cria o vertexShader e insere ele no programa
gl.attachShader (
    program,
    createShader (gl.VERTEX_SHADER, vertexShaderCode)
);

//Cria o fragmentShader e insere ele no programa
gl.attachShader(
    program,
    createShader (gl.FRAGMENT_SHADER, fragmentShaderCode)
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

//localiza a uniform "projecao" no vertexShader
const projecaoLocation =
gl.getUniformLocation(program, 'projecao');

//Envia a matriz mat4 para o vertexShader
gl.uniformMatrix4fv(projecaoLocation, false, projecao);




// -------------------------------  PARTE 5 -------------------------------
//Criando um único mini quadradinho centralizado em 0,0 
//A ideia é replicar esse quadradinho futuramente =)
/*   
(-40,-40) -------- (40,-40)
     |                 |
     |                 |
     |      (0,0)      |
     |                 |
     |                 |
(-40,40) ---------- (40,40)
*/
const verticesQuadrado = new Float32Array([
    -40,    -40,
     40,    -40,
     40,     40,
    -40,     40,
]);

//----------------- VAO ---------------------
//https://fegemo.github.io/utf-cg/classes/webgl/#25
const vaoQuadrado1 = gl.createVertexArray ();
gl.bindVertexArray (vaoQuadrado1); 

//----------------- VBO ---------------------
//https://fegemo.github.io/utf-cg/classes/webgl/#25
const vboQuadrado1 = gl.createBuffer ();
gl.bindBuffer (gl.ARRAY_BUFFER, vboQuadrado1);
gl.bufferData (gl.ARRAY_BUFFER, verticesQuadrado, gl.STATIC_DRAW);

// Localiza "in vec2 posicao" no VertexShader
const posicaoLocation = gl.getAttribLocation (program,'posicao');

//https://fegemo.github.io/utf-cg/classes/webgl/#28
gl.vertexAttribPointer(posicaoLocation, 2, gl.FLOAT, false, 0, 0);

//2 INDICA QUE CADA VERTICE POSSUI DUAS COORDENAS X E Y
gl.enableVertexAttribArray(posicaoLocation);

//------------------- DESCLOCAMENTO -----------------------------
const deslocamentoLocation = gl.getUniformLocation (program, 'deslocamento');
//gl.uniform2f(deslocamentoLocation, 250, 250); //colocar o quadradinho em 250,250, no centro do canvas 500*500

//----------------------- COR ----------------------------
const corLocation = gl.getUniformLocation (program, 'cor');
//gl.uniform4f (corLocation, 0.0, 1.0, 0.0, 1.0); //verde

/*
// ---------------- RENDERIZAÇÃO ----------------
gl.clear (gl.COLOR_BUFFER_BIT);
gl.bindVertexArray (vaoQuadrado1);
//DESENHA OS 4 VERTICES COMO TRIANGLE_FAN ↓
gl.drawArrays (gl.TRIANGLE_FAN, 0, 4);*/ 





// --------------------------------- PARTE 6 - PRIMEIRA TENTATIVA ---------------------------------------------
// CRIANDO OS 9 QUADRADOS - 3 LINHAS E 3 COLUNAS CONFORME O ENUNCIADO

// ---------------- RENDERIZAÇÃO ----------------
/*gl.clear(gl.COLOR_BUFFER_BIT); // limpa o canvas apenas uma vez
gl.bindVertexArray(vaoQuadrado1); // seleciona o VAO do */


/*PARA PENSAR SENDO QUE DELIMITEI UM CANVAS DE 0 A 500 PARA X E Y | Sistema de coordenadas escolhido:
(0,0) ---------------------- (500,0)
  |                              |
  |                              |
  |                              |
  |                              |
(0,500) ------------------ (500,500)
*/

// AS CORES FORAM ESCOLHIDAS COM BASE NESSE MATERIAL: https://fegemo.github.io/utf-cg/classes/webgl-handson/#valores-rgb-de-algumas-cores
/*
// ---------------- PRIMEIRA LINHA ----------------

// Quadrado 1 - preto
gl.uniform2f(deslocamentoLocation, 100, 100);
gl.uniform4f(corLocation, 0.0, 0.0, 0.0, 1.0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


// Quadrado 2 - vermelho
gl.uniform2f(deslocamentoLocation, 250, 100);
gl.uniform4f(corLocation, 1.0, 0.0, 0.0, 1.0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


// Quadrado 3 - verde
gl.uniform2f(deslocamentoLocation, 400, 100);
gl.uniform4f(corLocation, 0.0, 1.0, 0.0, 1.0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


// ---------------- SEGUNDA LINHA ----------------

// Quadrado 4 - azul
gl.uniform2f(deslocamentoLocation, 100, 250);
gl.uniform4f(corLocation, 0.0, 0.0, 1.0, 1.0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


// Quadrado 5 - amarelo
gl.uniform2f(deslocamentoLocation, 250, 250);
gl.uniform4f(corLocation, 1.0, 1.0, 0.0, 1.0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


// Quadrado 6 - magenta
gl.uniform2f(deslocamentoLocation, 400, 250);
gl.uniform4f(corLocation, 1.0, 0.0, 1.0, 1.0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


// ---------------- TERCEIRA LINHA ----------------

// Quadrado 7 - ciano
gl.uniform2f(deslocamentoLocation, 100, 400);
gl.uniform4f(corLocation, 0.0, 1.0, 1.0, 1.0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


// Quadrado 8 - cinza
gl.uniform2f(deslocamentoLocation, 250, 400);
gl.uniform4f(corLocation, 0.6, 0.6, 0.6, 1.0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


// Quadrado 9 - branco
gl.uniform2f(deslocamentoLocation, 400, 400);
gl.uniform4f(corLocation, 1.0, 1.0, 1.0, 1.0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


DEU CERTO MAS NÃO É O QUE O ENUNCIADO PEDE --------- ALTERAR !! */ 





// --------------------------------- PARTE 6 - SEGUNDA TENTATIVA ---------------------------------------------
/*ENUNCIADO: Crie 9 desses objetos(QUADRADOS). Ao desenhar, itere sobre uma lista deles, por exemplo, ativando seu VAO 
e definindo sua cor, para então mandar desenhá-lo.*/

const quadrados = [
  {
    x: 100, y: 100,  cor: [0.0, 0.0, 0.0, 1.0] // QUADRADO 1 | preto
  },

  {
    x: 250, y: 100, cor: [1.0, 0.0, 0.0, 1.0] //  QUADRADO 2 | vermelho
  },

  {
    x: 400, y: 100, cor: [0.0, 1.0, 0.0, 1.0] //  QUADRADO 3 | verde
  },

  {
    x: 100, y: 250, cor: [0.0, 0.0, 1.0, 1.0] //  QUADRADO 4 | azul
  },

  {
    x: 250, y: 250, cor: [1.0, 1.0, 0.0, 1.0] //  QUADRADO 5 | amarelo
  },

  {
    x: 400, y: 250, cor: [1.0, 0.0, 1.0, 1.0] //  QUADRADO 6 | magenta
  },

  {
    x: 100, y: 400, cor: [0.0, 1.0, 1.0, 1.0] //  QUADRADO 7 | ciano
  },

  {
    x: 250, y: 400, cor: [0.6, 0.6, 0.6, 1.0] //  QUADRADO 8| cinza
  },

  {
    x: 400, y: 400, cor: [1.0, 1.0, 1.0, 1.0] //  QUADRADO 9 | branco
  }
]; 

// ---------------- RENDERIZAÇÃO ----------------
gl.clear(gl.COLOR_BUFFER_BIT); // LIMPANDO O CANVAS 
gl.bindVertexArray(vaoQuadrado1);// DEFININDO AS CONFIGURAÇÕES DE VAOQUADRADO1 PARA OS OUTROS QUADRADOS

//Para cada quadrado dentro do array quadrados, execute esse bloco.
//PERCORRE TODOS OS OBJETOS DA LISTA
quadrados.forEach((quadrado) => {
  // define a posição do quadrado
  gl.uniform2f( deslocamentoLocation, quadrado.x,quadrado.y);

  // define a cor do quadrado
  gl.uniform4f(corLocation,quadrado.cor[0],quadrado.cor[1],quadrado.cor[2],quadrado.cor[3]);

  // desenha
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

});