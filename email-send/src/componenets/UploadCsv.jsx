import React, { useEffect } from "react";
import Papa from "papaparse";
import { useState } from "react";

const UploadCSV = ({ setCsvData }) => {
  const [file, setFile] = useState(null);
  const [hasEmptyColumns, setHasEmptyColumns] = useState(false);
  const [isEmailHeaderMissing, setIsEmailHeaderMissing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          const headers = results.meta.fields;
          const hasEmpty = data.some((row) =>
            headers.some((header) => row[header].trim() === "")
          );
          setIsEmailHeaderMissing(!headers.includes("email"));
          setHasEmptyColumns(hasEmpty);
          setIsLoaded(headers.includes("email") && !hasEmpty);
        },
      });
    }
  }, [file]);

  const CheckMe = () => {
    console.log(`isLoaded ${isLoaded}`)
    console.log(`isEmailHeaderMissing ${isEmailHeaderMissing}`)
    console.log(`hasEmpty ${hasEmptyColumns}`)
  }
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setCsvData([]);
    setIsUploaded(false);
    setIsEmailHeaderMissing(false);
    setHasEmptyColumns(false);
    setIsLoaded(false);
  };

  const handleUpload = () => {
    if (isLoaded) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          setCsvData(data);
          setIsUploaded(true);
        },
      });
    }
  };

  return (
    <div className="upload-csv-container">
      <p>Second Step: Upload Csv file with emails</p>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!isLoaded}>
        Upload
      </button>
      {hasEmptyColumns ? (
        <p style={{ color: "red" }}>There is/are empty column(s)</p>
      ) : isEmailHeaderMissing ? (
        <p style={{ color: "red" }}>Required Header Is Missing - Email</p>
      ) : isUploaded ? (
        <p style={{ color: "green" }}>CSV file uploaded successfully</p>
      ) : null}
    </div>
  );
};

export default UploadCSV;
