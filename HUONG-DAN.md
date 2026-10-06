# Website Nails Trendy — Hướng dẫn sửa nội dung

Giao diện hiện tại: **Paris Chic** (trắng ngà, đen, vàng champagne).

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
Mở `js/config.js`, sửa số điện thoại, địa chỉ, giờ mở cửa, link Facebook/Instagram/TikTok, dòng khuyến mãi (hiện ở thanh trên cùng).
Mọi chỗ trên website (nút gọi, nút Zalo, chân trang, form) sẽ tự cập nhật.

## Sửa bảng giá
Trong `index.html`, tìm `BẢNG GIÁ`. Mỗi dòng có dạng:
```html
<div class="it"><span class="n">Tên dịch vụ<small>Mô tả ngắn</small></span><span class="d"></span><span class="p">150.000đ</span></div>
```
Phần `<small>…</small>` không bắt buộc.

## Thêm ảnh thật
Bỏ ảnh vào `images/` (nên dùng ảnh dọc, tỉ lệ 3:4), rồi trong `index.html`:
- **Khung vòm ở đầu trang**: thêm `<img src="images/ten-anh.jpg" alt="">` vào trong mỗi `.arch`.
- **Bộ sưu tập**: thêm `<img src="images/mau-1.jpg" alt="Bordeaux">` vào trong `<figure>` của mỗi mẫu.

Ảnh sẽ tự phủ kín khung. Có thể xoá các `<div class="nail">` (hình vẽ minh hoạ) khi đã có ảnh.

`data-cat` của mỗi mẫu quyết định nút lọc: `french`, `nude`, `wine` (rượu vang), `art` (nghệ thuật), `bride` (cô dâu). Một mẫu có thể thuộc nhiều loại, cách nhau bằng dấu cách.

## Form đặt lịch
Hiện form kiểm tra thông tin, sao chép tóm tắt lịch hẹn rồi mời khách gửi qua Zalo của tiệm.
Muốn lịch hẹn tự gửi về Google Sheet / email / Telegram: viết thêm vào hàm `sendBooking` trong `js/main.js`.
