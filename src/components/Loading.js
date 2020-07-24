import React from "react";
import Loader from "react-loader-spinner";

export default function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader type="Oval" color="#bbbbbb" height="50" width="50" />
    </div>
  );
}
