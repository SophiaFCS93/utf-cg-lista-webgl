
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