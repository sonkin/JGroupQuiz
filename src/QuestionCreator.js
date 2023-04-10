import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResultsTable from './ResultsTable';

// create the WebSocket connection
let socket = new WebSocket("ws://localhost:8081");

const QuestionCreator = () => {
    const [questionText, setQuestionText] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState('');
    const [password, setPassword] = useState('');
    const [results, setResults] = useState(null);
    const [question, setQuestion] = useState(null);
    const [finishedQuestion, setFinishedQuestion] = useState(false);
    const [submittedQuestion, setSubmittedQuestion] = useState(false);

    useEffect(() => {
        socket.onmessage = function (event) {
            let message = JSON.parse(event.data);
            if (message.type === "question") {
                setQuestion(message);
                setResults(null);
            }
            if (message.type === "results-update") {
                setResults(message.results);
            }
        };
        setPassword(localStorage.getItem('questionCreatorPassword'));
    }, []);

    useEffect(() => {
        setFinishedQuestion(false);
        setSubmittedQuestion(false);
    }, [question]);

    const finishQuestion = async () => {
        await axios.post('http://localhost:9000/finish');
        setFinishedQuestion(true);
        setSubmittedQuestion(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Store the password in localStorage
        localStorage.setItem('questionCreatorPassword', password);

        // Parse the correct answers
        const correctAnswersArray = correctAnswers.split(',').map((answer) => answer.trim());

        // Parse the question text and options
        const lines = questionText.trim().split('\n');
        const question = lines[0].trim();
        const options = lines.slice(1).map((line) => line.slice(3).trim());

        // Create the payload
        const payload = {
            question,
            options,
            correct: options.filter((option, index) => correctAnswersArray.includes(String.fromCharCode(97 + index))),
        };

        try {
            // Send the POST request
            const response = await axios.post('http://localhost:9000/question', payload);
            setSubmittedQuestion(true);
        } catch (error) {
            console.error('Error while submitting the question:', error);
        }
    };
    return (
        <div>
            <h1>JQUIZ: Create a Question for Quiz</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="question-text" style={{ display: "block", marginBottom: "5px" }}>Question:</label>
                    <textarea
                        id="question-text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        rows="7"
                        cols="200"
                        required
                        style={{ width: "100%" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="correct-answers" style={{ display: "block", marginBottom: "5px" }}>Correct Answers (e.g., "a,c"):</label>
                    <input
                        type="text"
                        id="correct-answers"
                        value={correctAnswers}
                        onChange={(e) => setCorrectAnswers(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={submittedQuestion} style={{ marginBottom: "20px" }}>Submit Question</button>
                {submittedQuestion && <span> <b>This question is submitted!</b></span>}
            </form>

            {question && results && results.length > 0 && (
                <>
                    <button disabled={finishedQuestion} onClick={finishQuestion} style={{ marginBottom: "20px" }}>Finish question</button>
                    {finishedQuestion && <span> <b>This question is finished!</b></span>}
                    <ResultsTable question={question} results={results} />
                </>
            )}
        </div>
    );
};

export default QuestionCreator;
