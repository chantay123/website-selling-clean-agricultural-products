import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  getSuppliers,
  updateProduct,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import {
  CategoryType,
  extendedProductType,
  ProductAttribute,
  productTypes,
  SupplierType,
} from "../../../../@type/global.type";
import AdminLayout from "../../components/AdminLayout";
import { useIsAdmin } from "../../hooks/useAdminAccess";
import { toast } from "react-toastify";

/**
 * Product administration backed by `GET /products`.
 *
 * The table lists the catalogue, the modal creates a product and the inline
 * form updates the attributes of an existing one. Every write verb needs an
 * administrator token.
 */
const ProductAdmin = () => {
  const isAdmin = useIsAdmin();


  const [products, setProducts] = useState<productTypes[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<productTypes | null>(null);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();



  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi tải danh sách sản phẩm"));
    } finally {
      setLoading(false);
    }
  };

  // The category and supplier lists are needed by the product form.
  useEffect(() => {
    if (isAdmin !== true) return;

    const loadReferences = async () => {
      try {
        const [categoryResponse, supplierResponse] = await Promise.all([
          getCategories(),
          getSuppliers(),
        ]);
        setCategories(categoryResponse.data);
        setSuppliers(supplierResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadReferences();
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin === true) fetchProducts();
  }, [isAdmin]);

  const visible = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = categoryId
        ? product.category?._id === categoryId
        : true;
      const matchesTerm = term
        ? product.name?.toLowerCase().includes(term) ||
          product.slug?.toLowerCase().includes(term) ||
          product.origin?.toLowerCase().includes(term)
        : true;
      return matchesCategory && matchesTerm;
    });
  }, [products, keyword, categoryId]);

  const handleCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ hot: false, attributes: [{}] });
    setOpen(true);
  };

  const handleEdit = (record: productTypes) => {
    setEditing(record);
    const attribute = record.productAttributes?.[0] ?? ({} as ProductAttribute);
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
      description: record.description,
      origin: record.origin,
      thumbnail_url: record.thumbnail_url,
      category_id: record.category?._id,
      supplier_id: record.supplier?._id,
      hot: record.hot,
      attributes: [
        {
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
        },
      ],
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      // The API only accepts a single attribute object on update.
      const [attribute] = values.attributes ?? [];

      if (editing) {
        await updateProduct(editing._id, {
          name: values.name,
          slug: values.slug,
          description: values.description,
          origin: values.origin,
          thumbnail_url: values.thumbnail_url,
          hot: values.hot,
          attribute,
        });
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await createProduct({
          name: values.name,
          slug: values.slug,
          description: values.description,
          origin: values.origin,
          thumbnail_url: values.thumbnail_url,
          category_id: values.category_id,
          supplier_id: values.supplier_id,
          hot: values.hot,
          attributes: values.attributes,
        });
        toast.success("Thêm sản phẩm thành công");
      }

      setOpen(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      if (error instanceof Error) return;
      toast.error(getApiErrorMessage(error, "Lỗi lưu sản phẩm"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Xoá sản phẩm thành công");
      fetchProducts();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi xoá sản phẩm"));
    }
  };

  const columns: TableProps<extendedProductType>["columns"] = [
    {
      title: "Ảnh",
      dataIndex: "thumbnail_url",
      width: 90,
      render: (value?: string) =>
        value ? (
          <img src={value} alt="" className="w-12 h-12 object-cover rounded-md" />
        ) : (
          <div className="w-12 h-12 rounded-md bg-gray-200" />
        ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      width: 170,
    },
    {
      title: "Xuất xứ",
      dataIndex: "origin",
      width: 120,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      width: 150,
      render: (value?: CategoryType) => value?.name || "-",
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 130,
      render: (value?: number) =>
        value === undefined ? "-" : `${value.toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Kho",
      dataIndex: "productAttributes",
      width: 150,
      render: (attributes?: ProductAttribute[]) =>
        attributes?.length ? (
          <Tag color="green">{attributes.length} mã</Tag>
        ) : (
          <Tag>Chưa có</Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 230,
      render: (_value, record) => (
        <Space size="small" wrap>
          <Button size="small" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Link to={`/editadmin/${record._id}`}>
            <Button size="small">Chi tiết</Button>
          </Link>
          <Button
            size="small"
            danger
            onClick={() => handleDelete(record._id)}
          >
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Bạn không có quyền truy cập trang quản trị.
      </div>
    );
  }

  return (
    <AdminLayout title="Quản lý sản phẩm">
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Sản phẩm</h3>
            <p className="text-sm text-gray-500">
              Tổng cộng {products.length} sản phẩm trong danh mục
            </p>
          </div>
          <Button type="primary" onClick={handleCreate}>
            + Thêm sản phẩm
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Input
            allowClear
            placeholder="Tìm theo tên, slug, xuất xứ..."
            className="max-w-sm"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            allowClear
            placeholder="Lọc theo danh mục"
            className="w-52"
            value={categoryId}
            onChange={setCategoryId}
            options={categories.map((item) => ({
              value: item._id,
              label: item.name,
            }))}
          />
        </div>

        <Table<extendedProductType>
          loading={loading}
          columns={columns}
          dataSource={visible.map((item, index) => ({
            ...item,
            key: `key-${index}`,
          }))}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title={editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        okText="Lưu"
        cancelText="Huỷ"
        destroyOnClose
        width={860}
      >
        <Form form={form} layout="vertical" className="pt-4">
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

          <Form.Item label="Thuộc tính / biến thể" name="attributes">
            <Form.List name="attributes">
              {(fields, { add, remove }) => (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Biến thể {field.name + 1}
                        </span>
                        {fields.length > 1 && (
                          <Button
                            size="small"
                            danger
                            onClick={() => remove(field.name)}
                          >
                            Xoá
                          </Button>
                        )}
                      </div>
                      <Row gutter={12}>
                        <Col xs={12} md={6}>
                          <Form.Item
                            name={[field.name, "weight"]}
                            label="Khối lượng"
                            className="mb-2"
                          >
                            <InputNumber className="w-full" step={0.1} />
                          </Form.Item>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Item
                            name={[field.name, "original_price"]}
                            label="Giá gốc"
                            className="mb-2"
                          >
                            <InputNumber className="w-full" min={0} />
                          </Form.Item>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Item
                            name={[field.name, "discounted_percent"]}
                            label="Giảm (%)"
                            className="mb-2"
                          >
                            <InputNumber className="w-full" min={0} max={100} />
                          </Form.Item>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Item
                            name={[field.name, "quantity_per_unit"]}
                            label="Số lượng / đơn vị"
                            className="mb-2"
                          >
                            <InputNumber className="w-full" min={0} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name={[field.name, "unit_of_measurement"]}
                            label="Đơn vị"
                            className="mb-2"
                          >
                            <Input placeholder="kg" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name={[field.name, "dimensions"]}
                            label="Kích thước"
                            className="mb-2"
                          >
                            <Input placeholder="10x10x5 cm" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name={[field.name, "certification"]}
                            label="Chứng nhận"
                            className="mb-2"
                          >
                            <Input placeholder="VietGAP" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name={[field.name, "harvest_date"]}
                            label="Ngày thu hoạch"
                            className="mb-2"
                          >
                            <Input placeholder="2024-01-01" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name={[field.name, "expiration_date"]}
                            label="Ngày hết hạn"
                            className="mb-2"
                          >
                            <Input placeholder="2024-12-31" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name={[field.name, "link"]}
                            label="Liên kết"
                            className="mb-2"
                          >
                            <Input placeholder="https://..." />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button onClick={() => add({})}>+ Thêm biến thể</Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default ProductAdmin;
