// src/pages/ReceptionSystem/index.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";

const ReceptionSystem = ({ user, onLogout }) => {
  const [patients, setPatients] = useState([]);
  const [visible, setVisible] = useState(false);
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

  const addPatient = async (values) => {
    const response = await fetch("http://localhost:5000/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, status: "候診中" }),
    });
    const newPatient = await response.json();
    setPatients([...patients, newPatient]);
    setVisible(false);
    form.resetFields();
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const columns = [
    { title: "號碼", dataIndex: "callNumber", key: "callNumber" },
    { title: "姓名", dataIndex: "name", key: "name" },
    { title: "年齡", dataIndex: "age", key: "age" },
    { title: "性別", dataIndex: "gender", key: "gender" },
    { title: "症狀", dataIndex: "condition", key: "condition" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>櫃檯掛號系統</h2>
      <Button type="primary" onClick={() => setVisible(true)}>
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
        title="新增病患"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={addPatient}>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="年齡" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="性別" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="condition" label="症狀" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReceptionSystem;
