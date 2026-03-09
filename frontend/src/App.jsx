import React, { useState } from 'react';
import TranscriptInput from './components/TranscriptInput';
import ResultDashboard from './components/ResultDashboard';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 px-6 py-10">
      <div className="mt-6">
        {!analysisResult ? (
          <TranscriptInput onAnalysisComplete={setAnalysisResult} />
        ) : (
          <ResultDashboard result={analysisResult} setResult={setAnalysisResult} />
        )}
      </div>

    </main>
  );
}

export default App;