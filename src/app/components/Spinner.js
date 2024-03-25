import React from "react";
import { FadeLoader } from "react-spinners";

function Spinner({ loading }) {
  return <FadeLoader color="blue" loading={loading} size={150} />;
}

export default Spinner;
