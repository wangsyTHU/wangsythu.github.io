import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { parse } from 'smol-toml';

export interface SiteConfig {
    site: {
        title: string;
        description: string;
        favicon: string;
        last_updated?: string;
    };
    author: {
        name_en?: string;
        name_cn?: string;
        name?: string;
        title: string;
        institution: string;
        avatar: string;
    };
    social: {
        email?: string;
        location?: string;
        location_url?: string;
        location_details?: string[];
        google_scholar?: string;
        orcid?: string;
        github?: string;
        linkedin?: string;
        researchgate?: string;
        [key: string]: string | string[] | undefined;
    };
    features: {
        enable_likes: boolean;
        enable_one_page_mode?: boolean;
    };
    navigation: Array<{
        title: string;
        type: 'section' | 'page' | 'link';
        target: string;
        href: string;
    }>;
    sections: Array<{
        id: string;
        type: 'markdown' | 'publications' | 'list' | 'cards';
        source?: string;
        title?: string;
        filter?: string;
        limit?: number;
    }>;
}

const CONFIG_PATH = path.join(process.cwd(), 'content', 'config.toml');

export function getConfig(): SiteConfig {
    try {
        const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
        const config = parse(fileContent) as unknown as SiteConfig;
        return config;
    } catch (error) {
        console.error('Error loading config:', error);
        // Return a default config or throw
        throw new Error('Failed to load content/config.toml');
    }
}

// Resolves the "Last updated" date shown in the footer from the timestamp of
// the most recent git commit, so it tracks the last push to GitHub rather
// than the time the site happened to be built.
export function getLastUpdated(): string {
    try {
        const commitDate = execSync('git log -1 --format=%cI', {
            cwd: process.cwd(),
            stdio: ['ignore', 'pipe', 'ignore'],
        })
            .toString()
            .trim();
        if (commitDate) {
            return new Date(commitDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
            });
        }
    } catch (error) {
        console.error('Error reading last git commit date:', error);
    }
    return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
    });
}
