from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import google.generativeai as genai

app = Flask(__name__)

# Load ML model
model = pickle.load(open("heart_model.pkl", "rb"))

# Gemini API setup
genai.configure(api_key="AQ.Ab8RN6JnxgZJz0T_5dNUbRih8chRwQw8-UODgitt6osWNcnCwQ")  # 🔴 Put your API key
chat_model = genai.GenerativeModel("gemini-3.5-flash")

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        features = [
            float(data["age"]),
            float(data["sex"]),
            float(data["cp"]),
            float(data["trestbps"]),
            float(data["chol"]),
            float(data["fbs"]),
            float(data["restecg"]),
            float(data["thalach"]),
            float(data["exang"]),
            float(data["oldpeak"]),
            float(data["slope"]),
            float(data["ca"]),
            float(data["thal"])
        ]

        features = np.array([features])

        prediction = model.predict(features)[0]

        if prediction == 1:
         result = "Possibility chances of heart disease. Please evaluate with doctor."
        else:
         result = "Healthy Heart"

        # ✅ CLEAN PROMPT (NO MARKDOWN)
        prompt = f"""
You are a professional health assistant.

Patient Data:
Age: {data["age"]}
Blood Pressure: {data["trestbps"]}
Cholesterol: {data["chol"]}
Max Heart Rate: {data["thalach"]}

Prediction: {result}

Give response in this format ONLY:

Reason:
- point
- point

Risk Factors:
- point
- point

Advice:
- point
- point

Keep it simple. No symbols like ### or **.
"""

        response = chat_model.generate_content(prompt)
        ai_reply = response.text

        return jsonify({
            "result": result,
            "ai_response": ai_reply
        })

    except Exception as e:
        return jsonify({
            "result": "Error",
            "ai_response": str(e)
        })

if __name__ == "__main__":
    app.run(debug=True)