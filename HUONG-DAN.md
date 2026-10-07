# Website Nails Trendy — Hướng dẫn sửa nội dung

Giao diện hiện tại: **Paris Chic** (trắng ngà, đen, vàng champagne). Ngôn ngữ chính là **tiếng Tây Ban Nha**; khách đổi được sang English, Italiano, Français, Deutsch, Português, 中文, 한국어 bằng nút chọn ngôn ngữ trên menu. Tên dịch vụ trong bảng giá và nội dung đánh giá giữ nguyên bản gốc ở mọi ngôn ngữ. Tiệm **không nhận đặt lịch** — khách đến trực tiếp, hỏi thêm qua **WhatsApp**.

## Cấu trúc
```
nails-trendy/
├─ index.html      Nội dung trang (bảng giá, bộ sưu tập, hỏi đáp...)
├─ css/style.css   Màu sắc, bố cục
├─ js/config.js    THÔNG TIN TIỆM — sửa ở đây trước tiên
├─ js/i18n.js      BẢN DỊCH 8 ngôn ngữ — sửa chữ trên web ở đây
├─ js/main.js      Menu, lọc mẫu, giờ mở cửa, đánh giá, bản đồ
├─ js/reviews.js   Đánh giá khách hàng
├─ legal/          4 trang chính sách (tiếng Tây Ban Nha)
├─ images/         Bỏ ảnh thật vào đây
├─ mau-chau-au/    3 mẫu châu Âu (Paris, Nordic, Milano) để tham khảo
└─ mau-cu/         Các mẫu cũ + bản pastel trước đây (ban-pastel/)
```

## Sửa thông tin tiệm
Mở `js/config.js`, sửa số điện thoại, số WhatsApp, địa chỉ, giờ mở cửa (`schedule`), link Instagram/Facebook/X (Twitter).
Các dòng ghi "VÍ DỤ" trong file là thông tin tạm, cần thay bằng thông tin thật.
Mọi chỗ trên website (nút gọi, nút WhatsApp, bảng giờ mở cửa, bản đồ, chân trang) sẽ tự cập nhật.

## Sửa bảng giá
Trong `index.html`, tìm `LISTA DE PRECIOS`. Mỗi dòng có dạng:
```html
<div class="it"><span class="n">Tên dịch vụ<small>Mô tả ngắn</small></span><span class="d"></span><span class="p">25€</span></div>
```
Phần `<small>…</small>` không bắt buộc.

## Thêm ảnh thật
Bỏ ảnh vào `images/` (nên dùng ảnh dọc, tỉ lệ 3:4), rồi trong `index.html`:
- **Khung vòm ở đầu trang**: thêm `<img src="images/ten-anh.jpg" alt="">` vào trong mỗi `.arch`.
- **Bộ sưu tập**: thêm `<img src="images/mau-1.jpg" alt="Bordeaux">` vào trong `<figure>` của mỗi mẫu.

Ảnh sẽ tự phủ kín khung. Có thể xoá các `<div class="nail">` (hình vẽ minh hoạ) khi đã có ảnh.

`data-cat` của mỗi mẫu quyết định nút lọc: `french`, `nude`, `wine` (rượu vang), `art` (nghệ thuật), `bride` (cô dâu). Một mẫu có thể thuộc nhiều loại, cách nhau bằng dấu cách.

## Giờ mở cửa
Sửa `schedule` trong `js/config.js`. Mỗi ngày ghi giờ mở và đóng, ví dụ `6: ["09:30", "20:30"]` (Thứ 7); ngày nghỉ ghi `null`.
Web tự gộp các ngày cùng giờ (Thứ 2 – Thứ 6), đánh dấu "Hôm nay" và báo Đang mở cửa / Hiện đang đóng cửa theo giờ Barcelona.

Nút WhatsApp gửi kèm các mẫu khách đã bấm ♥ trong Bộ sưu tập.

## Đánh giá khách hàng
- Nội dung đánh giá: mở `js/reviews.js`, dán từng đánh giá (copy từ Google Maps) vào danh sách `REVIEWS` theo ví dụ trong file.
- Ảnh khách chụp kèm đánh giá: lưu vào `images/reviews/` rồi ghi tên file vào `photos`.
- Các thẻ mẫu trong `DEMO_REVIEWS` chỉ hiện khi xem trên máy (localhost) và khi `REVIEWS` còn trống.

## Chính sách (thư mục legal/)
- `aviso-legal.html`, `privacidad.html`, `cookies.html`, `terminos.html` — viết bằng tiếng Tây Ban Nha.
- Tên chủ sở hữu, NIF/CIF, email, địa chỉ, điện thoại lấy từ `js/config.js` (`legalOwner`, `nif`, `email`, ...).
- Bản đồ Google chỉ tải khi khách bấm "Aceptar" ở thông báo cookie hoặc "Hiện bản đồ". Link "Configurar cookies" ở chân trang để khách chọn lại.
- Nên nhờ gestor/luật sư xem lại nội dung trước khi dùng chính thức.

## Ngôn ngữ
- Mọi chữ trên trang chủ nằm trong `js/i18n.js`, mỗi ngôn ngữ một khối (es, en, it, fr, de, pt, zh, ko).
- Trong `index.html`, phần tử có `data-i18n="khoá"` sẽ lấy chữ theo khoá đó. Muốn sửa câu nào, tìm khoá rồi sửa trong cả 8 ngôn ngữ.
- Link mở thẳng một ngôn ngữ: thêm `?lang=en` (hoặc fr, de, ...) vào cuối địa chỉ web. Web nhớ ngôn ngữ khách đã chọn.
- Tên thứ trong tuần và thời gian đánh giá ("hace 2 meses", "2 months ago"...) do trình duyệt tự dịch.
- Các trang chính sách trong `legal/` chỉ có tiếng Tây Ban Nha.
