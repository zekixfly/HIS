// src/PatientContext.jsx
import React, { createContext, useState } from "react";

export const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [currentPatient, setCurrentPatient] = useState(null);

  return (
    <PatientContext.Provider value={{ currentPatient, setCurrentPatient }}>
      {children}
    </PatientContext.Provider>
  );
};
