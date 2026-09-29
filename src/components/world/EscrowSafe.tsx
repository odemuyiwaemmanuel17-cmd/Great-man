import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { story } from '../../story/store';
import { EVENTS, ramp, window01 } from '../../story/script';

/**
 * Escrow as an event, not a label: payment flies into the wall vault,
 * bolts fire, evidence is photographed, the customer approves,
 * the vault opens and the money slides out to the artisan's tray.
 */
export default function EscrowSafe() {
  const door = useRef<THREE.Group>(null);
  const coin = useRef<THREE.Mesh>(null);
  const boltL = useRef<THREE.Mesh>(null);
  const boltR = useRef<THREE.Mesh>(null);
  const led = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.PointLight>(null);
  const tray = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = story.t;
    const pay = ramp(t, EVENTS.escrowPay[0], EVENTS.escrowPay[1]);
    const locked = ramp(t, EVENTS.escrowLock[0], EVENTS.escrowLock[1]);
    const evidence = window01(t, EVENTS.escrowEvidence[0], EVENTS.escrowEvidence[1], 0.004);
    const approved = ramp(t, EVENTS.escrowApprove[0], EVENTS.escrowApprove[1]);
    const release = ramp(t, EVENTS.escrowRelease[0], EVENTS.escrowRelease[1]);

    if (coin.current) {
      const flyingIn = pay < 1 && t < EVENTS.escrowRelease[0];
      coin.current.visible = t > EVENTS.escrowPay[0] - 0.005 && (pay < 1 || release < 0.15);
      if (flyingIn) {
        coin.current.position.set(
          THREE.MathUtils.lerp(2.35, 3.42, pay),
          THREE.MathUtils.lerp(1.15, 1.42, pay) - Math.sin(pay * Math.PI) * 0.18,
          THREE.MathUtils.lerp(-0.9, -2.0, pay),
        );
        coin.current.rotation.y += 0.28;
      } else if (release > 0) {
        coin.current.visible = true;
        coin.current.position.set(
          THREE.MathUtils.lerp(3.4, 2.95, release),
          THREE.MathUtils.lerp(1.3, 1.02, release),
          THREE.MathUtils.lerp(-2.0, -1.35, release),
        );
        coin.current.rotation.y += 0.2;
      }
      const scale = 1 - Math.sin(pay * Math.PI * 2) * 0.001;
      coin.current.scale.setScalar(Math.max(0.001, scale * (1 - approved * 0.0) * (release > 0.98 ? 0.98 : 1)));
    }

    if (boltL.current && boltR.current) {
      boltL.current.position.z = -1.62 + locked * 0.11;
      boltR.current.position.z = -2.38 - locked * 0.11;
    }

    if (led.current) {
      const mat = led.current.material as THREE.MeshStandardMaterial;
      const green = approved > 0.5 || release > 0;
      mat.color.set(green ? '#00ff88' : locked > 0.5 ? '#ff4438' : '#ffb04d');
      mat.emissive.copy(mat.color);
      mat.emissiveIntensity = 1.2 + Math.sin(clock.elapsedTime * 6) * 0.4;
    }

    if (door.current) {
      door.current.rotation.y = -release * 1.5;
    }
    if (flash.current) {
      flash.current.intensity = evidence * (Math.sin(clock.elapsedTime * 60) > 0 ? 26 : 4);
    }
    if (tray.current) {
      tray.current.visible = t > EVENTS.escrowRelease[0] - 0.05;
    }
  });

  return (
    <group>
      {/* vault body recessed into the utility wall */}
      <mesh castShadow position={[3.66, 1.42, -2]}>
        <boxGeometry args={[0.5, 1.15, 0.95]} />
        <meshStandardMaterial color="#14161d" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[3.4, 1.42, -2]}>
        <boxGeometry args={[0.04, 0.98, 0.8]} />
        <meshStandardMaterial color="#0a0c10" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* hinged door */}
      <group ref={door} position={[3.38, 1.42, -1.6]}>
        <mesh castShadow position={[0, 0, -0.38]}>
          <boxGeometry args={[0.07, 0.94, 0.78]} />
          <meshStandardMaterial color="#232733" roughness={0.24} metalness={0.9} />
        </mesh>
        <mesh position={[-0.055, 0, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.14, 14]} />
          <meshStandardMaterial color="#c9a24a" roughness={0.18} metalness={0.95} />
        </mesh>
        <mesh position={[-0.05, -0.3, -0.62]}>
          <sphereGeometry args={[0.028, 10, 8]} />
          <meshStandardMaterial color="#8f979d" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* bolts that fire on lock */}
      <mesh ref={boltL} position={[3.44, 1.42, -1.62]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.2, 10]} />
        <meshStandardMaterial color="#8f979d" roughness={0.22} metalness={0.9} />
      </mesh>
      <mesh ref={boltR} position={[3.44, 1.42, -2.38]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.2, 10]} />
        <meshStandardMaterial color="#8f979d" roughness={0.22} metalness={0.9} />
      </mesh>

      <mesh ref={led} position={[3.4, 1.86, -1.72]}>
        <sphereGeometry args={[0.028, 10, 8]} />
        <meshStandardMaterial color="#ffb04d" emissive="#ffb04d" emissiveIntensity={1.2} />
      </mesh>

      {/* the escrow token */}
      <mesh ref={coin} position={[2.35, 1.15, -0.9]} rotation={[Math.PI / 2, 0, 0]} visible={false} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.028, 24]} />
        <meshStandardMaterial color="#f2c14d" emissive="#c98a1d" emissiveIntensity={0.5} roughness={0.16} metalness={0.95} />
      </mesh>

      {/* artisan tray the money lands on */}
      <group ref={tray} position={[2.9, 0.98, -1.35]} visible={false}>
        <mesh>
          <boxGeometry args={[0.34, 0.03, 0.26]} />
          <meshStandardMaterial color="#5a4630" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.035, 0]}>
          <boxGeometry args={[0.3, 0.04, 0.22]} />
          <meshStandardMaterial color="#6e573c" roughness={0.9} />
        </mesh>
      </group>

      <pointLight ref={flash} position={[3.1, 1.5, -1.4]} color="#ffffff" intensity={0} distance={4} decay={2} />
    </group>
  );
}
