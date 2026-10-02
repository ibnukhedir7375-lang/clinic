import React, { useContext, useState } from "react";
import PatientContext, {
  ExaminationContext,
  PaymentContext,
} from "../context/PatientContext";

const Examination = () => {
  // const [examinatioResult, setExaminationresult] = useState([]);
  const { isPaid, setIsPaid } = useContext(PaymentContext);
  const { pateientInfo, setPateintInfo } = useContext(PatientContext);
  const { examinatioResult, setExaminationresult } =
    useContext(ExaminationContext);
  const [searchedPatient, setSearchedPatient] = useState();
  const [isClicked, setIsClicked] = useState(false);
  const [phone, setPhone] = useState();

  const [saturation, setSaturation] = useState();
  const [suger, setSuger] = useState();
  const [temprature, setTemprature] = useState();
  const [bp, setBP] = useState();
  const [phoneNo, setPhoneNo] = useState();

  function handleInputChange(event) {
    if (event.target.name === "saturation") setSaturation(event.target.value);
    if (event.target.name === "suger") setSuger(event.target.value);
    if (event.target.name === "bp") setBP(event.target.value);
    if (event.target.name === "temprature") setTemprature(event.target.value);
    if (event.target.name === "phoneNo") setPhoneNo(event.target.value);
  }
  const inputs = document.querySelectorAll("input");

  function handleSubmitButton() {
    if (examinatioResult.name === "") {
      setExaminationresult([
        {
          saturation: saturation,
          suger: suger,
          bp: bp,
          temprature: temprature,
          phoneNo: phoneNo,
        },
      ]);

      console.log("empty array");
    }
    if (examinatioResult.name !== "") {
      setExaminationresult((prev) => [
        ...prev,
        {
          saturation: saturation,
          suger: suger,
          bp: bp,
          temprature: temprature,
          phoneNo: phoneNo,
        },
      ]);
    }

    inputs.forEach((input) => (input.value = ""));

    console.log(examinatioResult);
  }
  return (
    <div>
      {!isClicked && (
        <div className="examination">
          <h2>find patient by Phone no:</h2>
          <div>
            {" "}
            <input
              type="text"
              onChange={(event) => setPhone(event.target.value)}
            />
            <button
              onClick={() => {
                setIsClicked(true);
                setSearchedPatient(
                  pateientInfo.find((patient) => patient.phone === phone),
                );
              }}
            >
              Find
            </button>
          </div>
        </div>
      )}

      {isClicked && isPaid && (
        <div className="examination-div">
          <div>
            <label htmlFor="">Full name: </label>
            {searchedPatient.name}
          </div>
          <div>
            <label htmlFor="">Age: </label>
            {searchedPatient.age}
          </div>
          <div>
            <label htmlFor="">Weight: </label>
            {searchedPatient.weight}
          </div>

          <div>
            <label htmlFor="">Saturation: </label>
            <input
              type="text"
              onChange={handleInputChange}
              name="saturation"
              // value={saturation}
            />
          </div>

          <div>
            {" "}
            <label htmlFor=""> Blood Pressure: </label>
            <input
              type="text"
              onChange={handleInputChange}
              name="bP"
              // value={bp}
            />
          </div>

          <div>
            <label htmlFor="">Temprature: </label>
            <input
              type="text"
              onChange={handleInputChange}
              name="temprature"
              //value={temprature}
            />
          </div>

          <div>
            {" "}
            <label htmlFor="">Suger Level: </label>
            <input
              type="text"
              onChange={handleInputChange}
              name="suger"
              // value={suger}
            />
          </div>

          <div>
            <label htmlFor="">Phone: </label>
            <input
              type="text"
              onChange={handleInputChange}
              name="phoneNo"
              // value={phoneNo}
            />
          </div>

          <button onClick={handleSubmitButton}>Submit</button>
          <button onClick={() => console.log(pateientInfo)}>Test</button>
        </div>
      )}
      {isClicked && !isPaid && <p>Do the payment first!!</p>}
    </div>
  );
};

export default Examination;
