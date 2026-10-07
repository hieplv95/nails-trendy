(function () {
  const S = window.SHOP || {};
  const I = window.I18N || { langs: [{ code: 'es', name: 'Español' }], dict: { es: {} } };
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} },
    del: k => { try { localStorage.removeItem(k); } catch (_) {} }
  };

  /* ---------- Ngôn ngữ ----------
   * Mặc định tiếng Tây Ban Nha. Đổi bằng nút chọn ngôn ngữ, hoặc link có ?lang=en (fr, de, ...).
   * Lựa chọn được nhớ trong trình duyệt của khách.
   */
  const DEFAULT = 'es';
  const codes = I.langs.map(l => l.code);
  const fromUrl = new URLSearchParams(location.search).get('lang');
  let lang = codes.includes(fromUrl) ? fromUrl : (codes.includes(store.get('nt-lang')) ? store.get('nt-lang') : DEFAULT);
  const t = (key, vars) => {
    let s = (I.dict[lang] && I.dict[lang][key]) ?? I.dict[DEFAULT][key] ?? key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  };

  /* ---------- Điền thông tin tiệm từ config.js ---------- */
  const waUrl = text => `https://wa.me/${S.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : '');
  const links = () => ({
    tel: 'tel:' + S.phoneRaw,
    whatsapp: waUrl(t('wa.hello')),
    map: S.mapUrl,
    facebook: S.facebook,
    instagram: S.instagram,
    twitter: S.twitter,
    tiktok: S.tiktok,
    waFloat: S.whatsappFloat || waUrl('')
  });
  function fillShop() {
    $$('[data-shop]').forEach(el => { el.textContent = S[el.dataset.shop] || ''; });
    const L = links();
    $$('[data-link]').forEach(el => { el.href = L[el.dataset.link] || '#'; });
  }

  /* ---------- Áp dụng bản dịch cho toàn trang ---------- */
  const TEL = '<a data-link="tel"><span data-shop="phone"></span></a>';
  const WA = '<a data-link="whatsapp" target="_blank" rel="noopener">WhatsApp</a>';
  function applyLang(code) {
    lang = code;
    document.documentElement.lang = code;
    document.title = t('meta.title');
    $('meta[name="description"]')?.setAttribute('content', t('meta.desc'));
    $('meta[property="og:title"]')?.setAttribute('content', t('meta.title'));
    $('meta[property="og:description"]')?.setAttribute('content', t('meta.desc'));
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml, { tel: TEL, wa: WA }); });
    $$('[data-i18n-alt]').forEach(el => el.setAttribute('alt', t(el.dataset.i18nAlt)));
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $$('[data-i18n-title]').forEach(el => el.setAttribute('title', t(el.dataset.i18nTitle)));
    const cur = I.langs.find(l => l.code === code);
    $('#langFlag').src = `images/flags/${code}.svg`;
    $('#langFlag').alt = cur ? cur.name : code;
    $$('#langList button').forEach(b => b.setAttribute('aria-current', b.dataset.lang === code));
    fillShop();
    renderHours();
    renderReviews();
  }

  /* ---------- Nút chọn ngôn ngữ ---------- */
  const langBtn = $('#langBtn'), langList = $('#langList');
  langList.innerHTML = I.langs.map(l =>
    `<li><button type="button" data-lang="${l.code}" lang="${l.code}"><img class="flag" src="images/flags/${l.code}.svg" alt="" width="24" height="16">${esc(l.name)}</button></li>`).join('');
  const closeLang = () => { langList.hidden = true; langBtn.setAttribute('aria-expanded', false); };
  langBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = langList.hidden;
    langList.hidden = !open;
    langBtn.setAttribute('aria-expanded', open);
  });
  langList.addEventListener('click', e => {
    const b = e.target.closest('button[data-lang]');
    if (!b) return;
    store.set('nt-lang', b.dataset.lang);
    applyLang(b.dataset.lang);
    closeLang();
  });
  document.addEventListener('click', e => { if (!e.target.closest('#lang')) closeLang(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLang(); });

  /* ---------- Bản đồ Google Maps + hỏi đồng ý cookie ----------
   * Google Maps lưu cookie của Google, nên chỉ tải bản đồ khi khách đồng ý.
   * Lựa chọn lưu trong trình duyệt ('yes' / 'no'); xoá đi thì thông báo hiện lại.
   */
  const CK = 'nt-cookie-consent';
  const mapFrame = $('#mapFrame'), mapPh = $('#mapPh'), banner = $('#cookieBanner');
  function loadMap() {
    if (!mapFrame || mapFrame.getAttribute('src')) return;
    mapFrame.src = 'https://maps.google.com/maps?q=' +
      encodeURIComponent((S.mapName || S.name) + ', ' + S.address) + `&z=16&hl=${lang}&output=embed`;
    mapFrame.hidden = false;
    if (mapPh) mapPh.hidden = true;
  }
  function choose(v) {
    store.set(CK, v);
    banner.hidden = true;
    if (v === 'yes') loadMap();
  }
  $('#ckAccept')?.addEventListener('click', () => choose('yes'));
  $('#ckReject')?.addEventListener('click', () => choose('no'));
  $('#mapLoad')?.addEventListener('click', () => choose('yes'));
  $$('[data-cookie-reset]').forEach(b => b.addEventListener('click', () => {
    store.del(CK);
    banner.hidden = false;
  }));

  /* ---------- Menu điện thoại ---------- */
  const nav = $('#nav'), burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  const navLinks = $$('.nav a[href^="#"]:not(.logo)');
  navLinks.forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  }));

  /* ---------- Đánh dấu mục đang xem trên menu ---------- */
  const sections = [...new Set(navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean))];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ---------- Hiệu ứng xuất hiện khi cuộn ---------- */
  const rv = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => rv.observe(el));

  /* ---------- Lọc mẫu nail ---------- */
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
    const f = b.dataset.f;
    $$('#gal .g').forEach(g => g.classList.toggle('hide', f !== 'all' && !(g.dataset.cat || '').split(' ').includes(f)));
  });

  /* ---------- Lưu mẫu yêu thích (lưu trên máy khách) ---------- */
  const KEY = 'nt-likes';
  let likes = [];
  try { likes = JSON.parse(store.get(KEY)) || []; } catch (_) {}
  const nameOf = g => g.dataset.name || $('b', g).textContent;
  const markLikes = () => $$('#gal .g').forEach(g => $('.heart', g).classList.toggle('on', likes.includes(nameOf(g))));
  $('#gal').addEventListener('click', e => {
    const h = e.target.closest('.heart');
    if (!h) return;
    const name = nameOf(h.closest('.g'));
    likes = likes.includes(name) ? likes.filter(x => x !== name) : [...likes, name];
    markLikes();
    store.set(KEY, JSON.stringify(likes));
  });
  markLikes();

  /* ---------- Mẫu nail lấy từ Instagram (qua Behold) ----------
   * Có link feed trong config.js (instagramFeed) thì thay các mẫu minh hoạ bằng bài Instagram mới nhất.
   * Nút lọc dựa vào chữ trong caption/hashtag, ví dụ #french #nude #burdeos #nailart #novia.
   */
  const CATS = {
    french: /french|francesa/,
    nude: /nude|natural|baby ?boomer|difuminad/,
    wine: /burdeos|bordeaux|granate|vino|rojo|red/,
    art: /nail ?art|dibujo|diseñ|decorad|3d|piedra|strass|cristal/,
    bride: /novia|boda|bride|wedding/
  };
  async function loadInstagram() {
    if (!S.instagramFeed) return;
    try {
      const res = await fetch(S.instagramFeed);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const posts = (Array.isArray(data) ? data : data.posts || []).slice(0, S.instagramCount || 8);
      if (!posts.length) return;
      $('#gal').innerHTML = posts.map((p, i) => {
        const text = (p.prunedCaption || p.caption || '').replace(/\s+/g, ' ').trim();
        const title = text ? (text.length > 28 ? text.slice(0, 26).trim() + '…' : text) : `${t('ig.design')} #${i + 1}`;
        const hay = (text + ' ' + (p.hashtags || []).join(' ')).toLowerCase();
        const cats = Object.keys(CATS).filter(k => CATS[k].test(hay)).join(' ');
        const img = (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) ||
          (p.mediaType === 'VIDEO' ? p.thumbnailUrl : p.mediaUrl);
        return `<div class="g" data-cat="${cats}" data-name="${esc(title + ' – ' + p.permalink)}">` +
          `<button class="heart" data-i18n-aria="aria.save" aria-label="${esc(t('aria.save'))}">♥</button>` +
          `<figure><a href="${esc(p.permalink)}" target="_blank" rel="noopener"><img src="${esc(img)}" alt="${esc(text || 'Nails Trendy')}" loading="lazy"></a></figure>` +
          `<figcaption><b>${esc(title)}</b><small><a href="${esc(p.permalink)}" target="_blank" rel="noopener" data-i18n="ig.view">${esc(t('ig.view'))}</a></small></figcaption></div>`;
      }).join('');
      // Ẩn nút lọc không có mẫu nào
      $$('#filters button').forEach(b => {
        if (b.dataset.f !== 'all') b.hidden = !$$('#gal .g').some(g => g.dataset.cat.split(' ').includes(b.dataset.f));
      });
      markLikes();
    } catch (err) {
      console.warn('Instagram feed failed, keeping sample designs.', err);
    }
  }
  loadInstagram();

  /* ---------- Đánh giá khách hàng (dữ liệu trong js/reviews.js) ---------- */
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const reviewList = (window.REVIEWS || []).length ? window.REVIEWS : (isLocal ? window.DEMO_REVIEWS || [] : []);
  const track = $('#rvTrack'), prevBtn = $('.rv-nav.prev'), nextBtn = $('.rv-nav.next');
  const step = () => ($('.rc', track)?.offsetWidth || 300) + 22;
  const updateNav = () => {
    prevBtn.disabled = track.scrollLeft < 5;
    nextBtn.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 5;
  };
  prevBtn.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateNav, { passive: true });
  addEventListener('resize', updateNav);
  track.addEventListener('click', e => {
    const b = e.target.closest('.rc-toggle');
    if (!b) return;
    b.textContent = t(b.closest('.rc').classList.toggle('open') ? 'rev.less' : 'rev.more');
  });

  function renderReviews() {
    if (!reviewList.length) return;
    const colors = ['#2FA36B', '#3B7DDD', '#8B5CF6', '#E0607E', '#D9822B', '#0F9AA8', '#6B7280'];
    const initials = n => n.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    const ago = d => {
      const days = Math.floor((Date.now() - new Date(d)) / 864e5);
      if (isNaN(days)) return '';
      if (days < 7) return rtf.format(-days, 'day');
      if (days < 30) return rtf.format(-Math.floor(days / 7), 'week');
      if (days < 365) return rtf.format(-Math.floor(days / 30), 'month');
      return rtf.format(-Math.floor(days / 365), 'year');
    };
    const count = (n, one, many) => t(n === 1 ? one : many, { n });
    const gIcon = '<svg class="rc-gl" viewBox="0 0 48 48" aria-label="Google"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z"/><path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.4 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';

    track.innerHTML = reviewList.map((r, i) => {
      const n = Math.max(0, Math.min(5, r.rating || 5));
      const days = (Date.now() - new Date(r.date)) / 864e5;
      const meta = [
        r.guide ? `<span class="lg">${esc(t('rev.guide'))}</span>` : '',
        r.reviews ? esc(count(r.reviews, 'rev.count1', 'rev.countN')) : '',
        r.pics ? esc(count(r.pics, 'rev.pics1', 'rev.picsN')) : ''
      ].filter(Boolean).join(' · ');
      const photos = (r.photos || []).slice(0, 3).map(p =>
        `<a href="${esc(p)}" target="_blank" rel="noopener"><img src="${esc(p)}" alt="${esc(t('rev.photo'))} ${esc(r.name)}"></a>`).join('');
      return `<article class="rc">
        <div class="rc-top"><div class="rc-av" style="background:${colors[i % colors.length]}">${esc(initials(r.name))}</div>
          <div><div class="rc-name">${esc(r.name)}</div>${meta ? `<div class="rc-meta">${meta}</div>` : ''}</div>${gIcon}</div>
        <div class="rc-row"><span class="stars" aria-label="${n}/5">${'★'.repeat(n)}<span class="off">${'★'.repeat(5 - n)}</span></span>
          <span class="rc-date">${ago(r.date)}</span>${days >= 0 && days <= 30 ? `<span class="rc-new">${esc(t('rev.new'))}</span>` : ''}</div>
        <p class="rc-text">${esc(r.text)}</p><button class="rc-toggle" type="button" hidden>${esc(t('rev.more'))}</button>
        ${photos ? `<div class="rc-photos">${photos}</div>` : ''}
      </article>`;
    }).join('');
    $('#rvCarousel').hidden = false;

    // "Ver más" chỉ hiện khi nội dung bị rút gọn
    $$('.rc', track).forEach(c => {
      const txt = $('.rc-text', c);
      $('.rc-toggle', c).hidden = txt.scrollHeight <= txt.clientHeight + 2;
    });
    updateNav();
  }

  /* ---------- Nút WhatsApp: gửi kèm các mẫu khách đã lưu ♥ ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-link="whatsapp"]');
    if (!a) return;
    a.href = waUrl(t('wa.hello') + (likes.length ? '\n' + t('wa.liked') + ' ' + likes.join(', ') : ''));
  });

  /* ---------- Giờ mở cửa (dữ liệu trong config.js: schedule) ---------- */
  function renderHours() {
    const table = $('#hoursTable');
    if (!table || !S.schedule) return;
    // Tên thứ theo ngôn ngữ đang chọn (5/1/2025 là Chủ nhật)
    const dayName = d => {
      const s = new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(new Date(2025, 0, 5 + d));
      return s.charAt(0).toLocaleUpperCase(lang) + s.slice(1);
    };
    const fmt = x => x.replace(/^0/, '');
    const toMin = x => { const [h, m] = x.split(':').map(Number); return h * 60 + m; };
    const sched = d => S.schedule[d] || null;

    // Gộp các ngày liền nhau có cùng giờ, ví dụ "Lunes – Viernes"
    const rows = [];
    [1, 2, 3, 4, 5, 6, 0].forEach(d => {
      const key = JSON.stringify(sched(d)), last = rows[rows.length - 1];
      if (last && last.key === key) last.days.push(d);
      else rows.push({ key, days: [d], h: sched(d) });
    });

    // Giờ hiện tại theo múi giờ của tiệm
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: S.timeZone || 'Europe/Madrid' }));
    const today = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();

    table.innerHTML = rows.map(r => {
      const label = r.days.length > 1 ? `${dayName(r.days[0])} – ${dayName(r.days[r.days.length - 1])}` : dayName(r.days[0]);
      const isToday = r.days.includes(today);
      const time = r.h ? `${fmt(r.h[0])} – ${fmt(r.h[1])}` : esc(t('hours.closed'));
      return `<tr${isToday ? ' class="today"' : ''}><th>${esc(label)}${isToday ? ` <small>${esc(t('hours.today'))}</small>` : ''}</th><td>${time}</td></tr>`;
    }).join('');

    const h = sched(today), st = $('#openStatus');
    const open = !!h && mins >= toMin(h[0]) && mins < toMin(h[1]);
    st.className = 'v-status ' + (open ? 'open' : 'closed');
    st.textContent = open ? t('status.open', { t: fmt(h[1]) }) : t('status.closed');
    st.hidden = false;
  }

  /* ---------- Khởi động ---------- */
  applyLang(lang);
  if (store.get(CK) === 'yes') loadMap();
  else if (store.get(CK) === null && banner) banner.hidden = false;
})();
