import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="nav-bars-div">
      <Link className="link" to="/newPatient">
        New Patient
      </Link>
      <Link className="link" to="/find">
        Find Patient
      </Link>
      <Link className="link" to="/Examination">
        Examination
      </Link>
      <Link className="link" to="/doctors">
        Physician
      </Link>
      <Link className="link" to="/laboratory">
        Laboratory
      </Link>
      <Link className="link" to="/pharmacy">
        Pharmacy
      </Link>
    </div>
  );
};

export default Navbar;
