var vertexShaderText = 
[
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    '',
    'void main()',
    '{',
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}'
].join('\n');

var fragShaderText = 
[
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main() {',
    '   gl_FragColor = vec4(gl_FragCoord.x/640.0, 0.0, gl_FragCoord.y/480.0, 1.0);',
    '}',
].join('\n');

var Init = function() {

    console.log("running...");

    var canvas = document.getElementById('out');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log("WebGL is not supported by this browser! Attempting to use experimental-webgl.");
        gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) {
        console.log("WebGL and experimental-webgl not supported.");
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Creating shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragShader, fragShaderText);


    // Compiles shaders
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('error compiling vertex shader.', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.error('error compiling fragment shader.', gl.getShaderInfoLog(fragShader));
        return;
    }

    // Creates program
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);

    // Links program
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('error linking program.', gl.getProgramInfoLog(program));
        return;
    }

    // Validates the program +++ dont include this in release as this is computationally expensive!
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('error validating program.', gl.getProgramInfoLog(program));
        return;
    }
    
    // Create compute buffer
    // vert = [X, Y, R, G, B]
    var vertices = [
        -1.0, -1.0,
        1.0, -1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, 1.0,
        -1.0, 1.0
    ];

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // uses float32Array as all numbers in js are 64bit double precision fps, and gl expects a float
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttributeLocation, // location of attr in function
        2, // number of elements per attr (vec2)
        gl.FLOAT, // type
        gl.FALSE,
        8, // sizeof element (2 floats)
        0 // offset from berginning of a vertex to this attr
    );
    gl .enableVertexAttribArray(positionAttributeLocation);

    // draw program to bound screen
    gl.useProgram(program);

    // uses bound buffer
    gl.drawArrays(
        gl.TRIANGLES, // drawing mode
        0, // how many elements to skip
        6 // how many elements to draw
    );
};