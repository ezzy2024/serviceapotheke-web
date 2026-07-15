'use server';

import Parser from 'rss-parser';

export type LegalUpdate = {
  id: string;
  topic: string;
  title: string;
  date: string;
  source: string;
  link: string;
};

const parser = new Parser();

export async function fetchLegalFeed(currentRoute: string = '/pdl'): Promise<LegalUpdate[]> {
  try {
    // Determine filter keywords based on route
    let keywords: string[] = [];
    if (currentRoute.includes('pdl')) {
      keywords = ['pDL', 'Dienstleistung', 'AMTS', 'Medikation', 'pharmazeutische'];
    } else if (currentRoute.includes('atm') || currentRoute.includes('telemetry')) {
      keywords = ['Telepharmazie', 'Gematik', 'TI', 'E-Rezept', 'Kiosk'];
    } else {
      keywords = ['Gesetz', 'Apotheke', 'BfArM', 'G-BA']; // Default
    }

    const keywordRegex = new RegExp(keywords.join('|'), 'i');

    const feed = await parser.parseURL('https://www.pharmazeutische-zeitung.de/rss.xml'); // Example feed
    const sourceName = 'Pharmazeutische Zeitung';

    const updates: LegalUpdate[] = [];

    for (const item of feed.items) {
      if (item.title && keywordRegex.test(item.title)) {
        updates.push({
          id: item.guid || item.link || Math.random().toString(),
          topic: keywords.find(k => new RegExp(k, 'i').test(item.title!)) || 'News',
          title: item.title,
          date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('de-DE') : 'Aktuell',
          source: sourceName,
          link: item.link || '#'
        });
      }
      if (updates.length >= 5) break; // Limit to top 5
    }

    return updates;
  } catch (error) {
    console.error('Error fetching legal feed:', error);
    return [];
  }
}
