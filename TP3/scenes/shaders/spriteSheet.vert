attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float n;
uniform float m;

uniform float N;
uniform float M;

varying vec2 vTextureCoord;

void main() {

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	vTextureCoord = vec2((aTextureCoord.x + m) / M , ((aTextureCoord.y  + n) / N));
}

