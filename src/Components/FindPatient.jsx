import React, { useContext, useEffect } from "react";
import { useState } from "react";
import PatientContext, { PaymentContext } from "../context/PatientContext";

const FindPatient = () => {
  const { isPaid, setIsPaid } = useContext(PaymentContext);
  const { pateientInfo, setPateintInfo } = useContext(PatientContext);
  const [phone, setPhone] = useState("");
  const [serachedPatient, setSearchedPatient] = useState();
  const [clickFindButton, setClickFindButton] = useState(false);

  useEffect(() => {
    console.log("hello");
  }, [serachedPatient]);
  function handleFindButton() {
    setClickFindButton(true);

    setSearchedPatient(pateientInfo.find((patient) => patient.phone === phone));
    //console.log(serachedPatient);
  }

  return (
    <div className="find-div">
      <h2>Find patient by Thier Phone no</h2>
      <div className="input-find">
        <input
          type="text"
          value={phone}
          onChange={(event) => {
            setIsPaid(false);
            setClickFindButton(false);
            //setClickFindButton(true);
            setPhone(event.target.value);
          }}
        />
        <button onClick={handleFindButton}>Find</button>
      </div>

      {serachedPatient && (
        <div className="patient">
          <p></p>
          <div>
            <label htmlFor="">Full name: </label>
            <p style={{ display: "inline" }}>{serachedPatient.name}</p>
          </div>
          <div>
            <label htmlFor="">Age: </label>
            <p style={{ display: "inline" }}>{serachedPatient.age}</p>{" "}
          </div>
          <div>
            <label htmlFor=""> Weight: </label>
            <p style={{ display: "inline" }}>{serachedPatient.weight}</p>{" "}
          </div>
          <div>
            <label htmlFor="">Phone no: </label>
            <p style={{ display: "inline" }}>{serachedPatient.phone}</p>
          </div>

          <button
            onClick={() => {
              setIsPaid(true);
              console.log("paid");
            }}
          >
            pay
          </button>
        </div>
      )}
      {serachedPatient == undefined && clickFindButton && <div>Not found</div>}
    </div>
  );
};

export default FindPatient;
