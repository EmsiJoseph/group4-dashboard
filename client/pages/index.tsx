import React, { useEffect, useState } from "react";

function index() {
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/analyze")
      .then((response) => response.json())
      .then((data) => {
        setResult(data.result);
      });
  }, []);

  return <div>{result}</div>;
}

export default index;
