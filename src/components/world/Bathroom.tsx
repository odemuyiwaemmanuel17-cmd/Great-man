import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { story } from '../../story/store';
import { EVENTS, ramp, fall, window01 } from '../../story/script';
import { tileTexture, plasterTexture, concreteTexture } from '../../utils/filmTextures';

const JOINT: [number, number, number] = [-2, 0.95, -5.78];

const DRIP_COUNT = 16;
const SPRAY_COUNT = 70;

function Water() {
  const drips = useRef<THREE.InstancedMesh>(null);
  const puddle = useRef<THREE.Mesh>(null);
  const jet = useRef<THREE.Group>(null);
  const spray = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: SPRAY_COUNT }, () => ({
        a: Math.random() * Math.PI * 2,
        v: 0.55 + Math.random() * 1.15,
        p: Math.random(),
        up: 0.35 + Math.random() * 0.75,
      })),
    [],
  );
  const dripSeeds = useMemo(
    () => Array.from({ length: DRIP_COUNT }, (_, i) => i / DRIP_COUNT),
    [],
  );

  useFrame(({ clock }) => {
    const t = story.t;
    const time = clock.elapsedTime;
    const active = t > EVENTS.dripStart && t < EVENTS.waterStops;
    const leak = ramp(t, EVENTS.dripStart, EVENTS.burst[0]);
    const bursting = ramp(t, EVENTS.burst[0], EVENTS.burst[1]) * fall(t, EVENTS.wrenchWork[0] + 0.04, EVENTS.waterStops);

    if (drips.current) {
      drips.current.visible = active && bursting < 0.2;
      const speed = 0.35 + leak * 0.9;
      dripSeeds.forEach((offset, i) => {
        const fall01 = (time * speed + offset) % 1;
        dummy.position.set(JOINT[0] + (i % 3 - 1) * 0.015, JOINT[1] - fall01 * 0.93, JOINT[2] + 0.06 + fall01 * 0.05);
        dummy.scale.setScalar(0.022 + burst0size(fall01));
        dummy.updateMatrix();
        drips.current!.setMatrixAt(i, dummy.matrix);
      });
      drips.current.instanceMatrix.needsUpdate = true;
    }

    if (puddle.current) {
      const spread = ramp(t, EVENTS.puddle[0], EVENTS.puddle[1]);
      const size = 0.04 + spread * 1.62 + Math.sin(time * 2.1) * 0.015 * spread;
      puddle.current.scale.setScalar(size);
      (puddle.current.material as THREE.MeshStandardMaterial).opacity = 0.35 + spread * 0.55;
    }

    if (jet.current) {
      jet.current.visible = bursting > 0.02;
      jet.current.scale.set(0.4 + bursting, bursting, 0.4 + bursting);
    }

    if (spray.current) {
      spray.current.visible = bursting > 0.05;
      seeds.forEach((s, i) => {
        const p = (time * (0.9 + bursting) + s.p * 3) % 1.1;
        const dist = s.v * p;
        dummy.position.set(
          JOINT[0] + Math.cos(s.a) * dist * 0.6,
          JOINT[1] - 4.4 * p * p + s.up * p,
          JOINT[2] + 0.1 + Math.sin(s.a) * dist * 0.45,
        );
        dummy.scale.setScalar(0.028 * bursting + 0.006);
        dummy.updateMatrix();
        spray.current!.setMatrixAt(i, dummy.matrix);
      });
      spray.current.instanceMatrix.needsUpdate = true;
    }
  });

  const waterMaterial = (
    <meshStandardMaterial color="#1d4a63" roughness={0.08} metalness={0.55} transparent opacity={0.9} />
  );

  return (
    <group>
      <instancedMesh ref={drips} args={[undefined, undefined, DRIP_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshPhysicalMaterial color="#bcdff0" roughness={0.05} metalness={0.2} transparent opacity={0.85} />
      </instancedMesh>

      <mesh ref={puddle} rotation={[-Math.PI / 2, 0, 0]} position={[-1.95, 0.014, -5.05]}>
        <circleGeometry args={[1, 40]} />
        {waterMaterial}
      </mesh>

      <group ref={jet} position={JOINT} visible={false}>
        <mesh position={[0.02, -0.28, 0.12]} rotation={[0.5, 0, -0.12]}>
          <coneGeometry args={[0.075, 0.85, 12, 1, true]} />
          <meshPhysicalMaterial color="#cfeaff" roughness={0.05} transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <instancedMesh ref={spray} args={[undefined, undefined, SPRAY_COUNT]} visible={false}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshPhysicalMaterial color="#d8f0ff" roughness={0.05} transparent opacity={0.7} />
      </instancedMesh>
    </group>
  );
}

const burst0size = (fall01: number) => fall01 * 0.008;

function PipeAssembly() {
  const oldFitting = useRef<THREE.Mesh>(null);
  const newFitting = useRef<THREE.Mesh>(null);
  const wrench = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = story.t;
    const work = ramp(t, EVENTS.wrenchWork[0], EVENTS.wrenchWork[1]);
    const done = ramp(t, 0.715, 0.74);
    if (wrench.current) {
      wrench.current.visible = window01(t, 0.64, 0.765, 0.02) > 0.01;
      wrench.current.position.set(JOINT[0] + 0.16, JOINT[1] - 0.55 * (1 - work), JOINT[2] + 0.34);
      wrench.current.rotation.z = Math.sin(work * Math.PI * 7) * 0.55 - 0.35;
    }
    if (oldFitting.current) {
      oldFitting.current.scale.setScalar(Math.max(0.001, 1 - done));
    }
    if (newFitting.current) {
      newFitting.current.scale.setScalar(Math.max(0.001, done));
    }
  });

  return (
    <group>
      {/* main run along the back wall */}
      <mesh position={[-2.9, 1.05, -5.82]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 1.9, 14]} />
        <meshStandardMaterial color="#d8d3c8" roughness={0.55} metalness={0.1} />
      </mesh>
      {/* vertical drop to the joint */}
      <mesh position={[-2, 1.05, -5.82]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.5, 14]} />
        <meshStandardMaterial color="#d8d3c8" roughness={0.55} metalness={0.1} />
      </mesh>
      {/* elbow + joint collar */}
      <mesh position={JOINT} castShadow>
        <sphereGeometry args={[0.105, 16, 14]} />
        <meshStandardMaterial color="#a9a294" roughness={0.42} metalness={0.3} />
      </mesh>
      <mesh ref={oldFitting} position={[JOINT[0], JOINT[1] - 0.16, JOINT[2] + 0.02]} castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.24, 14]} />
        <meshStandardMaterial color="#5c4a35" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh ref={newFitting} position={[JOINT[0], JOINT[1] - 0.16, JOINT[2] + 0.02]} castShadow>
        <cylinderGeometry args={[0.088, 0.088, 0.24, 14]} />
        <meshStandardMaterial color="#c9a24a" roughness={0.22} metalness={0.85} />
      </mesh>
      {/* stain down the wall from years of weeping */}
      <mesh position={[JOINT[0], 0.55, -5.89]}>
        <planeGeometry args={[0.34, 0.85]} />
        <meshStandardMaterial color="#4d4235" roughness={0.98} transparent opacity={0.55} />
      </mesh>

      {/* wrench + gloved hand entering frame */}
      <group ref={wrench} visible={false} rotation={[0.35, -0.3, 0]}>
        <mesh castShadow position={[0, 0.16, 0]}>
          <boxGeometry args={[0.05, 0.5, 0.03]} />
          <meshStandardMaterial color="#8f979d" roughness={0.24} metalness={0.85} />
        </mesh>
        <mesh castShadow position={[0, 0.52, 0]}>
          <torusGeometry args={[0.075, 0.028, 10, 18, Math.PI * 1.5]} />
          <meshStandardMaterial color="#8f979d" roughness={0.24} metalness={0.85} />
        </mesh>
        <mesh castShadow position={[0.02, 0.42, 0.02]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.085, 0.2, 6, 12]} />
          <meshStandardMaterial color="#2c3742" roughness={0.95} />
        </mesh>
        <mesh position={[0.03, 0.66, 0.05]} rotation={[0.3, 0, -0.2]}>
          <capsuleGeometry args={[0.1, 0.34, 6, 12]} />
          <meshStandardMaterial color="#232d38" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

export default function Bathroom() {
  const textures = useMemo(
    () => ({ tile: tileTexture(), plaster: plasterTexture('#b9ac95'), concrete: concreteTexture() }),
    [],
  );
  const bulb = useRef<THREE.PointLight>(null);
  const bulbMesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = story.t;
    const time = clock.elapsedTime;
    const bursting = window01(t, EVENTS.burst[0] - 0.005, EVENTS.burstHold[1]);
    const darkPhase = ramp(t, 0.42, 0.47) * fall(t, 0.58, 0.66);
    const warmBack = ramp(t, EVENTS.result[0], EVENTS.result[1]);
    let intensity = 5.2;
    if (bursting > 0) intensity = 5.2 * (0.45 + 0.55 * Math.abs(Math.sin(time * 26))) * bursting + 2.4 * (1 - bursting);
    if (darkPhase > 0) intensity = THREE.MathUtils.lerp(intensity, 1.6, darkPhase);
    if (warmBack > 0) intensity = THREE.MathUtils.lerp(intensity, 7.4, warmBack);
    if (bulb.current) bulb.current.intensity = intensity;
    if (bulbMesh.current) {
      (bulbMesh.current.material as THREE.MeshBasicMaterial).color.setScalar(
        THREE.MathUtils.lerp(0.25, 1, Math.min(1, intensity / 6)),
      );
    }
  });

  const leak = ramp(story.t, EVENTS.dripStart, EVENTS.burst[0]);

  return (
    <group>
      {/* interior shell — walls you can walk the camera through */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]}>
        <planeGeometry args={[7.8, 7.8]} />
        <meshStandardMaterial map={textures.tile} roughness={0.32} metalness={0.12} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.98, -2]}>
        <planeGeometry args={[7.8, 7.8]} />
        <meshStandardMaterial color="#8f877a" roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[0, 1.5, -5.9]}>
        <planeGeometry args={[7.8, 3]} />
        <meshStandardMaterial map={textures.tile} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-3.9, 1.5, -2]}>
        <planeGeometry args={[7.8, 3]} />
        <meshStandardMaterial map={textures.plaster} roughness={0.92} />
      </mesh>
      <mesh receiveShadow rotation={[0, -Math.PI / 2, 0]} position={[3.9, 1.5, -2]}>
        <planeGeometry args={[7.8, 3]} />
        <meshStandardMaterial map={textures.plaster} roughness={0.92} />
      </mesh>

      {/* skirting + utility corner props to sell a lived-in service room */}
      <mesh position={[-3.2, 0.35, -5.4]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial map={textures.concrete} roughness={0.9} />
      </mesh>
      <mesh position={[-3.2, 0.9, -5.4]} rotation={[0, 0, 0.16]}>
        <cylinderGeometry args={[0.015, 0.02, 1.1, 8]} />
        <meshStandardMaterial color="#6d6a63" roughness={0.6} />
      </mesh>
      <mesh position={[-3.35, 0.16, -4.3]}>
        <cylinderGeometry args={[0.2, 0.16, 0.34, 18]} />
        <meshStandardMaterial color="#3d4a55" roughness={0.7} />
      </mesh>
      <mesh position={[-3.32, 0.62, -4.24]} rotation={[0, 0, 0.28]}>
        <cylinderGeometry args={[0.018, 0.018, 1.05, 8]} />
        <meshStandardMaterial color="#7c6a4a" roughness={0.9} />
      </mesh>

      {/* the bulb */}
      <mesh position={[0, 2.72, -1.6]}>
        <cylinderGeometry args={[0.008, 0.008, 0.3, 6]} />
        <meshBasicMaterial color="#20242a" />
      </mesh>
      <mesh ref={bulbMesh} position={[0, 2.52, -1.6]}>
        <sphereGeometry args={[0.06, 14, 12]} />
        <meshBasicMaterial color="#ffd9a0" />
      </mesh>
      <pointLight ref={bulb} position={[0, 2.45, -1.6]} color="#ffd2a0" intensity={5.2} distance={11} decay={2} castShadow />

      <PipeAssembly />
      <Water />
    </group>
  );
}
