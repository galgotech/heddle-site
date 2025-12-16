import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '../CodeBlock';
import Mermaid from '../Mermaid';

interface MarkdownViewerProps {
    content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (match && match[1] === 'mermaid') {
                        return <Mermaid chart={String(children)} />;
                    }
                    if (match) {
                        return <CodeBlock code={String(children).trim()} language={match[1]} />
                    }
                    return (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
            }}
        >
            {content}
        </Markdown>
    );
};
