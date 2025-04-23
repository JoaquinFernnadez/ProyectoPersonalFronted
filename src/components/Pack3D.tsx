import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

  function SobrePlano() {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const texture = useTexture('/src/images/pack.png')

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
      ref.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1
    }
  })

  return (
    <mesh
      ref={ref}
      scale={hovered ? 1.6 : 1.4}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[1.5, 2]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  )
}

export default function Pack3D() {
  return (
    <div className="w-[200px] h-[300px]">
      <Canvas shadows camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 5]} intensity={1} castShadow />
        <SobrePlano />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
