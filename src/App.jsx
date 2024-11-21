// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import ReceptionSystem from "./pages/ReceptionSystem";
import CallingSystem from "./pages/CallingSystem";
import MedicalRecords from "./pages/MedicalRecords";
import { PatientProvider } from "./PatientContext"; // 引入 PatientProvider

const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // 當重新整理或離開頁面時會檢查是否還有未完成看診的病患，如有則不清理Storage紀錄，否則清理。
    return async () => {
      const data = await fetchPatients();
      if (!data.some((p) => p.status === "看診中" || p.status === "候診中")) {
        localStorage.clear();
      }
    };
  }, []);

  const fetchPatients = async () => {
    const response = await fetch("/api/patients");
    const data = await response.json();
    return data;
  };

  const onLogout = () => {
    setUser(null);
    // 這裡可以添加其他登出邏輯，比如清除 token 或者其他資料
  };

  return (
    <PatientProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/reception-system"
            element={
              <PrivateRoute user={user}>
                <ReceptionSystem user={user} onLogout={onLogout} />
              </PrivateRoute>
            }
          />
          <Route
            path="/calling-system"
            element={<CallingSystem />} // 去掉對 user 的依賴，直接允許訪問
          />
          <Route
            path="/medical-records"
            element={
              <PrivateRoute user={user}>
                <MedicalRecords user={user} onLogout={onLogout} />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </PatientProvider>
  );
};

export default App;
