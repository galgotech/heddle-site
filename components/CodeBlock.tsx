
import React from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <div className="bg-slate-900 rounded-lg shadow-lg overflow-hidden text-sm border-2 border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-slate-400">
        <span className="text-xs font-mono uppercase">Heddle Example</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <pre className="!bg-slate-900 !m-0 !p-0 !rounded-none">
        <code className={`language-${language} block p-6 overflow-x-auto`}>
          {code.trim()}
        </code>
      </pre>
    </div>
  );
};
