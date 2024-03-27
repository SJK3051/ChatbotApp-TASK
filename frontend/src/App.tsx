import { useState } from "react";
import ReactMarkdown from "react-markdown"
import "./App.css";
import React from "react";

export default function App() {
  const bottylogo = require('./assets/images/BottyLogo.png')

  const [result, setResult] = useState();
  const [question, setQuestion] = useState('');
  const [file, setFile] = useState();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  type QAPair = { question: string; answer: string };
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]); //An object of QAPair Array type, starting as an empty array.
  
  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
    setIsCollapsed(!event.target.value);
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }
    if (question) {
      formData.append("question", question);
    }

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        //Take the current state of qaPairs, expand the array, and add an additional object at the end.
        setQaPairs(qaPairs => [...qaPairs, { question: question, answer: data.result}]);
        setIsCollapsed(false)
        setQuestion('');
        setIsLoading(false)
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

      {
      qaPairs.length === 0 
      ? 'No questions so far!'
      : qaPairs.map((qaPair, index) => (
          <React.Fragment key={index}>
            <div className={`question ${isCollapsed ? '' : 'show'}`}>
              <h2>You</h2>
              <p>{qaPair.question}</p>
            </div>
            <div className={`answer ${!qaPair.answer && index===0 ? 'first' : 'other'}`}>
              <h2>Chatty</h2>
              <ReactMarkdown className="resultOutput">
                {isLoading ? 'Thinking...' : qaPair.answer ? qaPair.answer : 'Ready to Help You!'}
              </ReactMarkdown>
            </div>
          </React.Fragment>
        ))
      }

        
        <div className="input-button-div">
          <input
            className="questionInput"
            id="question"
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Ask your question here"
          />
          <button
            className="submitBtn"
            type="submit"
            disabled={!question} //Only allow submitting if the question is not null.
          >
            »
          </button>
        </div>
      </form>
    </div>
    /**<label className="fileLabel" htmlFor="file">
          Upload CSV file:
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".csv"
          onChange={handleFileChange}
          className="fileInput"
        />
        <br></br>
        **/
  );
}
