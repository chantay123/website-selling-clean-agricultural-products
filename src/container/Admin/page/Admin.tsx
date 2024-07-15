import {
  Button,
  Col,
  Form,
  Input,
  Menu,
  MenuProps,
  Modal,
  Row,
  Space,
  Table,
  TableProps,
} from "antd";
import requestApi from "../../../utils/interceptors";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdminStatus,
  setProduct,
} from "../../../redux/userReducer/userReducer";
import { RootState } from "../../../redux/config";
import {
  ProductAttribute,
  extendedProductType,
  productTypes,
} from "../../../@type/global.type";

import "./style.scss";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Icon from "@ant-design/icons/lib/components/Icon";
import { Link, useNavigate } from "react-router-dom";

const Admin = () => {
  const profile = async () => {
    try {
      const respone = await requestApi("users/@me/profile", "GET", {});
      const a = respone.data.data;
      dispatch(setAdminStatus(a?.role === "Admin"));
    } catch (error) {
      dispatch(setAdminStatus(false));
      console.log(error);
    }
  };
  useEffect(() => {
    profile();
  }, []);

  const isadmin = useSelector((state: RootState) => state.user.isAdmin);
  const deleteProduct = async (product_id: any) => {
    try {
      const respone = await requestApi(
        `products?id=${product_id}`,
        "DELETE",
        {}
      );
      fetchPRODUCT();
    } catch (error) {
      console.log(error);
    }
  };
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
  };

  const dispatch = useDispatch();
  const fetchPRODUCT = async () => {
    try {
      const respons = await requestApi("products", "GET", {});
      const a = respons.data.data;
      dispatch(setProduct(a));
      console.log(respons);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPRODUCT();
  }, []);
  const list = useSelector((state: RootState) => state.user.product);
  const extendedList: extendedProductType[] = list.map((obj, index) => ({
    ...obj,
    key: `key-${index}`,
  }));
  const columns: TableProps<productTypes>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      className: "text-sm",
      width: 200,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      className: "text-sm",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      className: "text-sm",
      width: 200,
    },
    {
      title: "Origin",
      dataIndex: "origin",
      className: "text-sm",
      width: 200,
    },
    {
      title: "Attributes",
      dataIndex: "attributes",
      className: "text-sm",
      width: 200,
      render: (attributes: ProductAttribute[]) => (
        <ul>
          {attributes.map((attr, index) => (
            <li key={index}>
              Weight: {attr.weight} kg, Original Price: ${attr.original_price}
              {attr.discounted_percent && (
                <>
                  , Discounted: {attr.discounted_percent}%, Discount Price: $
                  {attr.discount_price}
                </>
              )}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (attributes: ProductAttribute[], productTypes) => (
        <Space size="middle">
          <a
            onClick={() => deleteProduct(productTypes._id)}
            className="rounded-md   border px-4 py-2 text-white bg-red-600"
          >
            Delete
          </a>
          <div>
            <Button
              className="rounded-md border px-4 py-2 text-white bg-yellow-300"
              type="primary"
              onClick={showModal}
            >
              Edit
            </Button>
            <Modal
              title="Product"
              open={open}
              onCancel={handleCancel}
              cancelButtonProps={{ disabled: false }}
              footer={null}
            >
              <Form
                name="wrap"
                labelCol={{ flex: "110px" }}
                labelAlign="left"
                labelWrap
                wrapperCol={{ flex: 1 }}
                colon={false}
                style={{ maxWidth: 600 }}
              >
                <Form.Item label="Normal label" name="username">
                  <Input />
                </Form.Item>

                <Form.Item label="A super long label text" name="">
                  <Input />
                </Form.Item>
                <Form.Item label="A super long label text" name="">
                  <Input />
                </Form.Item>
                <Form.Item label="A super long label text" name="">
                  <Input />
                </Form.Item>
                <Form.Item label="A super long label text" name="">
                  <Input />
                </Form.Item>

                <Form.Item label=" ">
                  <Button htmlType="submit" className="text_submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Space>
      ),
    },
  ];

  const data: extendedProductType[] = extendedList;

  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] = [
    {
      key: "1",
      icon: <MailOutlined />,
      label: "Navigation One",
      children: [
        { key: "11", label: "Option 1" },
        { key: "12", label: "Option 2" },
        { key: "13", label: "Option 3" },
        { key: "14", label: "Option 4" },
      ],
    },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: "Navigation Two",
      children: [
        { key: "21", label: "Option 1" },
        { key: "22", label: "Option 2" },
        {
          key: "23",
          label: "Submenu",
          children: [
            { key: "231", label: "Option 1" },
            { key: "232", label: "Option 2" },
            { key: "233", label: "Option 3" },
          ],
        },
        {
          key: "24",
          label: "Submenu 2",
          children: [
            { key: "241", label: "Option 1" },
            { key: "242", label: "Option 2" },
            { key: "243", label: "Option 3" },
          ],
        },
      ],
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: "Navigation Three",
      children: [
        { key: "31", label: "Option 1" },
        { key: "32", label: "Option 2" },
        { key: "33", label: "Option 3" },
        { key: "34", label: "Option 4" },
      ],
    },
  ];

  interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
  }

  const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };

  const levelKeys = getLevelKeys(items as LevelKeysProps[]);

  const [stateOpenKeys, setStateOpenKeys] = useState(["2", "23"]);

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };
  const navigate = useNavigate();
  if (isadmin === false) {
    navigate("*");
    return;
  }
  return (
    <div>
      <Row>
        <Col span={5}>
          <div className="flex ">
            <div className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
              <div className="py-4 text-gray-500 dark:text-gray-400">
                <a
                  className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
                  href="#"
                >
                  Fruitables
                </a>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={["231"]}
                  openKeys={stateOpenKeys}
                  onOpenChange={onOpenChange}
                  style={{ width: 256 }}
                >
                  <Menu.Item key="1">
                    <Icon type="pie-chart" />
                    <span>Deshboard</span>
                    <Link to="/" />
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Icon type="desktop" />
                    <span>Meseros</span>
                    <Link to="/meseros" />
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </div>
        </Col>

        <Col span={18}>
          <div className="mt-9 ml-2">
            <Table columns={columns} dataSource={data} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Admin;
