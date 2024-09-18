// src/pages/Login/index.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";

const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      setUser(data);
      if (data.role === "reception") {
        navigate("/reception-system");
      } else if (data.role === "doctor") {
        navigate("/medical-records");
      }
    } catch (error) {
      console.error("Login failed:", error);
      notification.error({
        message: "Login failed",
        description: "Invalid username or password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCallingSystemNavigation = () => {
    navigate("/calling-system");
  };

  return (
    <div style={{ maxWidth: 300, margin: "100px auto" }}>
      <h2>Login</h2>
      <Button
        type="dashed"
        loading={loading}
        onClick={handleCallingSystemNavigation}
        style={{ marginBottom: 10, width: "100%" }}
        danger
      >
        切換叫號畫面
      </Button>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          style={{
            margin: "0px auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            登入
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
