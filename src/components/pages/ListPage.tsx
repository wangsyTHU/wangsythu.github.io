 'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ListPageConfig } from '@/types/page';

interface ListPageProps {
    config: ListPageConfig;
    embedded?: boolean;
}

export default function ListPage({ config, embedded = false }: ListPageProps) {
    const items = Array.isArray(config.items) ? config.items : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={embedded ? "" : "max-w-3xl mx-auto"}
        >
            <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
            {config.description && (
                <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8`}>
                    {config.description}
                </p>
            )}
            <div className="space-y-5">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                        <span className="text-sm font-medium text-neutral-500 dark:text-white mt-1 w-20 flex-shrink-0">{item.date}</span>
                        <div className="text-base text-neutral-800 dark:text-white">
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}
                                skipHtml={false}
                                components={{
                                    p: ({ children }) => <p className="m-0">{children}</p>,
                                    strong: ({ children }) => (
                                        <strong className="text-accent font-medium transition-all duration-200 rounded">
                                            {children}
                                        </strong>
                                    ),
                                    em: ({ children }) => <em className="italic text-neutral-600 dark:text-white">{children}</em>,
                                    a: ({ ...props }) => (
                                        <a
                                            {...props}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                                        />
                                    ),
                                }}
                            >
                                {item.content || ''}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
