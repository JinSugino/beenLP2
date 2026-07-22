/* ============================================================
   BeEngineer Tokyo — トップページ演出
   GSAP + ScrollTrigger + Lenis
   スニーカー広告風：登場 / 視差 / ピン横展開 / カウント / リビール
   ============================================================ */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  /* ---------- ローダー制御（共通ヘルパー） ----------
     動画は4秒だが、アニメーション自体は2秒で終わり
     2〜4秒は静止画。よって ANIM_MS(2秒)経過＋ページ読込完了で退場へ。 */
  const ANIM_MS = 2000;         // 動画のアニメーションが終わる時点
  const MIN_MS = 2000;          // 最低表示時間
  const MAX_MS = 6000;          // 保険：これ以上は待たない
  const startedAt = Date.now();
  const loaderEl = document.getElementById('loader');
  const loaderVideo = document.getElementById('loader-video');
  document.body.classList.add('loading');

  // 動画の再生位置がアニメ終了点に達したか
  let animDone = false;
  if (loaderVideo) {
    // timeupdate で 2秒到達を検知（endedより早く退場できる）
    loaderVideo.addEventListener('timeupdate', () => {
      if (loaderVideo.currentTime >= ANIM_MS / 1000) animDone = true;
    });
    loaderVideo.addEventListener('ended', () => { animDone = true; });
    const fail = () => {
      animDone = true;
      if (loaderEl) loaderEl.classList.add('no-video');
    };
    loaderVideo.addEventListener('error', fail);
    const src = loaderVideo.querySelector('source');
    if (src) src.addEventListener('error', fail);
    const p = loaderVideo.play();
    if (p && p.catch) p.catch(fail);
  } else {
    animDone = true;
  }

  function hideLoader(after) {
    const done = () => {
      // フェーズ1：拡大を開始（動画は静止画のまま拡大される）
      if (loaderEl) loaderEl.classList.add('is-zooming');

      // フェーズ2：拡大が乗ってきたところでフェードアウト
      setTimeout(() => {
        if (loaderEl) loaderEl.classList.add('is-hidden');
        // スクロールロック解除のみ（再計算は後段でまとめて行う）
        document.body.classList.remove('loading');
      }, 500);

      // ヒーロー演出はフェードアウト中盤で始動
      setTimeout(() => { if (typeof after === 'function') after(); }, 1000);
    };

    const tryClose = () => {
      const elapsed = Date.now() - startedAt;
      const pageReady = document.readyState === 'complete';
      // アニメ終了 & ページ読込完了 & 最低時間経過 → 退場へ
      if ((animDone && pageReady && elapsed >= MIN_MS) || elapsed >= MAX_MS) {
        done();
      } else {
        setTimeout(tryClose, 100);
      }
    };
    tryClose();
  }

  if (!hasGSAP || reduce) {
    // フォールバック：即表示（ローダーは最低時間だけ見せて消す）
    document.querySelectorAll('.hero-copy .line > span').forEach(s => s.style.transform = 'none');
    document.querySelectorAll('.hero-lead, .hero-cta').forEach(e => e.style.opacity = 1);
    document.querySelectorAll('.reveal-clip').forEach(e => e.style.clipPath = 'none');
    document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible'));
    document.querySelectorAll('.bridge-photo').forEach(e => e.classList.add('is-in'));
    document.querySelectorAll('[data-count]').forEach(e => e.textContent = e.dataset.count + (e.dataset.suffix || ''));
    // ヘッダー最上部非表示（フォールバック）
    const hdr = document.getElementById('site-header');
    if (hdr) {
      const upd = () => hdr.classList.toggle('is-top', (window.scrollY || 0) <= 8);
      window.addEventListener('scroll', upd, { passive: true });
      upd();
    }
    hideLoader();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- スクロール方式 ----------
     ScrollTrigger の pin / scrub は「ネイティブスクロール」で最も安定する。
     Lenis(慣性)は pin と競合し、遅延・定速化の原因になるため既定で無効。
     慣性を試したい場合は URL に ?lenis を付ける。 */
  const USE_LENIS = location.search.includes('lenis') &&
                    !location.search.includes('nolenis');
  let lenis = null;
  if (USE_LENIS && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1.1,
      smoothWheel: true,
      syncTouch: false
    });
    window.lenisInstance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* ---------- HERO 登場シーケンス（ローダー消滅後に再生） ---------- */
  const heroIn = gsap.timeline({ defaults: { ease: 'power4.out' }, paused: true });
  heroIn
    .fromTo('.hero-product', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out' }, 0.1)
    .to('.wipe-fill', { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 0.2)
    .to('.wipe-fill', { scaleX: 0, transformOrigin: 'right', duration: 0.5, ease: 'power2.inOut' }, 0.7)
    .to('.hero-copy .line > span', { y: '0%', duration: 1, stagger: 0.09 }, 0.35)
    .to('.hero-lead', { opacity: 1, y: 0, duration: 0.8 }, 0.9)
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, 1.05);

  // ローダーを閉じてからヒーロー演出を開始
  hideLoader(() => {
    heroIn.play(0);
    // ローダーが完全に消え、レイアウトが確定してから一度だけ再計算
    setTimeout(() => {
      if (lenis) {
        lenis.resize();   // ロック解除後の正しい高さを取り直す
        lenis.start();
      }
      ScrollTrigger.refresh();
    }, 300);
  });

  /* ---------- マウス視差（ヒーロー） ---------- */
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rx = (e.clientX / window.innerWidth - 0.5);
      const ry = (e.clientY / window.innerHeight - 0.5);
      gsap.to('#heroProduct', { x: rx * 18, y: ry * 12, duration: 0.9, ease: 'power2.out' });
      gsap.to('.hero-copy', { x: rx * -14, duration: 0.9, ease: 'power2.out' });
    });
  }

  /* ---------- スクロール・パララックス（data-parallax） ---------- */
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.2;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- マーキー（data-marquee、スクロール速度も加味） ---------- */
  gsap.utils.toArray('[data-marquee]').forEach((el) => {
    const dir = parseFloat(el.dataset.marquee) || 1;
    const half = el.scrollWidth / 2; // 内容を2連結してある前提
    const startX = dir > 0 ? 0 : -half;
    const endX = dir > 0 ? -half : 0;
    gsap.fromTo(el, { x: startX }, {
      x: endX, duration: 22, ease: 'none', repeat: -1
    });
  });

  /* ---------- ブリッジ写真：順に出現＋スクロール速度差 ---------- */
  const bridge = document.querySelector('.logo-bridge');
  if (bridge) {
    const photos = gsap.utils.toArray('.bridge-photo');

    // 出現：トリガーは1つだけ。中で時差をつける
    ScrollTrigger.create({
      trigger: bridge,
      start: 'top 72%',
      once: true,
      onEnter() {
        photos.forEach((el, i) => {
          setTimeout(() => el.classList.add('is-in'), i * 180);
        });
      }
    });

    // 速度差：1つの timeline にまとめる（写真ごとにトリガーを作らない）
    const bTl = gsap.timeline({
      scrollTrigger: {
        trigger: bridge,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
    photos.forEach((el) => {
      const sp = parseFloat(el.dataset.bridgeSpeed) || 0.15;
      bTl.to(el, { yPercent: sp * 100, ease: 'none' }, 0);
    });
  }

  /* ---------- クリップリビール ---------- */
  gsap.utils.toArray('.reveal-clip').forEach((el) => {
    // clip-path は描画コストが高いので一度きりで終わらせる
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true }
    });
    // 画像のズームも同じタイミングで一度きり（scrub をやめて負荷を下げる）
    const img = el.querySelector('img');
    if (img) {
      gsap.to(img, {
        scale: 1,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      });
    }
  });

  /* ---------- .reveal（下からフェード） ---------- */
  gsap.utils.toArray('.reveal').forEach((el) => {
    const delay = el.classList.contains('d1') ? 0.08
      : el.classList.contains('d2') ? 0.16
      : el.classList.contains('d3') ? 0.24 : 0;
    gsap.fromTo(el, { y: 28, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });


  /* ---------- PIN 横スクロール ショーケース ---------- */
  const track = document.getElementById('showcaseTrack');
  const showcase = document.getElementById('showcase');
  if (track && showcase && window.innerWidth > 640) {
    const scrollLen = () => track.scrollWidth - window.innerWidth + window.innerWidth * 0.12;

    // ScrollTrigger は1つだけ作り、その timeline に全アニメを載せる
    // （カード毎に ScrollTrigger を作ると同一範囲で多重計算になり重い）
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: showcase,
        start: 'top top',
        end: () => '+=' + scrollLen(),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true
      }
    });

    tl.to(track, { x: () => -scrollLen(), ease: 'none' }, 0);
    // カード内画像の視差も同じ timeline に載せる（トリガーは増やさない）
    tl.fromTo('.pcard img',
      { xPercent: -3 },
      { xPercent: 3, ease: 'none' }, 0);
  }

  /* ---------- 数値カウントアップ ---------- */
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.to(obj, {
          v: target, duration: 1.6, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.v) + suffix; }
        });
      }
    });
  });

  /* ---------- ヘッダー：最上部では隠す ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    const TH = 8; // これ以上スクロールしたら表示
    let lastState = null;
    const applyHeader = (y) => {
      const atTop = y <= TH;
      if (atTop === lastState) return;   // 状態が変わった時だけDOM操作
      lastState = atTop;
      header.classList.toggle('is-top', atTop);
    };
    // Lenis があればそちらのみ、無ければ window scroll のみ（二重登録しない）
    if (lenis) {
      lenis.on('scroll', ({ scroll }) => applyHeader(scroll));
    } else {
      window.addEventListener('scroll', () => applyHeader(window.scrollY), { passive: true });
    }
    applyHeader(window.scrollY || 0);
  }
  
// GSAPプラグイン登録（まだしていない場合）
gsap.registerPlugin(ScrollTrigger);

// ロゴブリッジセクションの2Dロゴ演出
gsap.to(".logo-bridge-svg", {
  opacity: 1,
  scale: 1,
  y: 0,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".logo-bridge",
    start: "top 60%",  // セクションが画面下から60%の位置に来たら発動
    end: "bottom top",
    toggleActions: "play reverse play reverse" // 行き来した時に再アニメーション
  }
});
(function initBridge3DLogo() {
  const container = document.getElementById('bridge-canvas');
  if (!container || typeof THREE === 'undefined') return;

  let root3D = null;
  let targetRotY = 0, targetRotX = 0.15;
  let curRotY = 0, curRotX = 0.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45, container.clientWidth / container.clientHeight, 1, 1000
  );
  camera.position.set(0, 0, 120);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const l1 = new THREE.DirectionalLight(0x3fb04d, 1.2);
  l1.position.set(100, 100, 100); scene.add(l1);
  const l2 = new THREE.DirectionalLight(0x3b82f6, 0.8);
  l2.position.set(-100, -100, 50); scene.add(l2);

  root3D = new THREE.Group();
  scene.add(root3D);

    const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.25,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
    });

  const loader = new THREE.SVGLoader();
  loader.load('assets/logo/BeEngineer_logo.svg', (data) => {
    const rawGroup = new THREE.Group();
    const pivot = new THREE.Group();
    const extrude = { depth: 12, bevelEnabled: true, bevelThickness: 1, bevelSize: 0.5, bevelSegments: 3 };

    data.paths.forEach((path) => {
      THREE.SVGLoader.createShapes(path).forEach((shape) => {
        rawGroup.add(new THREE.Mesh(new THREE.ExtrudeGeometry(shape, extrude), material));
      });
    });

    rawGroup.updateMatrixWorld(true);
    const size = new THREE.Vector3();
    new THREE.Box3().setFromObject(rawGroup).getSize(size);
    const TARGET_SIZE = 100;  // 65 → 100 で約1.5倍
    const scaleFactor = TARGET_SIZE / Math.max(size.x, size.y);
    rawGroup.scale.set(scaleFactor, -scaleFactor, scaleFactor);
    rawGroup.updateMatrixWorld(true);

    const center = new THREE.Vector3();
    new THREE.Box3().setFromObject(rawGroup).getCenter(center);
    rawGroup.position.sub(center);

    pivot.add(rawGroup);
    root3D.add(pivot);
  }, undefined, (err) => {
    console.warn('SVG読み込み失敗。代替オブジェクトを生成します。', err);
    root3D.add(new THREE.Mesh(new THREE.BoxGeometry(55, 55, 6, 2, 2, 2), material));
  });

  // ---- パーティクル ----
const P_COUNT = 900;
const P_RANGE = 260;
const positions = new Float32Array(P_COUNT * 3);
const speeds = new Float32Array(P_COUNT);

for (let i = 0; i < P_COUNT; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * P_RANGE * 1.6;
  positions[i * 3 + 1] = (Math.random() - 0.5) * P_RANGE;
  positions[i * 3 + 2] = (Math.random() - 0.5) * P_RANGE;
  speeds[i] = 0.05 + Math.random() * 0.15;
}

const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// 円形のソフトなスプライトを生成
function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

const pMat = new THREE.PointsMaterial({
  size: 3.5,
  map: makeDotTexture(),
  color: 0x3fb04d,
  transparent: true,
  opacity: 0.75,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true
});

const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);



  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // カーソル追従（X軸=上下、Y軸=左右）
  window.addEventListener('mousemove', (e) => {
    const mx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const my = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    targetRotY = mx * 0.5;
    targetRotX = 0.15 + my * 0.35;
  });

function loop() {
  requestAnimationFrame(loop);

  if (root3D) {
    curRotY += (targetRotY - curRotY) * 0.08;
    curRotX += (targetRotX - curRotX) * 0.08;
    root3D.rotation.y = curRotY;
    root3D.rotation.x = curRotX;
    root3D.position.y = Math.sin(Date.now() * 0.0012) * 2;
  }

  // パーティクル：ゆっくり上昇＋全体回転
  const pos = pGeo.attributes.position.array;
  for (let i = 0; i < P_COUNT; i++) {
    pos[i * 3 + 1] += speeds[i];
    if (pos[i * 3 + 1] > P_RANGE / 2) pos[i * 3 + 1] = -P_RANGE / 2;
  }
  pGeo.attributes.position.needsUpdate = true;

  particles.rotation.y += 0.0006;
  particles.rotation.y += (curRotY * 0.15 - particles.rotation.y) * 0.02;

  renderer.render(scene, camera);
}
  loop();
})();
  /* ---------- リサイズ時にレイアウト再計算 ---------- */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();