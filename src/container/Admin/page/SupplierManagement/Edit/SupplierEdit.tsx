/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Button, Form, Input, Layout } from "antd";
import requestApi from "../../../../../utils/interceptors";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { Content } from "antd/es/layout/layout";
import { toast } from "react-toastify";
const SupplierEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [supplierData, setSupplierData] = useState({
        company_name: "",
        contact_name: "",
        contact_title: "",
        phone: "",
        email: "",
        address: "",
        website: "",
        certification_details: "",
        description: "",
    });

    const supllier = async () => {
        try {
            const respone = await requestApi(`supplier/${id}`, "GET", {});
            const a = respone.data.data;
            console.log(a);
            setSupplierData(a);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        supllier();
    }, [id]);

    const editSupplier = async () => {
        const loadingToast = toast.loading("Updating....");
        const response = await requestApi(`supplier/${id}`, "PUT", {
            company_name: supplierData.company_name,
            contact_name: supplierData.contact_name,
            contact_title: supplierData.contact_title,
            phone: supplierData.phone,
            email: supplierData.email,
            address: supplierData.address,
            website: supplierData.website,
            certification_details: supplierData.certification_details,
            description: supplierData.description,
        });
        const { message } = response.data;
        try {
            toast.update(loadingToast, {
                render: message,
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            navigate(`/supplier`);
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <div className="flex bg-[#F2F9F6]">
            <Sidebar />
            <Layout className="min-h-screen overflow-hidden">
                <Layout>
                    <Content className="bg-[#F2F9F6]">
                        <Form
                            className="mt-4"
                            name="supplierForm"
                            initialValues={{ ...supplierData }}
                            onFinish={editSupplier}
                            onValuesChange={(changedValues, allValues) => {
                                setSupplierData(allValues);
                            }}
                            fields={[
                                { name: ["company_name"], value: supplierData.company_name },
                                { name: ["contact_name"], value: supplierData.contact_name },
                                { name: ["contact_title"], value: supplierData.contact_title },
                                { name: ["phone"], value: supplierData.phone },
                                { name: ["email"], value: supplierData.email },
                                { name: ["address"], value: supplierData.address },
                                { name: ["website"], value: supplierData.website },
                                { name: ["certification_details"], value: supplierData.certification_details },
                                { name: ["description"], value: supplierData.description },
                            ]}
                        >
                            <div className="relative">
                                <h2 className="ml-20 text-3xl">Edit Supplier</h2>
                                <div className="w-full mt-3 px-5 lg:px-10 3xl:px-10">
                                    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 3xl:gap-12">
                                        {[
                                            { label: "Company Name", name: "company_name" },
                                            { label: "Contact Name", name: "contact_name" },
                                            { label: "Contact Title", name: "contact_title" },
                                            { label: "Phone", name: "phone" },
                                            { label: "Email", name: "email" },
                                            { label: "Address", name: "address" },
                                            { label: "Website", name: "website" },
                                            { label: "Certification Details", name: "certification_details" },
                                            { label: "Description", name: "description" },
                                        ].map((field) => (
                                            <div className="w-full relative mb-6" key={field.name}>
                                                <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                                                    {field.label}
                                                </h3>
                                                <Form.Item
                                                    name={field.name}
                                                    className="border-2 rounded-lg border-black w-full flex flex-col"
                                                >
                                                    <Input
                                                        className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:outline-none"
                                                        style={{ background: "none" }}
                                                    />
                                                </Form.Item>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="ml-10 flex gap-4">
                                <Form.Item className="mt-2">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="h-12 w-60 border-2 border-black rounded-full font-popins text-base btn-hover"
                                    >
                                        Update
                                    </Button>
                                </Form.Item>
                                <Form.Item className="mt-2">
                                    <Button
                                        type="primary"
                                        className="h-12 w-60 border-2 border-black rounded-full font-popins text-base btn-hover"
                                        onClick={() => navigate("/supplier")}
                                    >
                                        Back Suppllier
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );

};

export default SupplierEdit;
