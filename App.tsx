import React, { useState, useCallback, useEffect } from 'react';
import { analyzeBook } from './services/geminiService';
import type { BookAnalysis } from './types';
import Header from './components/Header';
import AnalysisCard from './components/AnalysisCard';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import ApiKeySetup from './components/ApiKeySetup';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<BookAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleAnalyzeBook = useCallback(async () => {
    if (!apiKey) {
      setError("Az API kulcs nincs beállítva. Kérlek, add meg a kulcsot.");
      return;
    }
    if (!title.trim()) {
      setError("Kérlek, adj meg egy könyv címet az elemzéshez.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeBook(title, author, apiKey);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Sajnálom, hiba történt az elemzés során. Ellenőrizd az API kulcsot és próbáld újra később.');
    } finally {
      setIsLoading(false);
    }
  }, [title, author, apiKey]);

  const handleNewSearch = () => {
    setAnalysisResult(null);
    setError(null);
    setTitle('');
    setAuthor('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyzeBook();
  };

  const handleKeySaved = () => {
    const storedKey = localStorage.getItem('gemini_api_key');
    setApiKey(storedKey);
  };
  
  const handleResetKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey(null);
  };

  if (!apiKey) {
    return <ApiKeySetup onKeySaved={handleKeySaved} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl text-center">
          {!analysisResult && !isLoading && (
            <div className="w-full max-w-2xl text-center">
                <div className="bg-slate-800/50 rounded-lg p-8 sm:p-12 border border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Melyik könyvet elemezzük?</h2>
                    <p className="text-slate-400 mb-8">
                        Add meg egy könyv címét (és szerzőjét), és kielemezzük, mennyire illik "Pi" ízléséhez.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-300 text-left mb-2">Könyv címe (kötelező)</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="pl. A Hatalom Gyűrűi"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                aria-label="Könyv címe"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-slate-300 text-left mb-2">Szerző (ajánlott)</label>
                            <input
                                type="text"
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="pl. J.R.R. Tolkien"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                aria-label="Szerző"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !title.trim()}
                            className="w-full bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-500 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Elemzés...' : 'Könyv Elemzése'}
                        </button>
                    </form>
                </div>
                 {error && <p className="mt-4 text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>}
            </div>
          )}

          {isLoading && <LoadingSpinner />}
          
          {!isLoading && analysisResult && (
            <>
              <AnalysisCard analysis={analysisResult} />
               <button
                onClick={handleNewSearch}
                className="mt-12 bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Új Elemzés
              </button>
            </>
          )}
        </div>
      </main>
      <Footer onResetKey={handleResetKey} isKeySet={!!apiKey} />
    </div>
  );
};

export default App;