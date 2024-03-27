import os
import textwrap
import google.generativeai as genai
from IPython.display import Markdown
from dotenv import load_dotenv
load_dotenv()

def to_markdown_string(text):
    text = text.replace('•', '  *')
    return textwrap.indent(text, '> ', predicate=lambda _: True)
    return #Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

def predict(input)->str:
    BARD_API_KEY = os.getenv('BARD_API_KEY')
    print(f'bard api key in bard_preditor{BARD_API_KEY}')
    genai.configure(api_key=BARD_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(input)
    return to_markdown_string(response.text)
    #return ''