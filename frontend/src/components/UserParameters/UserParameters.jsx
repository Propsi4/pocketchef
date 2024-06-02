import React from "react";
import IngradientsInput from "../IngredientsInput/IngredientsInput";
import Filters from "../Filters/Filters";
import "./UserParameters.css";

const UserParameters = () => {
  return (
    <div className="userParameters">
      <IngradientsInput></IngradientsInput>
      <Filters />
    </div>
  );
};

export default UserParameters;
