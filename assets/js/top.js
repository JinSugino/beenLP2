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

  /* ---------- リサイズ時にレイアウト再計算 ---------- */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();