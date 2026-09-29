import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { story } from '../../story/store';
import { EVENTS, ramp, window01 } from '../../story/script';
import { plasterTexture, concreteTexture } from '../../utils/filmTextures';

/** House exterior shell built from wall panels so the camera can enter. */
function HouseShell({ plaster }: { plaster: THREE.Texture }) {
  const windowGlow = useMemo(() => new THREE.Color('#ffb54d'), []);
  const wall = { map: plaster, roughness: 0.93, metalness: 0.03 };
  return (
    <group>
      {/* front wall split around the doorway (opening x -0.9..0.9, y 0..2.25) */}
      <mesh castShadow receiveShadow position={[-2.45, 1.5, 2]}>
        <boxGeometry args={[3.1, 3, 0.24]} />
        <meshStandardMaterial {...wall} />
      </mesh>
      <mesh castShadow receiveShadow position={[2.45, 1.5, 2]}>
        <boxGeometry args={[3.1, 3, 0.24]} />
        <meshStandardMaterial {...wall} />
      </mesh>
      <mesh castShadow position={[0, 2.65, 2]}>
        <boxGeometry args={[1.8, 0.7, 0.24]} />
        <meshStandardMaterial {...wall} />
      </mesh>
      {/* doorway trim */}
      <mesh position={[0, 1.15, 2.02]}>
        <boxGeometry args={[1.9, 2.35, 0.06]} />
        <meshStandardMaterial color="#3a2c1e" roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.12, 2.07]}>
        <boxGeometry args={[1.62, 2.26, 0.05]} />
        <meshStandardMaterial color="#0c0d10" roughness={0.9} />
      </mesh>

      {/* back + side walls */}
      <mesh castShadow receiveShadow position={[0, 1.5, -6]}>
        <boxGeometry args={[8, 3, 0.24]} />
        <meshStandardMaterial {...wall} />
      </mesh>
      {[-4, 4].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 1.5, -2]}>
          <boxGeometry args={[0.24, 3, 8]} />
          <meshStandardMaterial {...wall} />
        </mesh>
      ))}

      {/* lit windows facing the compound */}
      {[-2.35, 2.5].map((x) => (
        <group key={x} position={[x, 1.65, 2.14]}>
          <mesh>
            <planeGeometry args={[1.05, 1.05]} />
            <meshBasicMaterial color={windowGlow} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.045, 1.12, 0.045]} />
            <meshStandardMaterial color="#20242a" roughness={0.5} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[1.12, 0.045, 0.045]} />
            <meshStandardMaterial color="#20242a" roughness={0.5} metalness={0.5} />
          </mesh>
        </group>
      ))}
      {/* side window — cooler, curtain-lit */}
      <mesh position={[4.13, 1.7, -3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.2, 0.9]} />
        <meshBasicMaterial color="#c9d8e8" toneMapped={false} />
      </mesh>

      {/* flat concrete roof + parapet — the everyday Nigerian bungalow */}
      <mesh castShadow receiveShadow position={[0, 3.12, -2]}>
        <boxGeometry args={[8.6, 0.24, 8.6]} />
        <meshStandardMaterial color="#6d675d" roughness={0.92} />
      </mesh>
      <mesh position={[0, 3.42, 2.28]}>
        <boxGeometry args={[8.6, 0.42, 0.16]} />
        <meshStandardMaterial {...wall} />
      </mesh>
      <mesh position={[0, 3.42, -6.28]}>
        <boxGeometry args={[8.6, 0.42, 0.16]} />
        <meshStandardMaterial {...wall} />
      </mesh>
      {[-4.28, 4.28].map((x) => (
        <mesh key={x} position={[x, 3.42, -2]}>
          <boxGeometry args={[0.16, 0.42, 8.6]} />
          <meshStandardMaterial {...wall} />
        </mesh>
      ))}

      {/* porch bulb — flickers with the room light during the burst */}
      <PorchBulb />
    </group>
  );
}

function PorchBulb() {
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const t = story.t;
    const warmBack = ramp(t, EVENTS.result[0], EVENTS.result[1]);
    if (light.current) light.current.intensity = 2.2 + warmBack * 2.6;
  });
  return (
    <pointLight ref={light} position={[0, 2.5, 2.7]} color="#ffbe6e" intensity={2.2} distance={9} decay={2} />
  );
}

/** Perimeter fence with gate opening, external tank on a stand, generator hut. */
function CompoundYard({ concrete }: { concrete: THREE.Texture }) {
  const fence = { color: '#b7ab93', roughness: 0.94, metalness: 0.04 };
  return (
    <group>
      {/* compound slab */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3]}>
        <planeGeometry args={[24, 18]} />
        <meshStandardMaterial map={concrete} roughness={0.96} />
      </mesh>

      {/* fence line at z=10 with gate opening x -1.4..1.4 */}
      {[-6.7, 6.7].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.9, 10]}>
          <boxGeometry args={[10.6, 1.8, 0.2]} />
          <meshStandardMaterial {...fence} />
        </mesh>
      ))}
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} castShadow position={[x, 1.15, 10]}>
          <boxGeometry args={[0.4, 2.3, 0.4]} />
          <meshStandardMaterial color="#98896d" roughness={0.9} />
        </mesh>
      ))}
      {/* gate pillars + lamps */}
      {[-1.75, 1.75].map((x) => (
        <group key={x} position={[x, 0, 10]}>
          <mesh castShadow position={[0, 1.35, 0]}>
            <boxGeometry args={[0.5, 2.7, 0.5]} />
            <meshStandardMaterial color="#a4937a" roughness={0.88} />
          </mesh>
          <mesh position={[0, 2.82, 0]}>
            <sphereGeometry args={[0.09, 12, 10]} />
            <meshBasicMaterial color="#ffd9a0" toneMapped={false} />
          </mesh>
          <pointLight position={[0, 2.8, 0]} color="#ffbe6e" intensity={1.6} distance={5} decay={2} />
        </group>
      ))}

      {/* side + back fence */}
      {[-11.5, 11.5].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.9, 3]}>
          <boxGeometry args={[0.2, 1.8, 14]} />
          <meshStandardMaterial {...fence} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 0.9, -8.5]}>
        <boxGeometry args={[23.2, 1.8, 0.2]} />
        <meshStandardMaterial {...fence} />
      </mesh>

      {/* external water tank on steel stand — the compound signature */}
      <group position={[-4.6, 0, 5.6]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            castShadow
            position={[(i % 2 ? 0.42 : -0.42) * (i < 2 ? 1 : 1), 0.85, (i < 2 ? -0.42 : 0.42)]}
          >
            <boxGeometry args={[0.09, 1.7, 0.09]} />
            <meshStandardMaterial color="#3c4046" roughness={0.45} metalness={0.65} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 1.78, 0]}>
          <boxGeometry args={[1.05, 0.08, 1.05]} />
          <meshStandardMaterial color="#3c4046" roughness={0.45} metalness={0.65} />
        </mesh>
        <mesh castShadow position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 1.35, 24]} />
          <meshStandardMaterial color="#e8e6de" roughness={0.42} metalness={0.2} />
        </mesh>
        <mesh position={[0, 3.2, 0]}>
          <cylinderGeometry args={[0.66, 0.62, 0.12, 24]} />
          <meshStandardMaterial color="#2f343a" roughness={0.5} metalness={0.4} />
        </mesh>
      </group>

      {/* generator hut + exhaust */}
      <group position={[4.8, 0, 6.2]}>
        <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
          <boxGeometry args={[1.5, 1.1, 1.2]} />
          <meshStandardMaterial color="#4d4a44" roughness={0.88} />
        </mesh>
        <mesh castShadow position={[0, 1.18, 0]}>
          <boxGeometry args={[1.68, 0.1, 1.36]} />
          <meshStandardMaterial color="#33312c" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.6, -0.3]} castShadow>
          <cylinderGeometry args={[0.045, 0.05, 0.9, 10]} />
          <meshStandardMaterial color="#23262a" roughness={0.5} metalness={0.6} />
        </mesh>
      </group>

      {/* parked sedan in the driveway */}
      <group position={[2.9, 0, 2.4]} rotation={[0, -0.12, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
          <boxGeometry args={[1.6, 0.52, 3.4]} />
          <meshStandardMaterial color="#5a646e" roughness={0.38} metalness={0.55} />
        </mesh>
        <mesh castShadow position={[0, 1.02, -0.18]}>
          <boxGeometry args={[1.42, 0.44, 1.75]} />
          <meshStandardMaterial color="#14181d" roughness={0.15} metalness={0.6} />
        </mesh>
        {[
          [-0.8, 1.15], [0.8, 1.15], [-0.8, -1.15], [0.8, -1.15],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.3, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.29, 0.29, 0.2, 16]} />
            <meshStandardMaterial color="#101113" roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* gate — swings open just before the van arrives */}
      <SwingingGate />
    </group>
  );
}

function SwingingGate() {
  const gate = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const t = story.t;
    const open = window01(t, EVENTS.vanArrival[0] - 0.02, 0.66, 0.02);
    if (gate.current) {
      gate.current.rotation.y = THREE.MathUtils.lerp(gate.current.rotation.y, -open * 1.7, delta * 4);
    }
  });
  return (
    <group ref={gate} position={[1.4, 0, 10]}>
      <mesh castShadow position={[-0.7, 0.85, 0]}>
        <boxGeometry args={[1.4, 1.7, 0.06]} />
        <meshStandardMaterial color="#2d3238" roughness={0.42} metalness={0.7} />
      </mesh>
      {[0.35, 1.35].map((y) => (
        <mesh key={y} position={[-0.7, y, 0.045]}>
          <boxGeometry args={[1.42, 0.06, 0.02]} />
          <meshStandardMaterial color="#1c2024" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export default function Compound() {
  const textures = useMemo(() => ({ plaster: plasterTexture('#c3b295'), concrete: concreteTexture() }), []);
  return (
    <group>
      <Stars radius={140} depth={50} count={1600} factor={3.2} saturation={0} fade speed={0.35} />
      {/* moon */}
      <mesh position={[-38, 30, -55]}>
        <sphereGeometry args={[2.4, 24, 24]} />
        <meshBasicMaterial color="#dfe6f2" toneMapped={false} />
      </mesh>
      {/* street beyond the gate */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 22]}>
        <planeGeometry args={[90, 26]} />
        <meshStandardMaterial color="#171a1f" roughness={0.97} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 22]}>
        <planeGeometry args={[90, 0.16]} />
        <meshBasicMaterial color="#4c5157" transparent opacity={0.5} />
      </mesh>
      {/* ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial color="#0d1013" roughness={1} />
      </mesh>

      <CompoundYard concrete={textures.concrete} />
      <HouseShell plaster={textures.plaster} />
    </group>
  );
}
