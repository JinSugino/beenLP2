/* ============================================================
   BeEngineer Tokyo — トップページ演出
   GSAP + ScrollTrigger + Lenis
   スニーカー広告風：登場 / 視差 / ピン横展開 / カウント / リビール
   ============================================================ */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  /* ---------- ローダー制御（共通ヘルパー） ----------
     最低表示時間（MIN_MS）と window.load の両方を待ってから消す。
     速く読めても最低 MIN_MS は見せて“間”をつくる。 */
  const MIN_MS = 1000;
  const startedAt = Date.now();
  const loaderEl = document.getElementById('loader');
  document.body.classList.add('loading'); // スクロールロック

  function hideLoader(after) {
    const wait = Math.max(0, MIN_MS - (Date.now() - startedAt));
    const done = () => {
      if (loaderEl) loaderEl.classList.add('is-hidden');
      document.body.classList.remove('loading');
      // フェードアウト後にコールバック（ヒーロー演出開始など）
      setTimeout(() => { if (typeof after === 'function') after(); }, 450);
    };
    // window.load 済みなら即、未了なら load を待つ
    if (document.readyState === 'complete') {
      setTimeout(done, wait);
    } else {
      window.addEventListener('load', () => setTimeout(done, wait), { once: true });
    }
  }

  if (!hasGSAP || reduce) {
    // フォールバック：即表示（ローダーは最低時間だけ見せて消す）
    document.querySelectorAll('.hero-copy .line > span').forEach(s => s.style.transform = 'none');
    document.querySelectorAll('.hero-lead, .hero-cta').forEach(e => e.style.opacity = 1);
    document.querySelectorAll('.reveal-clip').forEach(e => e.style.clipPath = 'none');
    document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible'));
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

  /* ---------- Lenis 慣性スクロール ---------- */
  let lenis = null;
  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop(); // ローダー表示中はスクロールを止める
  }

  /* ---------- HERO 登場シーケンス（ローダー消滅後に再生） ---------- */
  const heroIn = gsap.timeline({ defaults: { ease: 'power4.out' }, paused: true });
  heroIn
    .to('.hero-product', { y: 0, duration: 1.2, ease: 'power3.out' }, 0.1)
    .fromTo('.hero-product img', { scale: 1.35 }, { scale: 1.15, duration: 1.4, ease: 'power2.out' }, 0.1)
    .to('.wipe-fill', { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 0.2)
    .to('.wipe-fill', { scaleX: 0, transformOrigin: 'right', duration: 0.5, ease: 'power2.inOut' }, 0.7)
    .to('.hero-copy .line > span', { y: '0%', duration: 1, stagger: 0.09 }, 0.35)
    .to('.hero-lead', { opacity: 1, y: 0, duration: 0.8 }, 0.9)
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, 1.05)
    // 光沢スイープをタイムラインに載せる（登場後半で走らせる）
    .fromTo('.hero-product', { '--x': '-120%' }, { '--x': '120%', duration: 0.9, ease: 'power2.inOut' }, 0.8);

  // ローダーを閉じてからヒーロー演出を開始
  hideLoader(() => {
    if (lenis) lenis.start();
    heroIn.play(0);
    ScrollTrigger.refresh();
  });

  /* ---------- マウス視差（ヒーロー） ---------- */
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rx = (e.clientX / window.innerWidth - 0.5);
      const ry = (e.clientY / window.innerHeight - 0.5);
      gsap.to('#heroProduct', { x: rx * 30, y: ry * 24 + 0, rotateY: rx * 6, rotateX: -ry * 6, duration: 0.8, ease: 'power2.out' });
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

  /* ---------- クリップリビール ---------- */
  gsap.utils.toArray('.reveal-clip').forEach((el) => {
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 82%' }
    });
    const img = el.querySelector('img');
    if (img) {
      gsap.to(img, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
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
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* ---------- PIN 横スクロール ショーケース ---------- */
  const track = document.getElementById('showcaseTrack');
  const showcase = document.getElementById('showcase');
  if (track && showcase && window.innerWidth > 640) {
    const scrollLen = () => track.scrollWidth - window.innerWidth + window.innerWidth * 0.12;
    gsap.to(track, {
      x: () => -scrollLen(),
      ease: 'none',
      scrollTrigger: {
        trigger: showcase,
        start: 'top top',
        end: () => '+=' + scrollLen(),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    // カード内画像に軽い視差
    gsap.utils.toArray('.pcard img').forEach((img) => {
      gsap.fromTo(img, { xPercent: -4 }, {
        xPercent: 4, ease: 'none',
        scrollTrigger: {
          trigger: showcase, start: 'top top', end: () => '+=' + scrollLen(),
          scrub: true
        }
      });
    });
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
    const applyHeader = (y) => {
      if (y > TH) header.classList.remove('is-top');
      else header.classList.add('is-top');
    };
    if (lenis) {
      lenis.on('scroll', ({ scroll }) => applyHeader(scroll));
    }
    // Lenis非使用時／初期状態のフォールバック
    window.addEventListener('scroll', () => applyHeader(window.scrollY), { passive: true });
    applyHeader(window.scrollY || 0);
  }

  /* ---------- リサイズ時にレイアウト再計算 ---------- */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();