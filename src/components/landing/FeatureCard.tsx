import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface FeatureCardProps {
    title: string;
    children: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, children }) => {
    const content = typeof children === 'string' ? (
        <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
    ) : (
        children
    );

    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <div className="text-slate-600 leading-relaxed feature-card-content">
                {content}
            </div>
        </div>
    );
};
