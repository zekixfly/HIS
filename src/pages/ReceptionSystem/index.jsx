// src/pages/ReceptionSystem/index.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, Modal, notification } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ReceptionSystem = ({ user, onLogout }) => {
  const [patients, setPatients] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const response = await fetch("http://localhost:5000/api/patients");
    const data = await response.json();
    setPatients(data);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        // 編輯病患
        await fetch(`http://localhost:5000/api/patients/${editingPatient.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        notification.success({ message: "病患更新成功" });
      } else {
        // 新增病患
        const response = await fetch("http://localhost:5000/api/patients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, status: "候診中" }),
        });
        const newPatient = await response.json();
        setPatients([...patients, newPatient]);
        notification.success({ message: "病患新增成功" });
      }
      form.resetFields();
      setVisible(false);
      fetchPatients();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const addPatient = () => {
    setIsEdit(false);
    setVisible(true);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setIsEdit(true);
    setEditingPatient(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/patients/${id}`, {
      method: "DELETE",
    });
    notification.success({ message: "病患刪除成功" });
    fetchPatients();
  };

  const columns = [
    { title: "號碼", dataIndex: "callNumber", key: "callNumber" },
    { title: "姓名", dataIndex: "name", key: "name" },
    { title: "年齡", dataIndex: "age", key: "age" },
    { title: "性別", dataIndex: "gender", key: "gender" },
    { title: "症狀", dataIndex: "condition", key: "condition" },
    {
      title: "編輯",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            修改
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          >
            刪除
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>櫃檯掛號系統</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={addPatient}>
        新增病患
      </Button>
      <Button type="default" onClick={handleLogout} style={{ marginLeft: 16 }}>
        登出
      </Button>
      <Table
        dataSource={patients}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title={isEdit ? "編輯病患" : "新增病患"}
        open={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: "Please enter the patient's name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="年齡"
            rules={[
              { required: true, message: "Please enter the patient's age" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性別"
            rules={[
              { required: true, message: "Please enter the patient's gender" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="condition"
            label="症狀"
            rules={[
              {
                required: true,
                message: "Please enter the patient's condition",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReceptionSystem;
