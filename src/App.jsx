import React, { use, useState } from "react";
import NewPatient from "./Components/NewPatient";
import {
  BrowserRouter,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";
import Navbar from "./Navbars/Navbar";
import Pharmacy from "./Components/Pharmacy";
import FindPatient from "./Components/FindPatient";
import Laboratory from "./Components/Laboratory";
import Examination from "./Components/Examination";
import FindContext from "./context/FindContext";
import PatientContext, {
  PaymentContext,
  SearchedPatient,
  LaboratoryContext,
  NewContext,
} from "./context/PatientContext";
import { ExaminationContext } from "./context/PatientContext";
// import { Laboratory } from "./context/PatientContext";
import Doctors from "./Components/Doctors";
import Login from "./Components/Login";
import { Role, Welcome } from "./utils/roles";

const App = () => {
  const [isPaid, setIsPaid] = useState(false);
  const [examinatioResult, setExaminationresult] = useState([]);
  const [lab, setLab] = useState([]); //This state for Examination.jsx
  const [isFind, setIsfind] = useState(false);
  const [pateientInfo, setPateintInfo] = useState([]);
  const [serachedPatient, setSearchedPatient] = useState();
  const data = JSON.parse(localStorage.getItem("data")) ?? {};
  const isAuthorized = Object?.keys(data)?.length > 0;
  return !isAuthorized ? (
    <Login />
  ) : (
    <>
      <Welcome role={data?.role} />
      <PatientContext value={{ pateientInfo, setPateintInfo }}>
        <PaymentContext value={{ isPaid, setIsPaid }}>
          <ExaminationContext
            value={{ examinatioResult, setExaminationresult }}
          >
            <SearchedPatient value={{ SearchedPatient, setSearchedPatient }}>
              <LaboratoryContext value={{ lab, setLab }}>
                <Routes>
                  {data?.role === "doctor" && (
                    <Route path="/" element={<Doctors />} />
                  )}
                  {data?.role === "examinor" && (
                    <Route path="/" element={<Examination />} />
                  )}
                  {data?.role === "laboratory" && (
                    <Route path="/" element={<Laboratory />} />
                  )}
                  {data?.role === "pharmacy" && (
                    <Route path="/" element={<Pharmacy />} />
                  )}
                  {data?.role === "reception" && (
                    <Route path="/" element={<NewPatient />} />
                  )}

                  {/* Catch-all fallback if path doesn't match */}
                  <Route
                    path="*"
                    element={<div>Not Found or Unauthorized</div>}
                  />
                </Routes>
              </LaboratoryContext>
            </SearchedPatient>
          </ExaminationContext>
        </PaymentContext>
      </PatientContext>
    </>
  );
};

export default App;
