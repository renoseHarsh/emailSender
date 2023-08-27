import React, { useEffect, useState } from "react";

const EmailItem = ({ csvItem, emailData, accessToken }) => {
  const [status, setStatus] = useState("grey");

  useEffect(() => {
    if (status === 'green') {
      return;
    }
    const substitutedSubject = substituteJinjaVariables(emailData.subject);
    const substitutedBody = substituteJinjaVariables(emailData.body);
    const newEmailData = { recipient: csvItem.email, subject: substitutedSubject, body: substitutedBody }
    sendEmail(newEmailData)

  }, []);
  const sendEmail = async (detail) => {
    const authInfo = JSON.parse(sessionStorage.getItem("authInfo"));
    const accessToken = authInfo?.access_token;    
    try {
      const email = {
        raw: btoa(
          "From: me\n" + `To: ${detail.recipient}\n` + `Subject: ${detail.subject}\n\n` + `${detail.body}`
        ),
      };
      const response = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(email),
        }
      );
      if (response.ok) {
        console.log("Email sent successfully!");
        setStatus('green')
      } else {
        throw new Error("Failed to fetch message");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const substituteJinjaVariables = (content) => {
    let substitutedContent = content;
    if (csvItem) {
      for (const property in csvItem) {
        const jinjaVariable = `{{ ${property} }}`;
        substitutedContent = substitutedContent.replace(jinjaVariable, csvItem[property])
      }
    }
    return substitutedContent;
  }


  return (
    <div
      style={{
        border: '1px solid grey',
        borderRadius: '5px',
        padding: '5px',
        margin: '1px',
        backgroundColor: status,
      }}
    >
      {csvItem.email}
    </div>
  );
};

export default EmailItem;
