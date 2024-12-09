// src/pages/ReceptionSystem/index.jsx
import React, { useState, useContext, useEffect } from "react";
import { Table, Button, Form, Input, Modal, notification } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PatientContext } from "../../context/PatientContext";

const ReceptionSystem = ({ user, onLogout }) => {
  const {patientList, createPatient, readPatients, updatePatient, deletePatient} = useContext(PatientContext);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => await readPatients())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleOk = async () => {
    try {
      const formValues = await form.getFieldValue();      
      if (isEdit) {
        // 編輯病患
        await updatePatient(formValues);
        notification.success({ message: "病患更新成功" });
      } else {
        // 新增病患
        await createPatient(formValues);
        notification.success({ message: "病患新增成功" });
      }
      form.resetFields();
      setVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    await deletePatient(id);
    notification.success({ message: "病患刪除成功" });
    readPatients();
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

  const handleEdit = (fromValues) => {
    console.log('record', fromValues);
    
    setIsEdit(true);
    // setEditingPatient(record);
    form.setFieldsValue(fromValues);
    setVisible(true);
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
      render: (text, values) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(values)}
            style={{ marginRight: 8 }}
          >
            修改
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(values.id)}
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
        dataSource={patientList}
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
