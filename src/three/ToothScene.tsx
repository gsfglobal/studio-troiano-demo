import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import ringsData from '../data/tooth-rings.json'

export type ProgressRef = { current: number }

type Key = { p: number; cam: [number, number, number]; tgt: [number, number, number]; rot: number; x: number; y: number; s: number }

/** Percorso della camera lungo lo scroll: entrata, rotazione, superficie, radici, uscita. */
const KEYS: Key[] = [
  { p: 0.0, cam: [0, 0.3, 7.6], tgt: [0, 0, 0], rot: -0.5, x: 0, y: -0.35, s: 0.8 },
  { p: 0.14, cam: [0, 0.25, 6.1], tgt: [0, 0, 0], rot: 0.35, x: 0, y: 0, s: 1 },
  { p: 0.34, cam: [0.2, 0.45, 5.5], tgt: [0, 0.05, 0], rot: 2.5, x: 0, y: 0, s: 1 },
  { p: 0.52, cam: [0.75, 2.75, 2.25], tgt: [0, 0.7, 0], rot: 3.35, x: 0, y: 0, s: 1 },
  { p: 0.7, cam: [-2.3, -0.25, 4.6], tgt: [0, -0.08, 0], rot: 5.73, x: 0, y: 0, s: 1 },
  { p: 0.86, cam: [0, 0.25, 6.4], tgt: [0, 0, 0], rot: 6.75, x: 0.35, y: 0.05, s: 0.92 },
  { p: 1.0, cam: [0, 0.3, 7.2], tgt: [0, 0, 0], rot: 7.3, x: 0.5, y: 0.15, s: 0.88 },
]

const smooth = (t: number) => t * t * (3 - 2 * t)
function sample(p: number) {
  let i = 0
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const t = smooth(Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p))))
  const l = (u: number, v: number) => u + (v - u) * t
  return {
    cam: [l(a.cam[0], b.cam[0]), l(a.cam[1], b.cam[1]), l(a.cam[2], b.cam[2])] as const,
    tgt: [l(a.tgt[0], b.tgt[0]), l(a.tgt[1], b.tgt[1]), l(a.tgt[2], b.tgt[2])] as const,
    rot: l(a.rot, b.rot),
    x: l(a.x, b.x),
    y: l(a.y, b.y),
    s: l(a.s, b.s),
  }
}

/** Mappa normale procedurale e ripetibile: micro-superficie dello smalto e sottili striature. */
function makeNormalMap(size = 512) {
  const h = new Float32Array(size * size)
  const waves: [number, number, number, number][] = []
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 26; i++) waves.push([Math.round(4 + rnd() * 40), Math.round(4 + rnd() * 40), rnd() * Math.PI * 2, 0.4 + rnd()])
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const u = x / size
      const v = y / size
      let s = 0
      for (const [fx, fy, ph, a] of waves) s += a * Math.sin(2 * Math.PI * (fx * u + fy * v) + ph)
      s = s / 14 + 0.08 * Math.sin(2 * Math.PI * 48 * v + 0.6 * Math.sin(2 * Math.PI * 5 * u))
      h[y * size + x] = s
    }
  const data = new Uint8Array(size * size * 4)
  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)]
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      let nx = (at(x - 1, y) - at(x + 1, y)) * 1.2
      let ny = (at(x, y - 1) - at(x, y + 1)) * 1.2
      let nz = 1
      const l = Math.hypot(nx, ny, nz)
      nx /= l
      ny /= l
      nz /= l
      const o = (y * size + x) * 4
      data[o] = (nx * 0.5 + 0.5) * 255
      data[o + 1] = (ny * 0.5 + 0.5) * 255
      data[o + 2] = (nz * 0.5 + 0.5) * 255
      data[o + 3] = 255
    }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 3)
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.needsUpdate = true
  return tex
}

/** Rosso = clearcoat (smalto lucido), verde = rugosità (radice più opaca), lungo l'altezza del dente. */
function makeSurfaceMap(cejV: number) {
  const H = 256
  const data = new Uint8Array(4 * H * 4)
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1)
    const t = Math.min(1, Math.max(0, (v - (cejV - 0.04)) / 0.08))
    const clear = 0.08 + 0.92 * t
    const rough = 0.66 - 0.4 * t
    for (let x = 0; x < 4; x++) {
      const o = (y * 4 + x) * 4
      data[o] = clear * 255
      data[o + 1] = rough * 255
      data[o + 2] = 0
      data[o + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, 4, H, THREE.RGBAFormat)
  tex.magFilter = THREE.LinearFilter
  tex.needsUpdate = true
  return tex
}

function shadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(24,36,42,0.55)')
  grad.addColorStop(0.45, 'rgba(24,36,42,0.18)')
  grad.addColorStop(1, 'rgba(24,36,42,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Environment() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl)
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.58
    return () => {
      scene.environment = null
      env.dispose()
      pm.dispose()
    }
  }, [gl, scene])
  return null
}

type Ring = { y: number; p: number[] }

/** Modello del molare in JSON compatto (posizioni, normali, UV, colori, indici in base64). */
type ToothJson = { count: number; position: string; normal: string; uv: string; color: string; index: string }
const b64 = (s: string) => {
  const bin = atob(s)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out.buffer
}
class ToothLoader extends THREE.Loader<THREE.BufferGeometry> {
  load(url: string, onLoad: (g: THREE.BufferGeometry) => void, _onProgress?: (e: ProgressEvent) => void, onError?: (e: unknown) => void) {
    fetch(this.manager.resolveURL(url))
      .then((r) => {
        if (!r.ok) throw new Error(`Modello 3D non disponibile (${r.status})`)
        return r.json() as Promise<ToothJson>
      })
      .then((d) => {
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(b64(d.position)), 3))
        g.setAttribute('normal', new THREE.BufferAttribute(new Int8Array(b64(d.normal)), 3, true))
        g.setAttribute('uv', new THREE.BufferAttribute(new Uint16Array(b64(d.uv)), 2, true))
        g.setAttribute('color', new THREE.BufferAttribute(new Uint8Array(b64(d.color)), 3, true))
        g.setIndex(new THREE.BufferAttribute(new Uint16Array(b64(d.index)), 1))
        g.computeBoundingSphere()
        onLoad(g)
      })
      .catch((e) => (onError ? onError(e) : console.error(e)))
  }
}

function Tooth({ progress, lite, wide }: { progress: ProgressRef; lite: boolean; wide: boolean }) {
  const geometry = useLoader(ToothLoader, 'models/molare.json')
  const group = useRef<THREE.Group>(null)
  const shadow = useRef<THREE.Mesh>(null)
  const { camera, size } = useThree()
  const state = useRef({ p: 0, rot: -0.5, x: 0, y: -0.35, s: 0.8, cam: new THREE.Vector3(0, 0.3, 7.6), tgt: new THREE.Vector3() })

  const cejV = (ringsData.cej - ringsData.ymin) / (ringsData.ymax - ringsData.ymin)

  const mesh = useMemo(() => {
    const m = new THREE.Mesh(geometry)
    const normalMap = makeNormalMap(lite ? 256 : 512)
    const surface = makeSurfaceMap(cejV)
    m.material = lite
      ? new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, roughnessMap: surface, normalMap, normalScale: new THREE.Vector2(0.1, 0.1) })
      : new THREE.MeshPhysicalMaterial({
          vertexColors: true,
          roughness: 1,
          roughnessMap: surface,
          clearcoat: 1,
          clearcoatMap: surface,
          clearcoatRoughness: 0.22,
          normalMap,
          normalScale: new THREE.Vector2(0.11, 0.11),
          sheen: 0.35,
          sheenColor: new THREE.Color('#fff2dc'),
          sheenRoughness: 0.55,
          ior: 1.62,
          specularIntensity: 0.55,
        })
    return m
  }, [geometry, lite, cejV])

  // Anelli di scansione (sezioni del modello) e anello del colletto
  const rings = useMemo(() => {
    const g = new THREE.Group()
    const list: { line: THREE.LineLoop; y: number; mat: THREE.LineBasicMaterial }[] = []
    for (const r of ringsData.rings as Ring[]) {
      const pts: THREE.Vector3[] = []
      for (let i = 0; i < r.p.length; i += 2) pts.push(new THREE.Vector3(r.p[i] * 1.012, r.y, r.p[i + 1] * 1.012))
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const mat = new THREE.LineBasicMaterial({ color: '#4fc3e8', transparent: true, opacity: 0, depthWrite: false })
      const line = new THREE.LineLoop(geo, mat)
      g.add(line)
      list.push({ line, y: r.y, mat })
    }
    // Colletto: anello più spesso, evidenziato nel passo 3
    let best = (ringsData.rings as Ring[])[0]
    for (const r of ringsData.rings as Ring[]) if (Math.abs(r.y - ringsData.cej) < Math.abs(best.y - ringsData.cej) && r.p.length > 40) best = r
    const cpts: THREE.Vector3[] = []
    for (let i = 0; i < best.p.length; i += 2) cpts.push(new THREE.Vector3(best.p[i] * 1.03, best.y, best.p[i + 1] * 1.03))
    const curve = new THREE.CatmullRomCurve3(cpts, true)
    const tubeMat = new THREE.MeshBasicMaterial({ color: '#8cc24b', transparent: true, opacity: 0, depthWrite: false })
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.009, 6, true), tubeMat)
    g.add(tube)
    return { group: g, list, tube, tubeMat }
  }, [])

  const shadowTex = useMemo(() => shadowTexture(), [])

  // Su schermi larghi il dente sta a destra, lasciando spazio alle didascalie
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (wide) cam.setViewOffset(size.width, size.height, -size.width * 0.17, 0, size.width, size.height)
    else cam.clearViewOffset()
    cam.updateProjectionMatrix()
  }, [camera, size.width, size.height, wide])

  useEffect(
    () => () => {
      ;(mesh.material as THREE.Material).dispose()
      rings.list.forEach((r) => {
        r.line.geometry.dispose()
        r.mat.dispose()
      })
      rings.tube.geometry.dispose()
      rings.tubeMat.dispose()
      shadowTex.dispose()
    },
    [mesh, rings, shadowTex],
  )

  useFrame((three, dt) => {
    const st = state.current
    const k = 1 - Math.exp(-dt * 5)
    st.p += (progress.current - st.p) * Math.min(1, k * 1.6)
    const target = sample(st.p)
    const aspect = size.width / size.height
    const dist = aspect < 0.8 ? 1.32 : aspect < 1.2 ? 1.12 : 1
    st.cam.lerp(new THREE.Vector3(target.cam[0] * dist, target.cam[1] * (aspect < 0.8 ? 1.05 : 1), target.cam[2] * dist), k)
    st.tgt.lerp(new THREE.Vector3(...target.tgt), k)
    st.rot += (target.rot - st.rot) * k
    st.x += ((wide ? target.x : 0) - st.x) * k
    st.y += (target.y + (wide ? 0 : 0.34) - st.y) * k
    st.s += (target.s - st.s) * k
    camera.position.copy(st.cam)
    camera.lookAt(st.tgt)

    const t = three.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = st.rot + Math.sin(t * 0.35) * 0.04
      group.current.rotation.z = Math.sin(t * 0.5) * 0.015
      group.current.position.set(st.x, st.y + Math.sin(t * 0.8) * 0.025, 0)
      group.current.scale.setScalar(st.s)
    }
    if (shadow.current) {
      const m = shadow.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.55 * Math.min(1, st.s)
    }

    // Scansione della superficie (passo 2) e colletto in evidenza (passo 3)
    const scanT = Math.min(1, Math.max(0, (st.p - 0.38) / 0.2))
    const scanOn = st.p > 0.36 && st.p < 0.62 ? Math.sin(Math.PI * Math.min(1, (st.p - 0.36) / 0.26)) : 0
    const scanY = ringsData.ymax - 0.02 - scanT * (ringsData.ymax - ringsData.cej + 0.05)
    const cejOn = st.p > 0.6 && st.p < 0.84 ? Math.sin(Math.PI * Math.min(1, (st.p - 0.6) / 0.24)) : 0
    for (const r of rings.list) {
      const scan = scanOn * Math.exp(-(((r.y - scanY) / 0.07) ** 2)) * (r.y > ringsData.cej - 0.05 ? 1 : 0)
      const cej = cejOn * Math.exp(-(((r.y - ringsData.cej) / 0.03) ** 2))
      const faint = scanOn * 0.08 * (r.y > ringsData.cej ? 1 : 0)
      r.mat.opacity = Math.min(1, scan * 0.95 + cej * 1 + faint)
      r.line.visible = r.mat.opacity > 0.01
      r.mat.color.set(cej > scan ? '#8cc24b' : '#4fc3e8')
    }
    rings.tubeMat.opacity = cejOn * 0.95
    rings.tube.visible = cejOn > 0.01
  })

  return (
    <group ref={group}>
      <primitive object={mesh} />
      <primitive object={rings.group} />
      <mesh ref={shadow} position={[0, ringsData.ymin - 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.55} />
      </mesh>
    </group>
  )
}

export default function ToothScene({ progress, active, lite, wide }: { progress: ProgressRef; active: boolean; lite: boolean; wide: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={lite ? [1, 1.5] : [1, 2]}
      camera={{ fov: 30, near: 0.1, far: 50, position: [0, 0.3, 7.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.95
        gl.setClearColor(0xffffff, 0)
      }}
    >
      <Environment />
      <directionalLight position={[3, 5, 4]} intensity={2.5} color="#fffaf0" />
      <directionalLight position={[-4, 1, -3]} intensity={1.6} color="#9fe3ff" />
      <directionalLight position={[0, -3, 2]} intensity={0.35} color="#e8fff0" />
      <Tooth progress={progress} lite={lite} wide={wide} />
    </Canvas>
  )
}
