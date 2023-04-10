import React, {useEffect, useState} from "react";

const QuizQuestion = ({
                          question,
                          showResults,
                          onSubmit,
                          score,
                      }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [choiceIsSent, setChoiceIsSent] = useState(false);

    useEffect(() => {
        setSelectedOptions([]);
        setChoiceIsSent(false);
    }, [question]);

    const handleOptionSelect = (option) => {
        if (choiceIsSent) return;
        if (question.correct.length>1) {
            setSelectedOptions((prevOptions) =>
                prevOptions.includes(option)
                    ? prevOptions.filter((opt) => opt !== option)
                    : [...prevOptions, option]
            );
        } else {
            setSelectedOptions([option]);
        }
    };

    const handleSubmit = () => {
        if (selectedOptions.length === 0) return;
        setChoiceIsSent(true);
        onSubmit(selectedOptions);
    };

    return (
        <div>
            <h2>{question.question}</h2>
            <form>
                {question.options.map((option) => (
                    <div
                        key={option}
                        style={{
                            display: "flex",
                            cursor: "pointer",
                            padding: "10px",
                        }}
                        onClick={() => handleOptionSelect(option)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#eef";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "";
                        }}
                    >
                        <input
                            type={question.correct.length>1 ? "checkbox" : "radio"}
                            name="option"
                            value={option}
                            checked={selectedOptions.includes(option)}
                            onChange={() => handleOptionSelect(option)}
                            style={{marginRight: "10px"}}
                        />
                        <span
                            style={{marginLeft: 0, fontSize: "1.2rem", textAlign: "left"}}
                        >
                            {option}
                        </span>
                    </div>
                ))}
            </form>
            {!showResults && (
            <button onClick={handleSubmit}
                    className="button-style"
                    disabled={choiceIsSent}>
                Send your choice!
            </button>)}
        </div>
    );
};

export default QuizQuestion;
