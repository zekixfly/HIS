// src/PatientContext.jsx
import React, { createContext, useState } from "react";

export const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patientList, setPatientList] = useState(null);

  // 新增病患的API
  const createPatient = async (values) => {
    const response = await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, status: "候診中" }),
    });
    const newPatient = await response.json();
    setPatientList([...patientList, newPatient]);
  };

  // 讀取病患的API
  const readPatients = async () => {
    const response = await fetch("/api/patients");
    const patiensData = await response.json();
    setPatientList(patiensData);
    return patiensData;
  }

  // 修改病患的API
  const updatePatient = async (values) => {
    const response = await fetch(`/api/patients/${values.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const updatePatientsData = await response.json();
    console.log('updatePatientsData', updatePatientsData);
    
    setPatientList(updatePatientsData);
  };

  // 刪除病患的API
  const deletePatient = async (id) => {
    await fetch(`/api/patients/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <PatientContext.Provider
      value={{ patientList, createPatient, readPatients, updatePatient, deletePatient }}
    >
      {children}
    </PatientContext.Provider>
  );
};
