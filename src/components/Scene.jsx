import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import LiquidEffect from './LiquidEffect'

export default function Scene() {
  return (
    <>
      {/* Your normal scene content */}
      <mesh>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color="#111" />
      </mesh>

      {/* Post Processing */}
      <EffectComposer>
        <LiquidEffect />
      </EffectComposer>
    </>
  )
}
