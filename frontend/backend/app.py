from projects.intsys.frontend.backend.route import Server, GetUserCollection
from flask import Flask, jsonify, request
from datetime import datetime
from LLM_model import AIAnalyst, load_llm_config
from route import AskAI, RegisterUserAccount, GetUserAndLLMResponse

app = Flask(__name__)

if __name__ == "__main__":
  app.run()