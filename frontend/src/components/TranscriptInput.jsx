import React, { useState, useEffect, useRef } from 'react';
import { analyzeTranscript } from '../api/api';
import { Mic, Square, Sparkles, ArrowDownCircle  } from "lucide-react";

const TranscriptInput = ({ onAnalysisComplete }) => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setText((prev) => (prev + " " + finalTranscript).trim());
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setText(""); 
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return alert("Please record or type something first.");
    setLoading(true);
    try {
      const res = await analyzeTranscript({ transcript: text });
      onAnalysisComplete({
  ...res.data,
  transcript: text
});
    } catch (err) {
      alert("Backend error. Check if main.py is running.");
    }
    setLoading(false);
  };

  return (
  <div className="min-h-[80vh] flex items-center justify-center px-4">

    <div className="glass-card w-full max-w-3xl text-center bg-white border border-blue-100 shadow-xl rounded-2xl p-8">

      <h2 className="text-3xl font-bold text-blue-600 mb-3">
        AI Mock Interview Mentor
      </h2>


      <p className="text-gray-500 text-sm mb-6">
        Click the button below and start explaining your project or answering the question.
      </p>

      <div className="my-6">
  <button
    onClick={toggleListening}
    className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg
    ${
      isListening
        ? "bg-red-500 hover:bg-red-600"
        : "bg-blue-500 hover:bg-blue-600"
    }`}
  >
    {isListening ? (
      <>
        <Square size={18} className="animate-pulse"/>
        <span className="hidden sm:inline">Stop Recording</span>
      </>
    ) : (
      <>
        <Mic size={18} />
        <span className="hidden sm:inline">Start Speaking</span>
      </>
    )}
  </button>
</div>

      <div className="relative w-full">
        <textarea
          className="w-full h-56 border border-blue-200 rounded-xl p-4 text-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your words will appear here as you speak..."
        />

        {isListening && (
          <div className="absolute bottom-3 right-3 text-sm text-red-500 font-semibold animate-pulse">
            Recording...
          </div>
        )}
      </div>

       <button
  onClick={handleAnalyze}
  disabled={loading || isListening}
  className="w-full mt-6 flex items-center justify-center gap-2
  bg-blue-500 hover:bg-blue-600 text-white font-semibold
  py-3 rounded-xl transition-all duration-300
  hover:scale-[1.02] hover:shadow-lg
  disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? (
    <>
      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
      Processing...
    </>
  ) : (
    <>
      <ArrowDownCircle size={18} />
      Analyze Transcript
    </>
  )}
</button>

    </div>

  </div>
);
};



export default TranscriptInput;