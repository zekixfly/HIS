# 醫療資訊系統(Hospital Information System)

## 簡介

此專案是使用 ChatGPT 協同合作的醫療資訊系統雛形專案，主要分為三個部分：櫃檯掛號系統、醫師看診系統及診間叫號系統。專案包含前端與後端兩個部分。前端主要使用 React 框架開發，用於提供使用者介面與互動，後端則使用 Node.js 的 Express 框架來模擬後端 API 服務和資料庫操作。

## 前端功能概覽

```
櫃檯掛號系統: 櫃檯護理師幫病人掛號的介面。
醫師看診系統: 醫師能夠查看病人掛號紀錄，以及紀錄病人的病歷。
診間叫號系統: 顯示當前正在候診的病人資訊，並實時更新。
```

## 專案結構

### `後端`

```
server.js
```

### `前端`

```
src
├── components
├── pages
⎪   ├── Login
⎪   ├── CallingSystem
⎪   ├── MedicalRcords
⎪   └── ReceptionSystem
└── App.jsx
```

## 安裝與啟動

### `安裝`

```
npm install
```

or

```
yarn install
```

### `啟動後端伺服器`

```
node server
```

### `啟動前端伺服器`

```
npm start
```

or

```
yarn start
```

## 登入角色與他們的帳密

### 角色：`櫃檯`

    Username: reception
    Password: 123456

### 角色：`醫師`

    Username: doctor
    Password: 123456
