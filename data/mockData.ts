import { LibraryItem } from '../services/contentService'; // Thay đường dẫn nếu cần


export interface EthnicGroup {
  name: string;
  location: string;
  population: number;
  coords: [number, number];
  description: string;
  heritage: string;
  img: string;
}
export const ethnicData = [
  { name: "Kinh", location: "TP. Hà Nội", population: 82085826, coords: [21.0285, 105.8542], description: "Dân tộc đa số...", heritage: "Gốm Bát Tràng...", img: "/pictures-54dantoc/kinh.jpg" },
  { name: "Kinh", location: "TP. Hà Nội", population: 82085826, coords: [21.0285, 105.8542], description: "Dân tộc đa số, giữ vai trò chủ đạo trong việc xây dựng và bảo vệ đất nước Việt Nam.", heritage: "Gốm Bát Tràng, Tranh Đông Hồ, Nón lá Huế.", img: "/pictures-54dantoc/kinh.jpg" },
  { name: "Tày", location: "Tỉnh Lạng Sơn", population: 1845492, coords: [21.85, 106.76], description: "Nổi tiếng với hát Then và đàn Tính huyền thoại, cư trú chủ yếu vùng núi phía Bắc.", heritage: "Hát Then, Đàn tính, Vải chàm.", img: "/pictures-54dantoc/tay.jpg" },
  { name: "Thái", location: "Tỉnh Sơn La", population: 1820902, coords: [21.32, 103.92], description: "Chủ nhân của các điệu xòe tinh tế và trang phục khăn Piêu độc nhất vô nhị.", heritage: "Múa Xòe, Khăn Piêu, Nhà sàn.", img: "/pictures-54dantoc/thai.jpg" },
  { name: "Mường", location: "Tỉnh Phú Thọ", population: 1452095, coords: [20.81, 105.33], description: "Chủ nhân văn hóa Cồng chiêng và bộ sử thi vĩ đại Đẻ đất đẻ nước.", heritage: "Chiêng Mường, Thổ cẩm, Gùi tre.", img: "/pictures-54dantoc/muong.jpg" },
  { name: "H'Mông", location: "Tỉnh Tuyên Quang", population: 1393547, coords: [22.82, 104.98], description: "Sống trên những đỉnh núi cao mây phủ, giữ gìn nghề dệt lanh và lễ hội Gầu Tào.", heritage: "Lễ hội Gầu Tào, Vải lanh nhuộm chàm.", img: "/pictures-54dantoc/hmong.jpg" },
  { name: "Khmer", location: "TP. Cần Thơ", population: 1319652, coords: [9.6, 105.97], description: "Văn hóa gắn liền với Phật giáo Nam tông và các ngôi chùa tháp rực rỡ vàng son.", heritage: "Khăn Krama, Tượng gỗ Phật giáo, Đua ghe Ngo.", img: "/pictures-54dantoc/khmer.jpg" },
  { name: "Nùng", location: "Tỉnh Cao Bằng", population: 1083298, coords: [22.67, 106.26], description: "Giỏi nghề rèn đúc thủ công và có các làn điệu Sli thắm đượm tình người.", heritage: "Vải chàm, Rổ tre, Khăn thêu.", img: "/pictures-54dantoc/nung.jpg" },
  { name: "Dao", location: "Tỉnh Lào Cai", population: 891151, coords: [22.48, 103.97], description: "Nổi tiếng với các nghi lễ Cấp sắc linh thiêng và trang phục thêu cầu kỳ.", heritage: "Khăn đỏ thêu, Áo chàm thêu tay, Trang sức bạc.", img: "/pictures-54dantoc/dao.jpg" },
  { name: "Hoa", location: "TP. Hồ Chí Minh", population: 749466, coords: [10.76, 106.66], description: "Cộng đồng năng động, giữ gìn nghề thủ công truyền thống và ẩm thực đặc sắc.", heritage: "Đèn lồng, Tranh thư pháp, Gốm sứ.", img: "/pictures-54dantoc/hoa.jpg" },
  { name: "Gia Rai", location: "Tỉnh Gia Lai", population: 513930, coords: [13.98, 108.0], description: "Dân tộc đông nhất Tây Nguyên với truyền thống tượng gỗ nhà mồ độc đáo.", heritage: "Tượng nhà mồ, Chiêng, Thổ cẩm.", img: "/pictures-54dantoc/gia-rai.jpg" },
  { name: "Ê Đê", location: "Tỉnh Đắk Lắk", population: 398671, coords: [12.66, 108.03], description: "Chủ nhân của sử thi Khan và những ngôi nhà dài mẫu hệ huyền thoại.", heritage: "Gùi mây, Chiêng, Thổ cẩm.", img: "/pictures-54dantoc/e-de.webp" },
  { name: "Ba Na", location: "Tỉnh Quảng Ngãi", population: 286910, coords: [14.35, 108.0], description: "Sống trong những nhà Rông vút cao, giỏi chế tác nhạc cụ tre nứa.", heritage: "Nhà rông, Dệt thổ cẩm, Nhạc cụ tre.", img: "/pictures-54dantoc/bana.jpg" },
  { name: "Xơ Đăng", location: "Tỉnh Quảng Ngãi", population: 212277, coords: [14.65, 107.9], description: "Nổi tiếng với điệu múa cồng chiêng và nghề rèn đặc sắc.", heritage: "Thổ cẩm, Gùi, Khèn tre.", img: "/pictures-54dantoc/xo-dang.jpg" },
  { name: "Sán Chay", location: "Tỉnh Thái Nguyên", population: 201398, coords: [21.59, 105.84], description: "Sở hữu các điệu múa Tắc sình độc nhất vô nhị vùng trung du.", heritage: "Áo chàm, Rổ mây, Tranh dân gian.", img: "/pictures-54dantoc/san-chay.jpg" },
  { name: "Cơ Ho", location: "Tỉnh Lâm Đồng", population: 200800, coords: [11.5, 108.1], description: "Cư dân lâu đời của cao nguyên Lâm Viên, giỏi dệt thổ cẩm.", heritage: "Gùi mây, Dệt vải, Nhạc cụ tre.", img: "/pictures-54dantoc/co-ho.webp" },
  { name: "Chăm", location: "Tỉnh Khánh Hoà", population: 178948, coords: [11.56, 108.99], description: "Giữ gìn tinh hoa gốm Bàu Trúc và dệt thổ cẩm Mỹ Nghiệp rực rỡ.", heritage: "Gốm Bàu Trúc, Dệt Mỹ Nghiệp.", img: "/pictures-54dantoc/cham.jpg" },
  { name: "Sán Dìu", location: "Tỉnh Phú Thọ", population: 183008, coords: [21.3, 105.6], description: "Sống vùng trung du, giữ gìn lối hát Soọng cô thắm đượm tình người.", heritage: "Trang phục truyền thống, Quạt giấy.", img: "/pictures-54dantoc/san-diu.jpg" },
  { name: "Hrê", location: "Tỉnh Quảng Ngãi", population: 149460, coords: [15.1, 108.6], description: "Giỏi canh tác lúa nước và làm các loại nhạc cụ gõ bằng tre nứa.", heritage: "Gùi mây, Dệt vải, Nhạc cụ tre.", img: "/pictures-54dantoc/hre.jpg" },
  { name: "Ra Glai", location: "Tỉnh Khánh Hoà", population: 146613, coords: [11.8, 108.7], description: "Chủ nhân của Đàn Đá và đàn Chapi huyền thoại vùng Nam Trung Bộ.", heritage: "Đàn Chapi, Vải dệt, Rổ tre.", img: "/pictures-54dantoc/ra-glai.jpg" },
  { name: "M'Nông", location: "Tỉnh Lâm Đồng", population: 127334, coords: [12.0, 107.6], description: "Nổi tiếng với nghề săn bắt và thuần dưỡng voi rừng vĩ đại.", heritage: "Gùi tre, Chiêng, Dệt vải.", img: "/pictures-54dantoc/mnong.jpg" },
  { name: "Xtiêng", location: "Tỉnh Đồng Nai", population: 100752, coords: [11.7, 106.8], description: "Sống vùng biên giới, giữ nghề dệt và rèn thủ công truyền thống.", heritage: "Gùi, Thổ cẩm, Trống đất.", img: "/pictures-54dantoc/xtieng.jpg" },
  { name: "Khơ Mú", location: "Tỉnh Điện Biên", population: 90612, coords: [21.5, 103.1], description: "Giàu truyền thống dân ca và các điệu múa sạp rộn ràng.", heritage: "Múa sạp, Gùi, Thổ cẩm.", img: "/pictures-54dantoc/kho-mu.jpg" },
  { name: "Bru-Vân Kiều", location: "Tỉnh Quảng Trị", population: 94598, coords: [16.6, 106.8], description: "Sống dọc dãy Trường Sơn, nổi tiếng với nhạc cụ khèn bè.", heritage: "Gùi, Vải dệt, Sáo tre.", img: "/pictures-54dantoc/bru-van-kieu.jpg" },
  { name: "Thổ", location: "Tỉnh Nghệ An", population: 91430, coords: [19.2, 105.2], description: "Dân tộc có truyền thống canh tác lúa nước và nghề dệt gai lâu đời.", heritage: "Võng gai, Cồng chiêng, Dân ca.", img: "/pictures-54dantoc/tho.jpg" },
  { name: "Giáy", location: "Tỉnh Lào Cai", population: 67989, coords: [22.4, 103.8], description: "Văn hóa ẩm thực phong phú và trang phục nữ giới rực rỡ sắc màu.", heritage: "Bánh chưng gù, Múa quạt, Trang phục nữ.", img: "/pictures-54dantoc/giay.jpg" },
  { name: "Cơ Tu", location: "TP. Đà Nẵng", population: 74172, coords: [15.9, 107.8], description: "Nghệ thuật tạc tượng gỗ và dệt thổ cẩm cườm đặc sắc.", heritage: "Tượng gỗ, Thổ cẩm, Gùi mây.", img: "/pictures-54dantoc/co-tu.jpg" },
  { name: "Giẻ Triêng", location: "Tỉnh Quảng Ngãi", population: 63322, coords: [15.2, 107.7], description: "Cộng đồng giữ gìn tốt các điệu múa xoang truyền thống.", heritage: "Thổ cẩm, Nhạc cụ tre, Giỏ mây.", img: "/pictures-54dantoc/gie-trieng.jpg" },
  { name: "Mạ", location: "Tỉnh Lâm Đồng", population: 50322, coords: [11.6, 107.8], description: "Cư dân cao nguyên giữ nghề dệt vải truyền thống lâu đời.", heritage: "Gùi mây, Dệt vải, Nhạc cụ tre.", img: "/pictures-54dantoc/ma.jpg" },
  { name: "Kháng", location: "Tỉnh Sơn La", population: 16180, coords: [21.6, 103.5], description: "Gắn bó với nghề làm thuyền độc mộc và các điệu múa sạp.", heritage: "Thuyền độc mộc, Múa sạp, Gùi.", img: "/pictures-54dantoc/khang.jpg" },
  { name: "Co", location: "Tỉnh Quảng Ngãi", population: 40458, coords: [14.8, 108.4], description: "Gắn bó mật thiết với cây quế và văn hóa cồng chiêng vùng núi.", heritage: "Dệt vải, Giỏ tre, Khèn.", img: "/pictures-54dantoc/co.jpg" },
  { name: "Tà Ôi", location: "TP. Huế", population: 52356, coords: [16.2, 107.2], description: "Chủ nhân của nghề dệt vải Zèng - Di sản văn hóa quốc gia.", heritage: "Vải zèng, Trang sức hạt, Gùi.", img: "/pictures-54dantoc/ta-oi.jpg" },
  { name: "Chơ Ro", location: "Tỉnh Đồng Nai", population: 29520, coords: [10.8, 107.1], description: "Dân tộc bản địa lâu đời nhất miền Đông Nam Bộ.", heritage: "Gùi, Dệt vải, Sáo tre.", img: "/pictures-54dantoc/cho-ro.jpg" },
  { name: "Xinh Mun", location: "Tỉnh Sơn La", population: 29503, coords: [21.1, 104.2], description: "Cư dân miền núi phía Bắc có tục nhuộm răng đen và múa sạp.", heritage: "Gùi, Thổ cẩm, Nhạc cụ.", img: "/pictures-54dantoc/xinh-mun.jpg" },
  { name: "Hà Nhì", location: "Tỉnh Lai Châu", population: 25539, coords: [22.6, 102.6], description: "Nhà tường trình đất dày và trang phục thêu độc đáo bậc nhất.", heritage: "Trang phục thêu, Giỏ tre.", img: "/pictures-54dantoc/ha-nhi.webp" },
  { name: "Chu Ru", location: "Tỉnh Lâm Đồng", population: 23242, coords: [11.7, 108.2], description: "Sở hữu nghề đúc đồng và làm gốm thủ công gia truyền.", heritage: "Gốm thủ công, Dệt vải, Gùi.", img: "/pictures-54dantoc/chu-ru.jpg" },
  { name: "Lào", location: "Tỉnh Điện Biên", population: 17532, coords: [21.4, 102.9], description: "Giỏi nghề dệt vải và sở hữu chữ viết truyền thống riêng biệt.", heritage: "Khăn dệt, Giỏ tre, Đồ bạc.", img: "/pictures-54dantoc/lao.jpg" },
  { name: "La Chí", location: "Tỉnh Tuyên Quang", population: 15126, coords: [22.7, 104.6], description: "Những kỹ sư ruộng bậc thang tài ba vùng cao.", heritage: "Váy thổ cẩm, Gùi, Trang sức.", img: "/pictures-54dantoc/la-chi.png" },
  { name: "La Ha", location: "Tỉnh Sơn La", population: 10157, coords: [21.7, 103.7], description: "Dân tộc nông nghiệp lâu đời, giỏi đan lát thủ công mỹ nghệ.", heritage: "Dệt vải, Rổ tre, Nhạc cụ.", img: "/pictures-54dantoc/la-ha.jpg" },
  { name: "Phù Lá", location: "Tỉnh Lào Cai", population: 12435, coords: [22.7, 104.1], description: "Trang phục thêu tay đặc sắc và vô cùng tinh tế vùng núi cao.", heritage: "Váy thêu, Gùi, Trang sức bạc.", img: "/pictures-54dantoc/phu-la.jpg" },
  { name: "La Hủ", location: "Tỉnh Lai Châu", population: 12113, coords: [22.4, 102.7], description: "Gắn bó mật thiết với núi rừng Hoàng Liên Sơn hùng vĩ.", heritage: "Trang phục thêu, Gùi, Trang sức.", img: "/pictures-54dantoc/la-hu.jpg" },
  { name: "Lự", location: "Tỉnh Lai Châu", population: 6757, coords: [22.2, 103.2], description: "Phụ nữ có tục nhuộm răng đen và dệt vải thêu hoa văn tinh xảo.", heritage: "Khăn thêu, Dệt vải, Gùi.", img: "/pictures-54dantoc/lu.jpg" },
  { name: "Lô Lô", location: "Tỉnh Tuyên Quang", population: 4827, coords: [23.2, 105.4], description: "Chủ nhân trống đồng cổ và trang phục thêu ghép vải cầu kỳ.", heritage: "Trang phục thêu, Trống đồng nhỏ.", img: "/pictures-54dantoc/lo-lo.jpg" },
  { name: "Chứt", location: "Tỉnh Quảng Trị", population: 7513, coords: [17.8, 105.9], description: "Lưu giữ lối sống hang động sơ khai vô cùng quý giá.", heritage: "Gùi mây, Dệt vải, Nhạc cụ tre.", img: "/pictures-54dantoc/chut.jpg" },
  { name: "Mảng", location: "Tỉnh Lai Châu", population: 4650, coords: [22.3, 103.0], description: "Sống ven sông Đà, giỏi nghề sông nước và đánh bắt cá.", heritage: "Gùi, Rổ tre, Vải dệt.", img: "/pictures-54dantoc/mang.jpg" },
  { name: "Pà Thẻn", location: "Tỉnh Tuyên Quang", population: 8248, coords: [22.5, 105.0], description: "Nổi tiếng với lễ hội Nhảy lửa đầy kịch tính và huyền bí.", heritage: "Váy đỏ thêu, Trang sức, Khăn đội đầu.", img: "/pictures-54dantoc/pa-then.jpg" },
  { name: "Cơ Lao", location: "Tỉnh Tuyên Quang", population: 4003, coords: [23.0, 105.1], description: "Sống trên các hốc đá tai mèo, giỏi nghề thợ rèn và đan lát.", heritage: "Yên ngựa, Dao rèn, Tục cúng thần rừng.", img: "/pictures-54dantoc/co-lao.jpg" },
  { name: "Cống", location: "Tỉnh Lai Châu", population: 2729, coords: [22.3, 102.8], description: "Dân tộc ít người gìn giữ lễ hội hoa mào gà độc đáo.", heritage: "Lễ hội hoa mào gà, Gùi mây, Canh tác nương.", img: "/pictures-54dantoc/cong.jpg" },
  { name: "Bố Y", location: "Tỉnh Lào Cai", population: 3232, coords: [22.9, 104.9], description: "Nổi tiếng với trang phục thêu hoa văn tinh tế và đồ trang sức bạc.", heritage: "Trang phục thêu, Trang sức bạc, Lễ hội.", img: "/pictures-54dantoc/bo-y.webp" },
  { name: "Si La", location: "Tỉnh Lai Châu", population: 909, coords: [22.5, 102.6], description: "Cư dân biên giới với tục nhuộm răng đen và trang phục đính bạc.", heritage: "Trang phục đính bạc, Tục nhuộm răng, Hát giao duyên.", img: "/pictures-54dantoc/si-la.jpg" },
  { name: "Pu Péo", location: "Tỉnh Tuyên Quang", population: 903, coords: [23.1, 105.2], description: "Thờ thần rừng thiêng liêng và giữ gìn các khu rừng cấm.", heritage: "Lễ cúng thần rừng, Trống đồng, Trang phục.", img: "/pictures-54dantoc/pu-peo.jpg" },
  { name: "Brâu", location: "Tỉnh Quảng Ngãi", population: 525, coords: [14.7, 107.6], description: "Dân tộc ít người nhất nhì Tây Nguyên với tục cà răng căng tai xưa.", heritage: "Chiêng tha, Cà răng, Nhà rông.", img: "/pictures-54dantoc/brau.jpg" },
  { name: "Ơ Đu", location: "Tỉnh Nghệ An", population: 428, coords: [19.1, 104.4], description: "Dân tộc ít người nhất Việt Nam, đang khôi phục bản sắc văn hóa.", heritage: "Lễ hội tiếng sấm, Trang phục, Ngôn ngữ.", img: "/pictures-54dantoc/o-du.jpg" },
  { name: "Rơ Măm", location: "Tỉnh Quảng Ngãi", population: 639, coords: [14.4, 107.7], description: "Cư trú tại làng Le, nổi tiếng với nghề dệt vải truyền thống.", heritage: "Vải dệt, Lễ bỏ mả, Cồng chiêng.", img: "/pictures-54dantoc/ro-mam.jpg" },
  { name: "Ngái", location: "Tỉnh Thái Nguyên", population: 1649, coords: [21.6, 105.8], description: "Cộng đồng sống rải rác, giỏi nghề làm ruộng và đánh cá.", heritage: "Múa sư tử, Tranh thờ, Lễ hội kỳ yên.", img: "/pictures-54dantoc/ngai.jpg" }
];

export const marketplaceData = [
  // --- 1. BA NA ---
  { e: "BA NA", items: [
    { n: "Gùi mini (Trang trí)", p: "50.000 - 150.000 VNĐ", img: "pictures-sanpham/ba-na/gui-mini-trang-tri.jpg", d: "Phiên bản thu nhỏ của chiếc gùi đại ngàn, được đan tỉ mỉ bởi đôi tay khéo léo của người Ba Na. Nó không chỉ là vật trang trí, mà là lời nhắc nhở về sự cần cù, chịu khó và vẻ đẹp mộc mạc của núi rừng Tây Nguyên." },
    { n: "Gùi múa (Biểu diễn)", p: "250.000 - 450.000 VNĐ", img: "pictures-sanpham/ba-na/gui-mua-bieu-dien.webp", d: "Chiếc gùi nhẹ nhàng, thanh thoát dùng trong các điệu múa xoang truyền thống. Mỗi nhịp gùi đung đưa là một nhịp thở của buôn làng trong ngày hội mùa, cầu mong mưa thuận gió hòa." },
    { n: "Gùi sinh hoạt (Đi rẫy)", p: "500.000 - 800.000 VNĐ", img: "pictures-sanpham/ba-na/gui-sinh-hoat-i-ray.jpg", d: "Người bạn đường thân thiết của phụ nữ Ba Na. Được đan từ mây tre già bền bỉ, chiếc gùi này cõng cả nương rẫy, cõng cả những đứa trẻ lớn lên trên lưng mẹ, thấm đẫm mồ hôi và tình yêu thương." },
    { n: "Gùi hoa văn tinh xảo (Có nắp)", p: "1.200.000 - 2.000.000 VNĐ", img: "pictures-sanpham/ba-na/gui-hoa-van-tinh-xao-co-nap.jpg", d: "Kiệt tác đan lát với hoa văn hình học phức tạp (K'tơh). Đây là vật gia bảo, thường dùng để đựng tư trang quý giá hoặc làm quà sính lễ, thể hiện sự trân trọng và khéo léo tuyệt đỉnh." },
    { n: "Gốm", p: "Từ 150.000 VNĐ trở lên", img: "pictures-sanpham/ba-na/gom.jpg", d: "Được nung lộ thiên bằng rơm rạ và củi, gốm Ba Na mang vẻ đẹp mộc mạc, ám khói thời gian. Mỗi sản phẩm là sự giao hòa ngẫu hứng giữa đất và lửa, không cái nào giống cái nào." },
    { n: "Chiếu", p: "500.000 - 1.500.000 VNĐ", img: "pictures-sanpham/ba-na/chieu.jpg", d: "Tấm chiếu dệt thủ công từ cây lác rừng, êm ái và mát lạnh. Nơi đây chứng kiến bao câu chuyện kể khan bên bếp lửa, là nơi giấc ngủ đại ngàn được vỗ về bình yên." }
  ]},

  // --- 2. BỐ Y ---
  { e: "BỐ Y", items: [
    { n: "Khèn bè", p: "Từ 150.000 VNĐ", img: "pictures-sanpham/bo-y/khen-be.jpg", d: "Âm thanh của khèn bè như tiếng suối chảy, tiếng gió reo. Chàng trai Bố Y gửi gắm tâm tình vào tiếng khèn để gọi bạn tình, tiếng khèn nối liền đôi lứa giữa trập trùng núi đá." },
    { n: "Kèn lá", p: "Miễn phí", img: "pictures-sanpham/bo-y/ken-la.jpg", d: "Chỉ một chiếc lá rừng đơn sơ cũng có thể cất lên điệu nhạc da diết. Đây là nhạc cụ của tâm hồn, của những phút ngẫu hứng giữa thiên nhiên bao la." }
  ]},

  // --- 3. BRÂU ---
  { e: "BRÂU", items: [
    { n: "Gùi nhỏ (Mini/Trang trí)", p: "150.000 – 300.000 VNĐ", img: "pictures-sanpham/brau/gui-nho-mini-trang-tri.jpg", d: "Vật phẩm lưu niệm nhỏ xinh mang hồn cốt người Brâu. Dù nhỏ bé nhưng vẫn giữ nguyên kỹ thuật đan lát tinh xảo, là món quà mang hơi thở đại ngàn về phố thị." },
    { n: "Gùi trung (Thông dụng)", p: "300.000 – 600.000 VNĐ", img: "https://upload.wikimedia.org/wikipedia/commons/c/c9/The_papoose_of_people_Ede.jpg", d: "Vật dụng gắn liền với đời sống hàng ngày, bền bỉ cùng năm tháng. Chiếc gùi theo chân người Brâu lên rẫy, xuống suối, là chứng nhân cho sự cần lao." }, // Giữ ảnh cũ do chưa có ảnh mới
    { n: "Gùi cao cấp (Đan kín họa tiết)", p: "1.200.000 – 1.500.000 VNĐ trở lên", img: "pictures-sanpham/brau/gui-cao-cap-an-kin-hoa-tiet.jpg", d: "Đỉnh cao của nghệ thuật đan lát Brâu. Các nan tre được nhuộm màu tự nhiên, đan cài kín kẽ tạo nên những hoa văn cổ truyền, thể hiện đẳng cấp và khiếu thẩm mỹ của người sở hữu." }
  ]},

  // --- 4. BRU - VÂN KIỀU ---
  { e: "BRU - VÂN KIỀU", items: [
    { n: "Trang phục truyền thống & Thổ cẩm", p: "Từ 1.000.000 VNĐ trở lên", img: "pictures-sanpham/bru-van-kieu/trang-phuc-truyen-thong-tho-cam.jpg", d: "Bộ trang phục rực rỡ sắc màu, đặc biệt là chiếc khăn đội đầu quấn gọn gàng. Từng đường kim mũi chỉ là sự gửi gắm niềm tự hào dân tộc của người Bru - Vân Kiều dưới dãy Trường Sơn." }
  ]},

  // --- 5. CHĂM ---
  { e: "CHĂM", items: [
    { n: "Gốm bàn xoay (Bàu Trúc)", p: "Từ 100.000 VNĐ trở lên", img: "pictures-sanpham/cham/gom-ban-xoay-bau-truc.jpg", d: "Gốm 'nở hoa' trên lửa. Không dùng bàn xoay, người nghệ nhân Chăm đi giật lùi quanh khối đất, gửi gắm nhịp thở và hồn vía vào từng thớ đất sét sông Quao linh thiêng." },
    { n: "Sản phẩm dệt thổ cẩm (Mỹ Nghiệp)", p: "Từ 50.000 VNĐ trở lên", img: "pictures-sanpham/cham/san-pham-det-tho-cam-my-nghiep.png", d: "Mỗi tấm vải là một bức tranh thu nhỏ về vũ trụ quan của người Chăm. Hoa văn thần Shiva, thần Ganesha được dệt nổi tinh tế, kể lại những huyền thoại Champa cổ xưa." }
  ]},

  // --- 6. CHƠ RO ---
  { e: "CHƠ RO", items: [
    { n: "Đàn tre Goong Cla", p: "Từ 350.000 VNĐ", img: "pictures-sanpham/cho-ro/an-tre-goong-cla.jpg", d: "Được làm từ ống tre già, tiếng đàn Goong Cla thánh thót như tiếng suối reo vui. Đây là nhạc cụ kết nối cộng đồng trong những đêm lửa trại bập bùng." },
    { n: "Dàn Chinh (Cồng chiêng)", p: "Từ 2.500.000 VNĐ", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Chi%C3%AAng_%C4%91%E1%BB%93ng.jpg/330px-Chi%C3%AAng_%C4%91%E1%BB%93ng.jpg", d: "Báu vật của buôn làng. Tiếng Chinh vang lên là báo hiệu mùa lễ hội, là cầu nối giữa con người và thần linh (Yang), mang theo khát vọng về cuộc sống ấm no." } // Giữ ảnh cũ
  ]},

  // --- 7. CHU RU ---
  { e: "CHU RU", items: [
    { n: "Gốm K’Răng Gọ (Nghệ nhân Ma Ly)", p: "(Giá tùy sản phẩm)", img: "pictures-sanpham/chu-ru/gom-k-rang-go-nghe-nhan-ma-ly.jpg", d: "Dòng gốm mộc mạc đang được hồi sinh. Mỗi sản phẩm không chỉ là vật dụng mà còn là tâm huyết của nghệ nhân Ma Ly muốn giữ gìn ngọn lửa nghề truyền thống của cha ông." },
    { n: "Gùi mini (Quà tặng)", p: "200.000 – 400.000 VNĐ", img: "pictures-sanpham/chu-ru/gui-mini-qua-tang.jpg", d: "Món quà nhỏ mang ý nghĩa lớn. Chiếc gùi mini gói ghém tình cảm hiếu khách và sự khéo léo của người Chu Ru gửi đến bạn bè phương xa." },
    { n: "Gùi thông dụng", p: "500.000 – 1.000.000 VNĐ", img: "pictures-sanpham/chu-ru/gui-thong-dung.jpg", d: "Vật dụng thiết thân trong mọi nếp nhà Chu Ru. Đan từ tre nứa chọn lọc, chiếc gùi bền bỉ cùng người dân đi qua bao mùa rẫy." },
    { n: "Gùi lễ vật (Gùi cưới tinh xảo)", p: "1.500.000 – 3.000.000 VNĐ", img: "pictures-sanpham/chu-ru/gui-le-vat-gui-cuoi-tinh-xao.JPG", d: "Chiếc gùi đẹp nhất, trang trọng nhất dùng trong ngày cưới. Nó chứa đựng sính lễ và cả lời chúc phúc trăm năm, được đan bằng tất cả tài hoa và sự trân trọng." }
  ]},

  // --- 8. CHỨT ---
  { e: "CHỨT", items: [
    { n: "Đàn Chưrabon (Phổ thông)", p: "500.000 – 900.000 VNĐ", img: "pictures-sanpham/chut/an-churabon-pho-thong.jpg", d: "Nhạc cụ dây độc đáo của người Chứt. Tiếng đàn trầm bổng kể về cuộc sống nơi hang đá xưa kia và khát vọng vươn lên cuộc sống mới." },
    { n: "Đàn Chưrabon (Nghệ nhân chế tác)", p: "1.500.000 – 3.000.000 VNĐ", img: "pictures-sanpham/chut/an-churabon-nghe-nhan-che-tac.jpg", d: "Phiên bản cao cấp được chế tác bởi những nghệ nhân lão luyện. Âm thanh đạt độ chuẩn mực, là báu vật gìn giữ bản sắc văn hóa tộc người." }
  ]},

  // --- 9. CO ---
  { e: "CO", items: [
    { n: "Trang sức cườm", p: "Từ 50.000 VNĐ", img: "pictures-sanpham/co/trang-suc-cuom.jpg", d: "Những chuỗi cườm đá ngũ sắc rực rỡ quấn quanh cổ, quanh eo là niềm tự hào của phụ nữ Co. Nó tượng trưng cho vẻ đẹp, sự giàu có và địa vị trong cộng đồng." }
  ]},

  // --- 10. CƠ HO ---
  { e: "Cơ HO", items: [
    { n: "Sản phẩm đan lát", p: "Từ 80.000 VNĐ", img: "pictures-sanpham/co-ho/san-pham-an-lat.jpg", d: "Từ những sợi mây, sợi tre vô tri, qua bàn tay người Cơ Ho đã trở thành những vật dụng tinh xảo. Mỗi mối đan là sự kiên nhẫn và tình yêu với thiên nhiên." },
    { n: "Thổ cẩm K'Ho", p: "Từ 150.000 VNĐ", img: "pictures-sanpham/co-ho/tho-cam-k-ho.JPG", d: "Sắc màu thổ cẩm K'Ho rực rỡ như hoa rừng. Họa tiết trên vải kể lại những câu chuyện về muông thú, núi rừng và thần linh che chở buôn làng." },
    { n: "Cà phê K'Ho", p: "250.000 – 500.000 VNĐ/kg", img: "pictures-sanpham/co-ho/ca-phe-k-ho.jpeg", d: "Hương vị cà phê Arabica thượng hạng trồng trên đỉnh Langbiang. Mỗi hạt cà phê là kết tinh của đất đỏ bazan, sương mù cao nguyên và mồ hôi người nông dân K'Ho." }
  ]},

  // --- 11. CỜ LAO ---
  { e: "CỜ LAO", items: [
    { n: "Sản phẩm đan lát", p: "Từ 30.000 VNĐ", img: "pictures-sanpham/co-lao/san-pham-an-lat.jpg", d: "Vật dụng đơn sơ nhưng bền bỉ, phản ánh cuộc sống thích nghi với vùng núi đá tai mèo khắc nghiệt của người Cờ Lao." },
    { n: "Thổ cẩm & Trang phục truyền thống", p: "Từ 40.000 VNĐ trở lên", img: "pictures-sanpham/co-lao/tho-cam-trang-phuc-truyen-thong.jpg", d: "Bộ trang phục ghép vải độc đáo, màu sắc hài hòa. Đây là nhận diện văn hóa không thể trộn lẫn của người Cờ Lao giữa cao nguyên đá." }
  ]},

  // --- 12. CƠ TU ---
  { e: "Cơ TU", items: [
    { n: "Sản phẩm đan lát truyền thống", p: "Từ 150.000 VNĐ trở lên", img: "pictures-sanpham/co-tu/san-pham-an-lat-truyen-thong.JPG", d: "Nghệ thuật đan lát của người Cơ Tu đạt trình độ điêu luyện với các hoa văn cườm trắng nổi bật trên nền mây đen, tạo nên vẻ đẹp huyền bí và mạnh mẽ." }
  ]},

  // --- 13. CỐNG ---
  { e: "CỐNG", items: [
    { n: "Chiếu mây loại thường", p: "1.500.000 – 3.000.000 VNĐ", img: "pictures-sanpham/cong/chieu-may-loai-thuong.jpg", d: "Được dệt từ những sợi mây rừng chọn lọc, chiếu mây người Cống nổi tiếng bền đẹp, càng dùng càng bóng, mang lại giấc ngủ ngon lành." },
    { n: "Chiếu mây cao cấp", p: "4.000.000 – 8.000.000 VNĐ", img: "pictures-sanpham/cong/chieu-may-cao-cap.png", d: "Tuyệt phẩm thủ công đòi hỏi hàng tháng trời lao động. Những sợi mây nhỏ nhất, đều nhất được tuyển chọn để dệt nên tấm chiếu mềm mại như lụa, quý giá vô cùng." }
  ]},

  // --- 14. DAO ---
  { e: "DAO", items: [
    { n: "Thuốc tắm người Dao đỏ", p: "30.000 – 150.000 VNĐ", img: "pictures-sanpham/dao/thuoc-tam-nguoi-dao-o.jpg", d: "Bài thuốc bí truyền từ hàng trăm loại lá rừng, giúp hồi phục sức khỏe thần kỳ, đặc biệt cho phụ nữ sau sinh. Ngâm mình trong thùng gỗ pơ mu, mọi mệt mỏi tan biến." },
    { n: "Trang sức Bạc chạm khắc", p: "500.000 – Vài triệu đồng", img: "pictures-sanpham/dao/trang-suc-bac-cham-khac.jpg", d: "Bạc không chỉ là trang sức mà còn là bùa hộ mệnh, là của hồi môn. Nghệ thuật chạm khắc bạc của người Dao đạt đến độ tinh xảo với hoa văn chim muông, hoa lá sống động." },
    { n: "Tranh thờ", p: "Từ 800.000 VNĐ", img: "pictures-sanpham/dao/tranh-tho.jpg", d: "Bộ tranh thờ Đạo giáo huyền bí, thể hiện thế giới tâm linh phong phú của người Dao. Mỗi bức tranh là một câu chuyện về vũ trụ, răn dạy đạo lý làm người." }
  ]},

  // --- 15. Ê ĐÊ ---
  { e: "Ê ĐÊ", items: [
    { n: "Gùi mini/trang trí", p: "140.000 – 300.000 VNĐ", img: "pictures-sanpham/e-e/gui-mini-trang-tri.jpg", d: "Biểu tượng của Tây Nguyên thu nhỏ. Chiếc gùi xinh xắn mang theo hơi thở của đất đỏ bazan về không gian sống của bạn." },
    { n: "Gùi đan thưa (Đi rẫy)", p: "Khoảng 720.000 VNĐ", img: "pictures-sanpham/e-e/gui-an-thua-i-ray.jpeg", d: "Chiếc gùi chuyên dụng để đựng củi, đựng nước. Các mắt đan thưa giúp thoát nước, nhẹ nhàng nhưng chịu lực cực tốt." },
    { n: "Gùi đan kín họa tiết", p: "1.400.000 – 1.500.000 VNĐ", img: "pictures-sanpham/e-e/gui-an-kin-hoa-tiet.jpg", d: "Tác phẩm nghệ thuật trên lưng người phụ nữ Ê Đê. Những hoa văn đen đỏ nổi bật trên nền tre vàng óng ả thể hiện sự khéo léo và thẩm mỹ tinh tế." },
    { n: "Nhạc cụ Bro (Lưu niệm)", p: "300.000 – 600.000 VNĐ", img: "pictures-sanpham/e-e/nhac-cu-bro-luu-niem.jpg", d: "Cây đàn của những chàng trai si tình. Tiếng đàn Bro trầm ấm, mộc mạc như lời tỏ tình e ấp dưới ánh trăng." },
    { n: "Nhạc cụ Bro (Biểu diễn)", p: "1.200.000 – 3.000.000 VNĐ", img: "pictures-sanpham/e-e/nhac-cu-bro-bieu-dien.jpg", d: "Nhạc cụ chuyên nghiệp với âm thanh chuẩn xác, vang vọng. Chế tác từ những quả bầu khô tròn trịa và ống tre già nhất rừng." }
  ]},

  // --- 16. GIA RAI ---
  { e: "GIA RAI", items: [
    { n: "Rượu cần", p: "Từ 300.000 VNĐ trở lên", img: "pictures-sanpham/gia-rai/ruou-can.jpg", d: "Men say của đại ngàn. Rượu cần Gia Rai ủ bằng lá rừng và gạo nương, uống vào không đau đầu mà chỉ thấy lâng lâng tình người, tình đất." }
  ]},

  // --- 17. GIÁY ---
  { e: "GIÁY", items: [
    { n: "Sáo ngang (Náu Vang)", p: "200.000 – 500.000 VNĐ", img: "pictures-sanpham/giay/sao-ngang-nau-vang.jpg", d: "Tiếng sáo vút cao trên đỉnh núi mây mù. Chàng trai Giáy thổi sáo để gửi lòng mình theo gió, tìm bạn tri âm." },
    { n: "Giày thêu tay thủ công", p: "400.000 – 800.000 VNĐ", img: "pictures-sanpham/giay/giay-theu-tay-thu-cong.jpg", d: "Đôi giày vải thêu hoa văn sặc sỡ, nâng niu bàn chân người phụ nữ Giáy. Từng đường kim mũi chỉ là sự kiên nhẫn và tình yêu cái đẹp." }
  ]},

  // --- 18. GIÉ TRIÊNG ---
  { e: "GIÉ TRIÊNG", items: [
    { n: "Gùi", p: "300.000 – 900.000 VNĐ", img: "pictures-sanpham/gie-trieng/gui.jpg", d: "Chiếc gùi của người Gié Triêng có dáng vẻ thanh mảnh, độc đáo. Nó gắn liền với tục 'củi hứa hôn', minh chứng cho sự đảm đang của người con gái." },
    { n: "Đàn Đinh Tút", p: "Từ 300.000 VNĐ", img: "pictures-sanpham/gie-trieng/an-inh-tut.jpg", d: "Loại nhạc cụ tre nứa thổi bằng hơi, âm thanh rộn ràng như tiếng gió đùa qua khe suối, thường được chơi trong các lễ hội cộng đồng." },
    { n: "Ống đựng bằng tre", p: "(Tùy loại)", img: "pictures-sanpham/gie-trieng/ong-ung-bang-tre.jpg", d: "Vật dụng đơn giản nhưng hữu ích, dùng để đựng hạt giống, muối hay cơm lam. Ống tre già bóng loáng, bền bỉ theo thời gian." }
  ]},

  // --- 19. HÀ NHÌ ---
  { e: "HÀ NHÌ", items: [
    { n: "Đàn Hó Tơ", p: "800.000 – 1.800.000 VNĐ", img: "pictures-sanpham/ha-nhi/an-ho-to.JPG", d: "Cây đàn 3 dây với bầu cộng hưởng hình tam giác độc đáo. Tiếng đàn Hó Tơ trầm bổng là người bạn tâm tình của chàng trai Hà Nhì bên bếp lửa hồng." },
    { n: "Mâm mây (Đan thủ công)", p: "2.500.000 – 3.000.000 VNĐ", img: "pictures-sanpham/ha-nhi/mam-may-an-thu-cong.jpg", d: "Chiếc mâm tròn đan bằng mây rừng, vừa là vật dụng ăn uống, vừa là vật cúng tế linh thiêng. Kỹ thuật đan tinh xảo giúp mâm bền chắc qua nhiều thế hệ." }
  ]},

  // --- 20. HOA ---
  { e: "HOA", items: [
    { n: "Bánh bột truyền thống", p: "15.000 – 45.000 VNĐ", img: "pictures-sanpham/hoa/banh-bot-truyen-thong.jpg", d: "Hương vị ngọt ngào của người Hoa. Những chiếc bánh bò, bánh tiêu, bánh pía... không chỉ là món ăn mà còn gói ghém văn hóa ẩm thực nghìn năm." }
  ]},

  // --- 21. H'MÔNG (MÔNG) ---
  { e: "H'MÔNG (MÔNG)", items: [
    { n: "Khèn Mông", p: "400.000 – 2.000.000 VNĐ", img: "pictures-sanpham/h-mong-mong/khen-mong.jpg", d: "Linh hồn của người Mông trên cao nguyên đá. Sống trên đá, chết vùi trong đá, tiếng khèn vẫn vang vọng gọi bạn tình, gọi tổ tiên, mạnh mẽ và da diết khôn nguôi." }
  ]},

  // --- 22. HRÊ ---
  { e: "HRÊ", items: [
    { n: "Cà vạt thổ cẩm", p: "80.000 – 150.000 VNĐ", img: "pictures-sanpham/hre/ca-vat-tho-cam.jpg", d: "Sự kết hợp giữa truyền thống và hiện đại. Họa tiết thổ cẩm Hrê tạo điểm nhấn độc đáo cho trang phục âu phục, mang bản sắc văn hóa vào đời sống đương đại." },
    { n: "Túi xách thổ cẩm", p: "100.000 – 300.000 VNĐ", img: "pictures-sanpham/hre/tui-xach-tho-cam.jpg", d: "Chiếc túi nhỏ xinh dệt từ sợi bông tự nhiên, nhuộm màu rễ cây. Mỗi đường nét hoa văn là một câu chuyện về thiên nhiên núi rừng Quảng Ngãi." },
    { n: "Khăn choàng (K'tu)", p: "150.000 – 350.000 VNĐ", img: "pictures-sanpham/hre/khan-choang-k-tu.jpg", d: "Tấm khăn choàng ấm áp, che chở người Hrê qua mùa gió lạnh. Màu đỏ đen chủ đạo tượng trưng cho lửa và đất đai màu mỡ." },
    { n: "Váy (K'chiu) & Áo nữ", p: "800.000 – 2.000.000 VNĐ", img: "pictures-sanpham/hre/vay-k-chiu-ao-nu.jpeg", d: "Bộ trang phục duyên dáng của phụ nữ Hrê. Sự phối màu tinh tế và kỹ thuật dệt điêu luyện tạo nên vẻ đẹp mặn mà, đằm thắm." }
  ]},

  // --- 23. KHÁNG ---
  { e: "KHÁNG", items: [
    { n: "Ống đựng xôi (Khẩu tuổng)", p: "Từ 80.000 VNĐ", img: "pictures-sanpham/khang/ong-ung-xoi-khau-tuong.webp", d: "Hương nếp nương thơm lừng được ủ ấm trong chiếc 'Khẩu tuổng' đan bằng mây. Vật dụng giữ nhiệt tự nhiên, giữ trọn vị ngon của hạt ngọc trời." },
    { n: "Hòm mây", p: "Từ 350.000 VNĐ", img: "pictures-sanpham/khang/hom-may.jpg", d: "Chiếc vali của người vùng cao. Hòm mây chắc chắn, kín đáo dùng để đựng quần áo, tư trang, theo chân người Kháng trong những chuyến đi xa." },
    { n: "Hưn mạy (Nhạc cụ)", p: "Từ 800.000 VNĐ", img: "pictures-sanpham/khang/hun-may-nhac-cu.jpg", d: "Nhạc cụ độc đáo làm từ ống tre, khi gõ xuống sàn tạo ra âm thanh cộng hưởng trầm hùng, nhịp nhàng cho điệu múa sạp vui tươi." }
  ]},

  // --- 24. KHMER ---
  { e: "KHMER", items: [
    { n: "Gùi nhỏ (Srok - Lưu niệm)", p: "150.000 – 300.000 VNĐ", img: "pictures-sanpham/khmer/gui-nho-srok-luu-niem.jpg", d: "Phiên bản nhỏ của chiếc 'Srok' đựng lúa. Món quà lưu niệm mang đậm nét văn hóa lúa nước của đồng bào Khmer Nam Bộ." },
    { n: "Gùi trung (Phổ biến)", p: "350.000 – 600.000 VNĐ", img: "https://upload.wikimedia.org/wikipedia/commons/c/c9/The_papoose_of_people_Ede.jpg", d: "Vật dụng quen thuộc trên cánh đồng. Chiếc gùi Khmer có dáng bầu bĩnh, đan dày dặn, chứa đựng sự no ấm của mùa màng bội thu." }, // Giữ ảnh cũ
    { n: "Gùi lớn/Tinh xảo", p: "800.000 – 1.500.000 VNĐ", img: "pictures-sanpham/khmer/gui-lon-tinh-xao.gif", d: "Những chiếc gùi được đan bởi nghệ nhân lão làng, hoa văn nổi tinh tế. Đây là niềm tự hào của gia chủ, thường dùng trong các dịp lễ tết quan trọng." }
  ]},

  // --- 25. KHƠ MÚ ---
  { e: "KHƠ MÚ", items: [
    { n: "Nhạc cụ Đao Đao (Phổ thông)", p: "150.000 – 300.000 VNĐ", img: "pictures-sanpham/kho-mu/nhac-cu-ao-ao-pho-thong.jpg", d: "Ống tre tự nhiên, khi vỗ tạo ra âm thanh 'đao đao' vui nhộn. Nhạc cụ đơn giản nhưng mang lại niềm vui bất tận cho trẻ nhỏ và người già." },
    { n: "Nhạc cụ Đao Đao (Nghệ nhân)", p: "400.000 – 600.000 VNĐ", img: "pictures-sanpham/kho-mu/nhac-cu-ao-ao-nghe-nhan.JPG", d: "Được chế tác, căn chỉnh âm thanh kỹ lưỡng. Tiếng 'đao đao' vang, giòn, hòa quyện hoàn hảo trong dàn nhạc dân gian Khơ Mú." }
  ]},

  // --- 26. LA CHÍ ---
  { e: "LA CHÍ", items: [
    { n: "Đan lát", p: "Từ 30.000 VNĐ", img: "pictures-sanpham/la-chi/an-lat.jpg", d: "Sản phẩm mây tre đan bền bỉ, phục vụ đời sống tự cung tự cấp trên vùng cao. Mỗi chiếc giỏ, chiếc rổ là kết quả của sự tỉ mỉ những ngày nông nhàn." },
    { n: "Trang sức", p: "Từ 380.000 VNĐ", img: "pictures-sanpham/la-chi/trang-suc.jpg", d: "Vòng cổ, vòng tay bằng bạc chạm khắc đơn giản nhưng tinh tế. Nó là bùa hộ mệnh, bảo vệ người La Chí khỏi gió độc và tà ma." }
  ]},

  // --- 27. LA HA ---
  { e: "LA HA", items: [
    { n: "Rượu cần (Bình nhỏ 4-5L)", p: "220.000 – 250.000 VNĐ", img: "pictures-sanpham/la-ha/ruou-can-binh-nho-4-5l.jpg", d: "Bình rượu nhỏ gọn cho những cuộc vui đầm ấm. Hương men lá rừng nồng nàn gắn kết tình cảm gia đình, bạn bè." },
    { n: "Rượu cần (Bình trung 6-10L)", p: "300.000 – 480.000 VNĐ", img: "pictures-sanpham/la-ha/ruou-can-binh-trung-6-10l.jpg", d: "Lựa chọn hoàn hảo cho những bữa tiệc đãi khách. Vị rượu ngọt đằm, càng uống càng say lòng người." },
    { n: "Rượu cần (Bình đại 20-30L)", p: "800.000 – 1.300.000 VNĐ", img: "pictures-sanpham/la-ha/ruou-can-binh-ai-20-30l.jpg", d: "Bình rượu khổng lồ cho lễ hội lớn của bản. Cần rượu vít cong mời gọi cả cộng đồng cùng chung vui, say trong tiếng cồng chiêng." }
  ]},

  // --- 28. LA HỦ ---
  { e: "LA HỦ", items: [
    { n: "Sáo Í La La (Phổ thông)", p: "150.000 – 250.000 VNĐ", img: "pictures-sanpham/la-hu/sao-i-la-la-pho-thong.jpg", d: "Tiếng sáo gọi mùa xuân của người La Hủ. Âm thanh trong trẻo như tiếng chim rừng, mang theo ước vọng về một năm mới ấm no." },
    { n: "Sáo Í La La (Chế tác kỹ)", p: "300.000 – 500.000 VNĐ", img: "pictures-sanpham/la-hu/sao-i-la-la-che-tac-ky.jpg", d: "Cây sáo quý được làm từ trúc già, lỗ bấm chính xác. Đây là người bạn tri kỷ của các nghệ nhân, thổi hồn vào những giai điệu núi rừng biên cương." }
  ]},

  // --- 29. LÀO ---
  { e: "LÀO", items: [
    { n: "Mắm cá Padek", p: "60.000 - 120.000 VNĐ", img: "pictures-sanpham/lao/mam-ca-padek.jpg", d: "Gia vị 'linh hồn' trong ẩm thực người Lào. Mắm cá Padek mặn mòi, đậm đà, nêm nếm vào món ăn nào cũng dậy mùi thương nhớ quê hương." },
    { n: "Thìa/Muỗng (từ vỏ bom)", p: "100.000 – 250.000 VNĐ", img: "pictures-sanpham/lao/thia-muong-tu-vo-bom.png", d: "Từ tàn tích chiến tranh, người dân Lào đã tái chế thành vật dụng hòa bình. Chiếc thìa nhôm đúc thủ công mang thông điệp mạnh mẽ về sự hồi sinh từ tro tàn." },
    { n: "Vòng tay (từ vỏ bom)", p: "200.000 – 600.000 VNĐ", img: "pictures-sanpham/lao/vong-tay-tu-vo-bom.png", d: "Vòng tay đúc từ vỏ bom, khắc họa tiết truyền thống. Một món trang sức độc đáo, vừa cá tính vừa mang ý nghĩa lịch sử sâu sắc." },
    { n: "Búp bê voi (Lưu niệm)", p: "30.000 – 700.000 VNĐ", img: "pictures-sanpham/lao/bup-be-voi-luu-niem.png", d: "Những chú voi vải ngộ nghĩnh, biểu tượng của đất nước Triệu Voi. Món quà dễ thương mang lại may mắn và sức mạnh." }
  ]},

  // --- 30. LÔ LÔ ---
  { e: "LÔ LÔ", items: [
    { n: "Sản phẩm thêu", p: "Từ 300.000 VNĐ", img: "pictures-sanpham/lo-lo/san-pham-theu.jpg", d: "Kỹ thuật thêu ghép vải (patchwork) đỉnh cao của người Lô Lô. Những mảng màu rực rỡ được ghép nối tỉ mỉ tạo nên bức tranh trừu tượng đầy mê hoặc." },
    { n: "Trống đồng", p: "Từ 700.000 VNĐ", img: "pictures-sanpham/lo-lo/trong-ong.jpg", d: "Biểu tượng thiêng liêng kết nối trời và đất. Trống đồng Lô Lô là báu vật gia truyền, tiếng trống vang lên trong lễ cúng tổ tiên, cầu mong sự bảo trợ của thần linh." }
  ]},

  // --- 31. LỰ ---
  { e: "LỰ", items: [
    { n: "Túi đeo thổ cẩm", p: "200.000 – 500.000 VNĐ", img: "https://dantra.vn/uploads/san-pham/tho-cam-dan-toc/tui-tho-cam/tui-tho-cam-2.jpeg", d: "Chiếc túi nhỏ duyên dáng với họa tiết quả trám đặc trưng. Phụ kiện hoàn hảo để tôn lên vẻ đẹp mộc mạc mà tinh tế." }, // Giữ ảnh cũ
    { n: "Vải dệt thô", p: "200.000 – 400.000 VNĐ/mét", img: "pictures-sanpham/lu/vai-det-tho.jpg", d: "Chất liệu vải bông tự nhiên, nhuộm chàm thủ công. Vải thô mộc, thoáng mát, mang màu sắc trầm mặc của núi rừng Tây Bắc." },
    { n: "Khăn đội đầu (Pha phong)", p: "300.000 – 600.000 VNĐ", img: "pictures-sanpham/lu/khan-oi-au-pha-phong.jpg", d: "Chiếc khăn thêu hoa văn cầu kỳ, là điểm nhấn quan trọng nhất trên trang phục người phụ nữ Lự, thể hiện sự khéo léo và nết na." },
    { n: "Áo (Xưa)", p: "800.000 – 1.500.000 VNĐ", img: "pictures-sanpham/lu/ao-xua.jpg", d: "Những chiếc áo cổ truyền may theo lối xưa, đính hàng cúc bạc và thêu hoa văn tinh xảo. Một tác phẩm nghệ thuật may mặc gìn giữ hồn cốt dân tộc." },
    { n: "Váy (Sín)", p: "1.500.000 – 3.000.000 VNĐ", img: "pictures-sanpham/lu/vay-sin.jpg", d: "Chiếc váy hai tầng độc đáo với phần chân váy thêu dày đặc hoa văn. Khi bước đi, váy xòe ra như bông hoa rừng đang nở." }
  ]},

  // --- 32. MẠ ---
  { e: "MẠ", items: [
    { n: "Túi xách, ví, vải dệt", p: "50.000 – 300.000 VNĐ", img: "pictures-sanpham/ma/tui-xach-vi-vai-det.jpg", d: "Những phụ kiện nhỏ xinh dệt từ sợi bông, mang hoa văn hình học đặc trưng của người Mạ. Món quà ý nghĩa, mang nét văn hóa đại ngàn." },
    { n: "Gùi mini (Lưu niệm)", p: "150.000 – 200.000 VNĐ", img: "pictures-sanpham/ma/gui-mini-luu-niem.webp", d: "Chiếc gùi nhỏ nhắn, mô phỏng chính xác gùi thật. Một món đồ trang trí độc đáo, gợi nhớ về cuộc sống nương rẫy thanh bình." },
    { n: "Khăn choàng thổ cẩm", p: "250.000 – 500.000 VNĐ", img: "pictures-sanpham/ma/khan-choang-tho-cam.jpg", d: "Tấm khăn dệt dày dặn, ấm áp. Hoa văn trắng nổi bật trên nền chàm đen tạo nên vẻ đẹp sang trọng, cổ điển." },
    { n: "Gùi hoa văn (Gùi đi hội)", p: "500.000 – 800.000 VNĐ", img: "pictures-sanpham/ma/gui-hoa-van-gui-i-hoi.webp", d: "Chiếc gùi đẹp nhất của người con gái Mạ khi đi lễ hội. Nó đựng váy áo đẹp, trang sức và cả niềm vui phơi phới của tuổi trẻ." },
    { n: "Tấm đắp dệt thủ công", p: "800.000 – 5.000.000 VNĐ (Tùy độ tinh xảo)", img: "pictures-sanpham/ma/tam-ap-det-thu-cong.jpg", d: "Tấm chăn (Ui) dệt công phu, là của hồi môn quý giá. Nó che chở giấc ngủ, sưởi ấm gia đình qua những đêm đông lạnh giá trên cao nguyên." }
  ]},

  // --- 33. MẢNG ---
  { e: "MẢNG", items: [
    { n: "Sản phẩm mây tre đan", p: "Từ 150.000 VNĐ trở lên", img: "pictures-sanpham/mang/san-pham-may-tre-an.jpg", d: "Sống ven sông nước, người Mảng đan lát rất giỏi. Các sản phẩm từ mây tre như giỏ cá, nơm, gùi đều rất tinh xảo, bền đẹp, phục vụ đắc lực cho việc đánh bắt và hái lượm." }
  ]},

  // --- 34. M'NÔNG ---
  { e: "M'NÔNG", items: [
    { n: "Trang sức", p: "Từ 50.000 VNĐ", img: "pictures-sanpham/m-nong/trang-suc.jpg", d: "Vòng cổ, vòng tay bằng đồng, bạc, hạt cườm... không chỉ làm đẹp mà còn thể hiện sức mạnh và quyền uy của người M'Nông." },
    { n: "Gùi", p: "Từ 150.000 VNĐ", img: "pictures-sanpham/m-nong/gui.jpeg", d: "Chiếc gùi thân thuộc, gắn bó với người M'Nông như hình với bóng. Gùi theo người lên rẫy, gùi theo người đi săn voi, chứa đựng cả cuộc sống sinh tồn." },
    { n: "Thổ cẩm", p: "Từ 400.000 VNĐ", img: "", d: "Sắc đỏ đen chủ đạo mạnh mẽ. Thổ cẩm M'Nông dày dặn, bền bỉ, mang vẻ đẹp hoang sơ và phóng khoáng như chính con người nơi đây." } // Giữ ảnh cũ
  ]},

  // --- 35. MƯỜNG ---
  { e: "MƯỜNG", items: [
    { n: "Thổ cẩm (Tân Sơn)", p: "Từ 30.000 VNĐ trở lên", img: "pictures-sanpham/muong/tho-cam-tan-son.jpg", d: "Đặc sắc nhất là cạp váy Mường với hoa văn rồng, phượng, hươu, nai... được dệt tỉ mỉ. Đó là cả một thế giới quan thu nhỏ quấn quanh eo người phụ nữ." },
    { n: "Chiêng tiểu (20-30cm)", p: "2.500.000 – 4.500.000 VNĐ", img: "pictures-sanpham/muong/chieng-tieu-20-30cm.jpg" , d: "Chiếc chiêng nhỏ, âm thanh trong trẻo, thường dùng để giữ nhịp hoặc chơi các giai điệu vui tươi trong dàn chiêng Mường." },
    { n: "Chiêng trung (40-55cm)", p: "6.000.000 – 12.000.000 VNĐ", img: "pictures-sanpham/muong/chieng-trung-40-55cm.jpg", d: "Linh hồn của dàn chiêng. Tiếng chiêng trung trầm ấm, vang vọng, kết nối các bè trầm và bổng, tạo nên sự hòa quyện tuyệt vời." },
    { n: "Chiêng đại (>60cm)", p: "15.000.000 – 30.000.000 VNĐ", img: "pictures-sanpham/muong/chieng-ai-60cm.png", d: "Chiếc chiêng lớn nhất, quyền uy nhất. Tiếng chiêng đại rền vang như sấm, thể hiện sức mạnh của nhà Lang và sự phồn thịnh của bản Mường." }
  ]},
  // --- 36. NÙNG ---
  { e: "NÙNG", items: [
    { n: "Hương sạch (Nhang)", p: "5.000 – 10.000 VNĐ/nén", img: "pictures-sanpham/nung/huong-sach-nhang.jpg", d: "Hương làm từ thảo mộc thiên nhiên, không hóa chất. Mùi thơm dịu nhẹ, thanh khiết, dâng lên tổ tiên tấm lòng thành kính nhất." },
    { n: "Sản phẩm vải chàm", p: "Từ 150.000 VNĐ", img: "pictures-sanpham/nung/san-pham-vai-cham.jpg", d: "Màu chàm thâm trầm, bền bỉ như người Nùng. Vải nhuộm thủ công nhiều lần nước chàm, có mùi thơm đặc trưng, càng mặc càng mềm mại." },
    { n: "Chạm bạc", p: "Từ 400.000 VNĐ", img: "https://scov.gov.vn/upload/2005660/20210923/d5aef07799019eaca8e68b7388efef33img_0518.jpg", d: "Nghề chạm bạc Nùng Phản Slin tinh xảo nức tiếng. Từng nét chạm khắc hình hoa lá, chim muông trên bạc trắng tinh khôi thể hiện tài hoa bậc thầy." } // Giữ ảnh cũ
  ]},

  // --- 37. Ơ ĐU ---
  { e: "Ơ ĐU", items: [
    { n: "Rượu cần Ơ Đu", p: "Từ 350.000 VNĐ trở lên", img: "pictures-sanpham/o-u/ruou-can-o-u.jpg", d: "Hương vị đặc biệt của tộc người ít người nhất Việt Nam. Rượu ủ từ men lá rừng bí truyền, uống vào nghe như tiếng sấm đầu mùa gọi sự sống sinh sôi." }
  ]},

  // --- 38. PÀ THẺN ---
  { e: "PÀ THẺN", items: [
    { n: "Sản phẩm dệt thổ cẩm (Ván Chi)", p: "Từ 150.000 VNĐ trở lên", img: "https://baohagiang.vn/file/4028eaa4679b32c401679c0c74382a7e/042024/dua_sac_mau_1_20240417094932.jpg", d: "Sắc đỏ rực rỡ như lửa. Thổ cẩm Pà Thẻn nổi bật với màu đỏ chủ đạo, tượng trưng cho thần Lửa, mang lại may mắn và sức sống mãnh liệt." } // Giữ ảnh cũ
  ]},

  // --- 39. PHÙ LÁ ---
  { e: "PHÙ LÁ", items: [
    { n: "Nhạc cụ \"Cúc kẹ\" (Sáo mũi)", p: "200.000 – 500.000 VNĐ", img: "pictures-sanpham/phu-la/nhac-cu-cuc-ke-sao-mui.jpg", d: "Nhạc cụ độc đáo thổi bằng mũi. Âm thanh Cúc kẹ êm ái, nhẹ nhàng như lời thì thầm tâm sự, chứa đựng nỗi niềm sâu kín của người Phù Lá." }
  ]},

  // --- 40. RA GLAI ---
  { e: "RA GLAI", items: [
    { n: "Đàn Chapi truyền thống", p: "80.000 – 1.000.000 VNĐ", img: "pictures-sanpham/ra-glai/an-chapi-truyen-thong.jpg", d: "'Ai nghèo cũng có cây đàn Chapi'. Cây đàn tre đơn sơ nhưng chứa đựng cả tâm hồn phóng khoáng của người Ra Glai, tiếng đàn như tiếng lòng người nghệ sĩ núi rừng." }
  ]},

  // --- 41. RƠ MĂM ---
  { e: "RƠ MĂM", items: [
    { n: "Gùi mini (Lưu niệm)", p: "150.000 – 250.000 VNĐ", img: "pictures-sanpham/ro-mam/gui-mini-luu-niem.jpg", d: "Phiên bản nhỏ nhắn, đáng yêu của chiếc gùi Rơ Măm. Món quà lưu niệm độc đáo, mang nét văn hóa của một trong những dân tộc ít người nhất Tây Nguyên." },
    { n: "Gùi thô (Lao động)", p: "300.000 – 500.000 VNĐ", img: "https://dantra.vn/uploads/san-pham/tho-cam-dan-toc/gui-dan-toc/gui-dan-toc-6.jpg", d: "Chiếc gùi mộc mạc, bền bỉ. Được đan lát chắc chắn để chịu được sức nặng của lúa, ngô và những chuyến đi rừng dài ngày." }, // Giữ ảnh cũ
    { n: "Gùi hoa văn (Trang trí)", p: "600.000 – 1.200.000 VNĐ", img: "pictures-sanpham/ro-mam/gui-hoa-van-trang-tri.jpg", d: "Tuyệt tác đan lát với kỹ thuật cài nan tạo hoa văn hình học. Chiếc gùi không chỉ là vật dụng mà là niềm kiêu hãnh về sự khéo léo của người Rơ Măm." }
  ]},

  // --- 42. SÁN DÌU ---
  { e: "SÁN DÌU", items: [
    { n: "Trang phục truyền thống phụ nữ", p: "Từ 150.000 VNĐ", img: "pictures-sanpham/san-diu/trang-phuc-truyen-thong-phu-nu.jpg", d: "Chiếc áo dài màu chàm giản dị, kết hợp với váy xòe và khăn đội đầu. Vẻ đẹp đằm thắm, kín đáo của phụ nữ Sán Dìu được tôn lên qua từng nếp vải." }
  ]},

  // --- 43. SI LA ---
  { e: "SI LA", items: [
    { n: "Đàn tính tẩu", p: "800.000 – 1.500.000 VNĐ", img: "pictures-sanpham/si-la/an-tinh-tau.jpg", d: "Cây đàn 2 dây bầu tròn, âm thanh trong trẻo. Tiếng đàn tính tẩu hòa cùng điệu hát giao duyên là nét văn hóa đặc sắc của người Si La nơi biên cương." }
  ]},

  // --- 44. TÀ ÔI ---
  { e: "TÀ ÔI", items: [
    { n: "Sản phẩm dệt từ Zèng (Lưu niệm/Gia dụng)", p: "50.000 – 300.000 VNĐ", img: "pictures-sanpham/ta-oi/san-pham-det-tu-zeng-luu-niem-gia-dung.jpg", d: "Dệt Zèng là di sản văn hóa quốc gia. Những hạt cườm được dệt trực tiếp vào sợi vải tạo nên hoa văn nổi độc đáo, mang vẻ đẹp sang trọng và quý phái." }
  ]},

  // --- 45. TÀY ---
  { e: "TÀY", items: [
    { n: "Miến dong Bình Liêu", p: "Từ 30.000 VNĐ", img: "pictures-sanpham/tay/mien-dong-binh-lieu.webp", d: "Sợi miến dai giòn làm từ củ dong riềng trồng trên núi đá. Hương vị thanh mát, không hóa chất, mang đậm phong vị ẩm thực người Tày vùng biên ải." },
    { n: "Thổ cẩm (Mặt pha)", p: "300.000 – 1.500.000 VNĐ", img: "pictures-sanpham/tay/tho-cam-mat-pha.jpg", d: "Mặt chăn thổ cẩm dệt hoa văn hình quả trám, hình móc câu. Màu sắc hài hòa, trang nhã, là vật dụng không thể thiếu trong ngày cưới của cô gái Tày." },
    { n: "Đàn Tính (Tính Tẩu)", p: "600.000 – 1.500.000 VNĐ", img: "pictures-sanpham/tay/an-tinh-tinh-tau.jpg", d: "'Đàn Tính ba dây'. Cây đàn linh thiêng của các ông Then bà Then, là cầu nối giữa cõi trần và Mường Trời, mang lời cầu phúc an lành cho bản làng." }
  ]},

  // --- 46. THÁI ---
  { e: "THÁI", items: [
    { n: "Đan lát", p: "Từ 30.000 VNĐ", img: "pictures-sanpham/thai/an-lat.jpg", d: "Những chiếc ép khẩu đựng xôi, ớp đựng cá được đan khéo léo từ tre nứa. Vừa tiện dụng vừa mang vẻ đẹp thẩm mỹ dân gian tinh tế." },
    { n: "Thổ cẩm", p: "Từ 50.000 VNĐ", img: "pictures-sanpham/thai/tho-cam.jpg", d: "Nổi tiếng nhất là khăn Piêu thêu tay cầu kỳ. Từng đường chỉ thêu 'luồn rừng' thể hiện sự khéo léo, kiên nhẫn và tình yêu của cô gái Thái gửi gắm vào đó." },
    { n: "Pí (Sáo)", p: "Từ 250.000 VNĐ", img: "pictures-sanpham/thai/pi-sao.jpg", d: "Tiếng Pí nỉ non, da diết như tiếng lòng người đang yêu. Cây sáo trúc đơn sơ nhưng có sức lay động lòng người mãnh liệt." }
  ]},

  // --- 47. THỔ ---
  { e: "THỔ", items: [
    { n: "Xập xèng (Thanh la)", p: "500.000 – 1.200.000 VNĐ", img: "pictures-sanpham/tho/xap-xeng-thanh-la.jpg", d: "Nhịp phách rộn ràng của lễ hội. Tiếng xập xèng hòa cùng tiếng trống, tiếng cồng tạo nên không khí tưng bừng, xua tan mệt nhọc." },
    { n: "Trống (Cái/Con)", p: "2.500.000 – 6.000.000 VNĐ", img: "pictures-sanpham/tho/trong-cai-con.jpg", d: "Trống da trâu bịt kín hai mặt, âm thanh trầm hùng. Tiếng trống Thổ vang lên là báo hiệu mùa lễ hội, là nhịp đập trái tim của cộng đồng." },
    { n: "Chiêng (Cồng)", p: "3.500.000 – 8.000.000 VNĐ", img: "pictures-sanpham/tho/chieng-cong.jpg", d: "Cồng chiêng không chỉ là nhạc cụ mà là vật thiêng. Người Thổ quý chiêng như con, giữ gìn cẩn thận và chỉ mang ra đánh vào những dịp trọng đại." }
  ]},

  // --- 48. XINH MUN ---
  { e: "XINH MUN", items: [
    { n: "Gối đầu (Thêu thủ công)", p: "100.000 – 450.000 VNĐ", img: "pictures-sanpham/xinh-mun/goi-au-theu-thu-cong.jpg", d: "Chiếc gối thêu hoa văn sặc sỡ ở hai đầu. Đây là quà tặng ý nghĩa của cô dâu biếu bố mẹ chồng, thể hiện lòng hiếu thảo và tài nữ công gia chánh." },
    { n: "Khăn đội đầu (Thêu tinh xảo)", p: "150.000 – 600.000 VNĐ", img: "pictures-sanpham/xinh-mun/khan-oi-au-theu-tinh-xao.jpg", d: "Khăn đội đầu thêu hoa văn cây thông, hình thoi... Là điểm nhấn duyên dáng trên mái tóc người phụ nữ Xinh Mun, che chở và làm đẹp cho người đội." }
  ]},

  // --- 49. XƠ ĐĂNG ---
  { e: "XƠ ĐĂNG", items: [
    { n: "Bún gạo đỏ", p: "40.000 – 65.000 VNĐ/kg", img: "pictures-sanpham/xo-ang/bun-gao-o.jpg", d: "Sợi bún dai ngon làm từ gạo lúa rẫy đỏ (gạo huyết rồng). Hương vị đậm đà, giàu dinh dưỡng, mang màu sắc của đất đỏ Tây Nguyên." },
    { n: "Đàn T'rưng", p: "Từ 120.000 VNĐ", img: "pictures-sanpham/xo-ang/an-t-rung.jpg", d: "Dàn nhạc nước chảy. Những ống nứa to nhỏ ghép lại, khi gõ tạo ra âm thanh thánh thót như tiếng suối róc rách, tiếng thác đổ, mang cả âm hưởng đại ngàn vào nhà." },
    { n: "Đồ dùng từ vỏ cây", p: "1.500.000 – 4.000.000 VNĐ", img: "pictures-sanpham/xo-ang/o-dung-tu-vo-cay.jpg", d: "Sản phẩm độc đáo từ vỏ cây rừng đập dập, ngâm bùn. Tấm chăn, chiếc áo vỏ cây gợi nhớ về thuở sơ khai, là minh chứng cho khả năng sáng tạo phi thường của người Xơ Đăng." }
  ]},

  // --- 50. XTIÊNG ---
  { e: "XTIÊNG", items: [
    { n: "Ntố (Nia)", p: "Từ 50.000 VNĐ", img: "pictures-sanpham/xtieng/nto-nia.jpg", d: "Chiếc nia tròn trịa đan bằng tre, dùng để sảy gạo, phơi nông sản. Vật dụng quen thuộc gắn liền với hạt gạo dẻo thơm nuôi sống buôn làng." },
    { n: "Sor (Gùi)", p: "Từ 150.000 VNĐ", img: "pictures-sanpham/xtieng/sor-gui.jpg", d: "Gùi Xtiêng có dáng thon gọn, đáy vuông vững chãi. Là người bạn đồng hành không thể thiếu trong mỗi chuyến đi rừng, đi rẫy của bà con." },
    { n: "Thổ cẩm", p: "Từ 250.000 VNĐ", img: "pictures-sanpham/xtieng/tho-cam.jpg", d: "Nghề dệt thổ cẩm Xtiêng nổi tiếng với các hoa văn mô phỏng thiên nhiên sinh động. Tấm vải bền chắc, màu sắc hài hòa, ấm áp như tình người Bình Phước." }
  ]}
];

export const libraryData: LibraryItem[] = [
  // Nhóm Kinh
// ==========================================
// DỮ LIỆU THƯ VIỆN ĐẦY ĐỦ (KIẾN TRÚC - NGHI LỄ - LỄ HỘI)
// ==========================================
  
  // ==================== KIẾN TRÚC (ARCHITECTURE) ====================
  // Kinh
  {
    id: "arch-kinh-dinh", category: "architecture", ethnic: "Kinh",
    title: "Đình Làng Việt", desc: "Biểu tượng quyền lực làng xã và tâm linh.",
    content: "Đình làng là công trình kiến trúc lớn nhất, quan trọng nhất của làng người Việt ở Bắc Bộ. Đây là nơi thờ Thành Hoàng (vị thần bảo hộ của làng) và cũng là nơi hội họp việc làng, tổ chức lễ hội.\n\nKiến trúc đình thường theo kiểu chữ Nhất, chữ Nhị hoặc chữ Công. Điểm đặc sắc nhất là bộ mái xòe rộng chiếm 2/3 chiều cao đình, các đầu đao cong vút mềm mại như cánh chim. Bên trong là hệ thống cột gỗ lim lớn và các mảng chạm khắc tứ linh (Long, Ly, Quy, Phượng), tứ quý rất tinh xảo.",
    image: "pictures-thuvien/kien-truc/kinh/arch-kinh-dinh.png"
  },
  {
    id: "arch-kinh-chua", category: "architecture",
    ethnic: "Kinh",
    title: "Chùa Bắc Tông",
    desc: "Không gian Phật giáo thanh tịnh.",
    content: "Chùa Việt thường có kiến trúc chữ Tam, chữ Công với tam quan, tiền đường, thượng điện. Điểm nhấn là tháp chuông uy nghiêm và hệ thống tượng Phật sơn son thếp vàng lộng lẫy.",
    image: "pictures-thuvien/kien-truc/kinh/arch-kinh-chua.jpg"
  },
  {
    id: "arch-kinh-nharuong", category: "architecture",
    ethnic: "Kinh",
    title: "Nhà Rường Huế",
    desc: "Tinh hoa kiến trúc gỗ truyền thống.",
    content: "Nhà Rường là loại nhà ở 3 gian 2 chái đặc trưng của quan lại và tầng lớp thượng lưu xưa. Toàn bộ khung nhà bằng gỗ mít hoặc lim, được liên kết bằng mộng, không dùng đinh. Các cột, kèo được chạm trổ cực kỳ tinh vi.",
    image: "pictures-thuvien/kien-truc/kinh/arch-kinh-nharuong.jpg"
  },

  // Nhóm Chăm
  {
    id: "arch-cham-thap", category: "architecture", ethnic: "Chăm",
    title: "Tháp Chăm (Kalan)", desc: "Đỉnh cao kỹ thuật xây gạch không mạch.",
    content: "Kalan là đền thờ các vị thần Hindu (Shiva), tượng trưng cho ngọn núi thần thoại Meru. Đặc điểm nổi bật là kỹ thuật xây gạch mài chập, khít mạch không cần vữa kết dính mà vẫn đứng vững ngàn năm. Trên mặt tường gạch là các phù điêu chạm khắc trực tiếp.",
    image: "pictures-thuvien/kien-truc/cham/arch-cham-thap.jpg"
  },
  {
    id: "arch-cham-nhatuc", category: "architecture", ethnic: "Chăm",
    title: "Nhà Tục", desc: "Ngôi nhà gìn giữ phong tục mẫu hệ.",
    content: "Trong khuôn viên gia đình người Chăm, Nhà Tục là nơi quan trọng nhất, nơi diễn ra các nghi lễ vòng đời và thờ cúng tổ tiên. Nhà thường thấp, kín đáo, thể hiện sự tôn nghiêm.",
    image: "pictures-thuvien/kien-truc/cham/arch-cham-nhatuc.jpg"
  },

  // Nhóm Khmer
  {
    id: 'arch-khmer-chua', category: 'architecture', ethnic: 'Khmer',
    title: 'Chùa Khmer (Vihear)', desc: 'Rực rỡ sắc vàng Phật giáo Nam Tông.',
    content: "Chùa là trung tâm sinh hoạt của phum sóc. Chánh điện (Vihear) là kiến trúc chính, mái nhọn nhiều tầng, trang trí tượng rắn Naga, chim thần Keynor, chằn Yeak. Màu vàng rực rỡ tượng trưng cho sự giác ngộ.",
    image: "pictures-thuvien/kien-truc/khmer/arch-khmer-chua.jpg"
  },

  // Nhóm Tây Nguyên (Gia Rai, Ê Đê, Ba Na...)
  {
    id: 'arch-ede-nhadai', category: 'architecture', ethnic: 'Ê Đê',
    title: 'Nhà Dài', desc: 'Dài như tiếng chiêng ngân.',
    content: "Nhà Dài là nơi sinh sống của đại gia đình mẫu hệ. Nhà làm bằng tre nứa gỗ, sàn cao, có cầu thang đực (cho khách) và cầu thang cái (có hình bầu vú, cho người nhà). Độ dài của nhà thể hiện sự thịnh vượng của dòng họ.",
    image: "pictures-thuvien/kien-truc/e-de/arch-ede-nhadai.jpg"
  },
  {
    id: 'arch-bana-nharong', category: 'architecture', ethnic: 'Ba Na',
    title: 'Nhà Rông', desc: 'Lưỡi rìu vút cao giữa đại ngàn.',
    content: "Nhà Rông là ngôi nhà chung, nơi hội họp, xử kiện và tiếp khách của buôn làng Ba Na, Xơ Đăng. Mái nhà cao vút như lưỡi rìu ngược (có thể cao tới 20m), thể hiện sức mạnh và uy quyền của làng trước thiên nhiên.",
    image: "pictures-thuvien/kien-truc/ba-na/arch-bana-nharong.jpg"
  },
  {
    id: 'arch-giarai-nhamo', category: 'architecture', ethnic: 'Gia Rai',
    title: 'Nhà Mồ', desc: 'Kiến trúc tâm linh và nghệ thuật tạc tượng.',
    content: "Nhà mồ được xây dựng công phu cho người chết trước lễ Bỏ mả. Xung quanh nhà mồ là hàng rào tượng gỗ (tượng người khóc, tượng phồn thực...) thể hiện quan niệm sinh sôi nảy nở.",
    image: "pictures-thuvien/kien-truc/gia-rai/arch-giarai-nhamo.jpg"
  },

  // Nhóm Tây Bắc (Thái, H'Mông...)
  {
    id: 'arch-thai-nhasan', category: 'architecture', ethnic: 'Thái',
    title: 'Nhà Sàn Thái', desc: 'Duyên dáng với Khau Cút trên nóc.',
    content: "Nhà sàn người Thái cao ráo, sạch sẽ. Người Thái Đen có biểu tượng Khau Cút trên nóc nhà hình sừng trâu hoặc cánh hoa sen. Người Thái Trắng có lan can chạy quanh nhà.",
    image: "pictures-thuvien/kien-truc/thai/arch-thai-nhasan.jpg"
  },
  {
    id: 'arch-hmong-trinhtuong', category: 'architecture', ethnic: "H'Mông",
    title: 'Nhà Trình Tường', desc: 'Pháo đài đất ấm áp trên cao nguyên đá.',
    content: "Nhà người Mông làm bằng đất nện dày để chống lại cái lạnh khắc nghiệt của vùng cao. Cột kê trên đá tảng, mái thấp lợp ngói âm dương hoặc ván pơ mu. Xung quanh thường có hàng rào đá xếp chồng không cần chất kết dính.",
    image: "pictures-thuvien/kien-truc/hmong/arch-hmong-trinhtuong.jpg"
  },
  {
    id: 'arch-dao-nhanuasan', category: 'architecture', ethnic: 'Dao',
    title: 'Nhà Nửa Sàn Nửa Đất', desc: 'Thích nghi với địa hình dốc.',
    content: "Do sống ở sườn núi dốc, người Dao (đặc biệt là Dao Khâu) làm nhà một nửa là sàn cột gỗ, một nửa nền đất đắp bằng phẳng. Bàn thờ Bàn Vương luôn được đặt ở vị trí trang trọng nhất.",
    image: "pictures-thuvien/kien-truc/dao/arch-dao-nhanuasan.jpg"
  },
  {
    id: 'arch-hanhi-nhanam', category: 'architecture', ethnic: 'Hà Nhì',
    title: 'Nhà Trình Tường Hình Nấm', desc: 'Vẻ đẹp cổ tích nơi biên cương.',
    content: "Tường đất nện dày tới 40-50cm, mái tranh phủ kín xuống tận tường giống như cây nấm khổng lồ. Kiến trúc này giúp ngôi nhà ấm vào mùa đông và mát vào mùa hè.",
    image: "pictures-thuvien/kien-truc/ha-nhi/arch-hanhi-nhanam.jpg"
  },

  // ==================== NGHI LỄ (RITUALS) ====================
  // Kinh
  {
    id: 'rit-kinh-mau', category: 'ritual', ethnic: 'Kinh',
    title: 'Tín Ngưỡng Thờ Mẫu (Lên Đồng)', desc: 'Di sản văn hóa phi vật thể của nhân loại.',
    content: "Nghi lễ nhập hồn và hầu thánh, thể hiện sự giao tiếp giữa con người và thần linh. Các giá hầu đồng kết hợp âm nhạc chầu văn, trang phục rực rỡ và vũ đạo uyển chuyển. Đây là nghi lễ cầu sức khỏe, tài lộc và may mắn.",
    image: "pictures-thuvien/nghi-le/kinh/tho-mau-len-dong-kinh.webp"
  },
  {
    id: 'rit-kinh-cungto', category: 'ritual', ethnic: 'Kinh',
    title: 'Thờ Cúng Tổ Tiên', desc: 'Đạo lý uống nước nhớ nguồn.',
    content: "Mỗi gia đình người Việt đều có bàn thờ tổ tiên. Nghi lễ cúng giỗ vào ngày mất của người thân là dịp con cháu sum họp, tưởng nhớ công ơn sinh thành dưỡng dục.",
    image: "pictures-thuvien/nghi-le/kinh/tho-cung-to-tien-kinh.jpg"
  },

  // Chăm
  {
    id: 'rit-cham-truongthanh', category: 'ritual', ethnic: 'Chăm',
    title: 'Lễ Trưởng Thành', desc: 'Dấu mốc của thiếu nữ Chăm.',
    content: "Nghi lễ bắt buộc đối với các thiếu nữ Chăm khi đến tuổi dậy thì (khoảng 15-16 tuổi). Chỉ sau nghi lễ này, người con gái mới được công nhận là thành viên chính thức của cộng đồng và được phép lấy chồng.",
    image: "pictures-thuvien/nghi-le/cham/le-truong-thanh-nguoi-cham.jpg"
  },
  {
    id: 'rit-cham-rija', category: 'ritual', ethnic: 'Chăm',
    title: 'Lễ Rija Nưgar', desc: 'Lễ tống ôn, đạp lửa đầu năm.',
    content: "Rija Nưgar là lễ hội mở đầu năm mới, nhằm tẩy uế, xua đuổi những điều xấu xa. Điểm nhấn là điệu múa đạp lửa của thầy Ka-ing, thể hiện sức mạnh xua đuổi tà ma.",
    image: "pictures-thuvien/nghi-le/cham/le-hoi-rija-nagar-nguoi-cham.jpg"
  },

  // Khmer
  {
    id: 'rit-khmer-kathina', category: 'ritual', ethnic: 'Khmer',
    title: 'Lễ Dâng Y Kathina', desc: 'Cầu phước lớn nhất Phật giáo Nam tông.',
    content: "Sau 3 tháng an cư kiết hạ, phật tử tổ chức lễ rước y cà sa dâng lên các nhà sư. Lễ rước trang nghiêm, rực rỡ sắc vàng, thể hiện lòng thành kính với Tam Bảo.",
    image: "pictures-thuvien/nghi-le/khmer/le-dang-y-kathina_khmer.jpg"
  },

  // Dao
  {
    id: 'rit-dao-capsac', category: 'ritual', ethnic: 'Dao',
    title: 'Lễ Cấp Sắc (Quá Tang)', desc: 'Cột mốc trưởng thành của đàn ông Dao.',
    content: "Người đàn ông Dao phải trải qua lễ Cấp Sắc mới được công nhận là người lớn, được đặt tên âm và sau này khi chết mới được về với tổ tiên. Nghi lễ răn dạy đạo đức, kính trọng cha mẹ và sống hướng thiện.",
    image: "pictures-thuvien/nghi-le/dao/le-cap-sac-nguoi-dao.jpg"
  },

  // Tây Nguyên
  {
    id: 'rit-giarai-pothi', category: 'ritual', ethnic: 'Gia Rai',
    title: 'Lễ Bỏ Mả (Pơ Thi)', desc: 'Cuộc chia ly vĩnh viễn bi tráng.',
    content: "Lễ hội lớn nhất Tây Nguyên. Sau nhiều năm nuôi mộ, gia đình làm lễ lớn, dựng nhà mồ đẹp, tạc tượng gỗ để tiễn đưa linh hồn người chết về thế giới bên kia vĩnh viễn. Sau lễ này, người sống không còn thăm nom mộ nữa.",
    image: "pictures-thuvien/nghi-le/gia-rai/le-bo-ma-gia-rai.jpg"
  },
  {
    id: 'rit-bana-damtrau', category: 'ritual', ethnic: 'Ba Na',
    title: 'Lễ Đâm Trâu', desc: 'Hiến sinh tạ ơn thần linh (Yang).',
    content: "Cây nêu thần được dựng lên. Trong tiếng cồng chiêng vang dội, các chàng trai cô gái nhảy múa vòng tròn. Con trâu hiến tế là vật trung gian gửi gắm lời cầu nguyện mưa thuận gió hòa, buôn làng no ấm lên các vị thần.",
    image: "pictures-thuvien/nghi-le/ba-na/le-hoi-dam-trau-ba-na.jpg"
  },
  {
    id: 'rit-ede-bennuoc', category: 'ritual', ethnic: 'Ê Đê',
    title: 'Lễ Cúng Bến Nước', desc: 'Cầu mong nguồn nước sạch dồi dào.',
    content: "Hàng năm sau mùa thu hoạch, buôn làng tổ chức cúng tạ ơn thần Nước. Bến nước được dọn dẹp sạch sẽ, thầy cúng dâng rượu cần cầu mong nguồn nước không bao giờ cạn, dân làng không bị ốm đau.",
    image: "pictures-thuvien/nghi-le/e-de/le-hoi-cung-nuoc-ede.jpg"
  },

  // Các dân tộc khác
  {
    id: 'rit-muong-mo', category: 'ritual', ethnic: 'Mường',
    title: 'Mo Mường', desc: 'Sử thi tang lễ dẫn đường linh hồn.',
    content: "Trong đám tang, ông Mo sẽ đọc (diễn xướng) hàng vạn câu thơ trong bộ sử thi 'Đẻ đất đẻ nước' để kể về nguồn gốc con người và dẫn đường cho linh hồn người chết vượt qua các cửa ải để về Mường Trời.",
    image: "pictures-thuvien/nghi-le/muong/mo-muong-nguoi-muong.jpg"
  },
  {
    id: 'rit-thai-tangcau', category: 'ritual', ethnic: 'Thái',
    title: 'Lễ Tằng Cẩu', desc: 'Nghi thức búi tóc thủy chung.',
    content: "Trước khi về nhà chồng, cô dâu Thái Đen được mẹ chồng hoặc người có uy tín chải tóc và búi ngược lên đỉnh đầu (Tằng cẩu). Từ đây, người phụ nữ chính thức có chồng, búi tóc là biểu tượng của lòng thủy chung son sắt.",
    image: "pictures-thuvien/nghi-le/thai/le-tang-cau-thai.jpg"
  },
  {
    id: 'rit-odu-tiengsam', category: 'ritual', ethnic: 'Ơ Đu',
    title: 'Lễ Tiếng Sấm', desc: 'Đón năm mới theo tiếng sấm đầu mùa.',
    content: "Dân tộc Ơ Đu quan niệm tiếng sấm đầu xuân là dấu hiệu thần linh thức dậy. Khi nghe tiếng sấm, họ mới bắt đầu làm lễ cúng trời đất, giết gà, lợn ăn mừng năm mới.",
    image: "pictures-thuvien/nghi-le/odu/le-tieng-sam-o-du.jpg"
  },
  {
    id: 'rit-lahu-thanrung', category: 'ritual', ethnic: 'La Hủ',
    title: 'Cúng Thần Rừng', desc: 'Xin phép mẹ thiên nhiên.',
    content: "Người La Hủ ('Lá Vàng') sống dựa vào rừng. Vào dịp lễ, họ cúng thần rừng để xin phép săn bắn hái lượm và cầu mong không bị thú dữ làm hại, cây rừng luôn xanh tốt.",
    image: "pictures-thuvien/nghi-le/la-hu/cung-than-rung-la-hu.jpg"
  },
  {
    id: 'rit-chut-laplo', category: 'ritual', ethnic: 'Chứt',
    title: 'Lễ Lấp Lỗ', desc: 'Gieo hạt giống hy vọng.',
    content: "Vào ngày 7/7 âm lịch, người Chứt (Rục, Sách) đào lỗ tra hạt giống xuống đất, sau đó lấp lại và làm lễ cúng thần linh. Nghi thức tượng trưng cho sự sinh sôi nảy nở của cây trồng.",
    image: "pictures-thuvien/nghi-le/chut/le-lap-lo-dan-toc-chut.jpg"
  },
  {
    id: 'rit-cong-hoamaoga', category: 'ritual', ethnic: 'Cống',
    title: 'Lễ Hoa Mào Gà', desc: 'Sắc đỏ may mắn nơi biên cương.',
    content: "Người Cống coi hoa mào gà là biểu tượng của may mắn. Vào Tết cổ truyền (tháng 11), họ hái hoa mào gà về trang trí nhà cửa, cúng tổ tiên và cài lên tóc để cầu bình an.",
    image: "pictures-thuvien/nghi-le/cong/le-hoa-mao-ga-cong.jpg"
  },
  {
    id: 'rit-sila-camban', category: 'ritual', ethnic: 'Si La',
    title: 'Lễ Cấm Bản', desc: 'Không gian thiêng liêng biệt lập.',
    content: "Vào dịp cúng thần bản, người Si La dựng cổng chào, treo ký hiệu cấm người lạ vào bản. Trong thời gian này, nội bất xuất, ngoại bất nhập để đảm bảo sự thanh tịnh cho nghi lễ.",
    image: "pictures-thuvien/nghi-le/si-la/le-cam-ban-si-la.jpg"
  },

  // ==================== LỄ HỘI (FESTIVALS) ====================
  // Kinh
  {
    id: "fes-kinh-tet",
    category: "festival",
    ethnic: "Kinh",
    title: "Tết Nguyên Đán",
    desc: "Lễ hội lớn nhất và thiêng liêng nhất.",
    content: "Tết Nguyên Đán là dịp đoàn viên, sum họp gia đình. Bắt đầu từ lễ cúng ông Công ông Táo (23 tháng Chạp), gói bánh chưng, cúng Giao thừa, hái lộc đầu xuân. Trong 3 ngày Tết, mọi người đi chúc Tết họ hàng, thầy cô, bạn bè.",
    image: "pictures-thuvien/le-hoi/kinh/fes-kinh-tet.jpg"
  },
  {
    id: "fes-kinh-hung",
    category: "festival",
    ethnic: "Kinh",
    title: "Giỗ Tổ Hùng Vương",
    desc: "Tín ngưỡng thờ cúng tổ tiên độc đáo.",
    content: "'Dù ai đi ngược về xuôi, nhớ ngày Giỗ Tổ mùng mười tháng ba'. Lễ hội diễn ra tại đền Hùng (Phú Thọ) để tưởng nhớ 18 đời vua Hùng đã có công dựng nước. Nghi lễ dâng hương, rước kiệu thể hiện đạo lý uống nước nhớ nguồn.",
    image: "pictures-thuvien/le-hoi/kinh/fes-kinh-hung.jpg"
  },
  {
    id: "fes-kinh-giong",
    category: "festival",
    ethnic: "Kinh",
    title: "Hội Gióng",
    desc: "Hào khí chống giặc ngoại xâm.",
    content: "Lễ hội tại đền Sóc và đền Phù Đổng tôn vinh Thánh Gióng - một trong Tứ bất tử. Các màn diễn xướng chiến trận mô phỏng cuộc chiến chống giặc Ân được tổ chức quy mô, hoành tráng.",
    image: "pictures-thuvien/le-hoi/kinh/fes-kinh-giong.jpeg"
  },
  {
    id: "fes-kinh-lim",
    category: "festival",
    ethnic: "Kinh",
    title: "Hội Lim",
    desc: "Câu hát quan họ người ơi người ở.",
    content: "Lễ hội vùng Kinh Bắc với đặc sản là hát Quan họ đối đáp trên thuyền rồng và dưới cửa đình. Các liền anh liền chị trong trang phục mớ ba mớ bảy hát những làn điệu trữ tình.",
    image: "pictures-thuvien/le-hoi/kinh/fes-kinh-lim.jpeg"
  },

  // Khmer
  {
    id: "fes-khmer-chol",
    category: "festival",
    ethnic: "Khmer",
    title: "Chol Chnam Thmay",
    desc: "Tết năm mới, té nước cầu may.",
    content: "Diễn ra vào giữa tháng 4 dương lịch. Người dân đến chùa đắp núi cát (cầu phúc), tắm Phật bằng nước thơm và té nước vào nhau để gột rửa điều xui xẻo. Đây là lễ hội vui tươi nhất của người Khmer Nam Bộ.",
    image: "pictures-thuvien/le-hoi/khmer/fes-khmer-chol.jpg"
  },
  {
    id: "fes-khmer-okombok",
    category: "festival",
    ethnic: "Khmer",
    title: "Ok Om Bok",
    desc: "Cúng Trăng và Đua Ghe Ngo kịch tính.",
    content: "Vào rằm tháng 10 âm lịch, người Khmer cúng tạ ơn thần Mặt Trăng đã ban cho mùa màng tốt tươi. Cốm dẹp là vật phẩm không thể thiếu. Lễ hội kết thúc bằng cuộc đua Ghe Ngo hào hứng và thả đèn gió.",
    image: "pictures-thuvien/le-hoi/khmer/fes-khmer-okombok.jpg"
  },

  // Thái
  {
    id: "fes-thai-hoaban",
    category: "festival",
    ethnic: "Thái",
    title: "Lễ Hội Hoa Ban",
    desc: "Mùa hoa tình yêu Tây Bắc.",
    content: "Tháng 2 âm lịch, khi hoa ban nở trắng rừng, người Thái tổ chức lễ hội để cầu mưa và tưởng nhớ chuyện tình nàng Ban chàng Khum. Trai gái hò hẹn, chơi ném còn, hát giao duyên trong không khí lãng mạn.",
    image: "pictures-thuvien/le-hoi/thai/fes-thai-hoaban.jpg"
  },

  // Chăm
  {
    id: "fes-cham-kate",
    category: "festival",
    ethnic: "Chăm",
    title: "Lễ Hội Kate",
    desc: "Lễ hội lớn nhất bên tháp cổ.",
    content: "Diễn ra vào tháng 7 lịch Chăm tại các khu đền tháp Po Nagar, Po Rome. Người dân rước y phục của vua chúa lên tháp, làm lễ tắm tượng, mặc y phục cho tượng thần. Đây là dịp con cháu tưởng nhớ tổ tiên.",
    image: "pictures-thuvien/le-hoi/cham/fes-cham-kate.jpg"
  },

  // H'Mông, Tày, Dao...
  {
    id: "fes-hmong-gautao",
    category: "festival",
    ethnic: "H'Mông",
    title: "Lễ Hội Gầu Tào",
    desc: "Cầu phúc, cầu mệnh đầu xuân.",
    content: "Gia đình nào hiếm muộn hoặc hay ốm đau sẽ nhờ thầy cúng dựng cây nêu giữa bãi đất rộng để tổ chức Gầu Tào. Đây cũng là dịp vui chơi xuân lớn nhất, trai gái múa khèn, hát gấu plềnh tìm bạn tình.",
    image: "pictures-thuvien/le-hoi/hmong/fes-hmong-gautao.jpg"
  },
  {
    id: "fes-tay-longtong",
    category: "festival",
    ethnic: "Tày",
    title: "Lễ Lồng Tồng",
    desc: "Hội xuống đồng lớn nhất Việt Bắc.",
    content: "Diễn ra vào tháng Giêng. Dân làng cúng Thần Nông cầu mùa. Tâm điểm là hội tung còn: quả còn ngũ sắc phải ném thủng tâm vòng tròn trên cây nêu cao vút thì năm đó bản làng mới may mắn.",
    image: "pictures-thuvien/le-hoi/tay/fes-tay-longtong.jpg"
  },
  {
    id: "fes-dao-tetnhay",
    category: "festival",
    ethnic: "Dao",
    title: "Tết Nhảy",
    desc: "Vũ điệu tri ân Bàn Vương.",
    content: "Một gia đình hoặc dòng họ tổ chức nhảy múa thâu đêm suốt sáng để tạ ơn Bàn Vương đã cứu mạng trong quá trình di cư. Các điệu múa mô tả cảnh luyện binh, săn bắn, cày cấy rất sinh động.",
    image: "pictures-thuvien/le-hoi/dao/fes-dao-tetnhay.jpg"
  },
  {
    id: "fes-pathen-nhaylua",
    category: "festival",
    ethnic: "Pà Thẻn",
    title: "Lễ Hội Nhảy Lửa",
    desc: "Vũ điệu thần bí trên than hồng.",
    content: "Các chàng trai Pà Thẻn sau khi được thầy cúng làm phép nhập đồng sẽ nhảy vào đống than hồng rực bằng chân trần, bốc than tung lên mà không hề bị bỏng. Nghi lễ thể hiện sức mạnh thần linh che chở con người.",
    image: "pictures-thuvien/le-hoi/pa-then/nhay-lua.jpg"
  },
  {
    id: "fes-mnong-duavoi",
    category: "festival",
    ethnic: "M'Nông",
    title: "Lễ Hội Đua Voi",
    desc: "Tinh thần thượng võ Bản Đôn.",
    content: "Tổ chức tại Buôn Đôn, Đắk Lắk. Những chú voi to lớn dưới sự điều khiển của nài voi thi chạy, thi bơi vượt sông Sêrêpôk. Lễ hội tôn vinh tài nghệ thuần dưỡng voi của người M'Nông.",
    image: "pictures-thuvien/le-hoi/mnong/fes-mnong-duavoi.jpg"
  },
  {
    id: "fes-lolo-caumua",
    category: "festival",
    ethnic: "Lô Lô",
    title: "Lễ Cầu Mưa",
    desc: "Hóa trang người rừng gọi mưa.",
    content: "Vào năm hạn hán, người Lô Lô Chải tổ chức lễ cầu mưa. Điểm độc đáo là những người đàn ông hóa trang toàn thân bằng lá ngô, lá cây, múa nhịp nhàng quanh đàn cúng để mời thần Mưa về.",
    image: "pictures-thuvien/le-hoi/lo-lo/fes-lolo-caumua.jpg"
  },
  {
    id: "fes-hanhi-khogiagia",
    category: "festival",
    ethnic: "Hà Nhì",
    title: "Lễ Khô Già Già",
    desc: "Lễ hội cầu mùa tháng 6.",
    content: "Lễ hội lớn nhất trong năm của người Hà Nhì Đen. Họ mổ trâu hiến tế, dựng cây đu, chơi bập bênh. Đây là dịp để cộng đồng gắn kết và cầu mong mùa màng bội thu.",
    image: "pictures-thuvien/le-hoi/ha-nhi/fes-hanhi-khogiagia.jpg"
  }
];