
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag.chatbot import get_response  
from backend.vapi_integerate import vapi_service  # <-- import your VapiService


app = FastAPI()

# Allow CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str

@app.get("/")
async def root():
    return {"message": "Welcome to AvenBot API. Use the /chat endpoint to interact with the bot."}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    reply = get_response(request.query)
    print(f"Response: {reply['response']}")
    return {"response": reply["response"]}

@app.post("/vapi-chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("query", "")

    # Generate response using your own logic
    response = get_response(user_input)

    return {"response": response}

@app.get("/vapi/assistant-id")
async def get_vapi_assistant_id():
    assistant_id = await vapi_service.get_or_create_assistant()
    return {"assistant_id": assistant_id}
