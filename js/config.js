/*
 * THÔNG TIN TIỆM — chỉ cần sửa file này, website sẽ tự cập nhật ở mọi chỗ.
 * Những dòng ghi "VÍ DỤ" là thông tin tạm, cần thay bằng thông tin thật.
 */
window.SHOP = {
  name: "Nails Trendy",
  phone: "+34 631 339 475",      // hiển thị
  phoneRaw: "+34631339475",       // dùng cho nút gọi (không dấu cách)
  whatsapp: "34631339475",        // số WhatsApp: mã nước + số, không dấu +
  // Nút WhatsApp tròn màu xanh nổi ở góc màn hình
  whatsappFloat: "https://api.whatsapp.com/send/?phone=34631339475&text=%C2%BFC%C3%B3mo+podemos+ayudarte%3F+Por+favor%2C+escr%C3%ADbenos+una+pregunta.%0D%0A%0D%0AHow+can+we+help+you%3F+Please+write+us+a+question.&type=phone_number&app_absent=0",
  address: "Carrer de los Castillejos, 322, 08025 Barcelona",
  mapUrl: "https://www.google.com/maps/place/Nails+Trendy+Sal%C3%B3n+De+U%C3%B1as+Vietnamita/@41.4094264,2.1748764,17z/data=!4m6!3m5!1s0x12a4a36d91945e6b:0x19cdc36a20653622!8m2!3d41.4094264!4d2.1748764!16s%2Fg%2F11wh6xbkbs",
  mapName: "Nails Trendy Salón De Uñas Vietnamita", // tên tiệm trên Google Maps (dùng cho bản đồ)
  googleRating: "4,6",            // điểm Google — cập nhật tay khi thay đổi
  googleReviews: "207",           // số lượt đánh giá Google — cập nhật tay khi thay đổi
  priceRange: "5 – 30 €",         // khoảng giá hiện trên thẻ bản đồ
  // Giờ mở cửa: 0 = Chủ nhật, 1 = Thứ 2, ... 6 = Thứ 7. null = nghỉ.
  schedule: {
    1: ["09:30", "21:00"],
    2: ["09:30", "21:00"],
    3: ["09:30", "21:00"],
    4: ["09:30", "21:00"],
    5: ["09:30", "21:00"],
    6: ["09:30", "20:30"],
    0: null
  },
  timeZone: "Europe/Madrid",      // múi giờ của tiệm (để báo Đang mở cửa / Đã đóng cửa)
  facebook: "https://www.facebook.com/nailstrendybcn",
  twitter: "https://x.com/nailstrendyes",
  instagram: "https://www.instagram.com/nailtrendy.es/",
  tiktok: "https://www.tiktok.com/@nailstrendy.eu",
  instagramFeed: "",              // link JSON feed từ behold.so — để trống thì hiện mẫu minh hoạ
  instagramCount: 8,              // số bài Instagram hiện trong Bộ sưu tập
  // Thông tin pháp lý (dùng trong các trang chính sách ở thư mục legal/)
  legalOwner: "Lee Le",           // CẦN XÁC NHẬN — chủ sở hữu / tên công ty (razón social)
  nif: "B4118921",                // CẦN XÁC NHẬN — NIF/CIF (CIF chuẩn có 9 ký tự, số này mới có 8)
  email: "manager@nailtrendy.com",
};
