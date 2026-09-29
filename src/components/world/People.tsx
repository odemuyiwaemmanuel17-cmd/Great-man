import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { story } from '../../story/store';
import { EVENTS, ramp, window01 } from '../../story/script';
import { phoneScreenTexture } from '../../utils/filmTextures';

const SILHOUETTE = { color: '#05060a', roughness: 1, metalness: 0 };

/**
 * Homeowner — seen only as a backlit silhouette holding their phone, exactly
 * as a real camera would frame them at 9:47pm in a dark hallway.
 */
export function Homeowner() {
  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.PointLight>(null);
  const screens = useMemo(
    () => ({
      lock: phoneScreenTexture({ kind: 'lock' }),
      report: phoneScreenTexture({ kind: 'report' }),
      match: phoneScreenTexture({ kind: 'match' }),
    }),
    [],
  );

  useFrame(({ clock }) => {
    const t = story.t;
    const visible = window01(t, EVENTS.discovery[0] - 0.01, 0.575, 0.02);
    if (group.current) {
      group.current.visible = visible > 0.01;
      group.current.position.y = (1 - visible) * -0.4 + Math.sin(clock.elapsedTime * 1.1) * 0.012;
    }
    if (screen.current) {
      const mat = screen.current.material as THREE.MeshBasicMaterial;
      const kind = t < EVENTS.phoneReport[0] ? 'lock' : t < EVENTS.phoneMatch[0] ? 'report' : 'match';
      if (mat.map !== screens[kind]) {
        mat.map = screens[kind];
        mat.needsUpdate = true;
      }
      mat.color.setScalar(t > EVENTS.discovery[1] ? 0.4 : 1);
    }
    if (glow.current) {
      const on = window01(t, EVENTS.discovery[0], EVENTS.discovery[1] + 0.04);
      glow.current.intensity = on * (2.6 + Math.sin(clock.elapsedTime * 7) * 0.3);
    }
  });

  return (
    <group ref={group} position={[1.15, 0, 1.55]} rotation={[0, -0.5, 0]} visible={false}>
      {[-0.11, 0.11].map((z) => (
        <mesh key={z} castShadow position={[0, 0.42, z * 1.1]}>
          <capsuleGeometry args={[0.075, 0.55, 5, 10]} />
          <meshStandardMaterial {...SILHOUETTE} />
        </mesh>
      ))}
      {/* wrapper top — wider torso line */}
      <mesh castShadow position={[0, 1.18, 0]}>
        <capsuleGeometry args={[0.21, 0.42, 6, 12]} />
        <meshStandardMaterial {...SILHOUETTE} />
      </mesh>
      <mesh castShadow position={[0, 1.62, 0.01]}>
        <sphereGeometry args={[0.115, 18, 14]} />
        <meshStandardMaterial {...SILHOUETTE} />
      </mesh>
      {/* raised arm holding the phone toward the room */}
      <mesh castShadow position={[0.14, 1.32, 0.24]} rotation={[0.9, 0.35, -0.3]}>
        <capsuleGeometry args={[0.045, 0.4, 5, 10]} />
        <meshStandardMaterial {...SILHOUETTE} />
      </mesh>
      <mesh position={[0.26, 1.24, 0.44]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshStandardMaterial {...SILHOUETTE} />
      </mesh>
      {/* the phone */}
      <group position={[0.3, 1.3, 0.5]} rotation={[0.12, -0.55, 0.06]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.3, 0.018]} />
          <meshStandardMaterial color="#0b0d12" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh ref={screen} position={[0, 0, 0.011]}>
          <planeGeometry args={[0.142, 0.272]} />
          <meshBasicMaterial map={screens.lock} toneMapped={false} />
        </mesh>
      </group>
      <pointLight ref={glow} position={[0.32, 1.32, 0.62]} color="#a8c4ff" intensity={0} distance={3.2} decay={2} />
      {/* hallway rim light behind them */}
      <pointLight position={[0.2, 1.7, 1.6]} color="#ff9e4d" intensity={3.4} distance={4.5} decay={2} />
    </group>
  );
}

/** Plumber's van arriving at the gate — headlights first, body second. */
export function Van() {
  const group = useRef<THREE.Group>(null);
  const beams = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = story.t;
    const arrive = ramp(t, EVENTS.vanArrival[0], EVENTS.vanArrival[1]);
    if (group.current) {
      group.current.visible = t > EVENTS.vanArrival[0] - 0.03 && t < 0.7;
      group.current.position.z = 26 - arrive * 13;
      group.current.position.x = 0.9;
    }
    if (beams.current) {
      beams.current.visible = arrive > 0.05 && t < 0.68;
    }
  });

  return (
    <group ref={group} rotation={[0, Math.PI, 0]} visible={false}>
      {/* facing -z toward the gate */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <boxGeometry args={[1.7, 1.15, 2.9]} />
        <meshStandardMaterial color="#dfe3e6" roughness={0.42} metalness={0.35} />
      </mesh>
      <mesh castShadow position={[0, 0.62, -1.85]}>
        <boxGeometry args={[1.62, 0.62, 0.95]} />
        <meshStandardMaterial color="#c9ced3" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.72, -2.3]}>
        <planeGeometry args={[1.35, 0.34]} />
        <meshStandardMaterial color="#10141a" roughness={0.15} metalness={0.7} />
      </mesh>
      {/* HandyTrust livery stripe */}
      <mesh position={[0.86, 1.02, 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.2, 0.3]} />
        <meshBasicMaterial color="#e9b558" toneMapped={false} />
      </mesh>
      <mesh position={[-0.86, 1.02, 0.2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.2, 0.3]} />
        <meshBasicMaterial color="#e9b558" toneMapped={false} />
      </mesh>
      {[
        [-0.85, -1.7], [0.85, -1.7], [-0.85, 1.1], [0.85, 1.1],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.31, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.18, 16]} />
          <meshStandardMaterial color="#0f1012" roughness={0.85} />
        </mesh>
      ))}
      <group ref={beams}>
        {[-0.6, 0.6].map((x) => (
          <group key={x} position={[x, 0.6, -2.34]}>
            <mesh>
              <sphereGeometry args={[0.07, 10, 8]} />
              <meshBasicMaterial color="#fff6d8" toneMapped={false} />
            </mesh>
            <mesh position={[0, -0.12, -1.6]} rotation={[0.16, 0, 0]}>
              <coneGeometry args={[0.5, 3.4, 14, 1, true]} />
              <meshBasicMaterial color="#ffeec2" transparent opacity={0.14} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
          </group>
        ))}
        <pointLight position={[0, 0.7, -2.8]} color="#ffedc4" intensity={16} distance={12} decay={2} />
      </group>
    </group>
  );
}

/**
 * The plumber himself — boots, trouser hems and toolbox crossing a low
 * camera at the gate. What the lens can prove, not what it cannot render.
 */
export function PlumberBoots() {
  const group = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const caseRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = story.t;
    const walk = ramp(t, EVENTS.bootsWalk[0], EVENTS.bootsWalk[1]);
    const visible = window01(t, EVENTS.bootsWalk[0] - 0.01, EVENTS.bootsWalk[1] + 0.02, 0.015);
    if (group.current) {
      group.current.visible = visible > 0.01;
      group.current.position.z = 11.5 - walk * 9;
      group.current.position.x = -0.4 + walk * 0.5;
      group.current.rotation.y = Math.PI + 0.1;
    }
    const stride = Math.sin(clock.elapsedTime * 7.2);
    if (left.current) {
      left.current.position.z = stride * 0.16;
      left.current.rotation.x = -stride * 0.42;
    }
    if (right.current) {
      right.current.position.z = -stride * 0.16;
      right.current.rotation.x = stride * 0.42;
    }
    if (caseRef.current) {
      caseRef.current.position.y = 0.42 + Math.abs(stride) * 0.045;
      caseRef.current.rotation.z = stride * 0.06;
    }
  });

  const trouser = { color: '#20242c', roughness: 0.94 };
  const boot = { color: '#15100c', roughness: 0.72, metalness: 0.12 };

  const Leg = ({ side }: { side: number }) => (
    <group position={[side * 0.13, 0, 0]}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.085, 0.095, 0.62, 12]} />
        <meshStandardMaterial {...trouser} />
      </mesh>
      <mesh castShadow position={[0, 0.09, 0.05]}>
        <boxGeometry args={[0.15, 0.17, 0.34]} />
        <meshStandardMaterial {...boot} />
      </mesh>
      <mesh castShadow position={[0, 0.16, -0.02]}>
        <cylinderGeometry args={[0.085, 0.1, 0.14, 12]} />
        <meshStandardMaterial {...boot} />
      </mesh>
    </group>
  );

  return (
    <group ref={group} visible={false}>
      <group ref={left}>
        <Leg side={-1} />
      </group>
      <group ref={right}>
        <Leg side={1} />
      </group>
      {/* toolbox swinging in frame at hip height */}
      <group ref={caseRef} position={[0.42, 0.42, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.2, 0.18]} />
          <meshStandardMaterial color="#9e2f24" roughness={0.55} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[0.36, 0.03, 0.14]} />
          <meshStandardMaterial color="#6e211a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.18, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.06, 0.014, 8, 14, Math.PI]} />
          <meshStandardMaterial color="#2b2e33" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* gloved hand gripping the handle, cropped by the frame line */}
        <mesh position={[0, 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.05, 0.1, 5, 10]} />
          <meshStandardMaterial color="#2c3742" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}
