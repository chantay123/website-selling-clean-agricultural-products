/**
 * Knowledge hub about fresh agricultural products.
 *
 * The blog holds the editorial articles, this module holds the practical
 * knowledge a customer actually looks for: how to pick a product, how to
 * store it, how to cook it and when the harvest is at its peak.
 */

export type KnowledgeCategory =
  | "chon-sanh-pham"
  | "bao-quan"
  | "che-bien"
  | "theo-mua"
  | "chung-nhan";

export type KnowledgeType = {
  _id: string;
  title: string;
  category: KnowledgeCategory;
  /** Short teaser shown on the card. */
  summary: string;
  /** The full, printable guide. */
  detail: string;
  /** Practical tips, one line each. */
  tips: string[];
  /** Products the guide is about. */
  relatedProducts: string[];
  /** Minutes needed to read the guide. */
  readTime: number;
};

export const knowledgeCategories: {
  id: KnowledgeCategory;
  name: string;
  description: string;
}[] = [
  {
    id: "chon-sanh-pham",
    name: "Chọn sản phẩm",
    description: "Cách nhận biết nông sản tươi, đúng vụ và đạt chuẩn",
  },
  {
    id: "bao-quan",
    name: "Bảo quản & bảo trì",
    description: "Giữ rau củ, trái cây, thịt và thủy sản tươi lâu hơn",
  },
  {
    id: "che-bien",
    name: "Cách chế biến",
    description: "Cách nấu ngon, giữ dưỡng chất và dễ thực hiện",
  },
  {
    id: "theo-mua",
    name: "Nông sản theo mùa",
    description: "Lịch thu hoạch từng tháng tại Việt Nam",
  },
  {
    id: "chung-nhan",
    name: "Chứng nhận & nguồn gốc",
    description: "VietGAP, GlobalG.A.P, PGS và truy xuất nguồn gốc",
  },
];

export const knowledgeGuides: KnowledgeType[] = [
  {
    _id: "kn-cach-chon-trai-cay",
    title: "7 bước chọn trái cây tươi đúng vụ",
    category: "chon-sanh-pham",
    summary:
      "Từ màu sắc vỏ đến mùi thơm và độ mềm, đây là những gì bạn cần kiểm tra để không mua phải trái cây chín ép hoặc nông sản kém chất lượng.",
    detail:
      "Mua trái cây tươi ở chợ hay ở siêu thị thì bạn cũng dùng chung một bộ tiêu chí. Vấn đề là nhiều người chỉ nhìn vào vỏ ngoài rồi đem về nhà, kết quả là nông sản không ngon, thậm chí không ăn được.\n\nBước 1 — Nhìn mắt và rời. Trái cây đúng vụ có màu đồng đều, không bị vết nám, nứt da hay thâm đen ở cuống. Rau lá nên có lá to, dày, xanh đậm và còn nguyên cuống, lá úng vàng là dấu hiệu đã mất nước.\n\nBước 2 — Cầm và cảm trọng lượng. Trái cây có nước luôn nặng hơn so với cảm giác nhìn. Sầu riêng Riêng Vàng đúng vụ có trọng lượng trên 2,5 kg/trái, cơm dày và dẻo. Bơ sáp 034 nặng tay, hạt lép và vỏ mượt.\n\nBước 3 — Ngửi mùi. Trái chín cây có mùi thơm đặc trưng ngay ở lớp vỏ, kể cả khi đặt cách xa vài cm. Trái xanh vỏ lạnh thường có mùi nhạt hoặc mùi khét, cơm bị lạnh và không ngọt.\n\nBước 4 — Kiểm tra độ chín. Xoài cát Hòa Lộc nên có mùi thơm và hơi lõm nhẹ ở cuống, mềm khi bấm nhẹ. Dưa hấu ruột đỏ nên có vết sáng cạnh cuống, mùi ngọt bùng lên.\n\nBước 5 — Kiểm tra phần gốc. Dưa hấu, bầu, bí đao có gân xanh và còn dính lá non, dấu hiệu vừa cắt khỏi vườn.\n\nBước 6 — Ưu tiên sản phẩm truy xuất nguồn gốc. Các đơn vị đạt VietGAP hoặc GlobalG.A.P đều có mã vùng trồng, ngày thu hoạch và giấy kiểm định tương ứng.\n\nBước 7 — Đặt mua đúng mùa. Nông sản ngoài vụ thường phải dùng thuốc bảo quản hoặc vận chuyển đường dài, chất lượng giảm rõ rệt so với lúc đúng mùa.",
    tips: [
      "Sầu riêng: chọn trái nặng, hạt lép, đuôi có mùi thơm, vỏ không nứt",
      "Xoài: kiểm tra mùi ở cuống, mềm nhẹ khi bấm là chín",
      "Rau lá: chọn bó còn nguyên rễ, lá không úng, không có dấu sống",
      "Trái cây nhập khẩu: kiểm tra nhãn và ngày nhập, tránh mua quá 5 ngày",
    ],
    relatedProducts: [
      "prd-sau-rieng-rieng-vang",
      "prd-xoai-cat-hoa-loc",
      "prd-bo-sap-034",
    ],
    readTime: 6,
  },
  {
    _id: "kn-bao-quan-rau-cu",
    title: "Bảo quản rau củ tươi 7 ngày không héo",
    category: "bao-quan",
    summary:
      "Rau muống, cà chua, cà rốt và bắp cải bị héo nhanh chỉ vì bạn để chúng ở sai chỗ. Đây là cách bảo quản đúng cho từng nhóm rau.",
    detail:
      "Nguyên nhân rau héo nhanh nhất không phải là mua sai mà là bảo quản sai. Rau củ mất nước qua đường hô hấp, và tốc độ mất nước phụ thuộc vào nhiệt độ, độ ẩm và có bị gói kín hay không.\n\nRau lá (rau muống, cải bê, rau đay): rửa sạch, để ráo hoàn toàn, bỏ vào túi nhựa có lỗ thông gió rồi để ngăn mát 2-6 độ C. Rau muống và cải bê chỉ nên giữ 2-3 ngày trong tủ lạnh.\n\nCủ, quả (khoai lang, cà rốt, khoai tây): để nơi tối, thoáng, nhiệt độ 15-20 độ C, không cần điều hòa. Khoai lang và khoai tây tuyệt đối không để cùng chỗ với hành tỏi vì khí ethylene từ củ hành làm khoai nhanh nảy mầm và khô.\n\nCà chua và ớt: để ngoài tủ lạnh ở nhiệt độ phòng. Lạnh làm cà chua mềm, mất đường và vị. Nếu cà chua chưa chín, đặt cùng một quả chuối trong túi giấy sẽ giúp chín nhanh gấp 2-3 lần nhờ khí ethylene.\n\nBắp cải và cải thảo: bọc từng chiếc bằng màng bọc thực phẩm rồi cho vào ngăn mát. Không rửa trước khi cất, nước sẽ đẩy nhanh vi khuẩn vào cuống.\n\nMít, sầu riêng: nhiệt độ phòng, không để trong tủ lạnh vì sẽ mất đường và cơm bị dính. Sầu riêng nên dùng trong 1-2 ngày sau khi mở.\n\nNguyên tắc chung: rửa khi dùng chứ không phải khi mua, bọc riêng từng loại, không bọc kín hoàn toàn rau lá và kiểm tra lại túi sau 2 ngày.",
    tips: [
      "Rau lá: túi có lỗ + ngăn mát, dùng trong 2-3 ngày",
      "Củ quả: nơi tối thoáng 15-20 độ C, không điều hòa",
      "Cà chua: để ngoài tủ lạnh, chín nhanh bằng cách úp cùng 1 quả chuối",
      "Khoai lang và khoai tây không để cùng hành, tỏi",
      "Tách bóc khoai tây và cà rốt khỏi túi khi cất",
    ],
    relatedProducts: ["prd-rau-muong-huu-co-hop", "prd-ca-chua-bi", "prd-ca-rok"],
    readTime: 7,
  },
  {
    _id: "kn-bao-quan-thit-thuy-hai-san",
    title: "Bảo quản thịt và thủy sản đúng cách trong tủ lạnh",
    category: "bao-quan",
    summary:
      "Chuỗi lạnh, ngăn đông và cách xử lý tôm sú, cá basa, thịt bò Mộc Châu để giữ độ tươi và an toàn thực phẩm.",
    detail:
      "Thịt và thủy sản là nhóm thực phẩm nhanh hỏng nhất, và phần lớn vấn đề bắt nguồn từ việc bảo quản sai ngay tại nhà.\n\nNguyên tắc số một: giữ chuỗi lạnh liên tục. Khi gói hàng bị ngắt chuỗi lạnh trên đường giao, vi khuẩn bắt đầu nhân lên ngay ở nhiệt độ 20-40 độ C. Sản phẩm bán tại Agrimarket được vận chuyển trong chuỗi lạnh nên bạn nhận vẫn còn lạnh, hãy đưa thẳng vào tủ lạnh.\n\nThịt bò, thịt lợn, thịt gà: chia thành từng phần nhỏ vừa một lần ăn, bọc kín và cất ngăn đông ở -18 độ C nếu ăn trong vòng 2-3 tháng, hoặc ngăn mát ở 2-4 độ C nếu ăn trong 2-3 ngày. Tuyệt đối không rửa thịt trước khi cất vì nước rửa làm tăng vị vi khuẩn.\n\nTôm sú: bỏ túi đá, rửa nhanh bằng nước lạnh, để ráo rồi cất ngăn đông. Tôm tươi giữ được 3 tháng, tôm nấu chín ở ngăn đông ở khoảng 2 tháng.\n\nCá basa: cá làm lạnh nhanh có thể bảo quản ngăn đông 6 tháng. Khi rã đông, để trong tủ lạnh và dùng trong 24 giờ, không cấp đông lại lần hai.\n\nRau củ sống thêm trong bữa ăn: nấu rau xong vớt ra, xả nhanh bằng nước lạnh và để ráo, không để rau nguội trong nồi vì nhiệt độ ấm là môi trường lý tưởng cho vi khuẩn.\n\nSau khi chế biến: không để thịt thành phần còn ăn lại ở nhiệt độ phòng quá 2 giờ, đặc biệt trong thời tiết nóng trên 30 độ C.",
    tips: [
      "Nhận hàng còn lạnh: đưa thẳng vào tủ lạnh, không để bên ngoài",
      "Chia thịt thành phần vừa 1 bữa rồi cấp đông",
      "Không rửa thịt trước khi cất",
      "Tôm sú cất ngăn đông, dùng trong 3 tháng",
      "Rau đã nấu xả lạnh ngay, không để nguội trong nồi",
    ],
    relatedProducts: [
      "prd-thit-bo-moc-chau",
      "prd-thit-ga-ta",
      "prd-tom-su-camau",
      "prd-ca-basa-an-giang",
    ],
    readTime: 6,
  },
  {
    _id: "kn-che-bien-rau-cu",
    title: "5 món chế biến từ rau củ hữu cơ ngon nhất",
    category: "che-bien",
    summary:
      "Cách nấu rau muống, cà chua bi, bắp cải trắng và cà rốt sao cho giữ dưỡng chất, dễ ăn và không mất vị.",
    detail:
      "Rau củ hữu cơ có hương vị đậm hơn rau trồng thông thường nên cần cách nấu phù hợp, không quá nhiệt và không ngâm nhiều gia vị.\n\nRau muống xào tỏi. Cắt rau muống thành đoạn 5-7 cm, để ráo thật khô trước khi xào để rau không ra nước. Lắm nóng chảo, cho tỏi vàng thơm, xào rau ở lửa lớn trong 1-2 phút, nêm nước mắm, tiêu và chút đường phèn. Xào quá lâu rau sẽ nhạt và mềm nhũn.\n\nCà chua bi xào trứng. Cà chua bi có vị chua ngọt đậm nên không cần nhiều đường. Trứng đánh tan, chiên sơn rồi đẩy sang một bên, cho cà chua vào xào mềm, trộn đều, nêm nếm vừa ăn.\n\nBắp cải trắng xào luyên. Cắt bắp cải thành sợi, cho vào chảo nóng cùng ít dầu nóng, xào 2 phút, thêm luyên khô, tắt bếp rồi rắc hành lá. Cách này giữ độ giòn và vị ngọt của bắp cải.\n\nCà rốt nấu súp. Cà rốt bỏ lõi, cắt xéo dày vừa ăn để nấu nhanh, cho vào nồi cùng bí đỏ, khoai tây, nấm và xương. Nấu vừa chín, không nấu quá lâu vì cà rốt sẽ nát.\n\nGà ta thảo hầm rau. Gà thảo nấu lâu sẽ mềm và ngọt. Cho gà vào nồi nước dừa hoặc nước lọc cùng củ hành, gừng, sâm vào và hầm 60-90 phút, sau đó mới cho rau củ vào và hầm thêm 10-15 phút để rau không nát.\n\nNguyên tắc chung: ưu tiên hấp và xào nhanh, giữ lửa lớn, nêm nếg vừa ăn và ăn ngay khi nấu xong để giữ độ tươi.",
    tips: [
      "Xào rau lá: để ráo khô, lửa lớn, tối đa 2 phút",
      "Cà chua bi xào trứng, không thêm đường",
      "Bắp cải xào luyên, tắt bếp rồi rắc hành lá",
      "Gà thảo hầm 60-90 phút, rau cho vào sau cùng",
      "Ăn ngay sau khi nấu để giữ vị tươi",
    ],
    relatedProducts: [
      "prd-rau-muong-huu-co-hop",
      "prd-ca-chua-bi",
      "prd-bap-cai-trang",
      "prd-thit-ga-ta",
    ],
    readTime: 6,
  },
  {
    _id: "kn-che-bien-trai-cay",
    title: "Cách ăn trái cây để hấp thu tốt vitamin C",
    category: "che-bien",
    summary:
      "Cắt hay để nguyên, ăn trước hay sau bữa ăn, có nên ăn chuối với sữa không? Giải đáp những điều khách hàng hỏi nhiều nhất.",
    detail:
      "Trái cây tươi giàu vitamin C, chất xơ và các chất chống oxy hoá, nhưng cách ăn quyết định lượng dinh dưỡng bạn hấp thu được.\n\nCắt hay để nguyên? Cắt làm tăng bề mặt tiếp xúc với không khí, vitamin C và chất chống oxy hoá giảm nhanh hơn. Nên ăn trong vòng 15-20 phút sau khi cắt, và dùng dao sắc thay vì để bào hay xé nhỏ quá nhiều.\n\nĂn trước hay sau bữa ăn? Trái cây giàu vitamin C nên ăn trước bữa ăn khoảng 30 phút, vì kích thích bài tiết dịch vị và giúp hấp thu sắt từ rau xanh trong bữa ăn. Trái cây giàu đường như sầu riêng, mít, chuối nên ăn giữa bữa hoặc sau bữa để không ảnh hưởng lượng đường huyết.\n\nChuối với sữa có an toàn không? Câu trả lời là có. Không có bằng chứng khoa học nào cho thấy ăn chuối với sữa gây hại. Cả hai đều là nguồn dinh dưỡng tốt, kết hợp lại giúp bổ sung kali, canxi và protein. Tuy nhiên nếu bạn bị tiêu hoá chậm thì nên ăn cách nhau khoảng 30 phút.\n\nBóc vỏ hay ăn cả vỏ? Vỏ táo, vỏ lê và vỏ bí đỏ giàu chất xơ và chất chống oxy hoá. Tuy nhiên cần rửa kỹ, và nếu thuộc nhóm khó tiêu hoá thì nên bóc vỏ.\n\nTrái cây nào nên ăn sống, loại nào nên nấu? Táo, xoài, dưa hấu, cam nên ăn sống để giữ vitamin C. Bơ sáp, chuối, lê nên ăn chín kỹ vì chất xơ hữu ích của chúng dễ hấp thu hơn ở dạng chín.\n\nMẹo bảo quản sau khi cắt: chấm mặt cắt của bưởi, chuối, xoài bằng nước chanh pha loãng để chậm oxy hoá, hoặc bọc kín trong hộp nhựa có khăn giấy ẩm.",
    tips: [
      "Ăn trái cây giàu vitamin C trước bữa ăn 30 phút",
      "Cắt xong ăn trong 15-20 phút để giữ dưỡng chất",
      "Chuối với sữa hoàn toàn an toàn",
      "Ăn vỏ táo, lê, bí đỏ sau khi rửa kỹ",
      "Chấm nước chanh lên mặt cắt để chậm oxy hoá",
    ],
    relatedProducts: [
      "prd-xoai-cat-hoa-loc",
      "prd-bo-sap-034",
      "prd-dua-hau-ruot-do",
      "prd-tau-kho",
    ],
    readTime: 6,
  },
  {
    _id: "kn-mua-han",
    title: "Mua nông sản theo mùa: lịch thu hoạch tháng này",
    category: "theo-mua",
    summary:
      "Biết mùa vụ giúp bạn mua được sản phẩm ngon nhất với giá hợp lý nhất, vì nông sản đúng vụ luôn dễ trồng hơn và rẻ hơn nhiều.",
    detail:
      "Nông sản ngoài vụ phải vận chuyển đường dài, bảo quản hoặc nuôi trồng nhân tạo nên chất lượng và giá đều bất lợi. Dưới đây là lịch thu hoạch phổ biến tại Việt Nam.\n\nTháng 1-2: Bưởi da xanh, cam sài, quýt trúc, mận hậu, cải bắp, rau cải, tỏi, ớt, đậu phụ. Đây là mùa trái cây miền Nam và rau củ vụ Đông.\n\nTháng 3-4: Xoài cát Hòa Lộc bắt đầu chín, mít Thanh Mát, dừa tươi Bến Tre, bưởi da xanh vào mùa, rau muống, bí đao, đậu bắp.\n\nTháng 5-6: Sầu riêng Riêng Vàng vào mùa cao điểm, nho xanh, bơ sáp 034, bánh chuối, mít, rau củ hè. Đây cũng là mùa thu hoạch rau củ hữu cơ ở Tây Nguyên và Đà Lạt bắt đầu vào đội.\n\nTháng 7-8: Trái cây vụ hè như mít, sầu riêng vụ cuối, thanh long, rau củ vụ hè. Cà chua, cà rốt trong nhà kính cho năng suất ổn định.\n\nTháng 9-10: Bưởi da xanh ngọt nhất trong năm, nho, bơ, sầu riêng cuối vụ, rau củ vụ Thu. Đây cũng là mùa thu hoạch gạo lứt và ngô.\n\nTháng 11-12: Bưởi da xanh vào chín rộ, nho vụ mới, rau củ vụ Đông, tôm sú và cá basa vào mùa thu hoạch lớn ở miền Tây.\n\nMẹo nhỏ: nếu bạn muốn mua sầu riêng đúng mùa, hãy chọn tháng 5-7, giá lúc này thấp hơn và cơm chắc hơn so với ngoài mùa.",
    tips: [
      "Sầu riêng đúng mùa: tháng 5-7, giá thấp và cơm chắc",
      "Bưởi da xanh ngọt nhất: tháng 9-11",
      "Xoài cát Hòa Lộc vào mùa: tháng 3-5",
      "Nho xanh và bơ sáp: tháng 5-7",
      "Mua đúng mùa giúp giá rẻ hơn và chất lượng tốt hơn 30%",
    ],
    relatedProducts: [
      "prd-sau-rieng-rieng-vang",
      "prd-mit-thanh-mat",
      "prd-nho-xanh-tay-ninh",
      "prd-bo-sap-034",
    ],
    readTime: 5,
  },
  {
    _id: "kn-chung-nhan-vietgap",
    title: "VietGAP, GlobalG.A.P, PGS khác nhau như thế nào?",
    category: "chung-nhan",
    summary:
      "Ba chứng nhận phổ biến nhất của nông sản sạch, cách đọc và ý nghĩa thực tế của từng loại đối với người tiêu dùng.",
    detail:
      "Nhiều người nghĩ chứng nhận chỉ là hình trên bao bì, nhưng thực tế mỗi loại có phạm vi kiểm soát khác nhau và giá trị thực tiễn khác nhau.\n\nVietGAP là chứng nhận do Bộ Nông nghiệp và Môi trường ban hành, dựa trên GAP của Codex Alimentarius của FAO. Phạm vi áp dụng gồm 7 nhóm sản phẩm: rau quả, trái cây, hoa, chè, thuỷ sản, chăn nuôi và gia vị. Với VietGAP, quy trình trồng trọt được ghi nhận đầy đủ về giống, đất, nước tưới, phân bón, thu hoạch, bao bì và vận chuyển. Đây là chứng nhận phổ biến nhất trong nông sản Việt Nam.\n\nGlobalG.A.P là chuẩn quốc tế do FoodChain ID ban hành, được các chuỗi siêu thị quốc tế chấp nhận. Yêu cầu cao hơn về kiểm soát, truy xuất nguồn gốc và đánh giá của bên thứ ba.\n\nPGS (Participatory Guarantee System) là hệ thống đảm bảo chất lượng có sự tham gia của người sản xuất, phổ biến ở các hợp tác xã và vùng nguyên liệu nhỏ. Chi phí thấp hơn, quy trình đơn giản hơn, phù hợp với nông trại quy mô nhỏ nhưng vẫn đảm bảo sản xuất sạch.\n\nHữu cơ (Organic) là hướng canh tác không dùng thuốc trừ sâu, phân bón tổng hợp và hạt giống biến đối, có hệ sinh thái canh tác tự nhiên. Đây là tiêu chuẩn khắt khe nhất và chi phí cao nhất.\n\nCách đọc chứng nhận trên bao bì: mã số cơ sở đóng gói, tên cơ sở, ngày cấp, thời hạn hiệu lực và mã truy xuất. Bạn có thể nhập mã truy xuất lên cổng truy xuất nguồn gốc quốc gia để xem đúng lô hàng đó được trồng ở đâu, thu hoạch ngày nào.\n\nTại Agrimarket, mọi sản phẩm đều kèm thông tin chứng nhận trong tab Mô tả sản phẩm, cùng ngày thu hoạch và hạn sử dụng để bạn tự kiểm chứng.",
    tips: [
      "VietGAP: chuẩn quốc gia, phổ biến nhất ở Việt Nam",
      "GlobalG.A.P: chuẩn quốc tế, cần cho chuỗi siêu thị",
      "PGS: do nông hộ cùng xây dựng, phù hợp hợp tác xã",
      "Hữu cơ: khắt khe nhất, không thuốc trừ sâu, không phân bón tổng hợp",
      "Quét mã truy xuất để xem lô hàng thu hoạch ở đâu",
    ],
    relatedProducts: ["prd-rau-muong-huu-co-hop", "prd-sau-rieng-rieng-vang"],
    readTime: 7,
  },
  {
    _id: "kn-mat-ong-rung",
    title: "Mật ong rừng khác mật ong nuôi như thế nào?",
    category: "chon-sanh-pham",
    summary:
      "Độ đặc, màu sắc, vị và cách khai thác quyết định chất lượng. Bài viết giúp bạn chọn được hộ mật ong rừng đúng chuẩn.",
    detail:
      "Mật ong rừng và mật ong nuôi đều là mật ong, nhưng quy trình tạo ra sản phẩm khác nhau rõ rệt.\n\nNguồn gốc. Mật ong rừng được khai thác từ tổ ong tự nhiên trong rừng, ong tự tìm nguồn mật từ hoa rừng. Mật ong nuôi do người nuôi đặt thùng, kiểm soát nguồn mật qua việc di chuyển thùng theo mùa hoa.\n\nĐộ đặc. Mật ong rừng thường đặc hơn, độ ẩm dưới 18%. Mật ong nuôi công nghiệp có thể xấp xỉ 20-22%. Mật đặc thì chậm chảy, hơi dẻo khi múc, để lâu không bị lên men.\n\nMàu sắc. Mật ong rừng có màu đậm, từ hổ phách đến nâu sẫm tùy loài hoa. Mật ong nuôi thường sáng và đồng đều hơn.\n\nMùi vị. Mật ong rừng mang mùi hoa rừng đặc trưng, vị đậm hơn và có chút hậu ngọt. Mật ong nuôi thường nhạt và dễ bị pha đường.\n\nKiểm tra hàng giả. Mật ong pha đường thường loãng hơn, kéo sợi không dính, và thường được làm nhoè với nước hoặc si-rô. Mật ong rừng thật có độ đặc, kéo sợi dài và bám chặt.\n\nBảo quản. Đậy kín, để nơi tối và mát, tránh ẩm. Mật ong bị hút ẩm sẽ lên men và chua. Không cất trong tủ lạnh vì nhiệt độ thấp làm mật đông cứng và kết tinh.\n\nMẹo sử dụng: 1 thìa cà phê mật ong trong nước ấm tốt hơn nước nóng vì nhiệt độ cao phá hủy enzyme và vitamin. Không đun sôi mật ong.",
    tips: [
      "Mật rừng thật: đặc, kéo sợi dài, màu hổ phách đậm",
      "Mật pha đường: loãng, chảy nhanh, không dính",
      "Bảo quản ở nơi tối mát, không để tủ lạnh",
      "Không đun sôi mật ong, hòa với nước ấm",
      "Mật ong tốt thường đông thành hạt nhỏ trong mùa lạnh",
    ],
    relatedProducts: ["prd-mat-ong-rung"],
    readTime: 5,
  },
  {
    _id: "kn-lua-gao-lut",
    title: "Gạo lứt và các loại gạo ít đường bổ dưỡng",
    category: "che-bien",
    summary:
      "Gạo lứt, gạo lứt đỏ, gạo nếp và gạo đen khác nhau như thế nào về dinh dưỡng, và cách nấu đúng để giữ chất xơ.",
    detail:
      "Gạo trắng được đánh bóc hoàn toàn, mất đi phần lớn chất xơ, vitamin B và khoáng chất. Các loại gạo ít đánh bóc giữ lại nhiều dinh dưỡng hơn.\n\nGạo lứt là gạo chỉ bỏ lớp vỏ ngoài cùng, giữ nguyên cám và mầm. Nó chứa nhiều chất xơ, magiê, phốt pho và vitamin B1 hơn gạo trắng, đồng thời có chỉ số đường huyết thấp hơn.\n\nGạo lứt đỏ có vỏ và cám màu đỏ đục, chứa nhiều anthocyanin, chất chống oxy hoá. Khi nấu, cơm có màu hồng nhạt và vị đậm hơn gạo lứt thường.\n\nGạo nếp giàu amylopectin, nhuộc và dính, thường dùng cho bánh chưng, xôi và chè.\n\nGạo đen (gạo nếp tím, gạo cẩm) có cơm tím sẫm, chứa nhiều anthocyanin và được ưa chuộng cho món thực phẩm giàu chất chống oxy hoá.\n\nCách nấu giữ chất xơ: vo sạch nhưng không xát nhiều, dùng nước vừa đủ thay vì nước nhiều rồi rút bớt. Ngâm gạo lứt 30-60 phút trước khi nấu giúp cơm mềm và giảm thời gian nấu. Có thể nấu cùng 1 thìa cà phê dầu ăn để cơm dẻo hơn mà không cần nhiều nước.\n\nGạo lứt nên ngâm trước và nấu bằng nồi áp suất nếu muốn cơm mềm, vì lớp cám làm hạt nấu chậm hơn gạo trắng khoảng 30%.",
    tips: [
      "Vo nhẹ, không xát kỹ để giữ lớp cám",
      "Ngâm gạo lứt 30-60 phút trước khi nấu",
      "Dùng nồi áp suất để cơm mềm, thêm 1 thìa dầu ăn",
      "Gạo lứt đỏ và gạo cẩm có chất chống oxy hoá cao",
      "Bảo quản gạo trong hộp kín ở nơi khô mát",
    ],
    relatedProducts: ["prd-gao-lut-lang-que"],
    readTime: 5,
  },
];

export const knowledgeById = (id: string) =>
  knowledgeGuides.find((guide) => guide._id === id);
