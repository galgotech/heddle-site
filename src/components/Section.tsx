import React from 'react';

const Section: React.FC<{className?: string, children: React.ReactNode}> = ({ className = '', children }) => (
    <section className={`py-16 md:py-24 ${className}`}>
        <div className="container mx-auto px-6 md:px-8">
            {children}
        </div>
    </section>
);
export default Section;
