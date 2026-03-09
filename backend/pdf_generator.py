from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
import io

def generate_pdf(results):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph(f"Interview Analysis Report", styles['Title']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"Overall Performance: {results['overall_score']}/10", styles['Heading2']))
    
    story.append(Paragraph("Key Strengths:", styles['Heading3']))
    for s in results['key_strengths']:
        story.append(Paragraph(f"• {s}", styles['Normal']))

    story.append(Spacer(1, 12))
    story.append(Paragraph("AI Coaching Insights:", styles['Heading3']))
    for tip in results['coaching_tips']:
        story.append(Paragraph(f"• {tip}", styles['Normal']))

    doc.build(story)
    buffer.seek(0)
    return buffer