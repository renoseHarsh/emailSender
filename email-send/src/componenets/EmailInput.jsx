import React, { useEffect } from "react";

const EmailInput = ({
  data,
  updateData,
  headers,
  hasInvalidJinja,
  setHasInvalidJinja,
}) => {

  useEffect(() => {
    setHasInvalidJinja(checkForJinjaVariable(data.subject) || checkForJinjaVariable(data.body));
  }, [data])

  const handleSubjectChange = (e) => {
    const newSubject = e.target.value;
    updateData({ ...data, subject: newSubject });
  };

  const handleBodyChange = (e) => {
    const newBody = e.target.value;
    updateData({ ...data, body: newBody });
  };

  const checkForJinjaVariable = (text) => {
    const jinjaVariableRegex = /{{\s*(\w+)\s*}}/g;
    const matches = text.match(jinjaVariableRegex);
    if (!matches) {
      return false;
    }
    const variables = matches.map((match) =>
      match.replace(/{{\s*(\w+)\s*}}/g, "$1")
    );
    const invalidVariables = variables.filter(
      (variable) => !headers.includes(variable)
    );
    return invalidVariables.length > 0;
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "250px",
        left: "200px",
        width: "1000px",
      }}
    >
      <p>Third Step: Write Subject And Mail Body</p>
      <textarea
        placeholder="Subject"
        value={data.subject}
        onChange={handleSubjectChange}
        style={{
          width: "100%",
          height: "50px",
          resize: "none",
          fontSize: "18px",
        }}
      />
      <br />
      <textarea
        placeholder="Body"
        value={data.body}
        onChange={handleBodyChange}
        rows={10}
        style={{
          width: "100%",
          height: "500px",
          resize: "none",
          fontSize: "18px",
          paddingBottom: "20px",
        }}
      />
      {hasInvalidJinja ? (
        <p style={{ color: "red" }}>Invalid Jinja variable in the body</p>
      ) : null}
    </div>
  );
};

export default EmailInput;
