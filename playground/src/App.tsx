import React from 'react';
import Playground from './components/Playground';

const App = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header similar to main app or simplified */}
            <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/logo_small.png" alt="Heddle Logo" className="h-8 w-8" />
                    <span className="text-xl font-black text-slate-900">heddle playground</span>
                </div>
                <a href="/" className="text-sm font-medium text-slate-600 hover:text-teal-600">Back to Home</a>
            </header>
            <main>
                <Playground />
            </main>
        </div>
    );
};

export default App;
