/* Điền thông tin tiệm (từ config.js) vào các trang chính sách */
(function () {
  const S = window.SHOP || {};
  document.querySelectorAll('[data-shop]').forEach(el => { el.textContent = S[el.dataset.shop] || ''; });
  const links = {
    tel: 'tel:' + S.phoneRaw,
    email: 'mailto:' + S.email,
    map: S.mapUrl,
    whatsapp: 'https://wa.me/' + S.whatsapp
  };
  document.querySelectorAll('[data-link]').forEach(el => { el.href = links[el.dataset.link] || '#'; });
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Nút "Configurar cookies": xoá lựa chọn cũ để trang chủ hỏi lại
  document.querySelectorAll('[data-cookie-reset]').forEach(b => b.addEventListener('click', () => {
    try { localStorage.removeItem('nt-cookie-consent'); } catch (_) {}
    location.href = '../index.html#mapa';
  }));
})();
