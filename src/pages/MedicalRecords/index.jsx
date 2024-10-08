// src/components/MedicalRecords/index.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

const MedicalRecords = ({ onLogout }) => {
  const [patients, setPatients] = useState([]);
  const [saveＭedicalRecords, setSaveＭedicalRecords] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null); // 新增currentPatient狀態
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const response = await fetch("http://localhost:5000/api/patients");
    const data = await response.json();
    setPatients(
      data.filter((p) => p.status === "看診中" || p.status === "候診中")
    );
  };

  const callNextPatient = async () => {
    setSaveＭedicalRecords(false);
    const nextPatient = patients.find((p) => p.status === "候診中");
    if (nextPatient) {
      const updatedPatient = { ...nextPatient, status: "看診中" };
      await fetch(`http://localhost:5000/api/patients/${nextPatient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPatient),
      });

      // 將更新的信息存入 localStorage
      localStorage.setItem("currentPatient", JSON.stringify(updatedPatient));

      // 手動觸發 storage 事件，確保其他頁面接收到變化
      window.dispatchEvent(new Event("storage"));

      // 設定當前病患
      setCurrentPatient(updatedPatient);

      // 更新醫師頁面的病患列表
      setPatients(
        patients.map((p) => (p.id === nextPatient.id ? updatedPatient : p))
      );
    } else {
      alert("已無待叫號的病患");
    }
  };

  // 重新呼叫病患
  const recallPatient = () => {
    if (currentPatient) {
      // 修改 localStorage 中的數據以觸發 storage 事件
      localStorage.setItem(
        "currentPatient",
        JSON.stringify({
          ...currentPatient,
          // 可以加一個毫無實際意義的字段，例如一個隨機數，以強制觸發 storage 事件
          timestamp: new Date().getTime(),
        })
      );

      // 手動觸發 storage 事件，確保其他頁面接收到變化
      window.dispatchEvent(new Event("storage"));
    }
  };

  const completeConsultation = async () => {
    setSaveＭedicalRecords(false);
    if (currentPatient) {
      const updatedPatient = { ...currentPatient, status: "已完成" };
      await fetch(`http://localhost:5000/api/patients/${currentPatient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPatient),
      });

      // 清除 currentPatient
      setCurrentPatient(null);

      // 將更新的信息存入 localStorage
      localStorage.setItem("currentPatient", JSON.stringify(updatedPatient));

      // 手動觸發 storage 事件，確保其他頁面接收到變化
      window.dispatchEvent(new Event("storage"));

      // 更新醫師頁面的病患列表
      fetchPatients();
    }
  };

  const updatePatient = async (values) => {
    console.log("test", values);
    // setSelectedPatient()
    // const updatedPatient = { ...selectedPatient, ...values };
    await fetch(`http://localhost:5000/api/patients/${values.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    // 更新病患列表
    setCurrentPatient(values);
    setPatients(patients.map((p) => (p.id === values.id ? values : p)));
    setSaveＭedicalRecords(true);
    // setSelectedPatient(null);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
    localStorage.clear();
  };

  const columns = [
    { title: "號碼", dataIndex: "callNumber", key: "callNumber" },
    { title: "姓名", dataIndex: "name", key: "name" },
    { title: "症狀", dataIndex: "condition", key: "condition" },
    { title: "狀態", dataIndex: "status", key: "status" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>醫師病歷紀錄系統</h2>
      {currentPatient ? (
        <>
          <Button type="primary" onClick={recallPatient}>
            重新呼叫
          </Button>
        </>
      ) : (
        <Button type="primary" onClick={callNextPatient}>
          叫下一位病患
        </Button>
      )}
      <Button type="default" onClick={handleLogout} style={{ float: "right" }}>
        登出
      </Button>

      <Form
        form={form}
        layout="horizontal"
        onFinish={updatePatient}
        style={{
          border: "5px solid gray",
          borderRadius: 5,
          padding: "5px",
          margin: "5px 0px",
        }}
        labelCol={{
          span: "auto",
        }}
        wrapperCol={{
          span: "100%",
        }}
        fields={[
          { name: ["id"], value: currentPatient?.id },
          {
            name: ["callNumber"],
            value: currentPatient ? currentPatient.callNumber : "--",
          },
          {
            name: ["name"],
            value: currentPatient ? currentPatient.name : "--",
          },
          {
            name: ["condition"],
            value: currentPatient ? currentPatient.condition : "--",
          },
          {
            name: ["status"],
            value: currentPatient ? currentPatient.status : "--",
          },
          {
            name: ["description"],
            value: currentPatient ? currentPatient.description : "--",
          },
        ]}
      >
        <Form.Item name="id" style={{ display: "none" }}></Form.Item>
        <Form.Item
          name="callNumber"
          label="目前號碼"
          rules={[{ required: true }]}
        >
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="status" label="狀態" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="condition" label="症狀" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="主述" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={saveＭedicalRecords}
            type="primary"
            htmlType="submit"
          >
            保存
          </Button>
          <Button
            disabled={!saveＭedicalRecords}
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={completeConsultation}
          >
            已完成
          </Button>
        </Form.Item>
      </Form>
      <Table
        dataSource={patients}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default MedicalRecords;
