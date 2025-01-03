// server/server.js
const express = require("express");
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const PORT = 5000;

// 用戶數據
const users = [
  { userId: "1", username: "reception", password: "123456", role: "reception" },
  { userId: "2", username: "doctor", password: "123456", role: "doctor" },
];

// 病患數據
let patients = [
  {
    id: uuidv4(),
    name: "張三",
    age: 30,
    gender: "male",
    condition: "感冒",
    status: "候診中",
    description: "",
    callNumber: 1,
  },
  {
    id: uuidv4(),
    name: "李四",
    age: 25,
    gender: "female",
    condition: "發燒",
    status: "候診中",
    description: "",
    callNumber: 2,
  },
  {
    id: uuidv4(),
    name: "王五",
    age: 45,
    gender: "male",
    condition: "高血壓",
    status: "候診中",
    description: "",
    callNumber: 3,
  },
  {
    id: uuidv4(),
    name: "趙六",
    age: 60,
    gender: "female",
    condition: "糖尿病",
    status: "候診中",
    description: "",
    callNumber: 4,
  },
  {
    id: uuidv4(),
    name: "錢七",
    age: 50,
    gender: "male",
    condition: "胃潰瘍",
    status: "候診中",
    description: "",
    callNumber: 5,
  },
  {
    id: uuidv4(),
    name: "孫八",
    age: 28,
    gender: "female",
    condition: "感冒",
    status: "候診中",
    description: "",
    callNumber: 6,
  },
];

// 登入API
app.post("/login", (req, res) => {
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
app.get("/patients", (req, res) => {
  res.json(patients);
});

// 新增病患
app.post("/patients", (req, res) => {
  const newPatient = req.body;
  newPatient.id = uuidv4();
  newPatient.callNumber = patients.findLast((p) => p).callNumber + 1;
  patients.push(newPatient);
  res.json(newPatient);
});

// 更新病患資料
app.put("/patients/:id", (req, res) => {
  const patientId = req.params.id;
  req.body.age = Number(req.body.age);
  const updatedPatient = req.body;
  const index = patients.findIndex((p) => p.id === patientId);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updatedPatient };
    res.json(patients);
  } else {
    res.status(404).json({ message: "Patient not found" });
  }
});

// 刪除病患
app.delete("/patients/:id", (req, res) => {
  const patientId = req.params.id;
  patients = patients.filter((p) => p.id !== patientId);
  res.json({ message: "Patient deleted" });
});

// 啟動服務
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
