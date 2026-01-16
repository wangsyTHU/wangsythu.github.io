import { getConfig } from '@/lib/config';
import { getMarkdownContent, getBibtexContent, getTomlContent, getPageConfig } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import SelectedPublications from '@/components/home/SelectedPublications';
import News, { NewsItem } from '@/components/home/News';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import ListPage from '@/components/pages/ListPage';
import SectionPage, { ResolvedSection } from '@/components/pages/SectionPage';

import type { ReactElement } from 'react';

import { Publication } from '@/types/publication';
import {
  BasePageConfig,
  PublicationPageConfig,
  TextPageConfig,
  CardPageConfig,
  ListPageConfig,
  SectionedPageConfig,
  SectionConfig as SharedSectionConfig,
  ListSectionConfig,
  MarkdownSectionConfig,
  TextSectionConfig,
  CardSectionConfig,
} from '@/types/page';

// Define types for section config
type SectionConfig =
  | (SharedSectionConfig & { id: string })
  | {
    id: string;
    type: 'publications';
    title?: string;
    source?: string;
    filter?: string;
    limit?: number;
    content?: string;
    publications?: Publication[];
  }
  | (TextSectionConfig & { id: string })
  | (CardSectionConfig & { id: string });

type PageData =
  | { type: 'about', id: string, sections: SectionConfig[] }
  | { type: 'publication', id: string, config: PublicationPageConfig, publications: Publication[] }
  | { type: 'text', id: string, config: TextPageConfig, content: string }
  | { type: 'card', id: string, config: CardPageConfig }
  | { type: 'list', id: string, config: ListPageConfig }
  | { type: 'sectioned', id: string, config: SectionedPageConfig, sections: ResolvedSection[] };

export default function Home() {
  const config = getConfig();
  const enableOnePageMode = config.features.enable_one_page_mode;

  // Always load about page config for profile info
  const aboutConfig = getPageConfig('about');
  const researchInterests = (aboutConfig as { profile?: { key_words?: string[] } })?.profile?.key_words;

  // Helper function to process sections (for about page)
  const processSections = (sections: SectionConfig[]) => {
    return sections.map((section: SectionConfig) => {
      switch (section.type) {
        case 'markdown': {
          const markdownSection = section as MarkdownSectionConfig;
          return {
            ...section,
            content: markdownSection.content ?? (markdownSection.source ? getMarkdownContent(markdownSection.source) : '')
          };
        }
        case 'publications': {
          const bibtex = getBibtexContent('publications.bib');
          const allPubs = parseBibTeX(bibtex);
          const filteredPubs = section.filter === 'selected'
            ? allPubs.filter(p => p.selected)
            : allPubs;
          return {
            ...section,
            publications: filteredPubs.slice(0, section.limit || 5)
          };
        }
        case 'list': {
          const listSection = section as ListSectionConfig;
          const data = listSection.source ? getTomlContent<{ items?: NewsItem[]; news?: NewsItem[] }>(listSection.source) : null;
          return {
            ...section,
            items: listSection.items || data?.items || data?.news || []
          };
        }
        case 'text': {
          const textSection = section as TextSectionConfig;
          return {
            ...section,
            content: textSection.content ?? (textSection.source ? getMarkdownContent(textSection.source) : '')
          };
        }
        case 'card': {
          const cardSection = section as CardSectionConfig;
          const data = cardSection.source ? getTomlContent<{ items?: CardSectionConfig['items'] }>(cardSection.source) : null;
          return {
            ...section,
            items: cardSection.items || data?.items || []
          };
        }
        default:
          return section;
      }
    });
  };

  const resolveSectionedSections = (sections: SectionConfig[]): ResolvedSection[] => {
    return (sections || []).map((section) => {
      if (!section || typeof section !== 'object') {
        return { type: 'markdown', content: '' } as ResolvedSection;
      }
      if (section.type === 'markdown') {
        const markdownSection = section as MarkdownSectionConfig;
        const content = markdownSection.content ?? (markdownSection.source ? getMarkdownContent(markdownSection.source) : '');
        return { ...markdownSection, type: 'markdown', content };
      }
      if (section.type === 'text') {
        const textSection = section as TextSectionConfig;
        const content = textSection.content ?? (textSection.source ? getMarkdownContent(textSection.source) : '');
        return { ...textSection, type: 'text', content };
      }
      if (section.type === 'list') {
        const listSection = section as ListSectionConfig;
        return { ...listSection, type: 'list', items: listSection.items || [] };
      }
      if (section.type === 'card') {
        const cardSection = section as CardSectionConfig;
        return { ...cardSection, type: 'card', items: cardSection.items || [] };
      }
      // Skip unsupported types in sectioned pages
      return { ...section, type: 'markdown', content: '' } as ResolvedSection;
    });
  };

  // Determine which pages to show
  let pagesToShow: PageData[] = [];

  if (enableOnePageMode) {
    pagesToShow = config.navigation
      .filter(item => item.type === 'page')
      .map(item => {
        const rawConfig = getPageConfig(item.target);
        if (!rawConfig) return null;

        const pageConfig = rawConfig as BasePageConfig;

        if (pageConfig.type === 'about') {
          return {
            type: 'about',
            id: item.target,
            sections: processSections((rawConfig as { sections: SectionConfig[] }).sections || [])
          } as PageData;
        } else if (pageConfig.type === 'sectioned') {
          return {
            type: 'sectioned',
            id: item.target,
            config: pageConfig as SectionedPageConfig,
            sections: resolveSectionedSections((rawConfig as { sections: SectionConfig[] }).sections || [])
          } as PageData;
        } else if (pageConfig.type === 'publication') {
          const pubConfig = pageConfig as PublicationPageConfig;
          const bibtex = getBibtexContent(pubConfig.source);
          return {
            type: 'publication',
            id: item.target,
            config: pubConfig,
            publications: parseBibTeX(bibtex)
          } as PageData;
        } else if (pageConfig.type === 'text') {
          const textConfig = pageConfig as TextPageConfig;
          return {
            type: 'text',
            id: item.target,
            config: textConfig,
            content: getMarkdownContent(textConfig.source)
          } as PageData;
        } else if (pageConfig.type === 'card') {
          return {
            type: 'card',
            id: item.target,
            config: pageConfig as CardPageConfig
          } as PageData;
        } else if (pageConfig.type === 'list') {
          return {
            type: 'list',
            id: item.target,
            config: pageConfig as ListPageConfig
          } as PageData;
        }
        return null;
      })
      .filter((item): item is PageData => item !== null);
  } else {
    if (aboutConfig) {
      pagesToShow = [{
        type: 'about',
        id: 'about',
        sections: processSections((aboutConfig as { sections: SectionConfig[] }).sections || [])
      }];
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_2.1fr] gap-12">

        {/* Left Column - Profile */}
        <div className="lg:col-span-1">
          <Profile
            author={config.author}
            social={config.social}
            features={config.features}
            researchInterests={researchInterests}
          />
        </div>

        {/* Right Column - Content */}
        <div className="space-y-8">
          {pagesToShow.map((page) => (
            <section key={page.id} id={page.id} className="scroll-mt-24 space-y-8">
              {page.type === 'about' && page.sections.map((section: SectionConfig) => {
                let content: ReactElement | null = null;
                switch (section.type) {
                  case 'markdown':
                    content = (
                      <About
                        content={section.content || ''}
                        title={section.title}
                      />
                    );
                    break;
                  case 'publications':
                    content = (
                      <SelectedPublications
                        publications={section.publications || []}
                        title={section.title}
                        enableOnePageMode={enableOnePageMode}
                      />
                    );
                    break;
                  case 'list':
                    content = (
                      <News
                        items={section.items || []}
                        title={section.title}
                      />
                    );
                    break;
                  default:
                    content = null;
                }

                if (!content) return null;
                const sectionId = section.id && section.id !== page.id ? section.id : undefined;
                return (
                  <section key={section.id} id={sectionId} className={sectionId ? 'scroll-mt-24' : undefined}>
                    {content}
                  </section>
                );
              })}
              {page.type === 'publication' && (
                <PublicationsList
                  config={page.config}
                  publications={page.publications}
                  embedded={true}
                />
              )}
              {page.type === 'text' && (
                <TextPage
                  config={page.config}
                  content={page.content}
                  embedded={true}
                />
              )}
              {page.type === 'card' && (
                <CardPage
                  config={page.config}
                  embedded={true}
                />
              )}
              {page.type === 'list' && (
                <ListPage
                  config={page.config}
                  embedded={true}
                />
              )}
              {page.type === 'sectioned' && (
                <SectionPage
                  title={page.config.title}
                  description={page.config.description}
                  sections={page.sections}
                  embedded={true}
                />
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
