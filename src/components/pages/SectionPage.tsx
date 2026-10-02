'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';
import { CardItem, ListItem, SectionConfig } from '@/types/page';

export type ResolvedSection =
    | ({ type: 'markdown'; content: string } & Omit<SectionConfig, 'type' | 'content'>)
    | ({ type: 'text'; content: string } & Omit<SectionConfig, 'type' | 'content'>)
    | ({ type: 'list'; items: ListItem[] } & Omit<SectionConfig, 'type' | 'items'>)
    | ({ type: 'card'; items: CardItem[] } & Omit<SectionConfig, 'type' | 'items'>);

interface SectionPageProps {
    title: string;
    description?: string;
    sections: ResolvedSection[];
    embedded?: boolean;
}

export default function SectionPage({ title, description, sections, embedded = false }: SectionPageProps) {
    const safeSections = Array.isArray(sections) ? sections : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={embedded ? "" : "max-w-3xl mx-auto"}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{title}</h1>
                {description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
                        {description}
                    </p>
                )}
            </div>

            <div className="space-y-8">
                {safeSections.map((section, idx) => (
                    <div key={section.id ?? idx} className="space-y-3">
                        {section.title && (
                            <h2 className="text-2xl font-serif font-bold text-primary">{section.title}</h2>
                        )}

                        {section.type === 'markdown' && (
                            <div className="text-neutral-700 dark:text-neutral-200 leading-relaxed">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeRaw]}
                                    skipHtml={false}
                                    components={{
                                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                        ul: ({ children }) => <ul className="list-disc list-outside mb-4 space-y-1 ml-6">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal list-outside mb-4 space-y-1 ml-6">{children}</ol>,
                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-400">{children}</em>,
                                    }}
                                >
                                    {section.content || ''}
                                </ReactMarkdown>
                            </div>
                        )}

                        {section.type === 'text' && (
                            <div className="text-neutral-700 dark:text-neutral-200 leading-relaxed">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeRaw]}
                                    skipHtml={false}
                                    components={{
                                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                        ul: ({ children }) => <ul className="list-disc list-outside mb-4 space-y-1 ml-6">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal list-outside mb-4 space-y-1 ml-6">{children}</ol>,
                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-400">{children}</em>,
                                    }}
                                >
                                    {section.content || ''}
                                </ReactMarkdown>
                            </div>
                        )}

                        {section.type === 'list' && (
                            <div className="space-y-4">
                                {(section.items || []).map((item, i) => (
                                    <div key={i} className="flex items-start space-x-3">
                                        <span className="text-sm font-medium text-neutral-500 mt-1 w-36 flex-shrink-0">{item.date}</span>
                                        <div className="text-base text-neutral-800 dark:text-neutral-200">
                                            <ReactMarkdown
                                                rehypePlugins={[rehypeRaw]}
                                                skipHtml={false}
                                                components={{
                                                    p: ({ children }) => <p className="m-0">{children}</p>,
                                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                                    em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-400">{children}</em>,
                                                }}
                                            >
                                                {item.content || ''}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {section.type === 'card' && (
                            <div className="grid gap-4">
                                {(section.items || []).map((item, i) => (
                                    <div key={i} className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                                        <div className="flex items-start gap-3">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title || 'Card logo'}
                                                    width={56}
                                                    height={56}
                                                    className="w-14 h-14 rounded-md object-contain"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-base font-semibold text-primary">{item.title}</h3>
                                                    {item.date && (
                                                        <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                                            {item.date}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.subtitle && (
                                                    <p className="text-sm text-accent font-medium mb-2">{item.subtitle}</p>
                                                )}
                                                {item.content && (
                                                    <div className="text-sm text-neutral-700 dark:text-white leading-relaxed">
                                                        <ReactMarkdown
                                                            rehypePlugins={[rehypeRaw]}
                                                            skipHtml={false}
                                                            components={{
                                                                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                                                                ul: ({ children }) => <ul className="list-disc list-outside mb-3 space-y-1 ml-5">{children}</ul>,
                                                                ol: ({ children }) => <ol className="list-decimal list-outside mb-3 space-y-1 ml-5">{children}</ol>,
                                                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                                                strong: ({ children }) => <strong className="font-semibold dark:text-white">{children}</strong>,
                                                                em: ({ children }) => <em className="italic text-neutral-600 dark:text-white">{children}</em>,
                                                                a: ({ ...props }) => (
                                                                    <a
                                                                        {...props}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-accent transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                                                                    />
                                                                ),
                                                            }}
                                                        >
                                                            {item.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                                {item.tags && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {item.tags.map(tag => (
                                                            <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.link && (
                                                    <div className="mt-3">
                                                        <a
                                                            href={item.link}
                                                            className="text-sm text-accent hover:text-accent-dark underline"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Learn more
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
