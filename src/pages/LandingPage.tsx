import React from 'react';
import Section from '../components/Section';

import {
    heroCode,
    imperativeCode,
    prqlCode,
    errorHandlingCode,
    landingContent
} from '../data/landingContent';

import { FeatureCard } from '../components/landing/FeatureCard';
import { SplitSection } from '../components/landing/SplitSection';
import { MarkdownViewer } from '../components/landing/MarkdownViewer';

import readme from '../README.md?raw';

const LandingPage = () => {
    return <>
        {/* Hero Section */}
        <Section className="pt-24 md:pt-32">
            <SplitSection
                title={landingContent.hero.title}
                description={landingContent.hero.description}
                codeSnippet={heroCode}
                language="heddle"
                titleClassName="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight"
                headingLevel="h1"
            >
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a href={landingContent.hero.cta.playground ? "/playground" : "#"} target="_blank" className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-teal-700 transition-colors text-lg">
                        {landingContent.hero.cta.playground}
                    </a>
                    <a href={landingContent.hero.cta.specs ? "#readme" : "#"} className="bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-md hover:bg-slate-300 transition-colors text-lg">
                        {landingContent.hero.cta.specs}
                    </a>
                </div>
            </SplitSection>
        </Section>

        {/* Philosophy Section */}
        <Section className="bg-slate-50">
            <SplitSection
                title={landingContent.philosophy.title}
                description={landingContent.philosophy.description}
                codeSnippet={imperativeCode}
                language="heddle"
            />
        </Section>

        {/* PRQL Section */}
        <Section>
            <SplitSection
                title={landingContent.prql.title}
                description={landingContent.prql.description}
                codeSnippet={prqlCode}
                language="heddle"
                reverse={true}
            />
        </Section>

        {/* Error Handler Section */}
        <Section className="bg-slate-50">
            <SplitSection
                title={landingContent.errorHandling.title}
                description={landingContent.errorHandling.description}
                codeSnippet={errorHandlingCode}
                language="heddle"
            />
        </Section>

        {/* Key Features: Engineering */}
        <Section className="bg-slate-50">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{landingContent.engineering.title}</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">{landingContent.engineering.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {landingContent.engineering.features.map((feature, index) => (
                    <FeatureCard key={index} title={feature.title}>
                        {feature.description}
                    </FeatureCard>
                ))}
            </div>
        </Section>

        {/* Integration Section */}
        <Section>
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{landingContent.integration.title}</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
                    {landingContent.integration.description}
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                {landingContent.integration.features.map((feature, index) => (
                    <FeatureCard key={index} title={feature.title}>
                        {feature.description}
                    </FeatureCard>
                ))}
            </div>
        </Section>

        {/* Readme Section */}
        <Section className="bg-slate-100">
            <div id="readme" className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{landingContent.readme.title}</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">{landingContent.readme.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1">
                <div className="markdown-body bg-white p-6 md:p-10 rounded-lg border">
                    <MarkdownViewer content={readme} />
                </div>
            </div>
        </Section>
    </>;
};

export default LandingPage;
