import "./App.css";
import Authorise from "./componenets/AuthoriseUser";
import { useEffect, useState } from "react";
import UploadCSV from "./componenets/UploadCsv";
import EmailInput from "./componenets/EmailInput";
import EmailItem from "./componenets/EmailItem";

const clientId =
  "112681219247-li0dmrp4fiho8eug2qaajhq823n14rsj.apps.googleusercontent.com";
const clientSecret = "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";
const scopes = "https://www.googleapis.com/auth/gmail.send";

function App() {
  const [emailData, setEmailData] = useState({ subject: "", body: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [csvData, setCSVData] = useState([]);
  const [access_token, setAccess_token] = useState();
  const [check, setCheck] = useState(false);
  const [showEmails, setShowEmails] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [hasInvalidJinja, setHasInvalidJinja] = useState(false);

  useEffect(() => {
    const authInfo = JSON.parse(sessionStorage.getItem("authInfo"));
    const accessToken = authInfo?.access_token;
    const urlParams = new URLSearchParams(window.location.hash.substr(1));
    if (accessToken) {
      setIsLoggedIn(true);
      setAccess_token(accessToken);
    }

    if ([...urlParams.keys()].length == 0) {
      return;
    } else {
      const paramsObject = {};
      for (const [key, value] of urlParams) {
        paramsObject[key] = value;
      }
      sessionStorage.setItem("authInfo", JSON.stringify(paramsObject));
      window.history.pushState({}, "/", "/");
      setIsLoggedIn(true);
    }
  }, []);

  const handleInvalidJinja = (TorF) => {
    setHasInvalidJinja(TorF);
  };

  const handleSendClick = () => {
    setShowEmails(true);
  };

  const handleEmailChange = (newData) => {
    setEmailData(newData);
  };

  const updateCsvData = (data) => {
    setCSVData(data);
    if (data.length > 0) {
      setHeaders(Object.keys(data[0]));
    } else {
      setHeaders([]);
    }
  };



  return (
    <div>
      <Authorise isLoggedIn={isLoggedIn} />
      {isLoggedIn ? <UploadCSV setCsvData={updateCsvData} /> : null}
      {isLoggedIn ? (
        <EmailInput
          data={emailData}
          updateData={handleEmailChange}
          headers={headers}
          hasInvalidJinja={hasInvalidJinja}
          setHasInvalidJinja={setHasInvalidJinja}
        />
      ) : null}
      {isLoggedIn &&
      csvData.length > 0 &&
      emailData.body.trim() !== "" &&
      emailData.subject.trim() !== "" &&
      !hasInvalidJinja ? (
        <div style={{ position: "absolute", top: "900px", left: "1100px" }}>
          <button style={{ margin: "0 0 20px" }} onClick={handleSendClick}>
            SEND
          </button>
        </div>
      ) : null}
      {showEmails ? (
        <div style={{ position: "absolute", top: "950px", left: "500px" }}>
          <ul className="email-list" style={{ marginBottom: "20px" }}>
            {csvData.map((csvItem, index) => (
              <li key={index}>
                <EmailItem
                  csvItem={csvItem}
                  emailData={emailData}
                  accessToken={access_token}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
export default App;
