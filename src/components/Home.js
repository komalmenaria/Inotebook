import React from "react";
import Notes from "./Notes";

const home = (props) => {
  const {showAlert} = props
  return (
  
    <Notes showAlert={showAlert}/>
  );
  
};

export default home;
