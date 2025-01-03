// src/components/MedicalRecords/index.jsx
import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Form, Input, Modal, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { PatientContext } from "../../context/PatientContext"; // 引入 PatientProvider

const MedicalRecords = ({ onLogout }) => {
  const { patientList, readPatients, updatePatient } = useContext(PatientContext);
  const [filterPatientList, setFilterPatientList] = useState(null);
  const [saveＭedicalRecords, setSaveＭedicalRecords] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null); // 新增currentPatient狀態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // 從 localStorage 中取得目前叫號病患
    const currentPatient = JSON.parse(localStorage.getItem("currentPatient"));

    if (currentPatient) {
      setCurrentPatient(currentPatient);
    } else {
      setCurrentPatient(null);
    }
    // fetchPatients();
    (async () => {
      await getFilterPatientList();
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFilterPatientList = async () => {
    const patientsData = await readPatients();
    console.log("patientList", patientList);
    setFilterPatientList(
      patientsData.filter((p) => p.status === "看診中" || p.status === "候診中")
    );
  };

  const callNextPatient = async () => {
    setSaveＭedicalRecords(false);
    const nextPatient = patientList.find((p) => p.status === "候診中");
    if (nextPatient) {
      const updatedNextPatient = { ...nextPatient, status: "看診中" };

      await updatePatient(updatedNextPatient);

      // 將更新的信息存入 localStorage
      localStorage.setItem(
        "currentPatient",
        JSON.stringify(updatedNextPatient)
      );

      // 手動觸發 storage 事件，確保其他頁面接收到變化
      window.dispatchEvent(new Event("storage"));

      // 設定當前病患
      setCurrentPatient(updatedNextPatient);

      // 更新醫師頁面的病患列表
      (async () => {
        await getFilterPatientList();
      })();
      // setPatientList(
      //   patientList.map((p) =>
      //     p.id === nextPatient.id ? updatedNextPatient : p
      //   )
      // );
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
      const updatedNextPatient = { ...currentPatient, status: "已完成" };

      await updatePatient(updatedNextPatient);

      // 清除 currentPatient
      setCurrentPatient(null);

      // 將更新的信息存入 localStorage
      localStorage.setItem(
        "currentPatient",
        JSON.stringify(updatedNextPatient)
      );

      // 手動觸發 storage 事件，確保其他頁面接收到變化
      window.dispatchEvent(new Event("storage"));

      // 更新醫師頁面的病患列表
      // fetchPatients();
      (async () => {
        await getFilterPatientList();
      })();
    }
  };

  const handleEdit = async (formValues) => {
    await updatePatient(formValues);

    // 更新病患列表
    setCurrentPatient(formValues);

    // 將更新的信息存入 localStorage
    // localStorage.setItem("currentPatient", JSON.stringify(formValues));

    setSaveＭedicalRecords(true);
    // setSelectedPatient(null);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
    // localStorage.clear();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    { title: "號碼", dataIndex: "callNumber", key: "callNumber" },
    { title: "姓名", dataIndex: "name", key: "name" },
    { title: "年齡", dataIndex: "age", key: "age" },
    { title: "症狀", dataIndex: "condition", key: "condition" },
    {
      title: "狀態",
      dataIndex: "status",
      key: "status",
      render: (tag) => {
        let color = "geekblue";
        switch (tag) {
          case "候診中":
            color = "geekblue";
            break;
          case "看診中":
            color = "green";
            break;
          case "已完成":
            color = "volcano";
            break;
          default:
            color = "geekblue";
            break;
        }
        return (
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        );
      },
    },
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
        onFinish={handleEdit}
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
            name: ["age"],
            value: currentPatient ? currentPatient.age : "--",
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
        <Form.Item name="id" style={{ display: "none" }}>
          <Input disabled={true} />
        </Form.Item>
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
        <Form.Item name="age" label="年齡" rules={[{ required: true }]}>
          <Input type="number" disabled={true}/>
        </Form.Item>
        <Form.Item name="condition" label="症狀" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="主述" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={
              saveＭedicalRecords ||
              !patientList?.some(
                (p) => p.status === "看診中" || p.status === "候診中"
              )
            }
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
      <div
        style={{
          border: "5px solid gray",
          borderRadius: 5,
          padding: "5px",
          margin: "5px 0px",
        }}
      >
        <Button
          type="primary"
          color="danger"
          variant="outlined"
          style={{ marginLeft: 8 }}
          onClick={showModal}
        >
          歷史病例記錄表
        </Button>
        <Modal
          title="歷史病例記錄表"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Table
            dataSource={patientList}
            columns={[
              ...columns,
              {
                title: "描述",
                dataIndex: "description",
                key: "description",
              },
            ]}
            rowKey="id"
            style={{ marginTop: 20 }}
          />
        </Modal>
        <Table
          dataSource={filterPatientList}
          columns={columns}
          rowKey="id"
          style={{ marginTop: 20 }}
        />
      </div>
    </div>
  );
};

export default MedicalRecords;
