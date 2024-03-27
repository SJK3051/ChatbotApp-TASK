from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
import bard_predictor
from fastapi import FastAPI, UploadFile, Form
from typing import Optional

# Load environment variables from .env file in this folder (if any)
load_dotenv()

class Response(BaseModel):
    result: str | None

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict", response_model = Response) #Prepare an endpoint in /predict
async def predict(
    question: Optional[str] = Form(None), #Get the value in the key question from the form inside the request body, otherwise None. Automatically validate that its a string.
    file: Optional[UploadFile] = Form(None) #Get the value in the key file from the form inside the request body, otherwise None. Automatically validate that its an UploadFile
    ) -> Any:

    result = bard_predictor.predict(question) if question else 'Please provide a question!'
    return {'result':result} #Response model response means we have to return a dictionary