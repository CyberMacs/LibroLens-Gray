import React, { useState } from 'react';

interface ApiKeySetupProps {
  onKeySaved: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('A megadott API kulcs érvénytelen.');
      return;
    }
    localStorage.setItem('gemini_api_key', apiKey.trim());
    onKeySaved();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-200 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
          LibroLens
        </h1>
        <p className="text-slate-400 mb-8">Az Ön személyes könyv-sommelierje</p>

        <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">API Kulcs Beállítása</h2>
          <p className="text-slate-400 mb-6">
            Az alkalmazás használatához kérlek, add meg a Google AI Studio-ból származó Gemini API kulcsodat.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="api-key" className="sr-only">Gemini API Kulcs</label>
              <input
                type="password"
                id="api-key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
                placeholder="Írd be az API kulcsod..."
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                aria-label="Gemini API Kulcs"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              Kulcs Mentése és Folytatás
            </button>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <div className="mt-8 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg text-left">
            <h4 className="font-semibold text-yellow-300">Figyelem!</h4>
            <p className="text-xs text-yellow-400 mt-1">
              Az API kulcsodat a böngésződ helyi tárolójában mentjük el. Ez kényelmes, de kevésbé biztonságos, mint a szerveroldali tárolás. Ne oszd meg ezt az alkalmazást másokkal, ha a saját kulcsodat használod.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;
