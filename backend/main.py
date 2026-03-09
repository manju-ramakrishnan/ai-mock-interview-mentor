from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import analyze_interview_local
from llm_analyzer import analyze_with_llm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class InterviewRequest(BaseModel):
    transcript: str
    interview_type: str = "Technical"


@app.post("/api/analyze")
async def analyze_text(request: InterviewRequest):
    try:
        if not request.transcript.strip():
            raise HTTPException(status_code=400, detail="Transcript cannot be empty")

        # Rule-based analysis
        analysis = analyze_interview_local(request.transcript, request.interview_type)

        # LLM analysis
        try:
            llm_feedback = analyze_with_llm(request.transcript)
        except Exception as e:
            print("LLM ERROR:", e)
            llm_feedback = "AI feedback temporarily unavailable."

        # attach LLM feedback
        analysis["llm_feedback"] = llm_feedback
        analysis["transcript"] = request.transcript

        return analysis

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)