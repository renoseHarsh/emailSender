import React, { useEffect } from "react";

const clientId =
  "CLIENT_ID";
const clientSecret = "CLIENT_SECRET";
const scopes = "https://www.googleapis.com/auth/gmail.send";

const GetAuthorisation = ({ isLoggedIn }) => {
  const authoriseAcount = () => {
    var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    var form = document.createElement("form");
    form.setAttribute("method", "GET");
    form.setAttribute("action", oauth2Endpoint);
    var params = {
      client_id: clientId,
      redirect_uri: "http://localhost:3000",
      response_type: "token",
      scope: scopes,
      include_granted_scopes: "true",
      state: "pass-through value",
    };

    for (var p in params) {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="login-button-container">
      <p>
        First Step: Login Your Gmail
        <span className={isLoggedIn ? "green-tick" : ""}>
          {isLoggedIn ? "✓ " : ""}
        </span>
      </p>
      <button
        onClick={authoriseAcount}
        style={{
          backgroundColor: isLoggedIn ? "green" : "#1a1a1a",
          marginLeft: isLoggedIn ? "-100px" : "0",
        }}
        disabled={isLoggedIn}
      >
        {isLoggedIn ? "Logged In" : "Login Gmail"}
      </button>
    </div>
  );
};

export default GetAuthorisation;
