import React from "react";
import "./ResultsTable.css";

const ResultsTable = ({ results, question }) => {
    const getVoters = (option, questionResults) => {
        return questionResults
            .filter((participant) => participant.answers.includes(option))
            .map((participant) => participant.name)
            .join(", ");
    };

    const isOptionCorrect = (option, correctOptions) => {
        return correctOptions.includes(option);
    };

    const getVoteCount = (option, questionResults) => {
        return questionResults.filter((participant) =>
            participant.answers.includes(option)
        ).length;
    };

    const getMaxVoteCount = (questionResults) => {
        const voteCounts = question.options.map((option) =>
            getVoteCount(option, questionResults)
        );
        return Math.max(...voteCounts);
    };

    return (
        <>
        <h2>Results table:</h2>
        <table className="results-table">
            <thead>
            <tr>
                <th>Option</th>
                <th>Voters</th>
                <th>Correct</th>
                <th>Votes Distribution</th>
            </tr>
            </thead>
            <tbody>
            {question.options.map((option, index) => {
                const questionResults = results;
                const correctOptions = question.correct;
                const voteCount = getVoteCount(option, questionResults);
                const maxVoteCount = getMaxVoteCount(questionResults);

                return (
                    <tr key={option} className={index % 2 === 0 ? "even-row" : ""}>
                        <td>{option}</td>
                        <td>{getVoters(option, questionResults)}</td>
                        <td>{isOptionCorrect(option, correctOptions) ? "Yes" : "No"}</td>
                        <td>
                            <div
                                style={{
                                    backgroundColor: "rgba(158,47,255,0.64)",
                                    width: `${(voteCount / maxVoteCount) * 100}%`,
                                    height: "20px",
                                }}
                            ></div>
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
        </>
    );
};

export default ResultsTable;
