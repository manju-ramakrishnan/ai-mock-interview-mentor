import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RechartRadar } from 'recharts';
import { Download, RefreshCw } from "lucide-react";

const ResultDashboard = ({ result, setResult }) => {
  const radarData = Object.keys(result.dimensions).map(key => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    A: result.dimensions[key],
    fullMark: 10
  }));

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // --- MAIN HEADING (BOLD) ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("AI Interview Analysis Report", 20, yPos);
    yPos += 15;

    // --- OVERALL SCORE ---
    doc.setFontSize(14);
    doc.text(`Overall Score: ${result.overall_score}/10`, 20, yPos);
    yPos += 15;

    // --- STAR CHECKLIST (TABLE) ---
    autoTable(doc, {
      startY: yPos,
      head: [['STAR Component', 'Status']],
      body: Object.entries(result.star_analysis).map(([key, val]) => [
        key, 
        val ? "✓ Detected" : "✗ Missing"
      ]),
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], fontStyle: 'bold' },
      styles: { font: "helvetica", fontSize: 10 }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // --- DETAILED FEEDBACK (BOLD HEADING) ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Detailed Feedback:", 20, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    result.detailed_feedback.forEach((feedback) => {
      const splitText = doc.splitTextToSize(`- ${feedback}`, pageWidth - 40);
      doc.text(splitText, 25, yPos);
      yPos += (splitText.length * 5) + 2;
    });

    // --- FULL TRANSCRIPT (BOLD HEADING) ---
    yPos += 10;
    if (yPos > 230) { doc.addPage(); yPos = 20; }
    
    doc.setFont("helvetica", "bold");
    doc.text("Your Interview Transcript:", 20, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const transcriptText = result.transcript || "Transcript generated successfully.";
    const splitTranscript = doc.splitTextToSize(transcriptText, pageWidth - 40);
    doc.text(splitTranscript, 25, yPos);

    doc.save('Interview_Analysis_Report.pdf');
  };

  return (
  <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800">

    {/* Header */}
    <header className="flex flex-wrap justify-between items-center gap-4 mb-8">

      <h1 className="text-4xl font-bold text-blue-600">
        Performance Report
      </h1>

       <div className="flex gap-3">

  {/* PDF Button */}
  <button
    onClick={downloadPDF}
    className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold
    transition-all duration-300 hover:bg-emerald-600 hover:scale-105 shadow-sm hover:shadow-md"
  >
    <Download size={20} />
    <span className="hidden sm:inline">PDF</span>
  </button>


  {/* New Analysis Button */}
  <button
    onClick={() => setResult(null)}
    className="group flex items-center justify-center gap-2 bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold
    transition-all duration-300 hover:bg-blue-600 hover:scale-105 shadow-sm hover:shadow-md"
  >
    <RefreshCw size={20} className="transition-transform duration-300 group-hover:rotate-180" />
    <span className="hidden sm:inline">New Analysis</span>
  </button>

</div>

    </header>


    {/* Score */}
    <div className="bg-white border border-blue-100 shadow-md rounded-xl p-6 mb-6">
      <p className="text-gray-500 text-sm">OVERALL SCORE</p>
      <h2 className="text-5xl font-extrabold text-blue-500">
        {result.overall_score}/10
      </h2>
    </div>


    {/* Radar + STAR Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Radar */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Performance Radar
        </h3>

        <div className="w-full h-[300px]">
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
              <RechartRadar
                name="Score"
                dataKey="A"
                stroke="#38bdf8"
                fill="#38bdf8"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>


      {/* STAR */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl">

        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          STAR Method Check
        </h3>

        {Object.entries(result.star_analysis).map(([key, val]) => (
          <div key={key} className="flex justify-between py-3 border-b border-gray-200">

            <span className="font-medium">{key}</span>

            <span className={`font-bold ${val ? "text-green-500" : "text-red-500"}`}>
              {val ? "✓" : "✗"}
            </span>

          </div>
        ))}

      </div>

    </div>


    {/* Mentor Feedback */}
    
    <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-xl p-6 mt-6">

      <h3 className="text-lg font-semibold mb-4">
        Personal Mentor Feedback
      </h3>

      <div className="flex flex-col gap-3">
        {result.detailed_feedback.map((tip, i) => (
          <p key={i} className="text-gray-600 leading-relaxed">
            {tip}
          </p>
        ))}
      </div>

    </div>

    {/* AI Mentor Insights (LLM) */}
{result.llm_feedback && (
  <div className="mt-6">

    <h3 className="text-lg font-semibold mb-4 text-purple-600 flex items-center gap-2">
      🤖 AI Mentor Insights
    </h3>

    <p className="text-sm text-gray-500 mb-6">
      AI-generated analysis based on your interview response.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {result.llm_feedback
        .split(/\*\*(.*?)\:\*\*/g)
        .filter(section => section.trim() !== "")
        .reduce((acc, curr, i, arr) => {
          if (i % 2 === 0) {
            acc.push({
              title: arr[i],
              content: arr[i + 1]
            });
          }
          return acc;
        }, [])

        // 🔴 REMOVE THIS CARD
        .filter(item => item.title.trim() !== "Evaluation of the Interview Answer")

        .map((item, index) => (

          <div
            key={index}
            className="bg-white border-l-4 border-purple-500 shadow-md rounded-xl p-6
            transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >

            <h4 className="text-md font-semibold text-purple-600 mb-3">
              {item.title}
            </h4>

            <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
              {item.content
                .replace(/\*/g, "")
                .split("\n")
                .filter(line => line.trim() !== "")
                .map((line, i) => {

                  const cleaned = line.replace("+", "").trim()

                  const labels = ["Situation", "Task", "Action", "Result", "Score"]

                  const isLabel = labels.some(label => cleaned.startsWith(label))

                  if (isLabel) {
                    const parts = cleaned.split(":")
                    const label = parts[0]
                    const text = parts.slice(1).join(":")

                    return (
                      <li key={i}>
                        <span className="font-semibold text-gray-800">
                          {label}:
                        </span>{" "}
                        {text}
                      </li>
                    )
                  }

                  return (
                    <li key={i}>
                      {cleaned}
                    </li>
                  )
                })}
            </ul>

          </div>

        ))}

    </div>

  </div>
)}

    {/* Action Plan */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

      {result.action_plan.map((item, i) => (

        <div
          key={i}
          className="bg-white border border-gray-200 rounded-xl shadow-md p-6 text-center
          transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          style={{ borderTop: `4px solid ${['#fbbf24','#38bdf8','#34d399'][i]}` }}
        >

          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center
          text-sm font-bold mx-auto mb-3">
            {item.step || (i + 1)}
          </div>

          <h4 className="font-semibold mb-2">
            {item.title}
          </h4>

          <p className="text-sm text-gray-500">
            {item.desc}
          </p>

        </div>

      ))}

    </div>

  </div>
);
};


export default ResultDashboard;