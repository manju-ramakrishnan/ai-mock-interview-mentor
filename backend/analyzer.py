import re

def analyze_star_logic(transcript):
    text = transcript.lower()
    # Using Regex clusters to catch "Intent" rather than just single words
    checkpoints = {
        'Situation': [r"project", r"working on", r"background", r"context"],
        'Task': [r"main idea", r"goal", r"needed to", r"objective", r"challenge", r"to help"],
        'Action': [r"i built", r"i created", r"i used", r"i designed", r"implemented", r"developed"],
        'Result': [r"can create", r"resulted in", r"outcome", r"achieved", r"impact", r"launched"]
    }
    
    results = {key: any(re.search(p, text) for p in patterns) 
               for key, patterns in checkpoints.items()}
    return results

def analyze_interview_local(transcript, interview_type="General"):
    star_results = analyze_star_logic(transcript)
    
    # Calculation Logic
    words = transcript.split()
    word_count = len(words)
    
    # Base scores
    structure_score = (sum(star_results.values()) / 4) * 10
    clarity = 8.8 if word_count > 40 else 5.0
    confidence = 7.5 if "i " in transcript.lower() else 4.0
    
    overall_score = round((structure_score * 0.5) + (clarity * 0.25) + (confidence * 0.25), 1)

    # Generate Detailed Mentor Feedback
    feedback = []
    if not star_results['Result']:
        feedback.append(" Impact Gap : You described the work but missed the outcome. Always end with the 'Result'.")
    if word_count < 50:
        feedback.append("Add Detail : Your answer is a bit short. Try to expand on the 'Action' steps you took.")
    if "basically" in transcript.lower():
        feedback.append("Filler Alert : ry to reduce the use of 'basically' to sound more authoritative.")

    return {
        "overall_score": overall_score,
        "dimensions": {
            "clarity": clarity,
            "confidence": confidence,
            "enthusiasm": 7.0,
            "structure": structure_score,
            "empathy": 6.0
        },
        "star_analysis": star_results,
        "detailed_feedback": feedback if feedback else ["• Excellent balance of technical detail and structure."],
        "communication": {
            "filler_count": transcript.lower().count(" um ") + transcript.lower().count(" like "),
            "pace": "Ideal" if 60 < word_count < 200 else "Adjust Pace",
            "clarity_rating": f"{clarity}/10"
        },
        "action_plan": [
            {"step": "1", "title": "Quantify Impact", "desc": "Add a number or metric to your 'Result' section."},
            {"step": "2", "title": "Strong Verbs", "desc": "Use 'Architected' or 'Executed' instead of 'Did'."},
            {"step": "3", "title": "STAR Drills", "desc": "Practice this story again focusing on the 'Task' section."}
        ],
        "coaching_tips": [
            {"title": "The 2-Minute Rule", "text": "Keep answers under 120 seconds.", "color": "#6366f1"},
            {"title": "Ownership", "text": "Use 'I' instead of 'We' to show your personal contribution.", "color": "#ec4899"},
            {"title": "Tone", "text": "Vary your pitch to show enthusiasm for the project.", "color": "#06b6d4"}
        ]
    }