// server/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());

// 用戶數據
const users = [
  { userId: "1", username: "reception", password: "123456", role: "reception" },
  { userId: "2", username: "doctor", password: "123456", role: "doctor" },
];

// 病患數據
let patients = [
  {
    id: 1,
    name: "張三",
    age: 30,
    gender: "male",
    condition: "感冒",
    status: "候診中",
    description: "",
    callNumber: 1,
  },
  {
    id: 2,
    name: "李四",
    age: 25,
    gender: "female",
    condition: "發燒",
    status: "候診中",
    description: "",
    callNumber: 2,
  },
  {
    id: 3,
    name: "王五",
    age: 45,
    gender: "male",
    condition: "高血壓",
    status: "候診中",
    description: "",
    callNumber: 3,
  },
  {
    id: 4,
    name: "趙六",
    age: 60,
    gender: "female",
    condition: "糖尿病",
    status: "候診中",
    description: "",
    callNumber: 4,
  },
  {
    id: 5,
    name: "錢七",
    age: 50,
    gender: "male",
    condition: "胃潰瘍",
    status: "候診中",
    description: "",
    callNumber: 5,
  },
  {
    id: 6,
    name: "孫八",
    age: 28,
    gender: "female",
    condition: "感冒",
    status: "候診中",
    description: "",
    callNumber: 6,
  },
  {
    id: 7,
    name: "周九",
    age: 65,
    gender: "male",
    condition: "肺炎",
    status: "候診中",
    description: "",
    callNumber: 7,
  },
  {
    id: 8,
    name: "吳十",
    age: 35,
    gender: "female",
    condition: "中風",
    status: "候診中",
    description: "",
    callNumber: 8,
  },
  {
    id: 9,
    name: "鄭十一",
    age: 40,
    gender: "male",
    condition: "冠心病",
    status: "候診中",
    description: "",
    callNumber: 9,
  },
  {
    id: 10,
    name: "王十二",
    age: 55,
    gender: "female",
    condition: "哮喘",
    status: "候診中",
    description: "",
    callNumber: 10,
  },
];

// 登入API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    res.json({ userId: user.userId, role: user.role });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// 獲取病患資料
app.get("/api/patients", (req, res) => {
  res.json(patients);
});

// 新增病患
app.post("/api/patients", (req, res) => {
  const newPatient = req.body;
  newPatient.id = patients.findLast((p) => p).id + 1;
  newPatient.callNumber = newPatient.id;
  patients.push(newPatient);
  res.json(newPatient);
});

// 更新病患資料
app.put("/api/patients/:id", (req, res) => {
  const patientId = parseInt(req.params.id);
  const updatedPatient = req.body;
  const index = patients.findIndex((p) => p.id === patientId);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updatedPatient };
    res.json(patients[index]);
  } else {
    res.status(404).json({ message: "Patient not found" });
  }
});

// 刪除病患
app.delete("/api/patients/:id", (req, res) => {
  const patientId = parseInt(req.params.id);
  patients = patients.filter((p) => p.id !== patientId);
  res.json({ message: "Patient deleted" });
});

// 啟動服務
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
