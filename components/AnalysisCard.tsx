import React from 'react';
import type { BookAnalysis } from '../types';

interface AnalysisCardProps {
  analysis: BookAnalysis;
}

const ScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const percentage = (score / 50) * 100;
  let bgColor = 'bg-green-500';
  if (percentage < 75) bgColor = 'bg-yellow-500';
  if (percentage < 40) bgColor = 'bg-red-500';

  return (
    <div className="w-full bg-slate-700 rounded-full h-4 my-2">
      <div
        className={`${bgColor} h-4 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const VerdictBadge: React.FC<{ verdict: string }> = ({ verdict }) => {
    let colorClasses = 'bg-green-800/80 text-green-300 border-green-600/50';
    if (verdict.toLowerCase().includes('nem') || verdict.toLowerCase().includes('inkább')) {
        colorClasses = 'bg-red-800/80 text-red-300 border-red-600/50';
    } else if (verdict.toLowerCase().includes('fontolandó')) {
         colorClasses = 'bg-yellow-800/80 text-yellow-300 border-yellow-600/50';
    }

    return (
        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${colorClasses}`}>
            {verdict}
        </span>
    );
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const { 
    title, 
    author, 
    recommendationScore,
    overallVerdict,
    analysisText,
    positivePoints,
    negativePoints,
    closingQuote 
  } = analysis;

  return (
    <div className="bg-slate-800 rounded-lg p-6 sm:p-8 border border-slate-700 w-full text-left shadow-2xl animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-slate-100">
          {title} <span className="text-lg font-normal text-slate-400">({author})</span>
        </h2>
        <VerdictBadge verdict={overallVerdict} />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-baseline text-sm font-medium text-slate-300">
            <span>Illeszkedési pontszám:</span>
            <span className="font-bold text-lg text-white">{recommendationScore} / 50</span>
        </div>
        <ScoreBar score={recommendationScore} />
      </div>

      <p className="text-slate-300 mb-6">{analysisText}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/30">
          <h4 className="font-semibold text-green-400 mb-3">Mellette szól:</h4>
          <ul className="space-y-2">
            {positivePoints.map((point, i) => (
              <li key={i} className="flex items-start">
                <span className="text-green-400 mr-2 mt-1">✓</span>
                <span className="text-slate-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/30">
          <h4 className="font-semibold text-red-400 mb-3">Ellene szólhat:</h4>
           <ul className="space-y-2">
            {negativePoints.map((point, i) => (
              <li key={i} className="flex items-start">
                <span className="text-red-400 mr-2 mt-1">✗</span>
                <span className="text-slate-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-700 text-right">
        <blockquote className="text-slate-400 italic">
          <p>„{closingQuote.text}”</p>
          <footer className="mt-1 text-sm not-italic text-slate-500 font-semibold">— {closingQuote.author}</footer>
        </blockquote>
      </div>
    </div>
  );
};

export default AnalysisCard;
