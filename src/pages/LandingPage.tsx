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
import "std/log" as log

// 1. Define the shape of your data
schema User = {
    id: int,
    name: string,
    email: string,
    active: bool
}

// 2. Define an atomic step
step fetch_users -> User = http.get {
    url: "https://api.example.com/users"
}

// 3. Define the main workflow
workflow process_active_users {
    fetch_users
        | transform.filter { condition: "active == true" }
        | ( // 4. Use first-class PRQL for transformation
            from input
            select id, name, email
          )
        | log.info { message: "Processed active users" }
}`;

const imperativeCode = `// 1. Import imperative logic from your host (e.g., Python, Go)
import "python/models" as ml
import "std/database" as db

// 2. Define steps that wrap this logic
step load_model = ml.load_fraud_model {
    model_path: "/models/v1/fraud.bin"
}

step run_prediction = ml.predict_fraud {
    // 'load_model' is automatically injected as a dependency
    model: load_model
}

// 3. Compose them in a clean, functional pipeline
workflow process_payment {
    // The data source (e.g., http.post) is piped in
    input_payment
        | run_prediction ? handle_model_failure
        | db.write_results
}`;


const prqlCode = `import "stream/db" as db
import "stream/kafka" as kafka
import "std/dashboard" as dash

step users_read = db.query { sql: "SELECT * FROM users" }
step events_read = kafka.read { topic: "user_events" }

workflow user_analytics {
    // 'events_read' output is piped into the PRQL block
    let users_table = users_read

    events_read
        | ( // Join stream against the database table
            from input
            join users_table (user_id == id)
            group {users_table.country} (
                aggregate { event_count = count }
            )
          )
        | dash.update_analytics
}`;

const errorHandlingCode = `import "std/error" as error
import "std/log" as log

step process_data = external.api_call { ... }

// Define a handler: a dedicated pipeline for errors
handler log_and_swallow = error.handler {
    log.error { message: "API call failed, continuing." }
    
    // Returns an empty dataframe to continue the flow
    return []
}

workflow main_pipeline {
    // If process_data fails, Heddle executes the
    // 'log_and_swallow' handler and pipes its
    // output to 'finalize'.
    process_data ? log_and_swallow | finalize
}`;


const LandingPage = () => {
  return <>
        {/* Hero Section */}
        <Section className="pt-24 md:pt-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                        Orchestrate Logic.
                        <br />
                        With a Functional Flow.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
                        Heddle is a declarative language that separates <strong>what</strong> you do (imperative logic) from <strong>how</strong> you do it (functional pipelines).
                        Stop fighting with glue scripts and start engineering resilient, high-performance workflows.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a href="#" className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-teal-700 transition-colors text-lg">
                            Play Ground
                        </a>
                        <a href="#readme" className="bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-md hover:bg-slate-300 transition-colors text-lg">
                            Read the Specs
                        </a>
                    </div>
                </div>
                <div>
                    <CodeBlock code={heroCode} language="heddle" />
                </div>
            </div>
        </Section>

        {/* Philosophy Section */}
        <Section className="bg-slate-50">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Functional Flow, Imperative Steps</h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Your business logic is imperative: call an API, run a Python model, query a database. Your data flow is functional: filter, transform, join, and aggregate.
                    </p>
                    <p className="mt-4 text-lg text-slate-600">
                        Heddle gives you the best of both worlds. You write simple, composable `steps` that wrap your imperative host-language logic. Then, you arrange those steps into clean, declarative `workflow` pipelines that are type-safe, testable, and easy to reason about.
                    </p>
                </div>
                <div>
                    <CodeBlock code={imperativeCode} language="heddle" />
                </div>
            </div>
        </Section>

        {/* PRQL Section */}
        <Section>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="order-2 lg:order-1">
                        <CodeBlock code={prqlCode} language="heddle" />
                </div>
                <div className="order-1 lg:order-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">First-Class Data Transformation</h2>
                        <p className="mt-4 text-lg text-slate-600">
                        Stop passing opaque SQL strings. Heddle integrates PRQL (Pipelined Relational Query Language) directly into the language, giving you compile-time safety and seamless data flow.
                        </p>
                        <p className="mt-4 text-lg text-slate-600">
                        Pipe data from any source—a Kafka stream, an HTTP request, or another step—directly into a PRQL block. Join, group, and aggregate data relationally, then pipe the results to the next step.
                        </p>
                </div>
            </div>
        </Section>

        {/* Error Handler Section */}
        <Section className="bg-slate-50">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Declarative Error Handling</h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Handle failures gracefully with the `?` operator. 
                    </p>
                    <p className="mt-4 text-lg text-slate-600">
                        Declaratively attach error-handling pipelines to any step, ensuring that your workflow can recover, retry, or fail gracefully without cluttering your business logic with `try/catch` blocks.
                    </p>
                </div>
                <div>
                    <CodeBlock code={errorHandlingCode} language="heddle" />
                </div>
            </div>
        </Section>

        {/* Key Features: Engineering */}
        <Section className="bg-slate-50">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Engineered for Resilience & Performance</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">Heddle is more than just syntax. It's a high-performance, columnar-native runtime built for robust, large-scale data processing.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <FeatureCard title="Optimized DAG Execution">
                    <p>
                    Heddle compiles your workflow into a Directed Acyclic Graph (DAG). Instead of writing imperative control flow, you define data dependencies. Heddle's runtime manages the execution plan, optimizes throughput, and runs independent tasks concurrently.
                    </p>
                </FeatureCard>

                <FeatureCard title="High-Performance Columnar Core">
                    <p>
                    Heddle's runtime is optimized for columnar data, enabling vectorized (SIMD) execution for extreme efficiency and high-speed processing on modern hardware.
                    </p>
                </FeatureCard>

                <FeatureCard title="Strong, Static Typing">
                    <p>
                    Define data contracts with `schema`. Heddle's compiler verifies data integrity at every step of your pipeline, eliminating entire classes of runtime errors before you ever deploy.
                    </p>
                </FeatureCard>

                <FeatureCard title="Easy sintaxy">
                    <p>
                    
                    </p>
                    {/* <CodeBlock code={errorHandlingCode} language="heddle" /> */}
                </FeatureCard>
            </div>
        </Section>

                
        {/* Integration Section */}
        <Section>
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Integrates With Your Stack</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">Heddle is a lightweight, embeddable engine, not a monolithic service. It's designed to connect the tools you already use.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <FeatureCard title="Embedded Core Architecture">
                    <p>
                    Heddle is a library, not a framework. Integrate it seamlessly with your existing applications in Python, Go, Rust, and Node.js. Call Heddle workflows as a function, or run the Heddle core as a standalone server.
                    </p>
                </FeatureCard>
                <FeatureCard title="Extensible Connectivity">
                    <p>
                    Connect to anything. An expanding standard library provides connectors for databases (PostgreSQL, ClickHouse), messaging (Kafka, NATS), and file formats (Parquet, Avro). The simple interface makes it easy to add your own.
                    </p>
                </FeatureCard>
            </div>
        </Section>

        {/* Readme Section */}
        <Section id="readme" className="bg-slate-100">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Heddle Language Specification</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">A brief overview of the core language constructs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1">
                <div className="markdown-body bg-white p-6 md:p-10 rounded-lg border">
                    <Markdown
                        remarkPlugins={[ remarkGfm ]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                if (match && match[1] === 'mermaid') {
                                    return <Mermaid chart={String(children)} />;
                                }
                                if (match && !inline) {
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
                        {readme}
                    </Markdown>
                </div>
            </div>
        </Section>
    </>;
};

export default LandingPage;
