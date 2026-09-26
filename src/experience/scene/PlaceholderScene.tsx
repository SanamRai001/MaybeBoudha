export function PlaceholderScene() {
  return (
    <group>
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[2.5, 2.75, 0.42, 64]} />
        <meshStandardMaterial color="#8d8576" roughness={0.95} />
      </mesh>

      <mesh position={[0, 0.58, 0]} scale={[1, 0.62, 1]}>
        <sphereGeometry args={[1.75, 64, 32]} />
        <meshStandardMaterial color="#e6dfcf" roughness={0.82} />
      </mesh>

      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[0.82, 0.55, 0.82]} />
        <meshStandardMaterial color="#c7a24b" roughness={0.62} />
      </mesh>

      <mesh position={[0, 2.22, 0]}>
        <coneGeometry args={[0.5, 1.35, 32]} />
        <meshStandardMaterial color="#a98533" roughness={0.58} metalness={0.08} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.39, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#202421" roughness={1} />
      </mesh>
    </group>
  )
}
