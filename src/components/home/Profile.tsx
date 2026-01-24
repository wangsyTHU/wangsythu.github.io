'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    EnvelopeIcon,
    AcademicCapIcon,
    HeartIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { MapPinIcon as MapPinSolidIcon, EnvelopeIcon as EnvelopeSolidIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Github, Linkedin, Pin } from 'lucide-react';
import { SiteConfig } from '@/lib/config';

// Custom ORCID icon component
const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

// Custom ResearchGate icon component
const ResearchGateIcon = ({ className }: { className?: string }) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>ResearchGate</title>
        <path
            d="M19.586 0c-0.818 0 -1.508 0.19 -2.073 0.565 -0.563 0.377 -0.97 0.936 -1.213 1.68a3.193 3.193 0 0 0 -0.112 0.437 8.365 8.365 0 0 0 -0.078 0.53 9 9 0 0 0 -0.05 0.727c-0.01 0.282 -0.013 0.621 -0.013 1.016a31.121 31.123 0 0 0 0.014 1.017 9 9 0 0 0 0.05 0.727 7.946 7.946 0 0 0 0.077 0.53h-0.005a3.334 3.334 0 0 0 0.113 0.438c0.245 0.743 0.65 1.303 1.214 1.68 0.565 0.376 1.256 0.564 2.075 0.564 0.8 0 1.536 -0.213 2.105 -0.603 0.57 -0.39 0.94 -0.916 1.175 -1.65 0.076 -0.235 0.135 -0.558 0.177 -0.93a10.9 10.9 0 0 0 0.043 -1.207v-0.82c0 -0.095 -0.047 -0.142 -0.14 -0.142h-3.064c-0.094 0 -0.14 0.047 -0.14 0.141v0.956c0 0.094 0.046 0.14 0.14 0.14h1.666c0.056 0 0.084 0.03 0.084 0.086 0 0.36 0 0.62 -0.036 0.865 -0.038 0.244 -0.1 0.447 -0.147 0.606 -0.108 0.385 -0.348 0.664 -0.638 0.876 -0.29 0.212 -0.738 0.35 -1.227 0.35 -0.545 0 -0.901 -0.15 -1.21 -0.353 -0.306 -0.203 -0.517 -0.454 -0.67 -0.915a3.136 3.136 0 0 1 -0.147 -0.762 17.366 17.367 0 0 1 -0.034 -0.656c-0.01 -0.26 -0.014 -0.572 -0.014 -0.939a26.401 26.403 0 0 1 0.014 -0.938 15.821 15.822 0 0 1 0.035 -0.656 3.19 3.19 0 0 1 0.148 -0.76 1.89 1.89 0 0 1 0.742 -1.01c0.344 -0.244 0.593 -0.352 1.137 -0.352 0.508 0 0.815 0.096 1.144 0.303 0.33 0.207 0.528 0.492 0.764 0.925 0.047 0.094 0.111 0.118 0.198 0.07l1.044 -0.43c0.075 -0.048 0.09 -0.115 0.042 -0.199a3.549 3.549 0 0 0 -0.466 -0.742 3 3 0 0 0 -0.679 -0.607 3.313 3.313 0 0 0 -0.903 -0.41A4.068 4.068 0 0 0 19.586 0zM8.217 5.836c-1.69 0 -3.036 0.086 -4.297 0.086 -1.146 0 -2.291 0 -3.007 -0.029v0.831l1.088 0.2c0.744 0.144 1.174 0.488 1.174 2.264v11.288c0 1.777 -0.43 2.12 -1.174 2.263l-1.088 0.2v0.832c0.773 -0.029 2.12 -0.086 3.465 -0.086 1.29 0 2.951 0.057 3.667 0.086v-0.831l-1.49 -0.2c-0.773 -0.115 -1.174 -0.487 -1.174 -2.264v-4.784c0.688 0.057 1.29 0.057 2.206 0.057 1.748 3.123 3.41 5.472 4.355 6.56 0.86 1.032 2.177 1.691 3.839 1.691 0.487 0 1.003 -0.086 1.318 -0.23v-0.744c-1.031 0 -2.063 -0.716 -2.808 -1.518 -1.26 -1.376 -2.95 -3.582 -4.355 -6.074 2.32 -0.545 4.04 -2.722 4.04 -4.9 0 -3.208 -2.492 -4.698 -5.758 -4.698zm-0.515 1.29c2.406 0 3.839 1.26 3.839 3.552 0 2.263 -1.547 3.782 -4.097 3.782 -0.974 0 -1.404 -0.03 -2.063 -0.086v-7.19c0.66 -0.059 1.547 -0.059 2.32 -0.059z"
            fill="currentColor"
        />
    </svg>
);

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    features: SiteConfig['features'];
    researchInterests?: string[];
}

export default function Profile({ author, social, features, researchInterests }: ProfileProps) {

    const englishName = author.name_en?.trim();
    const chineseName = author.name_cn?.trim();
    const displayName = englishName || chineseName || 'Profile';

    const [hasLiked, setHasLiked] = useState(false);
    const [showThanks, setShowThanks] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [isAddressPinned, setIsAddressPinned] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [isEmailPinned, setIsEmailPinned] = useState(false);
    const [lastClickedTooltip, setLastClickedTooltip] = useState<'email' | 'address' | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    // Check local storage for user's like status
    useEffect(() => {
        if (!features.enable_likes) return;

        const userHasLiked = localStorage.getItem('jiale-website-user-liked');
        if (userHasLiked === 'true') {
            setHasLiked(true);
        }
    }, [features.enable_likes]);

    const handleLike = () => {
        const newLikedState = !hasLiked;
        setHasLiked(newLikedState);

        if (newLikedState) {
            localStorage.setItem('jiale-website-user-liked', 'true');
            setShowThanks(true);
            setTimeout(() => setShowThanks(false), 2000);
        } else {
            localStorage.removeItem('jiale-website-user-liked');
            setShowThanks(false);
        }
    };

    useEffect(() => {
        const container = mapContainerRef.current;
        if (!container) return;
        container.innerHTML = '';
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'mapmyvisitors';
        script.src = 'https://mapmyvisitors.com/map.js?cl=a9adb0&w=260&t=n&d=OjA-1sglU01t45aN3NekkhYTxzMSOJgueUCN-Ao4KzM&co=ffffff&cmo=ff7f0e&cmn=2ca02c&ct=000000';
        container.appendChild(script);

        return () => {
            container.innerHTML = '';
        };
    }, []);

    useEffect(() => {
        const container = mapContainerRef.current;
        if (!container || typeof ResizeObserver === 'undefined') return;

        const syncSizeToMap = (target?: HTMLElement | null) => {
            const mapElement = (target ?? container.firstElementChild) as HTMLElement | null;
            if (!mapElement) return;
            const { width } = mapElement.getBoundingClientRect();
            if (width) {
                const desiredHeight = Math.round(width / 2.1); // keep container at 2:1 ratio (width:height)
                container.style.width = `${width}px`;
                container.style.height = `${desiredHeight}px`;
                // Keep the embedded map element aligned to the same height to avoid overflow
                mapElement.style.height = `${desiredHeight}px`;
            }
        };

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => syncSizeToMap(entry.target as HTMLElement));
        });

        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        resizeObserver.observe(node);
                        syncSizeToMap(node);
                    }
                });
            });
        });

        mutationObserver.observe(container, { childList: true });

        const initialChild = container.firstElementChild as HTMLElement | null;
        if (initialChild) {
            resizeObserver.observe(initialChild);
            syncSizeToMap(initialChild);
        }

        return () => {
            mutationObserver.disconnect();
            resizeObserver.disconnect();
            container.style.width = '';
            container.style.height = '';
        };
    }, []);

    const socialLinks = [
        ...(social.email ? [{
            name: 'Email',
            href: `mailto:${social.email}`,
            icon: EnvelopeIcon,
            isEmail: true,
        }] : []),
        ...(social.location || social.location_details ? [{
            name: 'Location',
            href: social.location_url || '#',
            icon: MapPinIcon,
            isLocation: true,
        }] : []),
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: AcademicCapIcon,
        }] : []),
        ...(social.orcid ? [{
            name: 'ORCID',
            href: social.orcid,
            icon: OrcidIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: Github,
        }] : []),
        ...(social.linkedin ? [{
            name: 'LinkedIn',
            href: social.linkedin,
            icon: Linkedin,
        }] : []),
        ...(social.researchgate ? [{
            name: 'ResearchGate',
            href: social.researchgate,
            icon: ResearchGateIcon,
        }] : []),
    ];

    const primaryLinks = socialLinks.filter(link => link.isEmail || link.isLocation);
    const secondaryLinks = socialLinks.filter(link => !link.isEmail && !link.isLocation);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-22"
        >
            {/* Profile Image */}
            <div className="w-[14.4rem] h-[14.4rem] mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Image
                    src={author.avatar}
                    alt={displayName}
                    width={230}
                    height={230}
                    className="w-full h-full object-cover object-[32%_center]"
                    priority
                />
            </div>

            {/* Name and Title */}
            <div className="text-center mb-6">
                <div className="text-3xl font-serif font-bold text-primary mb-2 leading-snug">
                    {englishName && <div>{englishName}</div>}
                    {chineseName && (
                        <div className={`${englishName ? 'mt-1 ' : ''}text-2xl`}>{chineseName}</div>
                    )}
                </div>
                <p className="text-lg text-accent font-medium mb-1 whitespace-pre-line">
                    {author.title}
                </p>
                <p className="text-lg font-semibold text-neutral-600 mb-2">
                    {author.institution}
                </p>
            </div>

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-3 relative px-2">
                {primaryLinks.map((link) => {
                    const IconComponent = link.icon;
                    if (link.isLocation) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        if (!isAddressPinned) setShowAddress(true);
                                        setLastClickedTooltip('address');
                                    }}
                                    onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                    onClick={() => {
                                        setIsAddressPinned(!isAddressPinned);
                                        setShowAddress(!isAddressPinned);
                                        setLastClickedTooltip('address');
                                    }}
                                    className={`p-2 sm:p-2 transition-colors duration-200 ${isAddressPinned
                                        ? 'text-accent'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-accent'
                                        }`}
                                    aria-label={link.name}
                                >
                                    {isAddressPinned ? (
                                        <MapPinSolidIcon className="h-5 w-5" />
                                    ) : (
                                        <MapPinIcon className="h-5 w-5" />
                                    )}
                                </button>

                                {/* Address tooltip */}
                                <AnimatePresence>
                                    {(showAddress || isAddressPinned) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -10, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-neutral-800 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap ${lastClickedTooltip === 'address' ? 'z-20' : 'z-10'
                                                }`}
                                            onMouseEnter={() => {
                                                if (!isAddressPinned) setShowAddress(true);
                                                setLastClickedTooltip('address');
                                            }}
                                            onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                        >
                                            <div className="text-center">
                                                <div className="flex items-center justify-center space-x-2 mb-1">
                                                    <p className="font-semibold">Work Address</p>
                                                    {!isAddressPinned && (
                                                        <div className="flex items-center space-x-0.5 text-xs text-neutral-400 opacity-60">
                                                            <Pin className="h-2.5 w-2.5" />
                                                            <span className="hidden sm:inline">Click</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {social.location_details?.map((line, i) => (
                                                    <p key={i} className="break-words">{line}</p>
                                                ))}
                                                <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                                                    {social.location_url && (
                                                        <a
                                                            href={social.location_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 w-full sm:w-auto"
                                                        >
                                                            <MapPinIcon className="h-4 w-4" />
                                                            <span>Google Map</span>
                                                        </a>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    if (link.isEmail) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        if (!isEmailPinned) setShowEmail(true);
                                        setLastClickedTooltip('email');
                                    }}
                                    onMouseLeave={() => !isEmailPinned && setShowEmail(false)}
                                    onClick={() => {
                                        setIsEmailPinned(!isEmailPinned);
                                        setShowEmail(!isEmailPinned);
                                        setLastClickedTooltip('email');
                                    }}
                                    className={`p-2 sm:p-2 transition-colors duration-200 ${isEmailPinned
                                        ? 'text-accent'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-accent'
                                        }`}
                                    aria-label={link.name}
                                >
                                    {isEmailPinned ? (
                                        <EnvelopeSolidIcon className="h-5 w-5" />
                                    ) : (
                                        <EnvelopeIcon className="h-5 w-5" />
                                    )}
                                </button>

                                {/* Email tooltip */}
                                <AnimatePresence>
                                    {(showEmail || isEmailPinned) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -10, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-neutral-800 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap ${lastClickedTooltip === 'email' ? 'z-20' : 'z-10'
                                                }`}
                                            onMouseEnter={() => {
                                                if (!isEmailPinned) setShowEmail(true);
                                                setLastClickedTooltip('email');
                                            }}
                                            onMouseLeave={() => !isEmailPinned && setShowEmail(false)}
                                        >
                                            <div className="text-center">
                                                <div className="flex items-center justify-center space-x-2 mb-1">
                                                    <p className="font-semibold">Email</p>
                                                    {!isEmailPinned && (
                                                        <div className="flex items-center space-x-0.5 text-xs text-neutral-400 opacity-60">
                                                            <Pin className="h-2.5 w-2.5" />
                                                            <span className="hidden sm:inline">Click</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="break-words">{social.email?.replace('@', ' (at) ')}</p>
                                                <div className="mt-2">
                                                    <a
                                                        href={link.href}
                                                        className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 w-full sm:w-auto"
                                                    >
                                                        <EnvelopeIcon className="h-4 w-4" />
                                                        <span className="sm:hidden">Send</span>
                                                        <span className="hidden sm:inline">Send Email</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 sm:p-2 text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors duration-200"
                            aria-label={link.name}
                        >
                            <IconComponent className="h-5 w-5" />
                        </a>
                    );
                })}
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 relative px-2">
                {secondaryLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 sm:p-2 text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors duration-200"
                            aria-label={link.name}
                        >
                            <IconComponent className="h-5 w-5" />
                        </a>
                    );
                })}
            </div>

            {/* Research Interests */}
            {researchInterests && researchInterests.length > 0 && (
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 mb-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] w-64 max-w-full mx-auto">
                    <h3 className="font-semibold text-primary mb-3">Key Words</h3>
                    <div className="space-y-2 text-sm text-neutral-700 dark:text-white">
                        {researchInterests.map((interest, index) => (
                            <div key={index}>{interest}</div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-6 hidden sm:block">
                <div
                    ref={mapContainerRef}
                    className="w-fit h-fit rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm mx-auto"
                />
            </div>

            {/* Like Button */}
            {features.enable_likes && (
                <div className="flex justify-center">
                    <div className="relative">
                        <motion.button
                            onClick={handleLike}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${hasLiked
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 cursor-pointer'
                                }`}
                        >
                            {hasLiked ? (
                                <HeartSolidIcon className="h-4 w-4" />
                            ) : (
                                <HeartIcon className="h-4 w-4" />
                            )}
                            <span>{hasLiked ? 'Liked' : 'Like'}</span>
                        </motion.button>

                        {/* Thanks bubble */}
                        <AnimatePresence>
                            {showThanks && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: -10, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap"
                                >
                                    Thanks! 😊
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-accent"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
