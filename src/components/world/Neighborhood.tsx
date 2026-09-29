import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { story } from '../../story/store';
import { EVENTS, ramp } from '../../story/script';

const WALL_PALETTE = ['#c2ab87', '#a9b6a2', '#d6cbbb', '#8f9db0', '#b3a290', '#c7c2b4', '#98876d'];
const ROOF_PALETTE = ['#4a3b30', '#3c4249', '#5a4132', '#2f353b'];

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Lot {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  twoStorey: boolean;
  wall: string;
  roof: string;
  hip: boolean;
  lit: boolean;
  tank: boolean;
  dish: boolean;
  tree: boolean;
  activity?: 'weld' | 'paint' | 'solar' | 'generator';
}

function buildLots(): Lot[] {
  const spots: [number, number][] = [
    [-17, 16], [-8.5, 18], [8.5, 18], [17, 15], [26, 19], [-26, 18],
    [-19, 28], [-9, 31], [2, 33], [12, 30], [23, 29], [-28, 30],
    [-16, -13], [-6, -16], [6, -15], [16, -12], [24, -18], [-26, -17],
    [33, 12], [-34, 11],
  ];
  return spots.map(([x, z], i) => ({
    x,
    z,
    w: 3.4 + seeded(i, 1) * 2.8,
    d: 3.2 + seeded(i, 2) * 2.2,
    h: 2.7 + seeded(i, 3) * 0.9,
    twoStorey: seeded(i, 4) > 0.68,
    wall: WALL_PALETTE[Math.floor(seeded(i, 5) * WALL_PALETTE.length)],
    roof: ROOF_PALETTE[Math.floor(seeded(i, 6) * ROOF_PALETTE.length)],
    hip: seeded(i, 7) > 0.5,
    lit: seeded(i, 8) > 0.42,
    tank: seeded(i, 9) > 0.55,
    dish: seeded(i, 10) > 0.6,
    tree: seeded(i, 11) > 0.5,
    activity: i === 1 ? 'weld' : i === 9 ? 'paint' : i === 3 ? 'solar' : i === 14 ? 'generator' : undefined,
  }));
}

function House({ lot }: { lot: Lot }) {
  const weld = useRef<THREE.PointLight>(null);
  const paintPatch = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (weld.current) {
      const f = Math.random() > 0.86 ? 1 : 0.12;
      weld.current.intensity = THREE.MathUtils.lerp(weld.current.intensity, f * 9, 0.4);
    }
    if (paintPatch.current) {
      paintPatch.current.position.y = lot.h * 0.5 + Math.sin(clock.elapsedTime * 0.7) * 0.25;
    }
  });

  return (
    <group position={[lot.x, 0, lot.z]} rotation={[0, (lot.x > 0 ? -1 : 1) * 0.08 * lot.x * 0.02, 0]}>
      <mesh castShadow receiveShadow position={[0, lot.h / 2, 0]}>
        <boxGeometry args={[lot.w, lot.h, lot.d]} />
        <meshStandardMaterial color={lot.wall} roughness={0.94} metalness={0.03} />
      </mesh>
      {lot.twoStorey && (
        <mesh castShadow position={[0, lot.h + lot.h * 0.32, 0]}>
          <boxGeometry args={[lot.w * 0.86, lot.h * 0.64, lot.d * 0.9]} />
          <meshStandardMaterial color={lot.wall} roughness={0.94} />
        </mesh>
      )}
      {lot.hip ? (
        <mesh castShadow position={[0, lot.h + (lot.twoStorey ? lot.h * 0.64 : 0) + 0.55, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[lot.w * 0.78, 1.1, 4]} />
          <meshStandardMaterial color={lot.roof} roughness={0.72} metalness={0.14} />
        </mesh>
      ) : (
        <mesh castShadow position={[0, lot.h + (lot.twoStorey ? lot.h * 0.64 : 0) + 0.09, 0]}>
          <boxGeometry args={[lot.w + 0.3, 0.18, lot.d + 0.3]} />
          <meshStandardMaterial color="#6d675d" roughness={0.92} />
        </mesh>
      )}
      {lot.lit && (
        <mesh position={[0, lot.h * 0.55, lot.d / 2 + 0.02]}>
          <planeGeometry args={[0.7, 0.6]} />
          <meshBasicMaterial color="#ffb54d" toneMapped={false} />
        </mesh>
      )}
      {lot.tank && (
        <mesh castShadow position={[lot.w * 0.22, lot.h + 0.75, -lot.d * 0.2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.85, 14]} />
          <meshStandardMaterial color="#e8e6de" roughness={0.45} metalness={0.2} />
        </mesh>
      )}
      {lot.dish && (
        <mesh position={[-lot.w * 0.3, lot.h + 0.4, lot.d * 0.3]} rotation={[1.1, 0.4, 0]}>
          <sphereGeometry args={[0.3, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
          <meshStandardMaterial color="#c3c8cd" roughness={0.35} metalness={0.55} side={THREE.DoubleSide} />
        </mesh>
      )}
      {lot.tree && (
        <group position={[lot.w * 0.75, 0, lot.d * 0.4]}>
          <mesh castShadow position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.09, 0.13, 1.8, 8]} />
            <meshStandardMaterial color="#3f2d1e" roughness={1} />
          </mesh>
          <mesh castShadow position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.85, 12, 10]} />
            <meshStandardMaterial color="#1d3524" roughness={1} />
          </mesh>
        </group>
      )}
      {lot.activity === 'weld' && (
        <group position={[lot.w * 0.62, 0, lot.d * 0.55]}>
          <pointLight ref={weld} color="#bfe0ff" intensity={1} distance={6} decay={2} position={[0, 0.8, 0]} />
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.5, 0.5]} />
            <meshStandardMaterial color="#3a3f45" roughness={0.6} metalness={0.5} />
          </mesh>
        </group>
      )}
      {lot.activity === 'paint' && (
        <>
          <mesh ref={paintPatch} position={[0, lot.h * 0.5, lot.d / 2 + 0.03]}>
            <planeGeometry args={[lot.w * 0.8, 0.8]} />
            <meshBasicMaterial color="#3e6f9e" />
          </mesh>
          <mesh castShadow position={[0.4, lot.h * 0.45, lot.d / 2 + 0.22]} rotation={[0.12, 0, 0.06]}>
            <boxGeometry args={[0.06, lot.h * 0.9, 0.06]} />
            <meshStandardMaterial color="#7c6a4a" roughness={0.9} />
          </mesh>
        </>
      )}
      {lot.activity === 'solar' && (
        <mesh position={[0, lot.h + 0.5, 0]} rotation={[-0.5, 0.3, 0]}>
          <boxGeometry args={[1.6, 0.06, 1]} />
          <meshStandardMaterial color="#12233f" roughness={0.18} metalness={0.75} emissive="#1d3f6e" emissiveIntensity={0.3} />
        </mesh>
      )}
      {lot.activity === 'generator' && (
        <group position={[lot.w * 0.6, 0, -lot.d * 0.5]}>
          <mesh castShadow position={[0, 0.3, 0]}>
            <boxGeometry args={[0.7, 0.55, 0.5]} />
            <meshStandardMaterial color="#4d4a44" roughness={0.85} />
          </mesh>
          <pointLight position={[0, 0.9, 0]} color="#ff9500" intensity={1.4} distance={3.5} decay={2} />
        </group>
      )}
      {/* front fence strip */}
      <mesh castShadow position={[0, 0.45, lot.d / 2 + 1.6]}>
        <boxGeometry args={[lot.w + 2.4, 0.9, 0.12]} />
        <meshStandardMaterial color="#8f8574" roughness={0.95} />
      </mesh>
    </group>
  );
}

export default function Neighborhood() {
  const lots = useMemo(buildLots, []);
  const alive = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = story.t;
    if (alive.current) {
      // pops in beyond the fence line well before the pullback reaches it
      alive.current.visible = t > EVENTS.reveal[0] - 0.16;
    }
  });

  return <group ref={alive} visible={false}>{lots.map((lot, i) => <House key={i} lot={lot} />)}</group>;
}
