/**
 * Seed catalogue of the shop.
 *
 * The public read endpoints of the Agrimarket API only return a couple of
 * test records with placeholder prices. This module holds a complete,
 * realistic Vietnamese agricultural catalogue that is merged into the API
 * responses so every page of the site shows meaningful content.
 */

import {
  BannerType,
  BlogType,
  CategoryType,
  CommentType,
  HashtagType,
  OrderType,
  ReportType,
  RoleType,
  StockType,
  SupplierType,
  productTypes,
} from "../@type/global.type";

/* -------------------------------------------------------------------------- */
/*                                  categories                                 */
/* -------------------------------------------------------------------------- */

export const seedCategories: CategoryType[] = [
  {
    _id: "cat-trai-cay-tuoi",
    name: "Trái cây tươi",
    slug: "trai-cay-tuoi",
    image: "/image/fruite-item-1.jpg",
  },
  {
    _id: "cat-rau-cu-huu-co",
    name: "Rau củ hữu cơ",
    slug: "rau-cu-huu-co",
    image: "/image/vegetable-item-1.jpg",
  },
  {
    _id: "cat-nong-san-sach",
    name: "Nông sản sạch",
    slug: "nong-san-sach",
    image: "/image/vegetable-item-3.png",
  },
  {
    _id: "cat-thit-thuy-hai-san",
    name: "Thịt & Thủy hải sản",
    slug: "thit-thuy-hai-san",
    image: "/image/single-item.jpg",
  },
  {
    _id: "cat-gia-vi-do-kho",
    name: "Gia vị & Đồ khô",
    slug: "gia-vi-do-kho",
    image: "/image/featur-2.jpg",
  },
  {
    _id: "cat-trai-cay-nhap-khau",
    name: "Trái cây nhập khẩu",
    slug: "trai-cay-nhap-khau",
    image: "/image/banner-fruits.jpg",
  },
];

const categoryById = (id: string) =>
  seedCategories.find((item) => item._id === id) as CategoryType;

/* -------------------------------------------------------------------------- */
/*                                  suppliers                                  */
/* -------------------------------------------------------------------------- */

export const seedSuppliers: SupplierType[] = [
  {
    _id: "sup-dalat-organic",
    company_name: "Nông trại hữu cơ Đà Lạt",
    contact_name: "Nguyễn Văn Hùng",
    contact_title: "Giám đốc điều hành",
    phone: "0912 345 678",
    email: "contact@dalatorganic.vn",
    address: "12 Đường 3/4, Phường 3, Đà Lạt, Lâm Đồng",
    website: "https://dalatorganic.vn",
    certification_details: "VietGAP, GlobalG.A.P, USDA Organic",
    description:
      "Đồi vườn canh tác hữu cơ theo tiêu chuẩn GlobalG.A.P, tươi suốt mùa và đóng gói ngay tại vườn.",
    payment_terms: "Thanh toán trong 30 ngày",
  },
  {
    _id: "sup-tiengiang",
    company_name: "HTX Trái Cây Tiền Giang",
    contact_name: "Trần Thị Hồng Nhung",
    contact_title: "Chủ tịch HTX",
    phone: "0938 112 233",
    email: "htxtiengiang@gmail.com",
    address: "1234 Đường 8, TP. Mỹ Tho, Tiền Giang",
    website: "https://htxtiengiang.vn",
    certification_details: "VietGAP, HACCP",
    description:
      "Hợp tác xã quy tụ 320 hộ nông dân trồng sầu riêng, xoài cát Hòa Lộc và thanh long theo mô hình VietGAP.",
    payment_terms: "Thanh toán trong 15 ngày",
  },
  {
    _id: "sup-bentre-coconut",
    company_name: "Cơ sở chế biến dừa Bến Tre",
    contact_name: "Phạm Quốc Dũng",
    contact_title: "Chủ cơ sở",
    phone: "0975 667 788",
    email: "sales@duabennghe.vn",
    website: "https://duabennghe.vn",
    address: "56 Hàm Long, Bến Tre",
    certification_details: "ISO 22000, HACCP",
    description:
      "Chuyên sản xuất dừa tươi bó, nước dừa và mật dừa, đạt chuẩn an toàn thực phẩm.",
    payment_terms: "Thanh toán trong 30 ngày",
  },
  {
    _id: "sup-mocchau-organic",
    company_name: "Trang trại hữu cơ Mộc Châu",
    contact_name: "Lê Minh Tuấn",
    contact_title: "Kỹ sư nông nghiệp",
    phone: "0968 445 566",
    email: "info@mocchauorganic.vn",
    website: "https://mocchauorganic.vn",
    address: "Khu du lịch Mộc Châu, Sơn La",
    certification_details: "VietGAP, GlobalG.A.P",
    description:
      "Chuyên thịt bò và thịt lợn hữu cơ, chăn nuôi thả trong vườn, không dùng kháng sinh.",
    payment_terms: "Thanh toán trong 45 ngày",
  },
  {
    _id: "sup-camau-seafood",
    company_name: "Hợp tác xã thủy sản Cà Mau",
    contact_name: "Võ Thị Mai",
    contact_title: "Chủ tịch HTX",
    phone: "0943 778 899",
    email: "camau.seafood@gmail.com",
    website: "https://camauseafood.vn",
    address: "78 Nguyễn Trung Trực, Cà Mau",
    certification_details: "BRC, VietGAP, ASC",
    description:
      "Cung cấp tôm sú, tôm cắn và cá nuôi lồng đạt chuẩn truy xuất nguồn gốc.",
    payment_terms: "Thanh toán trong 30 ngày",
  },
];

/* -------------------------------------------------------------------------- */
/*                                   products                                  */
/* -------------------------------------------------------------------------- */

type SeedAttribute = {
  weight: number;
  original_price: number;
  discounted_percent: number;
  unit_of_measurement: string;
  quantity_per_unit: number;
  certification: string;
  harvest_date: string;
  expiration_date: string;
};

type SeedProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  origin: string;
  categoryId: string;
  thumbnail: string;
  images?: string[];
  rating: number;
  numberOfReview: number;
  sold: number;
  hot?: boolean;
  supplierId: string;
  attributes: SeedAttribute[];
};

const seedProductsRaw: SeedProduct[] = [
  {
    id: "prd-sau-rieng-rieng-vang",
    name: "Sầu riêng Riêng Vàng",
    slug: "sau-rieng-rieng-vang",
    description:
      "Sầu riêng Riêng Vàng Tiền Giang thu hoạch đúng vụ, cơm vàng đặc, hạt lép và mùi thơm đậm đà. Trái được chọn lọc từ vườn, không thuốc trừ sâu, giữ nguyên hương vị khi vận chuyển.",
    origin: "Tiền Giang",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/fruite-item-3.jpg",
    images: ["/image/fruite-item-3.jpg", "/image/banner-fruits.jpg"],
    rating: 4.8,
    numberOfReview: 126,
    sold: 320,
    hot: true,
    supplierId: "sup-tiengiang",
    attributes: [
      {
        weight: 1,
        original_price: 165000,
        discounted_percent: 12,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-05-18",
        expiration_date: "2026-07-18",
      },
      {
        weight: 3,
        original_price: 158000,
        discounted_percent: 12,
        unit_of_measurement: "kg",
        quantity_per_unit: 3,
        certification: "VietGAP",
        harvest_date: "2026-05-18",
        expiration_date: "2026-07-18",
      },
    ],
  },
  {
    id: "prd-xoai-cat-hoa-loc",
    name: "Xoài cát Hòa Lộc",
    slug: "xoai-cat-hoa-loc",
    description:
      "Xoài cát Hòa Lộc Đồng Nai có cơm dày, ngọt đậm, hạt lép và mùi thơm đặc trưng. Trái chín cây, độ đường 18-20°Bx, phù hợp ăn tươi và làm sinh tố.",
    origin: "Đồng Nai",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/fruite-item-5.jpg",
    rating: 4.6,
    numberOfReview: 88,
    sold: 210,
    hot: true,
    supplierId: "sup-tiengiang",
    attributes: [
      {
        weight: 1,
        original_price: 59000,
        discounted_percent: 15,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-05-10",
        expiration_date: "2026-05-28",
      },
      {
        weight: 5,
        original_price: 55000,
        discounted_percent: 15,
        unit_of_measurement: "kg",
        quantity_per_unit: 5,
        certification: "VietGAP",
        harvest_date: "2026-05-10",
        expiration_date: "2026-05-28",
      },
    ],
  },
  {
    id: "prd-bo-sap-034",
    name: "Bơ sáp 034",
    slug: "bo-sap-034",
    description:
      "Bơ sáp 034 Đắk Lắk có cơm vàng dẻo, hạt lép, vị béo ngậy. Canh tác hữu cơ theo mô hình VietGAP, không thuốc diệt cỏ, đóng gói từng trái để bảo quản tốt.",
    origin: "Đắk Lắk",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/fruite-item-2.jpg",
    rating: 4.7,
    numberOfReview: 94,
    sold: 178,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 1,
        original_price: 98000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-05-02",
        expiration_date: "2026-06-02",
      },
      {
        weight: 2,
        original_price: 94000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 2,
        certification: "VietGAP",
        harvest_date: "2026-05-02",
        expiration_date: "2026-06-02",
      },
    ],
  },
  {
    id: "prd-nho-xanh-tay-ninh",
    name: "Nho xanh",
    slug: "nho-xanh-tay-ninh",
    description:
      "Nho xanh Tây Ninh hạt tròn, vị ngọt thanh, dày hạt và không chua. Canh tác theo tiêu chuẩn VietGAP trong nhà kính, giúp kiểm soát thuốc bảo vệ thực vật.",
    origin: "Tây Ninh",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/fruite-item-6.jpg",
    rating: 4.4,
    numberOfReview: 57,
    sold: 143,
    supplierId: "sup-tiengiang",
    attributes: [
      {
        weight: 1,
        original_price: 78000,
        discounted_percent: 18,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-04-28",
        expiration_date: "2026-05-20",
      },
    ],
  },
  {
    id: "prd-banh-chuoi-tay-ninh",
    name: "Bánh chuối",
    slug: "banh-chuoi-tay-ninh",
    description:
      "Bánh chuối Tây Ninh chín vàng đều, thịt dày, ngọt đậm và thơm. Thu hoạc từ vườn không thuốc trừ sâu, đóng gói theo bó để giữ độ tươi.",
    origin: "Tây Ninh",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/fruite-item-4.jpg",
    rating: 4.5,
    numberOfReview: 61,
    sold: 190,
    supplierId: "sup-tiengiang",
    attributes: [
      {
        weight: 1,
        original_price: 32000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-05-05",
        expiration_date: "2026-05-19",
      },
      {
        weight: 5,
        original_price: 30000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 5,
        certification: "VietGAP",
        harvest_date: "2026-05-05",
        expiration_date: "2026-05-19",
      },
    ],
  },
  {
    id: "prd-dua-hau-ruot-do",
    name: "Dưa hấu ruột đỏ",
    slug: "dua-hau-ruot-do",
    description:
      "Dưa hấu ruột đỏ Long An có vị ngọt thanh, độ đường 12-14°Bx, hạt chắc. Trồng theo phương pháp hữu cơ, không sử dụng thuốc tăng trưởng.",
    origin: "Long An",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/fruite-item-1.jpg",
    rating: 4.3,
    numberOfReview: 42,
    sold: 118,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 1,
        original_price: 28000,
        discounted_percent: 0,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "Hữu cơ",
        harvest_date: "2026-05-12",
        expiration_date: "2026-05-26",
      },
    ],
  },
  {
    id: "prd-ca-chua-bi",
    name: "Cà chua bi",
    slug: "ca-chua-bi",
    description:
      "Cà chua bi Đà Lạt trồng trong nhà kính, quả nhỏ đều, vị đậm ngọt, dày thịt và giàu vitamin C. Thu hái khi chín 70% để giữ độ tươi khi vận chuyển.",
    origin: "Đà Lạt",
    categoryId: "cat-rau-cu-huu-co",
    thumbnail: "/image/vegetable-item-4.jpg",
    rating: 4.6,
    numberOfReview: 73,
    sold: 205,
    hot: true,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 0.5,
        original_price: 45000,
        discounted_percent: 15,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "GlobalG.A.P",
        harvest_date: "2026-05-20",
        expiration_date: "2026-06-03",
      },
      {
        weight: 1,
        original_price: 42000,
        discounted_percent: 15,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "GlobalG.A.P",
        harvest_date: "2026-05-20",
        expiration_date: "2026-06-03",
      },
    ],
  },
  {
    id: "prd-rau-muong",
    name: "Rau muống",
    slug: "rau-muong",
    description:
      "Rau muống Đồng Nai non mềm, xanh đậm, thân giòn và ngọt. Trồng trong ruộng không thuốc diệt cỏ, thu hái buổi sáng để giữ độ tươi.",
    origin: "Đồng Nai",
    categoryId: "cat-rau-cu-huu-co",
    thumbnail: "/image/vegetable-item-6.jpg",
    rating: 4.2,
    numberOfReview: 35,
    sold: 96,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 0.5,
        original_price: 16000,
        discounted_percent: 0,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "Hữu cơ",
        harvest_date: "2026-05-21",
        expiration_date: "2026-05-28",
      },
    ],
  },
  {
    id: "prd-ca-rok",
    name: "Cà rốt",
    slug: "ca-rok",
    description:
      "Cà rốt Đà Lạt thân to, ngọt bét, giàu beta-caroten. Canh tác hữu cơ trong nhà kính, không dùng thuốc diệt cỏ, đóng gói theo bó.",
    origin: "Đà Lạt",
    categoryId: "cat-rau-cu-huu-co",
    thumbnail: "/image/vegetable-item-1.jpg",
    rating: 4.5,
    numberOfReview: 48,
    sold: 132,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 1,
        original_price: 32000,
        discounted_percent: 12,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "GlobalG.A.P",
        harvest_date: "2026-05-19",
        expiration_date: "2026-06-02",
      },
    ],
  },
  {
    id: "prd-bap-cai-trang",
    name: "Bắp cải trắng",
    slug: "bap-cai-trang",
    description:
      "Bắp cải trắng Đà Lạt búp to, lá xanh, vị ngọt và giòn. Trồng hữu cơ trong điều kiện thời tiết mát mẻ, thu hái khi búp đạt kích thước chuẩn.",
    origin: "Đà Lạt",
    categoryId: "cat-rau-cu-huu-co",
    thumbnail: "/image/vegetable-item-2.jpg",
    rating: 4.3,
    numberOfReview: 29,
    sold: 87,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 1,
        original_price: 26000,
        discounted_percent: 0,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "Hữu cơ",
        harvest_date: "2026-05-20",
        expiration_date: "2026-06-03",
      },
    ],
  },
  {
    id: "prd-khoai-lang-dong-nai",
    name: "Khoai lang Đồng Nai",
    slug: "khoai-lang-dong-nai",
    description:
      "Khoai lang Đồng Nai bột nhiều, ngọt và thơm, củ to đều. Trồng trên đất cát, không thuốc trừ sâu, bảo quản tốt trong điều kiện thường.",
    origin: "Đồng Nai",
    categoryId: "cat-nong-san-sach",
    thumbnail: "/image/vegetable-item-5.jpg",
    rating: 4.4,
    numberOfReview: 33,
    sold: 145,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 2,
        original_price: 24000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 2,
        certification: "VietGAP",
        harvest_date: "2026-04-30",
        expiration_date: "2026-07-30",
      },
      {
        weight: 5,
        original_price: 22000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 5,
        certification: "VietGAP",
        harvest_date: "2026-04-30",
        expiration_date: "2026-07-30",
      },
    ],
  },
  {
    id: "prd-gao-lut-lang-que",
    name: "Gạo lứt Làng quê",
    slug: "gao-lut-lang-que",
    description:
      "Gạo lứt Làng quê Sóc Trăng hạt dài, cơm dẻo thơm, giữ trọn lớp cám giàu chất xơ. Xay xát nhẹ, đóng gì túi hút chân không.",
    origin: "Sóc Trăng",
    categoryId: "cat-nong-san-sach",
    thumbnail: "/image/best-product-5.jpg",
    rating: 4.7,
    numberOfReview: 112,
    sold: 380,
    hot: true,
    supplierId: "sup-tiengiang",
    attributes: [
      {
        weight: 1,
        original_price: 42000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP, PGS",
        harvest_date: "2026-04-15",
        expiration_date: "2027-04-15",
      },
      {
        weight: 5,
        original_price: 39000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 5,
        certification: "VietGAP, PGS",
        harvest_date: "2026-04-15",
        expiration_date: "2027-04-15",
      },
    ],
  },
  {
    id: "prd-thit-bo-moc-chau",
    name: "Thịt bò Mộc Châu",
    slug: "thit-bo-moc-chau",
    description:
      "Thịt bò Mộc Châu thăn mềm, mỡ trắng, thịt ngọt. Chăn nuôi thả trong vườn, không dùng kháng sinh, khúc thịt được kiểm định định kỳ.",
    origin: "Sơn La",
    categoryId: "cat-thit-thuy-hai-san",
    thumbnail: "/image/best-product-1.jpg",
    rating: 4.8,
    numberOfReview: 96,
    sold: 165,
    hot: true,
    supplierId: "sup-mocchau-organic",
    attributes: [
      {
        weight: 1,
        original_price: 245000,
        discounted_percent: 8,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "GlobalG.A.P",
        harvest_date: "2026-05-20",
        expiration_date: "2026-05-24",
      },
    ],
  },
  {
    id: "prd-thit-ga-ta",
    name: "Gà ta thảo",
    slug: "thit-ga-ta",
    description:
      "Gà ta thảo vườn Sơn La thịt chắc, da vàng, dịch vị thơm. Nuôi thả tự nhiên trong vườn rộng, không dùng thuốc tăng trưởng.",
    origin: "Sơn La",
    categoryId: "cat-thit-thuy-hai-san",
    thumbnail: "/image/best-product-2.jpg",
    rating: 4.6,
    numberOfReview: 71,
    sold: 140,
    supplierId: "sup-mocchau-organic",
    attributes: [
      {
        weight: 1,
        original_price: 135000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "GlobalG.A.P",
        harvest_date: "2026-05-20",
        expiration_date: "2026-05-24",
      },
    ],
  },
  {
    id: "prd-tom-su-camau",
    name: "Tôm sú",
    slug: "tom-su-camau",
    description:
      "Tôm sú Cà Mau thịt chắc, ngọt, size 30-40 con/kg. Nuôi lồng theo phương pháp truy xuất nguồn gốc, đông lạnh nhanh ngay sau khai thác.",
    origin: "Cà Mau",
    categoryId: "cat-thit-thuy-hai-san",
    thumbnail: "/image/best-product-3.jpg",
    rating: 4.5,
    numberOfReview: 54,
    sold: 112,
    supplierId: "sup-camau-seafood",
    attributes: [
      {
        weight: 1,
        original_price: 235000,
        discounted_percent: 12,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "ASC, VietGAP",
        harvest_date: "2026-05-22",
        expiration_date: "2026-06-22",
      },
    ],
  },
  {
    id: "prd-ca-basa-an-giang",
    name: "Cá basa sạch",
    slug: "ca-basa-an-giang",
    description:
      "Cá basa An Giang thịt trắng, chắc, ít xương, vị ngọt. Nuôi theo tiêu chuẩn VietGAP, không dùng kháng sinh, đóng gói và đông lạnh tại nhà máy.",
    origin: "An Giang",
    categoryId: "cat-thit-thuy-hai-san",
    thumbnail: "/image/best-product-4.jpg",
    rating: 4.4,
    numberOfReview: 47,
    sold: 98,
    supplierId: "sup-camau-seafood",
    attributes: [
      {
        weight: 1,
        original_price: 78000,
        discounted_percent: 15,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP, ASC",
        harvest_date: "2026-05-21",
        expiration_date: "2026-06-21",
      },
    ],
  },
  {
    id: "prd-mat-ong-rung",
    name: "Mật ong rừng",
    slug: "mat-ong-rung",
    description:
      "Mật ong rừng Tây Nguyên hoa rừng tự nhiên, đậm và thơm, không pha đường. Nhà nuôi ong khai thác tận rừng, mỗi lần chỉ lấy 60% mật để ong đủ sống.",
    origin: "Kon Tum",
    categoryId: "cat-gia-vi-do-kho",
    thumbnail: "/image/featur-1.jpg",
    rating: 4.9,
    numberOfReview: 134,
    sold: 410,
    hot: true,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 0.5,
        original_price: 145000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP, PGS",
        harvest_date: "2026-03-12",
        expiration_date: "2028-03-12",
      },
      {
        weight: 1,
        original_price: 138000,
        discounted_percent: 10,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP, PGS",
        harvest_date: "2026-03-12",
        expiration_date: "2028-03-12",
      },
    ],
  },
  {
    id: "prd-nam-huong-kho",
    name: "Nấm hương khô",
    slug: "nam-huong-kho",
    description:
      "Nấm hương khô Tây Nguyên nấm thật, hương thơm nồng, vị đậm. Sấy phơi cất giữ mùi, đóng gói hút chân để bảo quản lâu dài.",
    origin: "Kon Tum",
    categoryId: "cat-gia-vi-do-kho",
    thumbnail: "/image/featur-3.jpg",
    rating: 4.7,
    numberOfReview: 63,
    sold: 152,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 0.1,
        original_price: 220000,
        discounted_percent: 5,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "Hữu cơ",
        harvest_date: "2026-02-20",
        expiration_date: "2027-02-20",
      },
    ],
  },
  {
    id: "prd-muoi-bien-mien",
    name: "Muối biển miền",
    slug: "muoi-bien-mien",
    description:
      "Muối biển miền Trung hòa tan bằng nước mưa, hạt mịn, vị dịu và giàu khoáng. Phơi cất trên bể lọc đáy cát, không pha thêm tạp chất.",
    origin: "Khánh Hòa",
    categoryId: "cat-gia-vi-do-kho",
    thumbnail: "/image/featur-2.jpg",
    rating: 4.5,
    numberOfReview: 41,
    sold: 220,
    supplierId: "sup-camau-seafood",
    attributes: [
      {
        weight: 1,
        original_price: 12000,
        discounted_percent: 0,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-01-15",
        expiration_date: "2029-01-15",
      },
    ],
  },
  {
    id: "prd-dua-tu-ben-tre",
    name: "Dừa tươi Bến Tre",
    slug: "dua-tu-ben-tre",
    description:
      "Dừa tươi Bến Tre vỏ xanh, nước dừa ngọt trong, cơm dừa dày béo. Hái xuống chuyển lên vườn trong ngày, giữ độ tươi và vị ngọt tự nhiên.",
    origin: "Bến Tre",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/banner-fruits.jpg",
    rating: 4.6,
    numberOfReview: 79,
    sold: 260,
    supplierId: "sup-bentre-coconut",
    attributes: [
      {
        weight: 1,
        original_price: 25000,
        discounted_percent: 0,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-05-22",
        expiration_date: "2026-05-29",
      },
    ],
  },
  {
    id: "prd-tau-kho",
    name: "Táo khỏa",
    slug: "tao-khoa",
    description:
      "Táo khỏa Đà Lạt quả to, vỏ đỏ, cơm ngọt giòn và tỷ lệ thịt cao. Trồng hữu cơ trong vườn, thu hoạch thủ công và tuyển từng trái.",
    origin: "Đà Lạt",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/fruite-item-1.jpg",
    rating: 4.7,
    numberOfReview: 103,
    sold: 295,
    hot: true,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 1,
        original_price: 78000,
        discounted_percent: 15,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "GlobalG.A.P",
        harvest_date: "2026-05-15",
        expiration_date: "2026-06-12",
      },
      {
        weight: 5,
        original_price: 72000,
        discounted_percent: 15,
        unit_of_measurement: "kg",
        quantity_per_unit: 5,
        certification: "GlobalG.A.P",
        harvest_date: "2026-05-15",
        expiration_date: "2026-06-12",
      },
    ],
  },
  {
    id: "prd-choi",
    name: "Chuối nữ Đồng Nai",
    slug: "chuoi-nu-dong-nai",
    description:
      "Chuối nữ Đồng Nai quả thon, thịt ngọt đậm, hương thơm. Trồng xen canh trong vườn cacao, không thuốc trừ sâu, chuối chín chín tự nhiên trên cây.",
    origin: "Đồng Nai",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/fruite-item-4.jpg",
    rating: 4.5,
    numberOfReview: 66,
    sold: 175,
    supplierId: "sup-tiengiang",
    attributes: [
      {
        weight: 1,
        original_price: 30000,
        discounted_percent: 8,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-05-14",
        expiration_date: "2026-05-24",
      },
    ],
  },
  {
    id: "prd-mit-thanh-mat",
    name: "Mít Thanh Mát",
    slug: "mit-thanh-mat",
    description:
      "Mít Thanh Mát Bến Tre, múi mít dày, hạt lép và ít xơ. Trái chín cây, độ đường cao, mùi thơm dịu. Giá bán theo từng trái từ 8 kg trở lên.",
    origin: "Bến Tre",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/fruite-item-2.jpg",
    images: ["/image/fruite-item-2.jpg", "/image/banner-fruits.jpg"],
    rating: 4.6,
    numberOfReview: 74,
    sold: 168,
    hot: true,
    supplierId: "sup-tiengiang",
    attributes: [
      {
        weight: 1,
        original_price: 95000,
        discounted_percent: 10,
        unit_of_measurement: "cái",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-05-20",
        expiration_date: "2026-06-05",
      },
      {
        weight: 2,
        original_price: 185000,
        discounted_percent: 10,
        unit_of_measurement: "cái",
        quantity_per_unit: 2,
        certification: "VietGAP",
        harvest_date: "2026-05-20",
        expiration_date: "2026-06-05",
      },
    ],
  },
  {
    id: "prd-le-muc-quy-nhon",
    name: "Lê mắc quy nhơn",
    slug: "le-mac-quy-nhon",
    description:
      "Lê mắc Quy Nhơn Bình Định, vỏ vàng đẹp, cơm trắng ngọt và mùi thơm đặc trưng. Trái được chọn từ vườn, bảo quản trong hộp xốp có lót mút.",
    origin: "Bình Định",
    categoryId: "cat-trai-cay-tuoi",
    thumbnail: "/image/fruite-item-5.jpg",
    rating: 4.4,
    numberOfReview: 52,
    sold: 132,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 1,
        original_price: 65000,
        discounted_percent: 12,
        unit_of_measurement: "kg",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-05-17",
        expiration_date: "2026-06-02",
      },
    ],
  },
  {
    id: "prd-cai-be-thuy-hai-san",
    name: "Cải bê thủy hải sản",
    slug: "cai-be-thuy-hai-san",
    description:
      "Cải bê tươi bóc sẵn từ cả bế tươi, thịt trắng ngọt, không tanh. Đóng gói hút chân không, giữ được độ tươi trong 3 ngày.",
    origin: "Cà Mau",
    categoryId: "cat-thit-thuy-hai-san",
    thumbnail: "/image/single-item.jpg",
    rating: 4.5,
    numberOfReview: 61,
    sold: 145,
    supplierId: "sup-camau-seafood",
    attributes: [
      {
        weight: 1,
        original_price: 120000,
        discounted_percent: 8,
        unit_of_measurement: "hộp",
        quantity_per_unit: 1,
        certification: "VietGAP, ASC",
        harvest_date: "2026-05-22",
        expiration_date: "2026-05-25",
      },
    ],
  },
  {
    id: "prd-nuoc-mia-tay-uyen",
    name: "Nước mía tươi",
    slug: "nuoc-mia-tuoi",
    description:
      "Nước mía tươi ép từ cây mía Bến Tre, không pha thêm nước, không hương liệu. Giữ nguyên vị ngọt tự nhiên, đóng chai thủy tinh 1 lít.",
    origin: "Bến Tre",
    categoryId: "cat-nong-san-sach",
    thumbnail: "/image/featur-2.jpg",
    rating: 4.7,
    numberOfReview: 118,
    sold: 320,
    hot: true,
    supplierId: "sup-tiengiang",
    attributes: [
      {
        weight: 1,
        original_price: 25000,
        discounted_percent: 0,
        unit_of_measurement: "chai",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-05-23",
        expiration_date: "2026-05-30",
      },
      {
        weight: 5,
        original_price: 24000,
        discounted_percent: 0,
        unit_of_measurement: "chai",
        quantity_per_unit: 5,
        certification: "VietGAP",
        harvest_date: "2026-05-23",
        expiration_date: "2026-05-30",
      },
    ],
  },
  {
    id: "prd-thien-ran-say-de",
    name: "Thiên ra sấy khô",
    slug: "thien-ra-say-kho",
    description:
      "Thiên ra (nấm sương) sấy khô tự nhiên, không pha màu, giữ nguyên mùi và giá trị dinh dưỡng. Đóng gói hút chân không, giữ khô tự nhiên.",
    origin: "Tây Nguyên",
    categoryId: "cat-gia-vi-do-kho",
    thumbnail: "/image/featur-1.jpg",
    rating: 4.3,
    numberOfReview: 47,
    sold: 118,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 1,
        original_price: 220000,
        discounted_percent: 15,
        unit_of_measurement: "hộp",
        quantity_per_unit: 1,
        certification: "PGS",
        harvest_date: "2026-03-20",
        expiration_date: "2027-03-20",
      },
    ],
  },
  {
    id: "prd-rau-muong-huu-co-hop",
    name: "Rau muống hữu cơ",
    slug: "rau-muong-huu-co-hop",
    description:
      "Rau muống hữu cơ Đà Lạt, thân giòn, lá xanh đậm và không sâu. Cắt bằng tay, đóng gói theo hộp 500 g thuận tiện cho gia đình.",
    origin: "Đà Lạt",
    categoryId: "cat-rau-cu-huu-co",
    thumbnail: "/image/vegetable-item-1.jpg",
    rating: 4.6,
    numberOfReview: 84,
    sold: 240,
    hot: true,
    supplierId: "sup-dalat-organic",
    attributes: [
      {
        weight: 1,
        original_price: 18000,
        discounted_percent: 10,
        unit_of_measurement: "hộp",
        quantity_per_unit: 1,
        certification: "VietGAP",
        harvest_date: "2026-05-24",
        expiration_date: "2026-05-29",
      },
      {
        weight: 5,
        original_price: 17000,
        discounted_percent: 10,
        unit_of_measurement: "hộp",
        quantity_per_unit: 5,
        certification: "VietGAP",
        harvest_date: "2026-05-24",
        expiration_date: "2026-05-29",
      },
    ],
  },
];

/** The seeded products, ready to be consumed by the API layer. */
export const seedProducts: productTypes[] = seedProductsRaw.map((item) => {
  const supplier = seedSuppliers.find((s) => s._id === item.supplierId);

  return {
    _id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    origin: item.origin,
    sold: item.sold,
    thumbnail_url: item.thumbnail,
    images: (item.images ?? [item.thumbnail]).map((url, index) => ({
      _id: `${item.id}-img-${index}`,
      url,
    })),
    rating: item.rating,
    numberOfReview: item.numberOfReview,
    hot: item.hot ?? false,
    category: categoryById(item.categoryId),
    category_id: item.categoryId,
    supplier,
    hashtags: [],
    productAttributes: item.attributes.map((attribute, index) => ({
      _id: `${item.id}-attr-${index}`,
      product_id: item.id,
      weight: attribute.weight,
      original_price: attribute.original_price,
      discounted_percent: attribute.discounted_percent,
      unit_of_measurement: attribute.unit_of_measurement,
      quantity_per_unit: attribute.quantity_per_unit,
      certification: attribute.certification,
      harvest_date: attribute.harvest_date,
      expiration_date: attribute.expiration_date,
      discount_price: Math.round(
        attribute.original_price * (1 - attribute.discounted_percent / 100)
      ),
      total_price: Math.round(
        attribute.original_price *
          (1 - attribute.discounted_percent / 100) *
          attribute.weight
      ),
      quantity: 100,
    })),
    price: Math.round(
      item.attributes[0].original_price *
        (1 - item.attributes[0].discounted_percent / 100)
    ),
    total_price: Math.round(
      item.attributes[0].original_price *
        (1 - item.attributes[0].discounted_percent / 100) *
        item.attributes[0].weight
    ),
  };
});

/* -------------------------------------------------------------------------- */
/*                                    blogs                                    */
/* -------------------------------------------------------------------------- */

export const seedBlogs: BlogType[] = [
  {
    _id: "blog-huong-dan-nong-san-sach",
    author_name: "Ban biên tập Agrimarket",
    title: "Cách chọn nông sản sạch tươi mới mỗi ngày",
    description:
      "Những tiêu chí thực tế để nhận biết rau củ, trái cây đạt chuẩn VietGAP khi mua ngoài chợ.",
    detail:
      "Nông sản sạch không chỉ nằm ở mẫu mã trên bao bì mà còn thể hiện ở cách trồng, cách bảo quản và cả độ tươi khi rau củ còn nguyên lá, nguyên cuống.\n\n1. Nhìn mắt và rời: lá rau củ hữu cơ thường to, dày, màu xanh đậm và có độ bóng tự nhiên. Rau bị già, úng vàng thường đã mất nước và dinh dưỡng.\n\n2. Cầm và cảm: trái cây đúng vụ có mùi thơm đặc trưng ngay ở lớp vỏ. Sầu riêng Riêng Vàng chín cây sẽ có mùi rất rõ, còn trái xanh vỏ lạnh thì cơm thường chưa chín đều.\n\n3. Ưu tiên sản phẩm truy xuất nguồn gốc: các đơn vị đạt VietGAP hoặc GlobalG.A.P đều có mã vùng trồng, ngày thu hoạch và giấy kiểm định tương ứng.\n\n4. Bảo quản đúng cách: rau lá nên rửa sạch, để ráo rồi bảo quản trong hộp thông gió ở ngăn mát từ 2-6 độ C. Trái cây nhiệt đới không nên cấp đông.\n\nTại Agrimarket, mỗi lô hàng đều được lấy mẫu kiểm nghiệm trước khi đưa lên sàn, đảm bảo sản phẩm bạn nhận đúng với mô tả.",
    status: "Published",
    thumbnail: "/image/vov_sla_synb.jpg",
    views_count: 2451,
    comments_count: 18,
    likes_count: 132,
    report_count: 0,
  },
  {
    _id: "blog-sau-rieng-mua-dip-tết",
    author_name: "Nguyễn Văn Hùng",
    title: "Bí quyết chọn sầu riêng ngon đúng vụ",
    description:
      "Nhận biết sầu riêng Riêng Vàng chín khúc, cơm vàng dẻo bằng mẹo bóp nhẹ và quan sát vỏ.",
    detail:
      "Sầu riêng là loại trái cây được ưa chuộng nhất vào dịp Tết và cả quanh năm. Để chọn được trái ngon, bạn nên chú ý những điểm sau:\n\n- Vỏ nâu đều, hơi nứt nhẹ là dấu hiệu trái chín tự nhiên, cơm sẽ dày và béo.\n- Bấm nhẹ vào phần gai gần cuống, nếu thấy hơi mềm thì cơm đã chín.\n- Lắc nhẹ, nếu nghe tiếng rung rõ và cảm nhận hạt lép bên trong thì độ chín vừa phải.\n- Tránh mua trái có vỏ xanh đậm đồng đều và không có vết nứt, đây thường là trái xị hoặc chín bằng hoá chất.\n\nSầu riêng Tiền Giang thường được thu hoạch từ tháng 4 đến tháng 7 hàng năm. Tại Agrimarket, sầu riêng được thu mua trực tiếp tại vườn và chuyển lên kho lạnh trong vòng 24 giờ nên độ tươi luôn được giữ tốt.",
    status: "Published",
    thumbnail: "/image/banner-fruits.jpg",
    views_count: 1893,
    comments_count: 12,
    likes_count: 96,
    report_count: 0,
  },
  {
    _id: "blog-rau-cu-huu-co-loi",
    author_name: "Lê Minh Tuấn",
    title: "Rau củ hữu cơ khác rau thông thường ở đâu?",
    description:
      "So sánh dinh dưỡng, vị ngon và giá trị của rau hữu cơ với rau trồng truyền thống.",
    detail:
      "Rau củ hữu cơ được canh tác theo nguyên tắc không dùng phân bón hoá học tổng hợp, không dùng thuốc trừ sâu và không dùng hạt giống biến đổi gen.\n\nVề dinh dưỡng: nhiều nghiên cứu cho thấy rau hữu cơ thường có hàm lượng chất chống oxy hóa cao hơn một chút, đặc biệt là khi canh tác trong điều kiện thuỷ canh trong nhà kính.\n\nVề cảm quan: rau hữu cơ thường nhạt hơn, giòn hơn và giữ mùi đặc trưng của giống rau vì không bị thuốc bảo vệ thực vật tác động.\n\nVề giá trị kinh tế: giá cao hơn từ 20-40% là điều không tránh khỏi, đổi lại bạn có giấy tờ chứng nhận rõ ràng và nông sản được thu mua theo hợp đồng bao tiêu với nông dân.\n\nTại Agrimarket, tất cả nông sản hữu cơ đều có chứng nhận GlobalG.A.P hoặc VietGAP kèm theo, bạn có thể tra cứu ngay trên trang chi tiết sản phẩm.",
    status: "Published",
    thumbnail: "/image/vegetable-item-3.png",
    views_count: 1520,
    comments_count: 9,
    likes_count: 78,
    report_count: 0,
  },
  {
    _id: "blog-bao-quan-rau-cu",
    author_name: "Ban biên tập Agrimarket",
    title: "Bảo quản rau củ tươi lâu hơn trong tủ lạnh",
    description:
      "Mẹo rửa, đóng gói và sắp xếp giúp rau củ giữ được 5-7 ngày mà không héo.",
    detail:
      "Phần lớn rau củ bị héo nhanh không phải vì không có tủ lạnh mà vì sai cách bảo quản.\n\n1. Không rửa trước khi cất: nước tạo môi trường ẩm cho nấm phát triển. Nếu cần rửa, hãy lau sạch bằng khăn ẩm.\n\n2. Tách từng phần: bó rau nên tháo rời từng câu, gỡ bớt lá vàng và cắt hết phần gốc đã già.\n\n3. Dùng khăn giấy: đặt một lớp khăn giấy khô trong hộp chứa rau sẽ hút bớt độ ẩm dư thừa.\n\n4. Đặt đúng ngăn: rau lá nên để ngăn mát từ 2-6 độ C, cà chua và ớt nên để ngăn nhiệt độ thường để vị không bị ngu.\n\n5. Tách biệt khí ethylene: chuối, bơ và cà chua tạo khí ethylene làm rau lá và các loại củ nhanh già. Hãy cất riêng.",
    status: "Published",
    thumbnail: "/image/single-item.jpg",
    views_count: 1284,
    comments_count: 7,
    likes_count: 64,
    report_count: 0,
  },
  {
    _id: "blog-thit-sach-an-toan",
    author_name: "Võ Thị Mai",
    title: "Thịt sạch và những điều người tiêu dùng cần biết",
    description:
      "Nhận biết thịt tươi, hiểu ý nghĩa của chứng nhận và cách bảo quản thịt trong tủ lạnh.",
    detail:
      "Thịt tươi có màu hồng tươi, bề mặt hơi ẩm, thịt có độ đàn hồi khi ấn nhẹ và mùi tươi đặc trưng của thịt.\n\nNếu thịt có màu xám xanh bên trong, bề mặt khô bóng hoặc mùi tanh nhẹ, đó là dấu hiệu bảo quản không đúng hoặc đã để lâu.\n\nTại Agrimarket, thịt bò Mộc Châu và gà ta thảo Sơn La đều đến từ các trang trại đạt GlobalG.A.P. Khúc thịt được kiểm định định kỳ bởi cơ quan độc lập và vận chuyển trong chuỗi lạnh duy trì ở 0-4 độ C.\n\nBảo quản tại nhà: chia thịt thành từng phần nhỏ vừa ăn, đặt trong hộp kín và bảo quản ngăn đông dưới -18 độ C nếu dùng trong 3 tháng. Thịt đã lên đông không nên rã đông lặp lại nhiều lần.",
    status: "Published",
    thumbnail: "/image/best-product-1.jpg",
    views_count: 987,
    comments_count: 5,
    likes_count: 51,
    report_count: 0,
  },
  {
    _id: "blog-xu-huong-nong-san-2026",
    author_name: "Ban biên tập Agrimarket",
    title: "Xu hướng nông sản sạch năm 2026",
    description:
      "Truy xuất nguồn gốc, bao bì tái chế và nông sản giàu dinh dưỡng là xu hướng người tiêu dùng quan tâm nhất.",
    detail:
      "Ngành nông sản Việt Nam đang chuyển mình mạnh sang nền sản xuất thông minh và bền vững.\n\n- Truy xuất nguồn gốc bắt buộc: mã QR trên bao bì giúp người tiêu dùng thấy toàn bộ chuỗi từ vườn đến kho. Tại Agrimarket, mọi sản phẩm đều có thông tin truy xuất.\n\n- Bao bì tái chế: túi giấy, hộp thực vật và nhựa sinh học thay thế dần bao bì nhựa dùng một lần.\n\n- Nông sản giàu dinh dưỡng: các giống rau được tạo để có hàm lượng chất chống oxy hóa cao hơn, thích hợp cho người ăn kiêng giảm dị ứng.\n\n- Bao bì nhỏ gọn: nhiều nhà bán lẻ chuyển sang khay 250g và 500g để giảm lãng phí thực phẩm.\n\nXu hướng này không chỉ là câu chuyện marketing: các hợp tác xã và trang trại trong hệ thống của chúng tôi đã bắt đầu chuyển đổi từ năm 2024 và hiện có hơn 60% sản lượng đạt chuẩn truy xuất.",
    status: "Published",
    thumbnail: "/image/featur-2.jpg",
    views_count: 764,
    comments_count: 4,
    likes_count: 39,
    report_count: 0,
  },
  {
    _id: "blog-mat-ong-rung",
    author_name: "Lê Minh Tuấn",
    title: "Mật ong rừng khác mật ong nuôi như thế nào?",
    description:
      "Màu sắc, vị, độ đặc và quy trình khai thác quyết định chất lượng mật ong rừng.",
    detail:
      "Mật ong rừng thu hoạc từ tổ ong tự dựng trong rừng tự nhiên, mật có màu đậm, vị đậm và có mùi hoa rừng đặc trưng. Mật ong nuôi thường sánh, màu sáng hơn và vị đồng đều hơn.\n\nMột tổ ong rừng chỉ được khai thác tối đa 60% lượng mật, phần còn lại dành cho ong sống qua mùa đông. Đây là quy tắc bắt buộc trong khai thác ong rừng đúng quy cách.\n\nKhi mua, hãy chọn mật có độ đặc vừa phải, không bị lên men rượu, không lẫn tạp chất. Mật ong để lâu có thể kết tinh, đó là hiện tượng bình thường và không ảnh hưởng chất lượng.\n\nMật ong rừng Tây Nguyên tại Agrimarket có chứng nhận VietGAP kèm theo và được đóng hộp thủy tinh hút chân để bảo quản tốt.",
    status: "Published",
    thumbnail: "/image/featur-1.jpg",
    views_count: 612,
    comments_count: 3,
    likes_count: 28,
    report_count: 0,
  },
  {
    _id: "blog-draft-phuong-an-boi-duong",
    author_name: "Ban biên tập Agrimarket",
    title: "Phương án bồi dưỡng đất cho vườn rau hữu cơ",
    description:
      "Bài viết đang được biên tập, sẽ xuất bản sau.",
    detail: "Bài viết đang được hoàn thiện.",
    status: "Draft",
    thumbnail: "/image/cart-page-header-img.jpg",
    views_count: 0,
    comments_count: 0,
    likes_count: 0,
    report_count: 0,
  },
];

/* -------------------------------------------------------------------------- */
/*                                   banners                                   */
/* -------------------------------------------------------------------------- */

export const seedBanners: BannerType[] = [
  {
    _id: "banner-nong-san-sach",
    slug: "nong-san-sach",
    url: "/image/hero-img-1.png",
    description: "Nông sản sạch chuẩn VietGAP đến từ vườn Đà Lạt",
    link: "/shop?category=cat-nong-san-sach",
  },
  {
    _id: "banner-trai-cay-tuoi",
    slug: "trai-cay-tuoi",
    url: "/image/banner-fruits.jpg",
    description: "Trái cây tươi thu hoạch đúng vụ, giá tốt tại vườn",
    link: "/shop?category=cat-trai-cay-tuoi",
  },
  {
    _id: "banner-rau-cu-huu-co",
    slug: "rau-cu-huu-co",
    url: "/image/hero-img-2.jpg",
    description: "Rau củ hữu cơ canh tác không thuốc trừ sâu",
    link: "/shop?category=cat-rau-cu-huu-co",
  },
  {
    _id: "banner-thit-thuy-hai-san",
    slug: "thit-thuy-hai-san",
    url: "/image/single-item.jpg",
    description: "Thịt và thủy sản tươi trong chuỗi lạnh",
    link: "/shop?category=cat-thit-thuy-hai-san",
  },
  {
    _id: "banner-gia-vi-do-kho",
    slug: "gia-vi-do-kho",
    url: "/image/featur-2.jpg",
    description: "Gia vị và đồ khô đặc sản Tây Nguyên",
    link: "/shop?category=cat-gia-vi-do-kho",
  },
];

/* -------------------------------------------------------------------------- */
/*                                   hashtags                                  */
/* -------------------------------------------------------------------------- */

export const seedHashtags: HashtagType[] = [
  {
    _id: "tag-huu-co",
    name: "#HuuCo",
    slug: "huu-co",
    type: "product",
    description: "Sản phẩm canh tác hữu cơ, không thuốc trừ sâu",
    usage_count: 42,
    isTrending: true,
  },
  {
    _id: "tag-vietgap",
    name: "#VietGAP",
    slug: "vietgap",
    type: "product",
    description: "Sản phẩm đạt chuẩn VietGAP của Việt Nam",
    usage_count: 38,
    isTrending: true,
  },
  {
    _id: "tag-trai-cay",
    name: "#TraiCay",
    slug: "trai-cay",
    type: "product",
    description: "Trái cây tươi thu hoạch đúng vụ",
    usage_count: 55,
    isTrending: true,
  },
  {
    _id: "tag-rau-cu",
    name: "#RauCu",
    slug: "rau-cu",
    type: "product",
    description: "Rau củ an toàn cho bữa ăn gia đình",
    usage_count: 47,
    isTrending: false,
  },
  {
    _id: "tag-dalat",
    name: "#DaLat",
    slug: "da-lat",
    type: "product",
    description: "Đặc sản vùng cao nguyên Đà Lạt",
    usage_count: 31,
    isTrending: true,
  },
  {
    _id: "tag-tien-giang",
    name: "#TienGiang",
    slug: "tien-giang",
    type: "product",
    description: "Trái cây miền Tây giàu vitamin",
    usage_count: 26,
    isTrending: false,
  },
  {
    _id: "tag-mat-ong",
    name: "#MatOng",
    slug: "mat-ong",
    type: "product",
    description: "Mật ong rừng nguyên chất từ Tây Nguyên",
    usage_count: 18,
    isTrending: false,
  },
  {
    _id: "tag-thit-sach",
    name: "#ThitSach",
    slug: "thit-sach",
    type: "product",
    description: "Thịt tươi từ trang trại đạt chuẩn",
    usage_count: 22,
    isTrending: false,
  },
];

/* -------------------------------------------------------------------------- */
/*                                testimonials                                */
/* -------------------------------------------------------------------------- */

export type TestimonialType = {
  id: string;
  name: string;
  role: string;
  rating: number;
  content: string;
  avatar: string;
};

export const seedTestimonials: TestimonialType[] = [
  {
    id: "tst-1",
    name: "Phan Chấn Tây",
    role: "Khách hàng thân thiết",
    rating: 5,
    content:
      "Sầu riêng đúng vụ, cơm vàng dẻo, giao nhanh trong ngày. Mỗi lần đặt đều được hỏi thăm điện thoại trước khi giao.",
    avatar: "/image/testimonial-1.jpg",
  },
  {
    id: "tst-2",
    name: "Nguyễn Văn An",
    role: "Chủ nhà hàng",
    rating: 5,
    content:
      "Tôi lấy rau củ cho nhà hàng mỗi sáng. Rau đều, không sâu, đúng số lượng. Giá ổn hơn chợ ngoài trời nhiều.",
    avatar: "/image/avatar.jpg",
  },
  {
    id: "tst-3",
    name: "Trần Thị B",
    role: "Mẹ bỉm",
    rating: 4,
    content:
      "Rau hữu cơ thật sự khác. Mua cho bé ăn dặm rất yên tâm, có giấy chứng nhận đầy đủ.",
    avatar: "/image/testimonial-1.jpg",
  },
  {
    id: "tst-4",
    name: "Lê Hoàng Nam",
    role: "Nhà bếp",
    rating: 5,
    content:
      "Thịt bò dẻo, giao trong chuỗi lạnh nên vẫn lạnh khi nhận. Nhà hàng của tôi đã chuyển sang nguồn thịt ở đây.",
    avatar: "/image/avatar.jpg",
  },
  {
    id: "tst-5",
    name: "Vũ Thị Mai",
    role: "Khách hàng thân thiết",
    rating: 4,
    content:
      "Đặt giao lức, dưa hấu và xoài đều ngon. Điểm trừ duy nhất là giao hơi lâu vào cuối tuần.",
    avatar: "/image/testimonial-1.jpg",
  },
  {
    id: "tst-6",
    name: "Đặng Quốc Bảo",
    role: "Nhà bảo trì",
    rating: 5,
    content:
      "Mật ong rừng đậm thật, không bị pha đường. Gia đình tôi dùng mỗi ngày, giá hợp lý so với chất lượng.",
    avatar: "/image/avatar.jpg",
  },
];

/* -------------------------------------------------------------------------- */
/*                                 admin data                                 */
/* -------------------------------------------------------------------------- */

export const seedStocks: StockType[] = seedProducts.flatMap((product, index) =>
  product.productAttributes.slice(0, 1).map((attribute, attributeIndex) => ({
    _id: `stk-${product._id}-${attributeIndex}`,
    product_id: product._id,
    product_name: product.name,
    quantity: [120, 64, 35, 88, 52, 96, 140, 45, 73, 30, 210, 40, 55, 26, 18, 310][
      index % 16
    ],
    original_price: attribute.original_price,
    discount_price: attribute.discount_price,
    total_price: attribute.total_price,
    unit_of_measurement: attribute.unit_of_measurement ?? "kg",
    expiration_date: attribute.expiration_date,
    harvest_date: attribute.harvest_date,
    status: index % 7 === 0 ? "Low Stock" : "In Stock",
    created_at: "2026-04-01T02:00:00.000Z",
    updated_at: "2026-05-18T02:00:00.000Z",
  }))
);

export const seedOrders: OrderType[] = [
  {
    _id: "ord-1001",
    user_id: "usr-1001",
    user_name: "Nguyễn Văn An",
    address: "24 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
    phone: "0912 345 678",
    payment_method: "COD",
    note: "Giao sau 17h",
    status: "Delivered",
    total_price: 512000,
    products: [
      { product_id: "prd-sau-rieng-rieng-vang", product_name: "Sầu riêng Riêng Vàng", quantity: 2, price: 145200 },
      { product_id: "prd-mat-ong-rung", product_name: "Mật ong rừng", quantity: 1, price: 124200 },
    ],
    created_at: "2026-05-12T03:24:00.000Z",
    updated_at: "2026-05-13T09:10:00.000Z",
  },
  {
    _id: "ord-1002",
    user_id: "usr-1002",
    user_name: "Trần Thị B",
    address: "128 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    phone: "0938 112 233",
    payment_method: "MoMo",
    status: "Shipped",
    total_price: 268400,
    products: [
      { product_id: "prd-thit-bo-moc-chau", product_name: "Thịt bò Mộc Châu", quantity: 1, price: 225400 },
      { product_id: "prd-ca-chua-bi", product_name: "Cà chua bi", quantity: 1, price: 43000 },
    ],
    created_at: "2026-05-15T07:02:00.000Z",
    updated_at: "2026-05-16T02:40:00.000Z",
  },
  {
    _id: "ord-1003",
    user_id: "usr-1003",
    user_name: "Lê Hoàng Nam",
    address: "77 Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh",
    phone: "0968 445 566",
    payment_method: "VNPay",
    status: "Processing",
    total_price: 356000,
    products: [
      { product_id: "prd-gao-lut-lang-que", product_name: "Gạo lứt Làng quê", quantity: 5, price: 35100 },
      { product_id: "prd-thit-ga-ta", product_name: "Gà ta thảo", quantity: 1, price: 121500 },
      { product_id: "prd-muoi-bien-mien", product_name: "Muối biển miền", quantity: 2, price: 24000 },
    ],
    created_at: "2026-05-17T01:35:00.000Z",
    updated_at: "2026-05-17T04:00:00.000Z",
  },
  {
    _id: "ord-1004",
    user_id: "usr-1004",
    user_name: "Vũ Thị Mai",
    address: "9 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh",
    phone: "0943 778 899",
    payment_method: "COD",
    status: "Pending",
    total_price: 128000,
    products: [
      { product_id: "prd-xoai-cat-hoa-loc", product_name: "Xoài cát Hòa Lộc", quantity: 1, price: 50150 },
      { product_id: "prd-dua-tu-ben-tre", product_name: "Dừa tươi Bến Tre", quantity: 1, price: 25000 },
      { product_id: "prd-tom-su-camau", product_name: "Tôm sú", quantity: 0.2, price: 47600 },
    ],
    created_at: "2026-05-19T02:12:00.000Z",
    updated_at: "2026-05-19T02:12:00.000Z",
  },
  {
    _id: "ord-1005",
    user_id: "usr-1005",
    user_name: "Đặng Quốc Bảo",
    address: "302 Trường Chinh, Quận 12, TP. Hồ Chí Minh",
    phone: "0975 667 788",
    payment_method: "Chuyển khoản",
    note: "Giao giờ hành chính",
    status: "Delivered",
    total_price: 894500,
    products: [
      { product_id: "prd-bo-sap-034", product_name: "Bơ sáp 034", quantity: 2, price: 176400 },
      { product_id: "prd-thit-bo-moc-chau", product_name: "Thịt bò Mộc Châu", quantity: 3, price: 676200 },
    ],
    created_at: "2026-05-08T06:48:00.000Z",
    updated_at: "2026-05-10T01:22:00.000Z",
  },
  {
    _id: "ord-1006",
    user_id: "usr-1006",
    user_name: "Phạm Thị Hồng",
    address: "15 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh",
    phone: "0909 123 456",
    payment_method: "MoMo",
    status: "Cancelled",
    total_price: 74200,
    products: [
      { product_id: "prd-nam-huong-kho", product_name: "Nấm hương khô", quantity: 1, price: 20900 },
      { product_id: "prd-rau-muong", product_name: "Rau muống", quantity: 2, price: 32000 },
    ],
    created_at: "2026-05-11T08:05:00.000Z",
    updated_at: "2026-05-11T10:20:00.000Z",
  },
  {
    _id: "ord-1007",
    user_id: "usr-1007",
    user_name: "Hoàng Minh Tuấn",
    address: "68 Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh",
    phone: "0987 654 321",
    payment_method: "VNPay",
    status: "Processing",
    total_price: 415800,
    products: [
      { product_id: "prd-tao-khoa", product_name: "Táo khỏa", quantity: 2, price: 132600 },
      { product_id: "prd-ca-basa-an-giang", product_name: "Cá basa sạch", quantity: 2, price: 132600 },
      { product_id: "prd-chuoi-nu-dong-nai", product_name: "Chuối nữ Đồng Nai", quantity: 1, price: 27600 },
    ],
    created_at: "2026-05-20T02:30:00.000Z",
    updated_at: "2026-05-20T05:10:00.000Z",
  },
  {
    _id: "ord-1008",
    user_id: "usr-1008",
    user_name: "Bùi Thị Lan",
    address: "210 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh",
    phone: "0898 765 432",
    payment_method: "COD",
    status: "Shipped",
    total_price: 189900,
    products: [
      { product_id: "prd-nho-xanh-tay-ninh", product_name: "Nho xanh", quantity: 2, price: 127680 },
      { product_id: "prd-ca-rok", product_name: "Cà rốt", quantity: 1, price: 28160 },
      { product_id: "prd-khoai-lang-dong-nai", product_name: "Khoai lang Đồng Nai", quantity: 1, price: 43200 },
    ],
    created_at: "2026-05-21T03:05:00.000Z",
    updated_at: "2026-05-21T08:45:00.000Z",
  },
];

export const seedReports: ReportType[] = [
  {
    _id: "rep-1",
    target_type: "product",
    target_id: "prd-muoi-bien-mien",
    reason: "Thông tin không chính xác",
    description: "Ảnh sản phẩm khác với mô tả, đề nghị kiểm tra lại.",
    status: "Pending",
    user_id: "usr-1002",
    user_name: "Trần Thị B",
    created_at: "2026-05-18T04:00:00.000Z",
    updated_at: "2026-05-18T04:00:00.000Z",
  },
  {
    _id: "rep-2",
    target_type: "blog",
    target_id: "blog-thit-sach-an-toan",
    reason: "Nội dung không phù hợp",
    description: "Bài viết cần bổ sung nguồn tham khảo cho thông tin dinh dưỡng.",
    status: "Pending",
    user_id: "usr-1004",
    user_name: "Vũ Thị Mai",
    created_at: "2026-05-19T02:30:00.000Z",
    updated_at: "2026-05-19T02:30:00.000Z",
  },
  {
    _id: "rep-3",
    target_type: "comment",
    target_id: "cmt-901",
    reason: "Ngôn từ không phù hợp",
    description: "Bình luận chứa từ ngữ không phù hợp với cửa hàng.",
    status: "Approved",
    user_id: "usr-1005",
    user_name: "Đặng Quốc Bảo",
    created_at: "2026-05-15T06:00:00.000Z",
    updated_at: "2026-05-16T01:00:00.000Z",
  },
  {
    _id: "rep-4",
    target_type: "product",
    target_id: "prd-thit-ga-ta",
    reason: "Giá không cạnh tranh",
    description: "Đề nghị cập nhật giá bán so với mức trung bình thị trường.",
    status: "Pending",
    user_id: "usr-1007",
    user_name: "Hoàng Minh Tuấn",
    created_at: "2026-05-20T08:15:00.000Z",
    updated_at: "2026-05-20T08:15:00.000Z",
  },
  {
    _id: "rep-5",
    target_type: "blog",
    target_id: "blog-draft-phuong-an-boi-duong",
    reason: "Bài viết nháp",
    description: "Bài viết chưa hoàn thiện, không nên hiển thị công khai.",
    status: "Rejected",
    user_id: "usr-1001",
    user_name: "Nguyễn Văn An",
    created_at: "2026-05-10T01:20:00.000Z",
    updated_at: "2026-05-11T03:30:00.000Z",
  },
];

export const seedRoles: RoleType[] = [
  {
    _id: "role-admin",
    name: "Admin",
    slug: "admin",
    description: "Toàn quyền trên hệ thống, bao gồm quản lý người dùng và cấu hình.",
    isActive: true,
  },
  {
    _id: "role-editor",
    name: "Editor",
    slug: "editor",
    description: "Được quyền soạn thảo, xuất bản bài viết và cập nhật thông tin sản phẩm.",
    isActive: true,
  },
  {
    _id: "role-supplier",
    name: "Supplier",
    slug: "supplier",
    description: "Quản lý sản phẩm và tồn kho của nhà cung cấp được phân công.",
    isActive: true,
  },
  {
    _id: "role-customer",
    name: "Customer",
    slug: "customer",
    description: "Khách hàng đăng nhập, đặt hàng và đánh giá sản phẩm.",
    isActive: true,
  },
];

/* -------------------------------------------------------------------------- */
/*                             comments & reviews                             */
/* -------------------------------------------------------------------------- */

/**
 * The comment endpoints of the backend require an access token and the
 * public catalogue has no discussion yet. The seed comments below give the
 * product and the blog pages a realistic discussion to show.
 */
export const seedComments: CommentType[] = [
  {
    _id: "cmt-101",
    product_id: "prd-sau-rieng-rieng-vang",
    user_id: "usr-1001",
    user_name: "Phan Chấn Tây",
    username: "phanchantay",
    avatar: "/image/testimonial-1.jpg",
    content:
      "Sầu riêng đúng vụ, cơm vàng dẻo và hạt lép. Giao khuya vẫn giao được, đóng xốp cẩn thận không bị dập.",
    rating: 5,
    created_at: "2026-05-20T02:15:00.000Z",
  },
  {
    _id: "cmt-102",
    product_id: "prd-sau-rieng-rieng-vang",
    user_id: "usr-1002",
    user_name: "Nguyễn Văn An",
    username: "nguyenvanan",
    avatar: "/image/avatar.jpg",
    content:
      "Giá hơi cao so với chợ nhưng cơm chắc chắn ngon hơn nhiều. Sẽ quay lại vào vụ sau.",
    rating: 4,
    created_at: "2026-05-21T09:40:00.000Z",
  },
  {
    _id: "cmt-103",
    product_id: "prd-xoai-cat-hoa-loc",
    user_id: "usr-1004",
    user_name: "Vũ Thị Mai",
    username: "vuthimai",
    avatar: "/image/testimonial-1.jpg",
    content:
      "Xoài ngọt đúng vị, hạt lép. Mua 5 kg làm sinh tố cho cả nhà, giao nhanh trong ngày.",
    rating: 5,
    created_at: "2026-05-18T03:05:00.000Z",
  },
  {
    _id: "cmt-104",
    product_id: "prd-rau-muong-huu-co-hop",
    user_id: "usr-1003",
    user_name: "Trần Thị B",
    username: "tranthib",
    avatar: "/image/testimonial-1.jpg",
    content:
      "Rau giòn, không sâu, đúng như mô tả. Hộp 500 g vừa đủ cho hai người ăn ba bữa.",
    rating: 5,
    created_at: "2026-05-24T07:20:00.000Z",
  },
  {
    _id: "cmt-105",
    product_id: "prd-thit-bo-moc-chau",
    user_id: "usr-1005",
    user_name: "Lê Hoàng Nam",
    username: "lehoangnam",
    avatar: "/image/avatar.jpg",
    content:
      "Thịt dẻo, giao trong chuỗi lạnh nên nhận vẫn lạnh. Nhà hàng tôi đã chuyển sang nguồn thịt ở đây.",
    rating: 5,
    created_at: "2026-05-16T01:30:00.000Z",
  },
  {
    _id: "cmt-106",
    product_id: "prd-mat-ong-rung",
    user_id: "usr-1007",
    user_name: "Đặng Quốc Bảo",
    username: "dangquocbao",
    avatar: "/image/testimonial-1.jpg",
    content:
      "Mật đậm thật, không bị pha đường. Gia đình dùng mỗi ngày, giá hợp lý so với chất lượng.",
    rating: 5,
    created_at: "2026-05-12T08:10:00.000Z",
  },
  {
    _id: "cmt-107",
    blog_id: "blog-huong-dan-nong-san-sach",
    user_id: "usr-1003",
    user_name: "Trần Thị B",
    username: "tranthib",
    avatar: "/image/testimonial-1.jpg",
    content:
      "Bài viết hướng dẫn rất rõ, đúng là những tiêu chí tôi dùng khi đi chợ cuối tuần.",
    created_at: "2026-05-15T04:00:00.000Z",
  },
  {
    _id: "cmt-108",
    blog_id: "blog-huong-dan-nong-san-sach",
    user_id: "usr-1001",
    user_name: "Nguyễn Văn An",
    username: "nguyenvanan",
    avatar: "/image/avatar.jpg",
    content:
      "Phần bảo quản trong tủ lạnh rất hữu ích, rau mua về giữ được tới 5 ngày.",
    created_at: "2026-05-16T02:45:00.000Z",
  },
  {
    _id: "cmt-109",
    blog_id: "blog-sau-rieng-mua-dip-tết",
    user_id: "usr-1004",
    user_name: "Vũ Thị Mai",
    username: "vuthimai",
    avatar: "/image/testimonial-1.jpg",
    content:
      "Theo bài này tôi chọn được trái sầu riêng rất ổn, cảm ơn ban biên tập.",
    created_at: "2026-05-17T06:30:00.000Z",
  },
  {
    _id: "cmt-110",
    blog_id: "blog-thit-sach-an-toan",
    user_id: "usr-1005",
    user_name: "Lê Hoàng Nam",
    username: "lehoangnam",
    avatar: "/image/avatar.jpg",
    content:
      "Thông tin về nguồn gốc thịt rất đáng đọc, đặc biệt là phần về mã vùng trồng.",
    created_at: "2026-05-19T01:55:00.000Z",
  },
];
