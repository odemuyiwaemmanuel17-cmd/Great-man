import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAM_KEYS, EVENTS, window01, ramp, smooth } from '../story/script';
import { story, setStoryTime, onStoryPhase } from '../story/store';
import { FilmAudio } from '../story/audio';
import Bathroom from './world/Bathroom';
import Compound from './world/Compound';
import { Homeowner, Van, PlumberBoots } from './world/People';
import EscrowSafe from './world/EscrowSafe';
import Neighborhood from './world/Neighborhood';
import Caption from './fx/Caption';

function sampleCamera(t: number, pos: THREE.Vector3, look: THREE.Vector3) {
  let i = 0;
  while (i < CAM_KEYS.length - 2 && t > CAM_KEYS[i + 1].t) i++;
  const a = CAM_KEYS[i];
  const b = CAM_KEYS[Math.min(i + 1, CAM_KEYS.length - 1)];
  const span = b.t - a.t || 1;
  const e = smooth(THREE.MathUtils.clamp((t - a.t) / span, 0, 1));
  pos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], e),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], e),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], e),
  );
  look.set(
    THREE.MathUtils.lerp(a.look[0], b.look[0], e),
    THREE.MathUtils.lerp(a.look[1], b.look[1], e),
    THREE.MathUtils.lerp(a.look[2], b.look[2], e),
  );
  return THREE.MathUtils.lerp(a.fov, b.fov, e);
}

function CameraDirector() {
  const { camera } = useThree();
  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useRef(new THREE.Vector3(0, 2, 0));

  useFrame(({ clock }, delta) => {
    const t = story.t;
    const time = clock.elapsedTime;
    const fov = sampleCamera(t, desiredPos, desiredLook);

    // handheld breathing — the camera is operated by a person, not a rail
    desiredPos.x += Math.sin(time * 0.6) * 0.03 + story.pointerX * 0.35;
    desiredPos.y += Math.sin(time * 0.83 + 1.4) * 0.022 + story.pointerY * 0.22;

    // the burst shakes the operator
    const shake = window01(t, EVENTS.shake[0], EVENTS.shake[1] + 0.03) * (1 - ramp(t, EVENTS.shake[1], EVENTS.shake[1] + 0.05));
    if (shake > 0.01) {
      desiredPos.x += (Math.random() - 0.5) * 0.09 * shake;
      desiredPos.y += (Math.random() - 0.5) * 0.09 * shake;
      desiredLook.x += (Math.random() - 0.5) * 0.06 * shake;
    }

    const k = 1 - Math.exp(-delta * 3.6);
    camera.position.lerp(desiredPos, k);
    lookAt.current.lerp(desiredLook, k);
    camera.lookAt(lookAt.current);
    const cam = camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, fov, k);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

// bridge for the director (kept outside React to avoid re-renders)

function Lights() {
  const roomBounce = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (roomBounce.current) {
      roomBounce.current.intensity = 1.2 + window01(story.t, EVENTS.burst[0], 0.5) * 1.6;
    }
  });
  return (
    <>
      <hemisphereLight args={['#1c2438', '#0a0c10', 0.42]} />
      <directionalLight
        position={[-24, 26, -30]}
        intensity={0.55}
        color="#8fa3cf"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0004}
      />
      <pointLight ref={roomBounce} position={[-2, 1.2, -4.6]} color="#3d6a8a" intensity={1.2} distance={6} decay={2} />
    </>
  );
}

export default function ThreeScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState({ hint: true, cta: false });
  const [soundOn, setSoundOn] = useState(false);
  const audio = useMemo(() => new FilmAudio(), []);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const scrollable = Math.max(1, rect.height - window.innerHeight);
        const t = THREE.MathUtils.clamp(-rect.top / scrollable, 0, 1);
        setStoryTime(t);
      });
    };
    const pointer = (e: PointerEvent) => {
      story.pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      story.pointerY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    read();
    const unsub = onStoryPhase((t) =>
      setPhase({ hint: t < 0.035, cta: t > 0.955 }),
    );
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    window.addEventListener('pointermove', pointer, { passive: true });
    // browsers restore scroll on reload without firing a scroll event
    const onLoad = () => {
      window.scrollTo(0, 0);
      read();
    };
    window.addEventListener('load', onLoad, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      unsub();
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('load', onLoad);
      audio.stop();
    };
  }, [audio]);

  return (
    <section ref={sectionRef} className="film" aria-label="The HandyTrust story">
      <div className="film__frame">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ fov: 40, near: 0.1, far: 300, position: [3.2, 3.4, 30] }}
          onCreated={() => document.getElementById('boot-veil')?.remove()}
        >
          <fog attach="fog" args={['#0a0d14', 34, 150]} />
          <CameraDirector />
          <Lights />
          <Compound />
          <Bathroom />
          <Homeowner />
          <Van />
          <PlumberBoots />
          <EscrowSafe />
          <Neighborhood />
          <Caption text="A pipe just burst." position={[-0.7, 2.15, -5.85]} show={EVENTS.captionBurst} width={2.5} />
          <Caption text="9:47 PM" position={[1.6, 2.3, -5.85]} show={EVENTS.captionClock} width={1.7} weight="400" />
          <Caption text="Tunde is 12 minutes away." position={[0, 3.5, 12.4]} rotationY={Math.PI} show={EVENTS.captionMatch} width={3.1} />
          <Caption text="Held. Verified. Released." position={[3.05, 2.35, -2]} rotationY={-Math.PI / 2} show={[0.845, 0.915]} width={2.3} />
          <Caption text="This was never one pipe." position={[0, 15, 24]} show={[0.965, 1]} width={4.2} />
        </Canvas>

        <div className="film__ui">
          <a className="film__brand" href="#top" aria-label="HandyTrust">
            <span className="film__brand-mark">H</span>
            HANDYTRUST
          </a>
          <button
            type="button"
            className={`film__sound${soundOn ? ' is-on' : ''}`}
            aria-label={soundOn ? 'Mute the film' : 'Play the film'}
            onClick={() => {
              if (soundOn) audio.stop();
              else audio.start();
              setSoundOn(!soundOn);
            }}
          >
            <i />
            <i />
            <i />
          </button>

          <div className={`film__hint${phase.hint ? '' : ' is-gone'}`}>
            <span>Scroll</span>
            <i />
          </div>

          <div className={`film__cta${phase.cta ? ' is-on' : ''}`}>
            <p>Plumbing. Electrical. Solar. Welding. Painting. Any problem in any room.</p>
            <div>
              <a className="film__cta-main" href="#book">Book a verified professional</a>
              <a className="film__cta-ghost" href="#artisan">Join as an artisan</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
