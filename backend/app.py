from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def Login():
  return jsonify('login successful')

def Connection():
  return

if __name__ == "__main__":
  app.run()