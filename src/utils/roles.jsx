import { Route } from "react-router-dom";
import Doctors from "../Components/Doctors";

export const roles = [
  { role: "doctor", email: "doctor@gmail.com", password: "12345" },
  { role: "reception", email: "reception@gmail.com", password: "1234567" },
  { role: "examinor", email: "examinor@gmail.com", password: "1234" },
  { role: "laboratory", email: "Lab@gmial.com", password: "123" },
  { role: "pharmacy", email: "pharmacy@gmail.com", password: "123456" },
];

// export function validator(email, password) {
//   roles.map((data) => {
//     if (data.email == email && data.password == password) {
//       localStorage.setItem("data", JSON.stringify(data));
//       return data;
//     } else {
//       localStorage.clear();
//       return "invalid crdentials";
//     }
//   });
// }

export function validator(email, password) {
  // 1. Search for a matching user profile
  const foundUser = roles.find(
    (data) => data.email === email && data.password === password,
  );

  // 2. Perform the logic based on if they were found or not
  if (foundUser) {
    localStorage.setItem("data", JSON.stringify(foundUser));
    return foundUser; // Returns the user object
  } else {
    localStorage.clear();
    return "invalid credentials"; // Returns the error string
  }
}

export function Welcome({ role }) {
  return !role ? (
    <h1 className="welcome">Welcome to this clinic</h1>
  ) : (
    <h1>Welcome {role}</h1>
  );
}

export function Role({ data }) {
  switch (data.role) {
    case "doctor":
      return <Route path="/doctors" element={<Doctors />} />;
      break;
    case "examinor":
      return <Route path="/examination" element={<Examination />} />;
      break;
    case "laboratory":
      return <Route path="/laboratory" element={<Laboratory />} />;
      break;
    case "pharmacy":
      return <Route path="/pharmacy" element={<Pharmacy />} />;
      break;

    default:
      return <Route path="/newPatient" element={<NewPatient />} />;
  }
}
