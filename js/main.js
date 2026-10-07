(function () {
  const S = window.SHOP || {};
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const waUrl = text => `https://wa.me/${S.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : '');

  /* ---------- Điền thông tin tiệm từ config.js ---------- */
  $$('[data-shop]').forEach(el => { el.textContent = S[el.dataset.shop] || ''; });
  const links = {
    tel: 'tel:' + S.phoneRaw,
    whatsapp: waUrl('Xin chào, mình muốn đặt lịch làm móng tại Nails Trendy.'),
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

  /* ---------- Lưu mẫu yêu thích (lưu trên máy khách) ---------- */
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
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const toMin = t => { const [h, m] = (t || '0:0').split(':').map(Number); return h * 60 + m; };
  const closed = S.closedDays || [];

  // Ngày mặc định: hôm nay, hoặc ngày mở cửa gần nhất.
  const start = new Date();
  while (closed.includes(start.getDay())) start.setDate(start.getDate() + 1);
  dateIn.min = iso(new Date());
  dateIn.value = iso(start);

  // Khung giờ mỗi 30 phút trong giờ mở cửa. Hôm nay thì ẩn các giờ đã qua.
  function fillTimes() {
    timeSel.innerHTML = '';
    const [y, mo, d] = dateIn.value.split('-').map(Number);
    if (!y) return;
    if (closed.includes(new Date(y, mo - 1, d).getDay())) {
      timeSel.add(new Option('Tiệm nghỉ ngày này — vui lòng chọn ngày khác', ''));
      return;
    }
    const now = new Date();
    const isToday = dateIn.value === iso(now);
    const earliest = now.getHours() * 60 + now.getMinutes() + 30;
    for (let m = toMin(S.openTime || '10:00'); m <= toMin(S.lastTime || '19:30'); m += 30) {
      if (isToday && m < earliest) continue;
      const t = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
      timeSel.add(new Option(t, t));
    }
    if (!timeSel.options.length) timeSel.add(new Option('Hôm nay đã hết giờ — vui lòng chọn ngày khác', ''));
  }
  dateIn.addEventListener('change', fillTimes);
  fillTimes();

  const setErr = (input, bad) => input.closest('.field').classList.toggle('err', bad);
  $$('input', form).forEach(i => i.addEventListener('input', () => setErr(i, false)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.replace(/[\s.\-()]/g, '');
    const okName = name.length >= 2;
    const okPhone = /^(\+|00)?\d{9,15}$/.test(phone);
    const okDate = !!dateIn.value && !!timeSel.value;
    setErr(form.elements.name, !okName);
    setErr(form.elements.phone, !okPhone);
    setErr(dateIn, !okDate);
    if (!okName || !okPhone || !okDate) return;

    const [y, mo, d] = dateIn.value.split('-');
    const booking = {
      name, phone,
      services: $$('input[name=svc]:checked', form).map(i => i.value).join(', ') || 'Chưa chọn',
      date: `${d}/${mo}/${y}`, time: timeSel.value,
      note: form.elements.note.value.trim(),
      liked: likes.join(', ')
    };
    showSummary(booking);
    sendBooking(booking);
  });

  /*
   * Gửi lịch hẹn về tiệm tự động. Hiện CHƯA kết nối nơi nhận — khách gửi lịch qua WhatsApp.
   * Khi có Google Sheet / email / bot Telegram, thêm lệnh gửi ở đây.
   */
  function sendBooking(booking) {
    // fetch('URL_NHAN_LICH', { method: 'POST', body: JSON.stringify(booking) });
  }

  const modal = $('#modal'), waBtn = $('#m-wa');
  function showSummary(b) {
    const text =
      `Xin chào, mình muốn đặt lịch tại ${S.name}:\n` +
      `Tên: ${b.name}\nSĐT: ${b.phone}\nDịch vụ: ${b.services}\n` +
      `Thời gian: ${b.time} ngày ${b.date}` +
      (b.liked ? `\nMẫu yêu thích: ${b.liked}` : '') +
      (b.note ? `\nGhi chú: ${b.note}` : '');
    $('#m-sum').innerText = text;
    waBtn.href = waUrl(text);
    modal.classList.add('show');
    waBtn.focus();
  }
  const close = () => modal.classList.remove('show');
  $('#m-close').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
