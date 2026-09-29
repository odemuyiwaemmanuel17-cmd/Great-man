import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { story } from '../../story/store';
import { window01 } from '../../story/script';
import { textPlaneTexture } from '../../utils/filmTextures';

export interface CaptionProps {
  text: string;
  position: [number, number, number];
  rotationY?: number;
  width?: number;
  show: readonly [number, number];
  weight?: string;
  color?: string;
}

/**
 * Spatial typography: a line that exists in the world, fading in only after
 * its event has already begun. Text clarifies; the film carries the story.
 */
export default function Caption({
  text,
  position,
  rotationY = 0,
  width = 2.6,
  show,
  weight = '300 italic',
  color,
}: CaptionProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => textPlaneTexture(text, { weight, color }), [text, weight, color]);

  useFrame(() => {
    if (!mesh.current) return;
    const opacity = window01(story.t, show[0], show[1], 0.015);
    mesh.current.visible = opacity > 0.01;
    (mesh.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    mesh.current.position.y = position[1] + (1 - opacity) * 0.06;
  });

  return (
    <mesh ref={mesh} position={position} rotation={[0, rotationY, 0]} visible={false}>
      <planeGeometry args={[width, width / 4]} />
      <meshBasicMaterial map={texture} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
