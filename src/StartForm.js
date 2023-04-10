import React, { useContext, useState } from "react";
import { UserContext } from "./App";
import { questions } from "./questions";
import Quiz from "./Quiz";
import "./styles.css"; // import your CSS file here

const StartForm = ({ onStartQuiz, onFinishQuiz }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const { name, setName, email, setEmail } = useContext(UserContext);

  const handleStartQuiz = () => {
    const valid = validateForm();
    if (valid) {
      setShowQuiz(true);
      onStartQuiz();
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!name) {
      setNameError("Please enter your name.");
      isValid = false;
    } else {
      setNameError("");
    }
    if (!email) {
      setEmailError("Please enter your email.");
      isValid = false;
    } else if (!email.endsWith("@dxc.com")) {
      setEmailError("Please enter a valid email @dxc.com");
      isValid = false;
    } else {
      setEmailError("");
    }
    return isValid;
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="App">
      {!showQuiz && (
        <div className="startForm">
          <h2>
            JOIN THE GROUP <br/>of Spring MVC training!
          </h2>
          <div style={{ padding: "10px" }}>
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={handleChangeName}
            />
            <div style={{ color: "red" }}>{nameError}</div>
          </div>
          <div style={{ padding: "10px" }}>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              placeholder="Your email"
              value={email}
              onChange={handleChangeEmail}
            />
            <div style={{ color: "red" }}>{emailError}</div>
          </div>
          <button
            className="button-style"
            style={{ marginTop: "50px" }}
            onClick={handleStartQuiz}
          >
            Join!
          </button>
        </div>
      )}
      {showQuiz && <Quiz questions={questions} onFinishQuiz={onFinishQuiz} />}
    </div>
  );
};

export default StartForm;
