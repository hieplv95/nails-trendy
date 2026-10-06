(function () {
  const S = window.SHOP || {};
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];

  /* ---------- Điền thông tin tiệm từ config.js ---------- */
  $$('[data-shop]').forEach(el => { el.textContent = S[el.dataset.shop] || ''; });
  const links = {
    tel: 'tel:' + S.phoneRaw,
    zalo: 'https://zalo.me/' + S.phoneRaw,
    map: S.mapUrl,
    facebook: S.facebook,
    instagram: S.instagram,
    tiktok: S.tiktok
  };
  $$('[data-link]').forEach(el => { el.href = links[el.dataset.link] || '#'; });
  $('#year').textContent = new Date().getFullYear();

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
    $$('#gal .g').forEach(g => g.classList.toggle('hide', f !== 'all' && !g.dataset.cat.split(' ').includes(f)));
  });

  /* ---------- Thả tim mẫu nail (lưu trên máy khách) ---------- */
  const KEY = 'nt-likes';
  let likes = [];
  try { likes = JSON.parse(localStorage.getItem(KEY)) || []; } catch (_) {}
  $$('#gal .g').forEach(g => {
    const name = $('b', g).textContent;
    const h = $('.heart', g);
    h.classList.toggle('on', likes.includes(name));
    h.addEventListener('click', () => {
      likes = likes.includes(name) ? likes.filter(x => x !== name) : [...likes, name];
      h.classList.toggle('on', likes.includes(name));
      try { localStorage.setItem(KEY, JSON.stringify(likes)); } catch (_) {}
    });
  });

  /* ---------- Form đặt lịch ---------- */
  const form = $('#bookForm');
  const dateIn = $('#f-date'), timeSel = $('#f-time');
  const pad = n => String(n).padStart(2, '0');
  const today = new Date();
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  dateIn.min = iso(today);
  dateIn.value = iso(today);

  // Khung giờ 9:00 – 20:30, mỗi 30 phút. Hôm nay thì ẩn các giờ đã qua.
  function fillTimes() {
    const isToday = dateIn.value === iso(new Date());
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes() + 30;
    timeSel.innerHTML = '';
    for (let m = 9 * 60; m <= 20 * 60 + 30; m += 30) {
      if (isToday && m < nowMin) continue;
      const t = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
      timeSel.add(new Option(t, t));
    }
    if (!timeSel.options.length) timeSel.add(new Option('Hết giờ hôm nay — chọn ngày khác', ''));
  }
  dateIn.addEventListener('change', fillTimes);
  fillTimes();

  const setErr = (input, bad) => input.closest('.field').classList.toggle('err', bad);
  $$('input', form).forEach(i => i.addEventListener('input', () => setErr(i, false)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const phone = form.phone.value.replace(/[\s.]/g, '');
    const okName = name.length >= 2;
    const okPhone = /^(\+?84|0)\d{9}$/.test(phone);
    const okDate = !!dateIn.value && !!timeSel.value;
    setErr(form.elements.name, !okName);
    setErr(form.phone, !okPhone);
    setErr(dateIn, !okDate);
    if (!okName || !okPhone || !okDate) return;

    const svcs = $$('input[name=svc]:checked', form).map(i => i.value).join(', ') || 'Chưa chọn';
    const [y, mo, d] = dateIn.value.split('-');
    const booking = {
      name, phone, services: svcs,
      date: `${d}/${mo}/${y}`, time: timeSel.value,
      note: form.note.value.trim(),
      liked: likes.join(', ')
    };
    showSummary(booking);
    sendBooking(booking);
  });

  /*
   * Gửi lịch hẹn về tiệm. Hiện CHƯA kết nối nơi nhận nên khách được hướng dẫn
   * gửi tóm tắt qua Zalo. Khi có Google Sheet / email / bot Telegram, thêm lệnh gửi ở đây.
   */
  function sendBooking(booking) {
    // fetch('URL_NHAN_LICH', { method: 'POST', body: JSON.stringify(booking) });
  }

  const modal = $('#modal');
  let summaryText = '';
  function showSummary(b) {
    summaryText =
      `Đặt lịch ${S.name}\n` +
      `Tên: ${b.name}\nSĐT: ${b.phone}\nDịch vụ: ${b.services}\n` +
      `Thời gian: ${b.time} ngày ${b.date}` +
      (b.liked ? `\nMẫu thích: ${b.liked}` : '') +
      (b.note ? `\nGhi chú: ${b.note}` : '');
    $('#m-sum').innerText = summaryText;
    modal.classList.add('show');
    try { navigator.clipboard.writeText(summaryText); } catch (_) {}
  }
  $('a', modal).addEventListener('click', () => {
    try { navigator.clipboard.writeText(summaryText); } catch (_) {}
  });
  $('#m-close').addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('show'); });
})();
