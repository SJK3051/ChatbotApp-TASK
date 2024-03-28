from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
import bard_predictor
from fastapi import FastAPI, UploadFile, Form
from typing import Optional
import uvicorn
from os import getenv

#Run fastapi @app with uvicorn if the python file is executed
if __name__ == "__main__":
    port = int(getenv('PORT',8000))
    uvicorn.run("api:app",port=port,reload=True) #Run the app method in the api python file.


# Load environment variables from .env file in this folder (if any)
load_dotenv()

app = FastAPI()

class Response(BaseModel):
    result: str | None

@app.get("/")
async def root():
    return {"message": "Please use the post method on /predict to get a useful result!"}

@app.post("/predict", response_model = Response) #Prepare an endpoint in /predict
async def predict(
    question: Optional[str] = Form(None), #Get the value in the key question from the form inside the request body, otherwise None. Automatically validate that its a string.
    file: Optional[UploadFile] = Form(None) #Get the value in the key file from the form inside the request body, otherwise None. Automatically validate that its an UploadFile
    ) -> Any:

    result = bard_predictor.predict(question) if question else 'Please provide a question!'
    return {'result':result} #Response model response means we have to return a dictionary


""" 
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 
"""