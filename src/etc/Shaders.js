/**
 * @author MicMetzger /
 */
import {Matrix4, Vector2, Vector3} from "three";
// import {MeshBVHUniformStruct, shaderIntersectFunction, shaderStructs} from "./three-mesh-bvh.js";



const ProtectionShader = {
   uniforms      : {
      time: {
         value: 0
      }
   },
   vertexShader  : `
		varying vec2 vUv;
		void main()	{
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,
   fragmentShader: `
		varying vec2 vUv;
		uniform float time;

		const float lines = 10.0;
		const float linewidth = 0.25;
		const float speed = 6.0;

		void main()	{
			float p = abs( fract( speed * time - lines * vUv.y ) * 2.0 - 1.0 );
			float c = smoothstep( p, p + 0.01, linewidth );
			gl_FragColor = vec4( vec3( c ), c );
		}
	`
};



const HitShader = {
   uniforms      : {
      time: {
         value: 0
      }
   },
   vertexShader  : `
		varying vec2 vUv;
		void main()	{
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,
   fragmentShader: `
		varying vec2 vUv;
		uniform float time;

		const float speed = 3.0;
		const float width = 0.05;
		const float border = 0.01;

		void main()	{

			vec2 dist = vUv - vec2( 0.5 );
			float l = length( dist );

			float f = fract( time * speed );
			float y = 0.1 + ( f * 0.4 );
			float w = sin( f ) * width;

			float c = smoothstep( y - border, y, l ) * ( 1.0 - smoothstep( y + w, y + w + border, l ) );

			gl_FragColor = vec4( c );

		}
	`
};



const ParticleShader = {
   uniforms      : {
      map: {
         value: null
      }
   },
   vertexShader  : `
		attribute float opacity;
		attribute float size;
		attribute float angle;
		attribute float t;

		varying float vAlpha;
		varying float vAngle;

		void main()	{
			vAlpha = opacity * ( 1.0 - t );
			vAngle = angle * t;

			vec3 pos = position;
			pos.y += size * t * 0.03;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
			gl_PointSize = size;
		}
	`,
   fragmentShader: `
		varying float vAlpha;
		varying float vAngle;
		uniform sampler2D map;

		void main()	{
			vec2 uv = gl_PointCoord;

			float c = cos( vAngle );
			float s = sin( vAngle );

			uv = vec2( c * ( uv.x - 0.5 ) + s * ( uv.y - 0.5 ) + 0.5, c * ( uv.y - 0.5 ) - s * ( uv.x - 0.5 ) + 0.5 );

			vec4 color = texture2D( map, uv );
			color.a *= vAlpha;

			gl_FragColor = vec4( color );
		}
	`
};



const NightShader = {

   uniforms: {
      'sceneDiffuse': {value: null}
   },

   vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

   fragmentShader: `
		uniform sampler2D sceneDiffuse;
      varying vec2 vUv;
		void main() {
            vec4 diffuse = texture2D(sceneDiffuse, vUv);
            gl_FragColor = vec4(diffuse.rgb, 1.0);
		}`
};



/*
 const ShadowShader = {

 uniforms: {
 'sceneDiffuse'       : {value: null},
 'sceneDepth'         : {value: null},
 'projectionMatrixInv': {value: new Matrix4()},
 'viewMatrixInv'      : {value: new Matrix4()},
 'bvh'                : {value: new MeshBVHUniformStruct()},
 'cameraPos'          : {value: new Vector3()},
 'resolution'         : {value: new Vector2()},
 'lightPos'           : {value: new Vector3(30.0, 60.0, 30.0)},
 'time'               : {value: 0.0},
 },

 vertexShader: `
 varying vec2 vUv;
 void main() {
 vUv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
 }`,

 fragmentShader: `
 precision highp isampler2D;
 precision highp usampler2D;
 uniform sampler2D sceneDiffuse;
 uniform sampler2D sceneDepth;
 uniform float time;
 ${shaderStructs}
 ${shaderIntersectFunction}
 uniform mat4 projectionMatrixInv;
 uniform mat4 viewMatrixInv;
 varying vec2 vUv;
 uniform BVH bvh;
 uniform vec3 cameraPos;
 uniform vec2 resolution;
 uniform vec3 lightPos;
 vec3 WorldPosFromDepth(float depth, vec2 coord) {
 float z = depth * 2.0 - 1.0;
 vec4 clipSpacePosition = vec4(coord * 2.0 - 1.0, z, 1.0);
 vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
 // Perspective division
 viewSpacePosition /= viewSpacePosition.w;
 vec4 worldSpacePosition = viewMatrixInv * viewSpacePosition;
 return worldSpacePosition.xyz;
 }
 vec3 computeNormal(vec3 worldPos, vec2 vUv) {
 vec2 downUv = vUv + vec2(0.0, 1.0 / (resolution.y * 1.0));
 vec3 downPos = WorldPosFromDepth( texture2D(sceneDepth, downUv).x, downUv);
 vec2 rightUv = vUv + vec2(1.0 / (resolution.x * 1.0), 0.0);;
 vec3 rightPos = WorldPosFromDepth(texture2D(sceneDepth, rightUv).x, rightUv);
 vec2 upUv = vUv - vec2(0.0, 1.0 / (resolution.y * 0.01));
 vec3 upPos = WorldPosFromDepth(texture2D(sceneDepth, upUv).x, upUv);
 vec2 leftUv = vUv - vec2(1.0 / (resolution.x * 1.0), 0.0);;
 vec3 leftPos = WorldPosFromDepth(texture2D(sceneDepth, leftUv).x, leftUv);
 int hChoice;
 int vChoice;
 if (length(leftPos - worldPos) < length(rightPos - worldPos)) {
 hChoice = 0;
 } else {
 hChoice = 1;
 }
 if (length(upPos - worldPos) < length(downPos - worldPos)) {
 vChoice = 0;
 } else {
 vChoice = 1;
 }
 vec3 hVec;
 vec3 vVec;
 if (hChoice == 0 && vChoice == 0) {
 hVec = leftPos - worldPos;
 vVec = upPos - worldPos;
 } else if (hChoice == 0 && vChoice == 1) {
 hVec = leftPos - worldPos;
 vVec = worldPos - downPos;
 } else if (hChoice == 1 && vChoice == 1) {
 hVec = rightPos - worldPos;
 vVec = downPos - worldPos;
 } else if (hChoice == 1 && vChoice == 0) {
 hVec = rightPos - worldPos;
 vVec = worldPos - upPos;
 }
 return normalize(cross(hVec, vVec));
 }
 float rand(vec2 n) {
 return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
 }

 void main() {
 vec4 texel = texture2D( sceneDiffuse, vUv );
 float depth = texture2D(sceneDepth, vUv).x;
 vec3 worldPos = WorldPosFromDepth(depth, vUv);
 // vec3 normal = computeNormal(worldPos, vUv);
 gl_FragColor = texel;
 uvec4 faceIndices = uvec4( 0u );
 vec3 faceNormal = vec3( 0.0, 0.0, 1.0 );
 vec3 barycoord = vec3( 0.0 );
 float side = 1.0;
 float dist = 0.0;
 vec3 lightPosSample = lightPos;
 vec3 toLight = normalize(vec3(lightPosSample) - worldPos);
 bool didHit = bvhIntersectFirstHit( bvh, worldPos + 0.01 * toLight, toLight, faceIndices, faceNormal, barycoord, side, dist );
 if (didHit && depth < 1.0 && dist <= length(vec3(lightPosSample) - worldPos)) {
 gl_FragColor.xyz = vec3(dist / length(vec3(lightPosSample) - worldPos));
 } else {
 gl_FragColor.xyz = vec3(1.0);
 }
 }`

 };
 */



export {ProtectionShader, HitShader, ParticleShader, NightShader/* , ShadowShader */};
