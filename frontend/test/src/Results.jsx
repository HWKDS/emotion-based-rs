import React, { useEffect, useState } from "react";
import axios from "axios";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://localhost:5175/api/results");
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch results: " + err.message);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h1>All Results</h1>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <h2>Result {index + 1}</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;
