import React, { useState } from "react";
import PatientContext, {
  ExaminationContext,
  SearchedPatient,
} from "../context/PatientContext";
import { useContext } from "react";
import Examination from "./Examination";
import Laboratory from "./Laboratory";
const Doctors = () => {
  // const { lab, setLab } = useContext(Laboratory);
  const { pateientInfo, setPateintInfo } = useContext(PatientContext);
  const { examinatioResult, setExaminationresult } =
    useContext(ExaminationContext);
  const [isClickd, setIsClicked] = useState(false);
  const [searchedPatient, setSearchedPatient] = useState();
  const [patientExamination, setPatientExamination] = useState();
  const [phone, setPhone] = useState();

  function handleFindButton() {
    setIsClicked(true);
    console.log(pateientInfo);
    console.log(examinatioResult);

    setPatientExamination(
      examinatioResult.find((result) => result.phoneNo === phone),
    );
    console.log(examinatioResult);
    setSearchedPatient(pateientInfo.find((patient) => patient.phone === phone));
  }
  return (
    <div>
      {!isClickd && (
        <div>
          {" "}
          <h2>Find Patient by Phone number</h2>
          <input
            type="text"
            onChange={(event) => setPhone(event.target.value)}
          />
          <button onClick={handleFindButton}>Find</button>
        </div>
      )}

      {searchedPatient ? (
        <div>
          <h2>{searchedPatient.name}</h2>
          <h2>{searchedPatient.age}</h2>
          <h2>{searchedPatient.weight}</h2>
        </div>
      ) : (
        isClickd && <div>No one</div>
      )}
      {patientExamination ? (
        <div>
          <h2>saturation :{patientExamination.saturation}</h2>
          <h2>Temprature: {patientExamination.temprature}</h2>
          <h2>Suger: {patientExamination.suger}</h2>

          <input type="text" />
          <label htmlFor="RBS"></label>
          <input type="radio" />
        </div>
      ) : (
        isClickd && <div>Please do the examination first</div>
      )}
      {isClickd && <button onClick={() => setIsClicked(false)}>Back</button>}
    </div>
  );
};

export default Doctors;
