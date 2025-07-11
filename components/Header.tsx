
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          LibroLens
        </h1>
        <p className="text-slate-400 mt-1">Az Ön személyes könyv-sommelierje</p>
      </div>
    </header>
  );
};

export default Header;
