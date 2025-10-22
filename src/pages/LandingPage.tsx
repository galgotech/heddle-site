import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'github-markdown-css/github-markdown.css';
import { CodeBlock } from '../components/CodeBlock';
import Mermaid from '../components/Mermaid';
import Section from '../components/Section';

import readme from '../README.md?raw';

interface FeatureCardProps {
    title: string;
    children: React.ReactNode;
}

// --- Helper Components (Defined outside main App to prevent re-renders) ---

const FeatureCard: React.FC<FeatureCardProps> = ({ title, children }) => (
    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{children}</p>
    </div>
);


// --- Code Snippets ---
const heroCode = `import "io/http" as http
import "core/transform" as transform

// 1. Define the shape of our data
schema User = {
    id: int,
    name: string,
    active: bool
}

// 2. Define the steps
step fetch_users -> User = http.get {
    url: "https://api.example.com/users"
}

// 3. Define the main workflow
workflow process_users {
    fetch_users
        | transform.filter { condition: "active == true" }
        | ( // 4. Use PRQL for transformation
            from input
            select name, email
          )
        | log.info
}`;

const prqlCode = `import "stream/db" as db
import "stream/kafka" as kafka

step users_read = db.query { sql: "SELECT * FROM users" }
step events_read = kafka.read { topic: "user_events" }

workflow user_analytics {
    // 'events' output is piped into the PRQL block as 'input'
    let users = users_read
    events_read | (
        from events_read
        join users (user_id == id)
        group {users.country} (
            aggregate {
                event_count = count
            }
        )
    ) | update_analytics_dashboard
}`;

const errorHandlingCode = `import "std/error" as error

step process_data = external.api_call { ... }

// Define a step to handle the error
error log_and_swallow = error.log {
    message: "API call failed, continuing with empty data"
    output: [] // Returns an empty frame to continue
}

workflow process {
    // If process_data fails, log_and_swallow is executed instead.
    process_data ? log_and_swallow | finalize
}`;


const LandingPage = () => {
  return <>
        {/* Hero Section */}
        <Section className="pt-24 md:pt-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                        Simple<br /> High-Throughput<br />Resilient<br />Data Orchestration.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
                        Heddle is a statically-typed, declarative language engineered for constructing efficient data integration and processing pipelines, built on a high-performance, columnar-native execution engine.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a href="#" className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-teal-700 transition-colors text-lg">
                            Play Ground
                        </a>
                        {/* <a href="#" className="bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-md hover:bg-slate-300 transition-colors text-lg">
                            Read the Docs
                        </a> */}
                    </div>
                </div>
                <div>
                    <CodeBlock code={heroCode} language="heddle" />
                </div>
            </div>
        </Section>

        {/* Why Heddle? */}
        <Section className="bg-slate-50">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">The Heddle Design</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">Core principles that guide Heddle's architecture for performance and reliability.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard title="Simple Syntax, Rapid Prototyping">
                    The minimal, declarative syntax is easy to learn. Interactively build and
                    test your pipelines by inspecting the data state after any step.
                </FeatureCard>

                <FeatureCard title="Best of Both Worlds">
                    Use Heddle's declarative pipelines to orchestrate the "what" and your
                    host language (Python, Go, etc.) to control the "how." Get full access to
                    imperative logic like loops and conditionals right where you need them.
                </FeatureCard>

                <FeatureCard title="Native PRQL Integration">
                    Natively use the power of PRQL (Pipelined Relational Query Language)
                    for complex joins, aggregations, and data shaping directly within your
                    orchestration flow.
                </FeatureCard>

                <FeatureCard title="AI-Ready by Design">
                    The declarative, typed structure makes Heddle an ideal target for
                    generative AI, enabling LLM-powered code generation, optimization, and
                    automation.
                </FeatureCard>

                <FeatureCard title="Optimized DAG Execution">
                    Heddle compiles your dependencies into a Directed Acyclic Graph (DAG).
                    Instead of writing imperative control flow, you define data relationships,
                    allowing Heddle's runtime to manage the execution plan, optimize throughput,
                    and run independent tasks concurrently.
                </FeatureCard>

                <FeatureCard title="High-Performance Columnar Core">
                    Heddle's runtime is optimized for columnar data, enabling vectorized
                    (SIMD) execution for extreme efficiency and high-speed processing.
                </FeatureCard>

                <FeatureCard title="Embedded Core Architecture">
                    Heddle is a lightweight, embeddable engine, not a monolithic runtime.
                    Integrate it seamlessly with your existing applications in Python, Go, Rust,
                    and Node.js.
                </FeatureCard>

                <FeatureCard title="Extensible Connectivity">
                    Connect to anything. An expanding standard library provides connectors
                    for databases (PostgreSQL, ClickHouse), messaging (Kafka, NATS),
                    and file formats (Parquet, Avro).
                </FeatureCard>
            </div>
        </Section>

        {/* Deep Dive */}
        <Section>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="order-2 lg:order-1">
                        <CodeBlock code={prqlCode} language="heddle" />
                </div>
                <div className="order-1 lg:order-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Seamless Integration with PRQL</h2>
                        <p className="mt-4 text-lg text-slate-600">
                        Heddle delegates complex relational data shaping to embedded PRQL blocks. Data flows seamlessly between orchestration steps and transformation logic, allowing access to both pipelined input and the broader workflow context.
                        </p>
                </div>
            </div>
        </Section>

        {/* Key Features */}
            <Section className="bg-slate-50">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Key Features</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">Built for robustness, performance, and developer productivity.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    <FeatureCard title="Strong, Static Typing">
                        Compile-time verification of data contracts using defined <code>schemas</code> ensures data integrity throughout the pipeline.
                    </FeatureCard>
                    <FeatureCard title="Optimized Performance">
                        The Heddle Core Runtime (HCR) applies optimizations like Operator Fusion, Predicate Pushdown, and Automatic Parallelization.
                    </FeatureCard>
                    <FeatureCard title="Out-of-Core Execution">
                        Robust memory management and data spilling (to NVMe) to handle datasets that exceed available RAM.
                    </FeatureCard>
                </div>
                    <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Resilience and Error Handling</h3>
                    <p className="text-slate-600 mb-4">Granular mechanisms for handling exceptions using local (<code>?</code> operator) and global error handlers, ensuring pipelines can recover or fail gracefully.</p>
                    <CodeBlock code={errorHandlingCode} language="heddle" />
                    </div>
            </div>
        </Section>
        
        {/* Ecosystem */}
        <Section>
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Built to Integrate</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">Heddle is designed to fit seamlessly into the modern data stack.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Languages (SDKs)</h3>
                    <p className="text-slate-600">Tier 1 support (Zero-Copy) for Rust, C++, Go, and Python. Tier 2 (Wasm) for Node.js and JVM.</p>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Connectivity</h3>
                    <p className="text-slate-600">Expanding <code>stdlib</code> for databases (PostgreSQL, ClickHouse), messaging (Kafka, NATS), and formats (Parquet, Avro).</p>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">AI Tooling Ready</h3>
                    <p className="text-slate-600">The declarative nature makes Heddle an ideal Intermediate Representation (IR) for generative AI tooling and LLM-powered optimization.</p>
                </div>
            </div>
        </Section>

        <Section>
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Heddle Language</h2>
                {/* <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">Core principles that guide Heddle's architecture for performance and reliability.</p> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1">
                <div className="markdown-body">
                    <Markdown
                        remarkPlugins={[ remarkGfm ]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                if (match && match[1] === 'mermaid') {
                                    return <Mermaid chart={String(children)} />;
                                }
                                return (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {readme}
                    </Markdown>
                </div>
            </div>
        </Section>
    </>;
};

export default LandingPage;
