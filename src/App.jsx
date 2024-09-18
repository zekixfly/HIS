// src/App.jsx
import React, { useState } from "react";
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
