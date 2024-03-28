import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

export default function App() {
  const bottylogo = require('./assets/images/BottyLogo.png')

  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  type QAPair = { question: string; answer: string };
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const currentQuestion = question; // Store the question before clearing it
    setIsLoading(true);
    setQaPairs(qaPairs => [...qaPairs, { question: currentQuestion, answer: 'Thinking...'}]);
    setQuestion('');

    const formData = new FormData();
    formData.append("question", currentQuestion);

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setQaPairs(qaPairs => {
          const newQaPairs = [...qaPairs];
          newQaPairs[newQaPairs.length - 1].answer = data.result;
          return newQaPairs;
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  return (
    <div className="appBlock">
      <div className="title">
        <h1 className="mainTitle">Chatty</h1>
        <img className='mainLogo' src={bottylogo} alt="Logo"/>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        {qaPairs.map((qaPair, index) => (
          <React.Fragment key={index}>
            <div className={`question ${qaPair.question ? 'show' : ''}`}>
              <h2>You</h2>
              <p>{qaPair.question}</p>
            </div>
            <div className={`answer ${!qaPair.answer && index===0 ? 'first' : 'other'}`}>
              <h2>Chatty</h2>
              <ReactMarkdown className="resultOutput">
                {isLoading && index === qaPairs.length - 1 ? 'Thinking...' : qaPair.answer || 'Ready to Help You!'}
              </ReactMarkdown>
            </div>
          </React.Fragment>
        ))}
        
        <div className="input-button-div">
          <textarea
            className="questionInput"
            id="question"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Ask your question here"
          />
          <button
            className="submitBtn"
            type="submit"
            disabled={!question.trim()} //Only allow submitting if the question is not null.
          >
            »
          </button>
        </div>
      </form>
    </div>
  );
}
