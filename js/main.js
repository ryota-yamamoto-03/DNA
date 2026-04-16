import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ── Color palette (single source of truth: CSS :root) ────────────────────
const _rs = getComputedStyle(document.documentElement);
const PALETTE = {
  web:   _rs.getPropertyValue('--c-web').trim(),
  game:  _rs.getPropertyValue('--c-game').trim(),
  career: _rs.getPropertyValue('--c-career').trim(),
  ai:    _rs.getPropertyValue('--c-ai').trim(),
};
// Three.js integer equivalents
const C = Object.fromEntries(
  Object.entries(PALETTE).map(([k, v]) => [k, new THREE.Color(v).getHex()])
);

// ── Portfolio data ──────────────────────────────────────────────────────────
const WORKS = [
  {
    title: 'STOPLINE',
    tag: 'Game',
    color: 'game',
    desc: '制限時間内に線を引いてボールを目的地まで運ぶ、戦略性と直感が試されるシンプルなシングルプレイゲームです',
    tech: ['Unity', 'C#','WebGL'],
    url: 'https://ph19-ryota.github.io/STOPLINE.VGA/',
  },
  {
    title: '新卒DeNA入社→IRIAMへ出向社員',
    tag: 'Career',
    color: 'career',
    desc: '新卒でDeNAに入社し、子会社のIRIAMへ出向。バーチャルライブ配信アプリの開発を担当し、コミュニティーチームでもMVP賞を受賞。技術とコミュニティの両面で貢献した経験があります。',
    tech: ['Unity', 'C#'],
    url: 'https://line.connpass.com/event/261038/'
  },
  {
    title: 'MetaMuse',
    tag: 'Web',
    color: 'web',
    desc: '仮想空間で活動する次世代バーチャルアイドル。音楽とテクノロジーを融合し新しい推し体験を届ける存在です。',
    tech: ['ChatGPT', 'suno AI', 'HTML', 'CSS', 'JavaScript'],
    url: 'https://metamuse-virtualidol.github.io/Official/index.html#',
  },
  {
    title: 'WowMe',
    tag: 'Web',
    color: 'web',
    desc: '推しとファンをつなぐ動画メッセージアプリ。特別な想いを届ける新体験サービスで誕生日や記念日に世界に一つの感動を贈れるサービスです。',
    tech: ['HTML', 'CSS', 'JS', 'Square'],
    url: 'https://hello-wowme.github.io/WowMe-Official/',
  },
  {
    title: 'ドルスケ',
    tag: 'AI',
    color: 'ai',
    desc: 'アイドルのライブ情報をまとめて確認できるスケジュール共有サービス。推し活を効率化できる便利ツールです誰でも簡単に利用可能で、ファン同士の交流も促進します。',
    tech: ['ClaudeCode', 'Supabase', 'Vercel'],
    url: 'https://dorusuke.vercel.app/',
  },
  {
    title: 'AI Closet',
    tag: 'AI',
    color: 'ai',
    desc: 'AIがあなたのクローゼットから今日の天気に合ったコーデを提案します',
    tech: ['ClaudeCode', 'Supabase', 'Vercel'],
    url: 'https://ai-closet-one.vercel.app/',
  },
  {
    title: 'AIニュース日報',
    tag: 'AI',
    color: 'ai',
    desc: 'AIが毎日のAIニュースをまとめたニュース日報。最新の情報をお届けします。',
    tech: ['ClaudeCode', 'Vercel', 'GitHub'],
    url: 'https://ai-news-daily-nine.vercel.app/',
  },
  {
    title: 'FAKESCAN',
    tag: 'AI',
    color: 'ai',
    desc: 'AI・偽サイト検出ツール。URLを入力するだけで、そのサイトが本物か偽物かをAIが分析し、ユーザーに警告します。安全なネット利用をサポートするサービスです。',
    tech: ['ClaudeCode', 'HTML', 'vercel', 'GitHub'],
    url: 'https://fakescan-three.vercel.app/',

  }
];

// ── Scene setup ──────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const isMobile = window.innerWidth < 600;

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, isMobile ? 32 : 22);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = isMobile ? 20 : 12;
controls.maxDistance = isMobile ? 55 : 40;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

// Fog
scene.fog = new THREE.FogExp2(0x000000, 0.018);

// ── Lights ───────────────────────────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

const addPointLight = (color, x, y, z, intensity = 2) => {
  const l = new THREE.PointLight(color, intensity, 60);
  l.position.set(x, y, z);
  scene.add(l);
};
addPointLight(C.web,    -10,  5,  5);
addPointLight(C.game,    10, -5, -5);
addPointLight(C.career,    0, -10, 10, 1.5);

// ── DNA Helix ────────────────────────────────────────────────────────────────
const DNA_HEIGHT   = 28;
const DNA_RADIUS   = 2.2;
const DNA_TURNS    = 5;
const STRAND_SEGS  = 200;
const RUNG_COUNT   = 40;

const strandMat1 = new THREE.MeshStandardMaterial({
  color: C.web, emissive: C.web, emissiveIntensity: 0.6,
  roughness: 0.2, metalness: 0.8,
});
const strandMat2 = new THREE.MeshStandardMaterial({
  color: C.game, emissive: C.game, emissiveIntensity: 0.6,
  roughness: 0.2, metalness: 0.8,
});
const rungMat = new THREE.MeshStandardMaterial({
  color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.15,
  roughness: 0.5, metalness: 0.4, transparent: true, opacity: 0.55,
});

// Build strand as TubeGeometry path
class HelixCurve extends THREE.Curve {
  constructor(phase) {
    super();
    this.phase = phase;
  }
  getPoint(t) {
    const angle = t * Math.PI * 2 * DNA_TURNS + this.phase;
    const y = (t - 0.5) * DNA_HEIGHT;
    return new THREE.Vector3(
      Math.cos(angle) * DNA_RADIUS,
      y,
      Math.sin(angle) * DNA_RADIUS,
    );
  }
}

const makeTube = (phase, mat) => {
  const curve = new HelixCurve(phase);
  const geo = new THREE.TubeGeometry(curve, STRAND_SEGS, 0.09, 8, false);
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  return mesh;
};

const strand1 = makeTube(0, strandMat1);
const strand2 = makeTube(Math.PI, strandMat2);

// Rungs (base pairs)
const rungGeo = new THREE.CylinderGeometry(0.04, 0.04, DNA_RADIUS * 2, 8);
const rungGroup = new THREE.Group();
for (let i = 0; i < RUNG_COUNT; i++) {
  const t = i / RUNG_COUNT;
  const angle = t * Math.PI * 2 * DNA_TURNS;
  const y = (t - 0.5) * DNA_HEIGHT;

  const x1 = Math.cos(angle) * DNA_RADIUS;
  const z1 = Math.sin(angle) * DNA_RADIUS;

  const rung = new THREE.Mesh(rungGeo, rungMat.clone());
  rung.position.set(0, y, 0);
  rung.rotation.z = Math.PI / 2;
  rung.rotation.y = -angle;
  rungGroup.add(rung);

  // Glow sphere at each rung end
  const sphereGeo = new THREE.SphereGeometry(0.14, 12, 12);
  const col = i % 2 === 0 ? C.web : C.career;
  const sphereMat = new THREE.MeshStandardMaterial({
    color: col, emissive: col, emissiveIntensity: 1.2,
    roughness: 0.1, metalness: 0.5,
  });
  const s1 = new THREE.Mesh(sphereGeo, sphereMat);
  s1.position.set(x1, y, z1);
  rungGroup.add(s1);
  const s2 = new THREE.Mesh(sphereGeo, sphereMat.clone());
  s2.position.set(-x1, y, -z1);
  rungGroup.add(s2);
}
scene.add(rungGroup);

// ── Floating particles ────────────────────────────────────────────────────────
const PARTICLE_COUNT = 1200;
const pPositions = new Float32Array(PARTICLE_COUNT * 3);
const pColors    = new Float32Array(PARTICLE_COUNT * 3);
const palette = Object.values(PALETTE).map(v => new THREE.Color(v));
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const r = 10 + Math.random() * 25;
  const theta = Math.random() * Math.PI * 2;
  const phi   = Math.acos(2 * Math.random() - 1);
  pPositions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
  pPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
  pPositions[i*3+2] = r * Math.cos(phi);
  const c = palette[Math.floor(Math.random() * palette.length)];
  pColors[i*3]   = c.r;
  pColors[i*3+1] = c.g;
  pColors[i*3+2] = c.b;
}
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
const pMat = new THREE.PointsMaterial({
  size: 0.06, vertexColors: true,
  transparent: true, opacity: 0.7,
  sizeAttenuation: true,
});
scene.add(new THREE.Points(pGeo, pMat));

// ── Work orbs around DNA ──────────────────────────────────────────────────────
const ORB_ORBIT_RADIUS = 6.5;
const orbGroup = new THREE.Group();
scene.add(orbGroup);

const orbMeshes = [];
const orbData   = [];

WORKS.forEach((work, i) => {
  const t     = i / WORKS.length;
  const angle = t * Math.PI * 2;
  const y     = (t - 0.5) * DNA_HEIGHT * 0.85;
  const color = C[work.color];

  // Outer glow ring
  const ringGeo = new THREE.TorusGeometry(1.1, 0.025, 16, 80);
  const ringMat = new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 1,
    roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.5,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);

  // Core sphere
  const coreGeo = new THREE.SphereGeometry(0.65, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 0.55,
    roughness: 0.15, metalness: 0.7,
    transparent: true, opacity: 0.92,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);

  // Inner detail
  const innerGeo = new THREE.IcosahedronGeometry(0.3, 1);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4,
    roughness: 0.3, metalness: 0.9, wireframe: true,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);

  const orb = new THREE.Group();
  orb.add(ring, core, inner);
  orb.position.set(
    Math.cos(angle) * ORB_ORBIT_RADIUS,
    y,
    Math.sin(angle) * ORB_ORBIT_RADIUS,
  );
  orb.userData = { work, index: i, baseAngle: angle, baseY: y };
  orbGroup.add(orb);
  orbMeshes.push(core);
  orbData.push({ orb, ring, inner, baseAngle: angle, baseY: y });
});

// Connecting lines from DNA to orbs
const lineMat = new THREE.LineBasicMaterial({
  color: 0x222222, transparent: true, opacity: 0.4,
});
orbData.forEach(({ orb }) => {
  const pts = [new THREE.Vector3(0, orb.position.y, 0), orb.position.clone()];
  const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
  orbGroup.add(new THREE.Line(lineGeo, lineMat));
});

// ── Raycasting / click ────────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let PAUSED = false;

const modal     = document.getElementById('modal');
const mTag      = document.getElementById('m-tag');
const mTitle    = document.getElementById('m-title');
const mDesc     = document.getElementById('m-desc');
const mTech     = document.getElementById('m-tech');
const mLink     = document.getElementById('m-link');

function openModal(work) {
  mTag.textContent    = work.tag;
  mTitle.textContent  = work.title;
  mDesc.textContent   = work.desc;
  mTech.innerHTML     = work.tech.map(t => `<span>${t}</span>`).join('');
  mLink.onclick       = () => window.open(work.url, '_blank');

  // Apply orb color as CSS custom properties
  const hex = PALETTE[work.color];
  const tc  = new THREE.Color(hex);
  const r   = Math.round(tc.r * 255);
  const g   = Math.round(tc.g * 255);
  const b   = Math.round(tc.b * 255);
  const card = modal.querySelector('.modal-card');
  card.style.setProperty('--orb-color',        hex);
  card.style.setProperty('--orb-color-dim',    `rgba(${r},${g},${b},0.22)`);
  card.style.setProperty('--orb-color-alpha50', `rgba(${r},${g},${b},0.5)`);

  modal.classList.add('open');
  PAUSED = true;
  controls.autoRotate = false;
}

function closeModal() {
  modal.classList.remove('open');
  PAUSED = false;
  controls.autoRotate = true;
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-close2').addEventListener('click', closeModal);

renderer.domElement.addEventListener('click', (e) => {
  if (modal.classList.contains('open')) return;
  mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(orbMeshes, false);
  if (hits.length) {
    const hit = hits[0].object;
    const work = hit.parent.userData.work;
    if (work) openModal(work);
  }
});

// Hover cursor
renderer.domElement.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(orbMeshes, false);
  renderer.domElement.style.cursor = hits.length ? 'pointer' : 'default';
});

// ── Scroll to rotate DNA ──────────────────────────────────────────────────────
let scrollOffset = 0;
window.addEventListener('wheel', (e) => {
  scrollOffset += e.deltaY * 0.0015;
});

// ── Resize ────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const mobile = window.innerWidth < 600;
  controls.minDistance = mobile ? 20 : 12;
  controls.maxDistance = mobile ? 55 : 40;
});

// ── Intro ─────────────────────────────────────────────────────────────────────
const intro  = document.getElementById('intro');
const hud    = document.getElementById('hud');
const hint   = document.getElementById('scroll-hint');
const legend = document.getElementById('legend');

// Touch device: update hint text
if ('ontouchstart' in window) {
  hint.textContent = 'Drag / Pinch · Tap orbs to explore';
}

document.getElementById('enter-btn').addEventListener('click', () => {
  intro.classList.add('hidden');
  setTimeout(() => {
    intro.style.display = 'none';
    hud.classList.add('visible');
    hint.classList.add('visible');
    legend.classList.add('visible');
  }, 1200);
});

// ── Animation loop ────────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  if (!PAUSED) {
    // Rotate DNA + orbs together with scroll
    const baseRot = scrollOffset + elapsed * 0.04;
    strand1.rotation.y = baseRot;
    strand2.rotation.y = baseRot;
    rungGroup.rotation.y = baseRot;
    orbGroup.rotation.y  = baseRot;

    // Orb self-animation
    orbData.forEach(({ orb, ring, inner }, i) => {
      const t = elapsed * 0.6 + i * 0.8;
      // gentle float
      orb.position.y = orbData[i].baseY + Math.sin(t) * 0.18;
      // spin ring & inner
      ring.rotation.x = elapsed * 0.5 + i;
      ring.rotation.z = elapsed * 0.3;
      inner.rotation.y = elapsed * 1.2 + i;
      inner.rotation.x = elapsed * 0.7;
      // pulse scale
      const s = 1 + 0.06 * Math.sin(t * 1.3);
      orb.scale.setScalar(s);
    });
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
