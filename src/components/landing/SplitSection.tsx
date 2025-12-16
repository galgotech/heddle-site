import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '../CodeBlock';

interface SplitSectionProps {
    title: string;
    description: string | React.ReactNode;
    codeSnippet: string;
    language: string;
    reverse?: boolean;
    children?: React.ReactNode;
    titleClassName?: string;
    headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const SplitSection: React.FC<SplitSectionProps> = ({
    title,
    description,
    codeSnippet,
    language,
    reverse = false,
    children,
    titleClassName,
    headingLevel = 'h2'
}) => {
    // Default title class if not provided
    const defaultTitleClass = "text-3xl md:text-4xl font-bold text-slate-900";
    const finalTitleClass = titleClassName || defaultTitleClass;

    const Heading = headingLevel;

    return (
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className={reverse ? "order-1 lg:order-2" : "text-center lg:text-left"}>
                <div className={reverse ? "" : (titleClassName ? "text-center lg:text-left" : "")}>
                    <Heading className={finalTitleClass}>
                        {typeof title === 'string' ? title.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                {i < title.split('\n').length - 1 && <br />}
                            </React.Fragment>
                        )) : title}
                    </Heading>

                    <div className="mt-4 text-lg text-slate-600">
                        {typeof description === 'string' ? (
                            <Markdown remarkPlugins={[remarkGfm]}>
                                {description}
                            </Markdown>
                        ) : (
                            description
                        )}
                    </div>

                    {children && (
                        <div className="mt-8">
                            {children}
                        </div>
                    )}
                </div>
            </div>
            <div className={reverse ? "order-2 lg:order-1" : ""}>
                <CodeBlock code={codeSnippet} language={language} />
            </div>
        </div>
    );
};
