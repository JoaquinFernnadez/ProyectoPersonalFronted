import { useTexture } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh } from 'three'
import * as THREE from 'three'

function SpinningBox() {
  const ref = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const texture = useTexture('/src/images/pack.png')

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
    }
  })

  return (
    <mesh
      ref={ref}
      scale={hovered ? 2.8 : 2.5}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1.5, 2, 1]} />
      <meshStandardMaterial map={texture}  metalness={0.5} roughness={0.3} emissive={hovered ? new THREE.Color('#ffcc00') : new THREE.Color('#000000')}
        emissiveIntensity={0.2} />
    </mesh>
  )
}

export default function Test3D() {
  return (
    <div style={{ width: 200, height: 320 }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.4} />
        <spotLight position={[2, 5, 5]} angle={0.5} penumbra={1} intensity={1.5} castShadow />
        <directionalLight position={[5, 5, 5]} />
        <SpinningBox />
      </Canvas>
    </div>
  )
}


