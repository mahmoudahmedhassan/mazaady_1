import React from "react";

function Taple({ tableData }) {
  return (
    <>
      
      <table class="table table-hover">
        <thead>
          <tr>
            {Object.keys(tableData).map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.values(tableData).map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Taple;
