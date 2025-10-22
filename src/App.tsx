
import React, { useState, useEffect } from 'react';
import { CodeBlock } from './components/CodeBlock';
import { GitHubIcon } from './components/Icons';
import logo from './logo_small.png';

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

// --- Type Declarations ---
declare global {
    interface Window {
        Prism: any;
    }
}

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

const Section: React.FC<{className?: string, children: React.ReactNode}> = ({ className = '', children }) => (
    <section className={`py-16 md:py-24 ${className}`}>
        <div className="container mx-auto px-6 md:px-8">
            {children}
        </div>
    </section>
);


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
            <a href="#" className="hover:text-teal-600 transition-colors">Ecosystem</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Community</a>
            <a href="#" className="flex items-center gap-1 hover:text-teal-600 transition-colors">
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
                        <a href="#" className="flex items-center gap-2 text-2xl font-black text-slate-900">
                            <img src={logo} alt="Heddle Logo" className="h-8 w-8" />
                            Heddle
                        </a>
                        
                        <nav className="hidden md:flex items-center gap-6 font-medium text-slate-700">
                           {navLinks}
                        </nav>
                        <div className="hidden md:block">
                            <a href="#" className="bg-teal-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">
                                Get Started
                            </a>
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
                 {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-200">
                        <nav className="flex flex-col items-center gap-4 p-4 font-medium text-slate-700">
                           {navLinks}
                           <a href="#" className="bg-teal-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-700 transition-colors w-full text-center">
                                Get Started
                            </a>
                        </nav>
                    </div>
                )}
            </header>

            <main className="flex-grow">
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
                                    Get Started
                                </a>
                                <a href="#" className="bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-md hover:bg-slate-300 transition-colors text-lg">
                                    Read the Docs
                                </a>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        <FeatureCard title="Declarative Orchestration">
                            Heddle emphasizes defining data dependencies (the "what") over imperative control flow (the "how"). Workflows are compiled into optimized Directed Acyclic Graphs (DAGs).
                        </FeatureCard>
                        <FeatureCard title="Embedded Core Architecture">
                            Designed as an embeddable execution engine, not a monolithic runtime. Integrates seamlessly with (Python, Go, Rust, NodeJS).
                        </FeatureCard>
                        <FeatureCard title="Leverage Imperative Control">
                            Declarative pipelines can call functions in your host language (Python, Go, etc.), giving you full access to imperative control flow like if/else, and loops, for complex logic.
                        </FeatureCard>
                        <FeatureCard title="Integrated with (PRQL)">
                            Natively incorporates PRQL (Pipelined Relational Query Language) for complex data shaping (joins, aggregations) directly within the orchestration flow.
                        </FeatureCard>
                        <FeatureCard title="Columnar-Native Execution">
                            The type system and runtime are optimized for columnar data, facilitating vectorized execution (SIMD optimization) and high efficiency.
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
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Host Languages (SDKs)</h3>
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
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400">
                <div className="container mx-auto px-6 md:px-8 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p>&copy; 2025 Heddle Project Contributors</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Documentation</a>
                            <a href="#" className="hover:text-white transition-colors">GitHub</a>
                            <a href="#" className="hover:text-white transition-colors">Community</a>
                            <a href="#" className="hover:text-white transition-colors">Blog</a>
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
