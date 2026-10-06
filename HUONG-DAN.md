# Website Nails Trendy — Hướng dẫn sửa nội dung

Giao diện hiện tại: **Paris Chic** (trắng ngà, đen, vàng champagne). Nội dung web viết bằng **tiếng Tây Ban Nha**, khách đặt lịch qua **WhatsApp**.

## Cấu trúc
```
nails-trendy/
├─ index.html      Nội dung trang (bảng giá, bộ sưu tập, hỏi đáp...)
├─ css/style.css   Màu sắc, bố cục
├─ js/config.js    THÔNG TIN TIỆM — sửa ở đây trước tiên
├─ js/main.js      Menu, lọc mẫu, form đặt lịch
├─ images/         Bỏ ảnh thật vào đây
├─ mau-chau-au/    3 mẫu châu Âu (Paris, Nordic, Milano) để tham khảo
└─ mau-cu/         Các mẫu cũ + bản pastel trước đây (ban-pastel/)
```

## Sửa thông tin tiệm
Mở `js/config.js`, sửa số điện thoại, số WhatsApp, địa chỉ, giờ mở cửa, ngày nghỉ, khung giờ đặt lịch, link Instagram/Facebook/TikTok, dòng chữ ở thanh trên cùng.
Các dòng ghi "VÍ DỤ" trong file là thông tin tạm, cần thay bằng thông tin thật.
Mọi chỗ trên website (nút gọi, nút WhatsApp, chân trang, form) sẽ tự cập nhật.

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

`data-cat` của mỗi mẫu quyết định nút lọc: `french`, `nude`, `wine` (burdeos), `art` (nail art), `bride` (novias). Một mẫu có thể thuộc nhiều loại, cách nhau bằng dấu cách.

## Form đặt lịch
Form kiểm tra thông tin, rồi mở WhatsApp với tin nhắn đặt lịch soạn sẵn gửi tới số của tiệm.
Muốn lịch hẹn tự gửi về Google Sheet / email / Telegram: viết thêm vào hàm `sendBooking` trong `js/main.js`.
