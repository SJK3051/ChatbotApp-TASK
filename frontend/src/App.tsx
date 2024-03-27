import { useState } from "react";
import ReactMarkdown from "react-markdown"
import "./App.css";

export default function App() {
  const [result, setResult] = useState();
  const [question, setQuestion] = useState('');
  const [file, setFile] = useState();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
        setResult(data.result);
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
        <h1>Chatty</h1>
        <hr/>{/** keps both to the side**/}
        <img src="image.jpg" alt="Logo"/>
      </div>
      
      <form onSubmit={handleSubmit} className="form">

        <div className={`collapsed ${isCollapsed ? '' : 'show'}`}>
          <h2>You</h2>
          <p>{question}</p>
        </div>

        <div className="expanded">
          {/**Create html from the markdown provided by the chatbot**/}
          <h2>Chatty</h2>
          <ReactMarkdown className="resultOutput">
            {isLoading ? 'Thinking...' : result ? result : 'Ready to Help You!'}
          </ReactMarkdown>
        </div>

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
