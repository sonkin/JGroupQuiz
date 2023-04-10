import "./styles.css";
import StartForm from "./StartForm";
import { createContext, useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import UserTable from "./UserTable";
import {
  createBrowserRouter,
  Route,
  Router,
  RouterProvider,
  Routes,
  useParams,
} from "react-router-dom";
import QuestionCreator from "./QuestionCreator";

export const UserContext = createContext();

const Main = () => {
  const { path } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [finishResults, setFinishResults] = useState(null);
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
    const serverUri = "https://jquiz-athjd4btb4c0fadd.z01.azurefd.net";
    try {
      const response = await fetch(serverUri + "/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://jquiz.vercel.app/",
        },
        body: JSON.stringify(results),
      });
      if (response.ok) {
        setFinishResults("Results are submitted!");
      }
    } catch (err) {
      setFinishResults("Results were not submitted: " + err);
    }
  };

  const userContextValue = {
    name,
    setName,
    email,
    setEmail,
  };
  return (
    <div className="App">
      <UserContext.Provider value={userContextValue}>
        <UserInfo />
        <StartForm onStartQuiz={handleStartQuiz} onFinishQuiz={onFinishQuiz} />
        <div>{finishResults}</div>
        {finishResults && <UserTable currentUserEmail={email} />}
      </UserContext.Provider>
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/results",
    element: <UserTable />,
  },
  {
    path: "/creator",
    element: <QuestionCreator />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
