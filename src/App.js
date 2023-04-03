import "./styles.css";
import StartForm from "./StartForm";
import { createContext, useEffect, useState } from "react";
import UserInfo from "./UserInfo";

export const UserContext = createContext();

const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [finishResults, setFinishResults] = useState("");
  const handleStartQuiz = () => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
  };
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");

    if (storedName) {
      setName(storedName);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const onFinishQuiz = async (score) => {
    const results = { username: name, email, score };
    const response = await fetch("http://23.97.148.236/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(results),
    });
    if (response.ok) {
      setFinishResults("Results are submitted!");
    }
  };

  const userContextValue = {
    name,
    setName,
    email,
    setEmail,
  };
  return (
    <>
      <UserContext.Provider value={userContextValue}>
        <div className="App">
          <UserInfo />
          <StartForm
            onStartQuiz={handleStartQuiz}
            onFinishQuiz={onFinishQuiz}
          />

          <h2>{finishResults}</h2>
        </div>
      </UserContext.Provider>
      <div className="footer">Quiz v.0.0.1</div>
    </>
  );
};

export default App;
