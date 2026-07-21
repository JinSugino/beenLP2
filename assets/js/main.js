/* ============================================================
   BeEngineer Tokyo — 共通スクリプト
   モバイルメニューの開閉（全ページ共通）
   ============================================================ */
(function () {
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });

  // ナビ内リンクをタップしたら閉じる
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    })
  );
})();

/* ============================================================
   スクロールリビール（.reveal → 表示で .is-visible）
   IntersectionObserver で軽量に。GSAP非依存。
   ============================================================ */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // reduced-motion 環境では即表示
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  els.forEach((el) => io.observe(el));

  // ファーストビュー内の reveal はロード直後に発火させる
  window.addEventListener('load', () => {
    document.querySelectorAll('section:first-of-type .reveal').forEach((el) =>
      el.classList.add('is-visible')
    );
  });
})();