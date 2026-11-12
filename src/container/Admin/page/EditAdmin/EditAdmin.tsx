import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategories,
  getProductById,
  getSuppliers,
  updateProduct,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import {
  CategoryType,
  ProductAttribute,
  SupplierType,
} from "../../../../@type/global.type";
import AdminLayout from "../../components/AdminLayout";
import { toast } from "react-toastify";

/**
 * Detail editor of one product.
 *
 * The screen loads the product with `GET /products/:id` and writes the
 * changes back with `PUT /products/:id`. The form mirrors the payload the
 * backend expects: the product fields plus a single `attribute` object.
 */
const EditAdmin = () => {
  const { editId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [productResponse, categoryResponse, supplierResponse] =
          await Promise.all([
            getProductById(editId ?? ""),
            getCategories(),
            getSuppliers(),
          ]);

        if (cancelled) return;

        const product = productResponse.data;
        if (!product) {
          if (!cancelled) {
            toast.error("Không tìm thấy sản phẩm");
            navigate("/productadmin");
          }
          return;
        }

        const attribute =
          (product.productAttributes?.[0] ?? {}) as ProductAttribute;

        setCategories(categoryResponse.data);
        setSuppliers(supplierResponse.data);

        form.setFieldsValue({
          name: product.name,
          slug: product.slug,
          description: product.description,
          origin: product.origin,
          thumbnail_url: product.thumbnail_url,
          category_id: product.category?._id,
          supplier_id: product.supplier?._id,
          hot: product.hot,
          weight: attribute.weight,
          original_price: attribute.original_price,
          discounted_percent: attribute.discounted_percent,
          dimensions: attribute.dimensions,
          unit_of_measurement: attribute.unit_of_measurement,
          quantity_per_unit: attribute.quantity_per_unit,
          certification: attribute.certification,
          harvest_date: attribute.harvest_date,
          link: attribute.link,
          expiration_date: attribute.expiration_date,
        });
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Lỗi tải thông tin sản phẩm"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [editId, form]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      setSaving(true);
      await updateProduct(editId ?? "", {
        name: values.name as string,
        slug: values.slug as string,
        description: values.description as string,
        origin: values.origin as string,
        thumbnail_url: values.thumbnail_url as string,
        hot: values.hot as boolean,
        attribute: {
          weight: values.weight as number,
          original_price: values.original_price as number,
          discounted_percent: values.discounted_percent as number,
          dimensions: values.dimensions as string,
          unit_of_measurement: values.unit_of_measurement as string,
          quantity_per_unit: values.quantity_per_unit as number,
          certification: values.certification as string,
          harvest_date: values.harvest_date as string,
          link: values.link as string,
          expiration_date: values.expiration_date as string,
        },
      });
      toast.success("Cập nhật sản phẩm thành công");
      navigate("/productadmin");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi cập nhật sản phẩm"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Chi tiết sản phẩm">
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="bg-white rounded-lg p-4 lg:p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Thông tin sản phẩm
          </h3>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Táo Mộc Châu" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Slug" name="slug">
                <Input placeholder="tao-moc-chau" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Xuất xứ" name="origin">
                <Input placeholder="Ý tụ, Việt Nam" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Ảnh (URL)" name="thumbnail_url">
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Danh mục" name="category_id">
                <Select
                  allowClear
                  placeholder="Chọn danh mục"
                  options={categories.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Nhà cung cấp" name="supplier_id">
                <Select
                  allowClear
                  placeholder="Chọn nhà cung cấp"
                  options={suppliers.map((item) => ({
                    value: item._id,
                    label: item.company_name,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả sản phẩm" />
          </Form.Item>

          <Form.Item name="hot">
            <Select
              placeholder="Chọn trạng thái nổi bật"
              options={[
                { value: true, label: "Nổi bật" },
                { value: false, label: "Thường" },
              ]}
            />
          </Form.Item>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
            Thuộc tính sản phẩm
          </h3>

          <Row gutter={16}>
            <Col xs={12} md={6}>
              <Form.Item label="Khối lượng" name="weight">
                <InputNumber className="w-full" step={0.1} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="Giá gốc" name="original_price">
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="Giảm (%)" name="discounted_percent">
                <InputNumber className="w-full" min={0} max={100} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="Số lượng / đơn vị" name="quantity_per_unit">
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Đơn vị" name="unit_of_measurement">
                <Input placeholder="kg" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Kích thước" name="dimensions">
                <Input placeholder="10x10x5 cm" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Chứng nhận" name="certification">
                <Input placeholder="VietGAP" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Ngày thu hoạch" name="harvest_date">
                <Input placeholder="2024-01-01" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Ngày hết hạn" name="expiration_date">
                <Input placeholder="2024-12-31" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Liên kết" name="link">
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
          </Row>

          <Space wrap>
            <Button type="primary" htmlType="submit" loading={saving}>
              Cập nhật
            </Button>
            <Button onClick={() => navigate("/productadmin")}>Quay lại</Button>
          </Space>
        </Form>
      </Spin>
    </AdminLayout>
  );
};

export default EditAdmin;
