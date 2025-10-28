
import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router"
import { GitHubIcon } from './components/Icons';

import logo from './logo_small.png';

// --- Page Components ---
import LandingPage from './pages/LandingPage';
import PlaygroundPage from './pages/PlaygroundPage';


// --- Type Declarations ---
declare global {
    interface Window {
        Prism: any;
    }
}



// --- Main Application Component ---

const App: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (window.Prism) {
            window.Prism.languages.heddle = {
                'comment': {
                    pattern: /(^|[^\\])#.*|\/\/.*/,
                    lookbehind: true,
                    greedy: true
                },
                'string': {
                    pattern: /"(?:\\.|[^"\\])*"/,
                    greedy: true
                },
                'keyword': /\b(?:workflow|step|schema|error|import|as|from|select|join|group|aggregate|filter|update_analytics_dashboard|log|finalize)\b/,
                'operator': /[|?=]/,
                'type': /\b(?:int|string|bool)\b/,
                'function': /\b[a-zA-Z_][\w.]*(?=\s*\{)/,
                'punctuation': /[{}[\]();,.:]/,
            };
            window.Prism.highlightAll();
        }
    }, []);

    const navLinks = (
        <>
            <a href="#" className="hover:text-teal-600 transition-colors">Docs</a>
            {/* <a href="#" className="hover:text-teal-600 transition-colors">Ecosystem</a> */}
            {/* <a href="#" className="hover:text-teal-600 transition-colors">Community</a> */}
            <a href="mailto:contact@fhub.dev" className="hover:text-teal-600 transition-colors">Contact</a>
            <a href="https://github.com/galgotech/heddle-lang" target="_blank" className="flex items-center gap-1 hover:text-teal-600 transition-colors">
                <GitHubIcon className="w-5 h-5" /> GitHub
            </a>
        </>
    );

    return (
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
                    <div className="container mx-auto px-6 md:px-8">
                        <div className="flex justify-between items-center h-16">
                            <a href="/" className="flex items-center text-2xl font-black text-slate-900">
                                <img src={logo} alt="Heddle Logo" className="h-8 w-8" />
                                eddle
                            </a>
                            
                            <nav className="hidden md:flex items-center gap-6 font-medium text-slate-700">
                            {navLinks}
                            </nav>
                            <div className="hidden md:block">
                                <a href="/playground" className="bg-teal-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">
                                    Play Ground
                                </a>
                            </div>
                            <div className="md:hidden">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-white border-t border-slate-200">
                            <nav className="flex flex-col items-center gap-4 p-4 font-medium text-slate-700">
                            {navLinks}
                            <a href="/playground" className="bg-teal-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-700 transition-colors w-full text-center">
                                    Play Ground
                                </a>
                            </nav>
                        </div>
                    )}
                </header>

                <main className="flex-grow">
                    {/* <LandingPage /> */}
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/playground" element={<PlaygroundPage />} />
                    </Routes>
                </main>


                {/* Footer */}
                <footer className="bg-slate-900 text-slate-400">
                    <div className="container mx-auto px-6 md:px-8 py-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <p>&copy; 2025 Heddle Project Contributors</p>
                            <div className="flex gap-6">
                                {/* <a href="#" className="hover:text-white transition-colors">Documentation</a>
                                <a href="#" className="hover:text-white transition-colors">GitHub</a>
                                <a href="#" className="hover:text-white transition-colors">Community</a>
                                <a href="#" className="hover:text-white transition-colors">Blog</a>
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a> */}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
    );
};

export default App;
