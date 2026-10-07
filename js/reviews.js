/*
 * ĐÁNH GIÁ KHÁCH HÀNG — copy từ Google Maps rồi dán vào danh sách REVIEWS bên dưới.
 *
 * Mỗi đánh giá là một khối { ... }, cách nhau bằng dấu phẩy:
 *   name:   tên người viết
 *   guide:  true nếu người viết là Local Guide (không bắt buộc)
 *   reviews, pics: số đánh giá và số ảnh của người viết trên Google (không bắt buộc)
 *   rating: số sao (1–5)
 *   date:   ngày viết, dạng "năm-tháng-ngày" — web tự ghi "3 ngày trước", "8 tháng trước"…
 *           đánh giá trong 30 ngày gần nhất có nhãn MỚI
 *   text:   nội dung đánh giá (giữ nguyên văn)
 *   photos: ảnh khách chụp (không bắt buộc) — lưu vào images/reviews/ rồi ghi tên file
 *
 * Ví dụ:
 *   {
 *     name: "Laura A.",
 *     guide: true, reviews: 305,
 *     rating: 5,
 *     date: "2026-09-20",
 *     text: "Nội dung đánh giá…",
 *     photos: ["images/reviews/laura-1.jpg"]
 *   },
 */
window.REVIEWS = [
  {
    name: "Reah Rajmangal",
    guide: true, reviews: 7, pics: 4,
    rating: 5,
    date: "2026-08-07", // "2 tháng trước" tính đến 07/10/2026
    text: "This is my go-to nail salon whenever I come to Barcelona. They are very thorough and willing to do designs. They also last quite long. Always satisfied leaving with my new sets!",
    photos: ["images/reviews/reah-1.jpg", "images/reviews/reah-2.jpg"]
  },
  {
    name: "Lisa Oyugi",
    guide: false, reviews: 1, pics: 1,
    rating: 5,
    date: "2026-08-07", // "2 tháng trước"
    text: "Tea did such a great job, loved my first experience her!! 10/10 would recommend",
    photos: ["images/reviews/lisa-1.jpg"]
  },
  {
    name: "Alix Musset",
    guide: true, reviews: 14, pics: 5,
    rating: 5,
    date: "2026-07-07", // "3 tháng trước"
    text: "Second time in this salon and the service is always fantastic. Whenever I’m in Barcelona this is the place to go! Very quick, very detailed, highly recommend",
    photos: ["images/reviews/alix-1.jpg"]
  },
  {
    name: "Myms __",
    guide: true, reviews: 215, pics: 81,
    rating: 5,
    date: "2026-06-07", // "4 tháng trước"
    text: "J’ai jamais vu des ongles aussi bien fait !! Ils sont fins, bien nettoyés à l’arrière, tout est parfait !",
    photos: ["images/reviews/myms-1.jpg"]
  },
  {
    name: "Marypazz",
    guide: true, reviews: 63, pics: 7,
    rating: 5,
    date: "2025-11-07", // "11 tháng trước"
    text: "He ido varias veces y siempre salí muy contenta. Las tratamientos me duran siempre 3 semanas como mínimo.\nEl trato es muy bueno, todo el personal es muy amable y profesional.",
    photos: ["images/reviews/marypazz-1.jpg", "images/reviews/marypazz-2.jpg", "images/reviews/marypazz-3.jpg"]
  },
  {
    name: "Sara Funari",
    guide: false, reviews: 5, pics: 2,
    rating: 5,
    date: "2025-11-07", // "11 tháng trước"
    text: "Ho aspettato a tornare una seconda volta per poter scrivere questa recensione. Sono stata 4 settimane con la loro ricostruzione e nessuna unghia si è mai scheggiata, rotta o rovinata. Sono tornata a fare il refill solo per una questione di ricrescita perché altrimenti sarei potuta stare con quelle unghie ancora una settimana. I ragazzi sono gentilissimi, velocissimi e attenti alle tue richieste. Vi consiglio questo salone al 100%, non vedo l’ora di tornarci ancora e poter scegliere tra i mille mila colori di smalto che hanno 💖",
    photos: ["images/reviews/sara-1.jpg", "images/reviews/sara-2.jpg"]
  }
];

/*
 * THẺ MẪU — chỉ hiện khi xem trên máy (localhost) để thử giao diện,
 * KHÔNG BAO GIỜ hiện trên web thật. Khi REVIEWS có nội dung thì thẻ mẫu cũng tự ẩn.
 */
window.DEMO_REVIEWS = [
  { name: "Khách mẫu A", guide: true, reviews: 25, pics: 12, rating: 5, date: "2026-10-06",
    text: "Đây là thẻ mẫu để xem thử giao diện. Nội dung đánh giá thật của khách sẽ hiện ở đây, đúng nguyên văn như trên Google Maps.",
    photos: ["images/hero-1.jpg", "images/hero-3.jpg"] },
  { name: "Khách mẫu B", guide: false, reviews: 8, rating: 5, date: "2026-08-15",
    text: "Thẻ mẫu thứ hai. Đánh giá dài sẽ được rút gọn còn vài dòng, khách bấm \"Xem thêm\" để đọc hết. Phần này chỉ để thử độ dài: một đánh giá dài thường kể về dịch vụ, thái độ phục vụ, giá cả, độ bền của móng và việc có quay lại hay không.",
    photos: ["images/hero-2.jpg"] },
  { name: "Khách mẫu C", guide: true, reviews: 140, rating: 5, date: "2026-02-01",
    text: "Thẻ mẫu thứ ba, không có ảnh." },
  { name: "Khách mẫu D", guide: false, reviews: 3, rating: 4, date: "2025-11-20",
    text: "Thẻ mẫu thứ tư, 4 sao." }
];
