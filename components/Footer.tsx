import React from 'react';

interface FooterProps {
  onResetKey: () => void;
  isKeySet: boolean;
}

const Footer: React.FC<FooterProps> = ({ onResetKey, isKeySet }) => {
  return (
    <footer className="w-full bg-slate-900/80 mt-12">
      <div className="container mx-auto px-4 py-4 text-center text-slate-500 text-sm border-t border-slate-700">
        <p>Powered by Gemini API. Created for demonstration purposes.</p>
        <p>LibroLens &copy; {new Date().getFullYear()}</p>
        {isKeySet && (
          <button 
            onClick={onResetKey}
            className="mt-4 text-xs text-slate-400 hover:text-red-400 underline transition-colors"
            aria-label="API kulcs törlése"
          >
            API Kulcs Törlése
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;