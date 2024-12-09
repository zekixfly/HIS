// src/PatientContext.jsx
import React, { createContext, useState } from "react";

export const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patientList, setPatientList] = useState(null);

  return (
    <PatientContext.Provider value={{ patientList, setPatientList }}>
      {children}
    </PatientContext.Provider>
  );
};
