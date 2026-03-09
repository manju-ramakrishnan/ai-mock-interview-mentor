from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_with_llm(transcript):

    prompt = f"""
You are an AI interview mentor.

Evaluate the following interview answer.

Give:
1. STAR method evaluation
2. Communication clarity
3. Confidence level
4. Suggestions for improvement

Answer:
{transcript}

Respond in bullet points.
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",

        messages=[
            {"role": "system", "content": "You are a professional interview coach."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    return completion.choices[0].message.content