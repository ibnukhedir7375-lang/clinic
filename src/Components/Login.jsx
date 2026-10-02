import React, { useState } from "react";
import { validator, Welcome } from "../utils/roles";

const Login = () => {
  const [info, setInfo] = useState();
  const [message, setMessage] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  function handleClick(e) {
    e.preventDefault();
    if (email && password) {
      setInfo({ email, password });
    } else {
      setMessage("Enter password and email");
    }
    const data = validator(email, password);
    const isInvalid = typeof data === "string";
    if (isInvalid) {
      setError(data);
    } else {
      window.location.reload();
    }
  }
  return (
    <form className="login-div" onSubmit={handleClick}>
      <Welcome />
      <div>
        <label htmlFor="">Email </label>
        <input
          type="email"
          name={email}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>

      <div>
        {" "}
        {/* <label htmlFor="">Phone </label>
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        /> */}
        <label htmlFor="">Password </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>

      <button type="submit">Login</button>
      {message ? <small>{message}</small> : null}
      {error ? <small>{error}</small> : null}
    </form>
  );
};

export default Login;
