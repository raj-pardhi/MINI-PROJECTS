import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import * as THREE from 'three'

export default function LiquidEffect() {
  const { size } = useThree()
  const mouse = useRef(new THREE.Vector2(0.5, 0.5))
  const strength = useRef(0)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX / size.width
      mouse.current.y = 1 - e.clientY / size.height
      strength.current = 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [size])

  useFrame((_, delta) => {
    strength.current = THREE.MathUtils.lerp(
      strength.current,
      0,
      delta * 3
    )
    pass.uniforms.uTime.value += delta
    pass.uniforms.uMouse.value.copy(mouse.current)
    pass.uniforms.uStrength.value = strength.current
  })

  const pass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uMouse: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uStrength: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uStrength;
      varying vec2 vUv;

      void main() {
        float dist = distance(vUv, uMouse);
        float ripple = smoothstep(0.35, 0.0, dist);

        vec2 offset = normalize(vUv - uMouse) * ripple * uStrength * 0.08;
        vec4 color = texture2D(tDiffuse, vUv + offset);

        gl_FragColor = color;
      }
    `
  })

  return <primitive object={pass} />
}
