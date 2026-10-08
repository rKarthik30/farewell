'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/*
 * Interactive 3D hero background:
 *  - a fibonacci-sphere shell of glowing particles + a cloud of "dust"
 *  - a slowly breathing wireframe icosahedron in the centre
 *  - the whole scene tilts toward the mouse, and shell particles near the
 *    cursor get pushed outward
 * Tweak PALETTE / counts / sizes below to change the look.
 */
const PALETTE = ['#22d3ee', '#a78bfa', '#f472b6'];

function useMouse() {
  const m = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      m.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      m.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return m;
}

/** soft round sprite so points render as glowing dots instead of squares */
function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.8)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function Scene({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null!);
  const points = useRef<THREE.Points>(null!);
  const wire = useRef<THREE.LineSegments>(null!);
  const mouse = useMouse();
  const shell = Math.floor(count * 0.7);

  const { geometry, base } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number;
      if (i < shell) {
        const k = i + 0.5;
        const phi = Math.acos(1 - (2 * k) / shell);
        const theta = Math.PI * (1 + Math.sqrt(5)) * k;
        const r = 2.4 + (Math.random() - 0.5) * 0.2;
        x = r * Math.cos(theta) * Math.sin(phi);
        y = r * Math.sin(theta) * Math.sin(phi);
        z = r * Math.cos(phi);
      } else {
        const r = 3.6 + Math.random() * 6;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        x = r * Math.cos(t) * Math.sin(p);
        y = r * Math.sin(t) * Math.sin(p);
        z = r * Math.cos(p);
      }
      pos.set([x, y, z], i * 3);
      c.set(PALETTE[i % PALETTE.length]);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return { geometry: g, base: pos.slice() };
  }, [count, shell]);

  const wireGeo = useMemo(() => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.45, 1)), []);
  const dot = useMemo(() => makeDotTexture(), []);
  useEffect(
    () => () => {
      geometry.dispose();
      wireGeo.dispose();
      dot.dispose();
    },
    [geometry, wireGeo, dot]
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const cursor = useMemo(() => new THREE.Vector3(), []);
  const inv = useMemo(() => new THREE.Matrix4(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const m = mouse.current;
    points.current.rotation.y += delta * 0.04;
    wire.current.rotation.x += delta * 0.08;
    wire.current.rotation.y -= delta * 0.12;
    wire.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04);

    // tilt + camera parallax toward the mouse
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, m.y * 0.3, 2.5, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, m.x * 0.45, 2.5, delta);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, m.x * 0.4, 2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, m.y * 0.3, 2, delta);
    state.camera.lookAt(0, 0, 0);

    // repel shell particles near the cursor (cursor mapped into the points' local space)
    cursor.set(m.x * state.viewport.width * 0.35, m.y * state.viewport.height * 0.35, 2.2);
    points.current.updateMatrixWorld();
    inv.copy(points.current.matrixWorld).invert();
    cursor.applyMatrix4(inv);

    const arr = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < shell * 3; i += 3) {
      tmp.set(base[i], base[i + 1], base[i + 2]);
      const d = tmp.distanceTo(cursor);
      const k = 1 + (d < 1.4 ? (1.4 - d) * 0.14 : 0);
      arr[i] += (base[i] * k - arr[i]) * 0.08;
      arr[i + 1] += (base[i + 1] * k - arr[i + 1]) * 0.08;
      arr[i + 2] += (base[i + 2] * k - arr[i + 2]) * 0.08;
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry}>
        <pointsMaterial
          size={0.07}
          map={dot}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={wire} geometry={wireGeo}>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

export default function ParticleField() {
  const wrap = useRef<HTMLDivElement>(null);
  // fewer particles on small screens
  const [count] = useState(() => (window.innerWidth < 768 ? 1400 : 3000));
  const [visible, setVisible] = useState(true);

  // stop rendering when the hero is scrolled out of view (saves battery/GPU)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene count={count} />
      </Canvas>
    </div>
  );
}
