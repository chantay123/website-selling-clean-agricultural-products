import { useEffect, useMemo, useState } from "react";
import { Col, Row, Spin } from "antd";
import { Link } from "react-router-dom";
import {
  getBlogs,
  getBanners,
  getCategories,
  getHashtags,
  getMyProfile,
  getProducts,
  getReports,
  getStocks,
  getSuppliers,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { useDispatch, useSelector } from "react-redux";
import { setAdminStatus } from "../../../../redux/userReducer/userReducer";
import { RootState } from "../../../../redux/config";
import AdminLayout from "../../components/AdminLayout";
import { toast } from "react-toastify";
import { isDemoAdmin } from "../../hooks/useAdminAccess";

/** One tile of the dashboard. */
type Stat = {
  label: string;
  value: number;
  hint: string;
  path: string;
  tone: string;
};

/**
 * Admin dashboard.
 *
 * The backend has no dedicated statistics endpoint, so every figure is
 * derived from the collections the API already exposes. The private
 * collections are only requested for an administrator.
 */
const Admin = () => {
  const dispatch = useDispatch();
  const isadmin = useSelector((state: RootState) => state.user.isAdmin);

  const [profileChecked, setProfileChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(0);
  const [categories, setCategories] = useState(0);
  const [suppliers, setSuppliers] = useState(0);
  const [blogs, setBlogs] = useState(0);
  const [banners, setBanners] = useState(0);
  const [hashtags, setHashtags] = useState(0);
  const [reports, setReports] = useState(0);
  const [stockUnits, setStockUnits] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await getMyProfile();

        if (!cancelled) {
          const isAdmin = response.data?.role === "Admin";
          dispatch(setAdminStatus(isAdmin || isDemoAdmin()));
        }
      } catch (error) {
        // The backend has no administrator account, the demo administrator
        // takes over so the dashboard stays reachable.
        if (!cancelled) dispatch(setAdminStatus(isDemoAdmin()));
      } finally {
        if (!cancelled) setProfileChecked(true);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    if (profileChecked && isadmin !== true) return;

    const load = async () => {
      setLoading(true);
      try {
        // The public collections are always available.
        const [productResponse, categoryResponse, supplierResponse, blogResponse, bannerResponse, hashtagResponse] =
          await Promise.all([
            getProducts(),
            getCategories(),
            getSuppliers(),
            getBlogs(),
            getBanners(),
            getHashtags(),
          ]);

        setProducts(productResponse.data.length);
        setCategories(categoryResponse.data.length);
        setSuppliers(supplierResponse.data.length);
        setBlogs(blogResponse.data.length);
        setBanners(bannerResponse.data.length);
        setHashtags(hashtagResponse.data.length);

        // The private ones need the administrator token.
        if (isadmin === true) {
          const [reportResponse, stockResponse] = await Promise.all([
            getReports(),
            getStocks(),
          ]);

          setReports(reportResponse.data.length);
          const units = stockResponse.data.reduce(
            (sum, stock) => sum + (stock.quantity ?? 0),
            0
          );
          setStockUnits(units);
          setLowStock(
            stockResponse.data.filter((stock) => (stock.quantity ?? 0) <= 5)
              .length
          );
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Lỗi tải số liệu tổng quan"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [profileChecked, isadmin]);

  const stats: Stat[] = useMemo(
    () => [
      {
        label: "Sản phẩm",
        value: products,
        hint: "Trong danh mục",
        path: "/productadmin",
        tone: "bg-green-100 text-green-700",
      },
      {
        label: "Danh mục",
        value: categories,
        hint: "Danh mục sản phẩm",
        path: "/categoryadmin",
        tone: "bg-yellow-100 text-yellow-700",
      },
      {
        label: "Nhà cung cấp",
        value: suppliers,
        hint: "Đối tác cung ứng",
        path: "/supplieradmin",
        tone: "bg-blue-100 text-blue-700",
      },
      {
        label: "Tồn kho",
        value: stockUnits,
        hint: `${lowStock} mã sắp hết`,
        path: "/stock",
        tone: "bg-purple-100 text-purple-700",
      },
      {
        label: "Bài viết",
        value: blogs,
        hint: "Bài đã đăng",
        path: "/blogadmin",
        tone: "bg-indigo-100 text-indigo-700",
      },
      {
        label: "Báo cáo",
        value: reports,
        hint: "Chờ kiểm duyệt",
        path: "/report",
        tone: "bg-red-100 text-red-700",
      },
      {
        label: "Banner",
        value: banners,
        hint: "Ảnh trang chủ",
        path: "/banneradmin",
        tone: "bg-orange-100 text-orange-700",
      },
      {
        label: "Từ khoá",
        value: hashtags,
        hint: "Từ khoá nổi bật",
        path: "/hashtagadmin",
        tone: "bg-teal-100 text-teal-700",
      },
    ],
    [products, categories, suppliers, stockUnits, lowStock, blogs, reports, banners, hashtags]
  );

  if (profileChecked && isadmin === false) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Bạn không có quyền truy cập trang quản trị.
      </div>
    );
  }

  return (
    <AdminLayout title="Tổng quan">
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {stats.map((stat) => (
            <Col key={stat.label} xs={12} sm={12} md={8} lg={6} xl={6}>
              <Link to={stat.path} className="block h-full">
                <div className="bg-white rounded-lg p-4 h-full hover:shadow-md transition-shadow">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${stat.tone}`}
                  >
                    {stat.value}
                  </div>
                  <p className="mt-3 text-base font-semibold text-gray-800">
                    {stat.label}
                  </p>
                  <p className="text-sm text-gray-500">{stat.hint}</p>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Spin>

      <div className="bg-white rounded-lg p-4 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Truy cập nhanh</h3>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} lg={6}>
            <Link to="/productadmin" className="block">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <p className="font-medium text-gray-800">Quản lý sản phẩm</p>
                <p className="text-sm text-gray-500">Thêm, sửa, xoá sản phẩm</p>
              </div>
            </Link>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Link to="/stock" className="block">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <p className="font-medium text-gray-800">Kho hàng</p>
                <p className="text-sm text-gray-500">Cập nhật số lượng tồn</p>
              </div>
            </Link>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Link to="/report" className="block">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <p className="font-medium text-gray-800">Kiểm duyệt</p>
                <p className="text-sm text-gray-500">Xử lý báo cáo người dùng</p>
              </div>
            </Link>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Link to="/orderadmin" className="block">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <p className="font-medium text-gray-800">Đơn hàng</p>
                <p className="text-sm text-gray-500">Theo dõi đơn của khách</p>
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default Admin;
