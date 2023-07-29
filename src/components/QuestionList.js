import React, { useState, useEffect } from "react";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:4000/questions");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleCorrectAnswerChange = async (questionId, correctIndex) => {
    try {
      // Send PATCH request to the API to update the correct answer for the question
      await fetch(`http://localhost:4000/questions/${questionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correctIndex: correctIndex,
        }),
      });

      // 
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === questionId
            ? { ...question, correctIndex: correctIndex }
            : question
        )
      );
    } catch (error) {
      console.error("Error updating correct answer:", error);
    }
  };

  return (
    <div>
      <h2>Questions:</h2>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <h3>{question.title}</h3>
            <p>{question.content}</p>
            <label>
              Correct Answer:
              <select
                value={question.correctIndex}
                onChange={(e) =>
                  handleCorrectAnswerChange(question.id, parseInt(e.target.value))
                }
              >
                {question.answers.map((answer, index) => (
                  <option key={index} value={index}>
                    {answer}
                  </option>
                ))}
              </select>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
