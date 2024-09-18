// src/pages/CallingSystem/index.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notification, Button } from "antd";
import "./index.scss";

const CallingSystem = () => {
  const [patients, setPatients] = useState([]);
  const [currentCall, setCurrentCall] = useState(null);
  const [nextCall, setNextCall] = useState(null);
  const navigate = useNavigate();
  // const findNextCallIndex = patients.findIndex(p => p?.id === nextCall?.id);
  // let waitingList = findNextCallIndex ? patients.slice(findNextCallIndex + 1) : patients.findLast(p => p?.id === currentCall?.id) ? "Finish!": patients;

  useEffect(() => {
    fetchPatients();

    // 監聽 localStorage 變化
    const handleStorageChange = () => {
      const updatedPatient = JSON.parse(localStorage.getItem("currentPatient"));
      if (updatedPatient && updatedPatient.status !== "已完成") {
        notification.info({
          message: `請病患 ${updatedPatient.name} 到診間`,
        });
        fetchPatients(); // 當病患更新時，重新加載病患列表
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      localStorage.clear();
    };
  }, []);

  const fetchPatients = async () => {
    const response = await fetch("http://localhost:5000/api/patients");
    const data = await response.json();
    setPatients(data);

    // 從 localStorage 中取得目前叫號病患
    const currentPatient = JSON.parse(localStorage.getItem("currentPatient"));

    if (currentPatient) {
      // 如果存在叫號病患，則顯示目前號碼及下一位號碼
      setCurrentCall(currentPatient);
      const nextPatient = data.find(
        (p) =>
          p.status === "候診中" && p.callNumber !== currentPatient.callNumber
      );
      setNextCall(nextPatient);
    } else {
      // 如果沒有叫號病患，顯示 "--"
      setCurrentCall(null);
      setNextCall(null);
    }
  };

  const handleLoginNavigation = () => {
    navigate("/login");
  };

  return (
    <div className="calling-system">
      <div className="header">
        <div className="title">家庭醫學科</div>
        <div className="doctors">
          <div className="doctor">
            <span>醫師</span> 陳英書
          </div>
          <div className="nurse">
            <span>跟診人員</span> 沈雅惠
          </div>
        </div>
      </div>

      <div className="number-display">
        <div className="current-number">
          <span>目前號碼</span>
          <div className="number">
            {currentCall ? currentCall.callNumber : "--"}
          </div>
        </div>
        <div className="next-number">
          <span>下一位號碼</span>
          <div className="number">{nextCall ? nextCall.callNumber : "--"}</div>
        </div>
      </div>

      <div className="queue-list">
        <div className="queue-title">候診名單</div>
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>
              {patient.callNumber} 號 {patient.name} ({patient.condition})
            </li>
          ))}
        </ul>
      </div>
      <Button
        type="dashed"
        onClick={handleLoginNavigation}
        style={{ marginBottom: 10, width: "100%" }}
        danger
      >
        切換登入頁面
      </Button>
    </div>
  );
};

export default CallingSystem;
