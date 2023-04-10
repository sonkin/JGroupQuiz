import React, {useContext, useEffect, useState} from "react";
import QuizQuestion from "./QuizQuestion";
import {UserContext} from "./App";
import ResultsTable from "./ResultsTable";
import stopwatch from "./assets/stopwatch.gif";
import stopwatch2 from "./assets/stopwatch2.gif";
import {HTTPURL, WSURL} from "./SERVER";

// create the WebSocket connection
let socket = new WebSocket(WSURL);

const Quiz = ({ questions, onFinishQuiz }) => {
  const [question, setQuestion] = useState(null);
  const [waitingForResults, setWaitingForResults] = useState(false);
  const [waitingForQuestion, setWaitingForQuestion] = useState(true);
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const { name, setName, email, setEmail } = useContext(UserContext);

  useEffect(() => {
    socket.onmessage = function (event) {
      let message = JSON.parse(event.data);
      if (message.type === "question") {
        setQuestion(message);
        setResults(null);
        setWaitingForQuestion(false);
      }
      if (message.type === "results") {
        setResults(message.results);
        setWaitingForResults(false);
      }
    };
  }, []);

  const handleQuestionSolved = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setScore(score - 1);
    }
  };

  const handleSubmit = (answers) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, answers }),
    };
    fetch(HTTPURL+"/results", requestOptions).then((response) => {
      if (response.ok) {
        setWaitingForResults(true);
      }
    });
  };

  return (
      <div>
{/*      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontWeight: "bold",
        }}
      >
        Current score: {score}
      </div>*/}

        {question && (
            <div>
              <QuizQuestion showResults={results && results.length>0}
                            question={question} onSubmit={handleSubmit}/>
            </div>
        )}
        {waitingForResults && (
            <div>
              <h2 style={{color:"#4345B8"}}>Waiting for the results...</h2>
              <img src={stopwatch} width={200}/>
            </div>
        )}
        {results && results.length > 0 && (
            <ResultsTable results={results} question={question} />
        )}
        {waitingForQuestion && (
            <div>
              <h2 style={{color:"#4345B8"}}>Waiting for the first question...</h2>
              <img src={stopwatch2} width={200}/>
            </div>
        )}
      </div>
  );
};

export default Quiz;
