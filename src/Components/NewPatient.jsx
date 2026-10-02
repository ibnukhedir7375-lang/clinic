import React, { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";
import FindPatient from "./FindPatient";
import PatientContext from "../context/PatientContext";

const NewPatient = () => {
  const { pateientInfo, setPateintInfo } = useContext(PatientContext);
  console.log(pateientInfo);

  // const [pateientInfo, setPateintInfo] = useState([
  //   { name: "", age: "", weight: "", phone: "" },
  // ]);
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [weight, setWeight] = useState("");
  const [phone, setPhone] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  function handleInputChange(event) {
    setIsRegistered(false);
    if (event.target.name === "Name") setName(event.target.value);
    else if (event.target.name === "Age") setAge(event.target.value);
    else if (event.target.name === "Weight") setWeight(event.target.value);
    else if (event.target.name === "Phone") setPhone(event.target.value);
  }

  function handleClick() {
    const inputFields = document.querySelectorAll("input");

    if (pateientInfo.name !== "") {
      setPateintInfo((prevInfo) => [
        ...prevInfo,
        { name: name, age: age, weight: weight, phone: phone },
      ]);
    }
    if (pateientInfo.name === "") {
      setPateintInfo([{ name: name, age: age, weight: weight, phone: phone }]);
    }
    inputFields.forEach((input) => (input.value = ""));
    //console.log(pateientInfo);
    setIsRegistered(true);
  }
  return (
    <div className="newPatient-div">
      {/* <patinetContext.Provider value={{ pateientInfo, setPateintInfo }}> */}
      <div>
        {" "}
        <label htmlFor="">Name</label>
        <input
          type="text"
          name="Name"
          //value={pateientInfo?.name}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="">Age</label>
        <input
          type="text"
          name="Age"
          // value={pateientInfo?.age}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="">Weight</label>
        <input
          type="text"
          name="Weight"
          // value={pateientInfo?.Weight}
          onChange={handleInputChange}
        />
      </div>

      <div>
        {" "}
        <label htmlFor="">Phone</label>
        <input
          type="text"
          name="Phone"
          //value={pateientInfo?.Phone}
          onChange={handleInputChange}
        />
      </div>

      <button name="Register" onClick={handleClick} className="register-button">
        Register
      </button>
      {isRegistered && <div>registerd succsfully</div>}
      {/* </patinetContext.Provider> */}
      {/* <FindPatient /> */}
    </div>
  );
};

export default NewPatient;
