/**
 * Web Scraper using FireCrawl API
 * Fetches and extracts clean text from any URL
 */

const FIRECRAWL_API_KEY = import.meta.env.VITE_FIRECRAWL_API_KEY || '';

export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  error?: string;
}

/**
 * Fetch and extract text content from a URL using FireCrawl API
 * @param url - The URL to scrape
 * @returns Scraped content with title and text
 */
export async function scrapeWebPage(url: string): Promise<ScrapedContent> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    
    // Use FireCrawl API with authentication
    const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown', 'html'],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // FireCrawl returns data in 'data' object
    const scrapedData = data.data || data;
    
    return {
      url: url,
      title: scrapedData.metadata?.title || scrapedData.title || extractDomainName(url),
      content: scrapedData.markdown || scrapedData.content || scrapedData.text || '',
    };
  } catch (error) {
    console.error('Web scraping error:', error);
    return {
      url: url,
      title: extractDomainName(url),
      content: '',
      error: error instanceof Error ? error.message : 'Failed to scrape webpage',
    };
  }
}

/**
 * Fallback: Fetch plain text from URL (may have CORS issues)
 */
export async function scrapeWebPageFallback(url: string): Promise<ScrapedContent> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Basic HTML to text conversion
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      url: url,
      title: extractTitle(html) || extractDomainName(url),
      content: text,
    };
  } catch (error) {
    return {
      url: url,
      title: extractDomainName(url),
      content: '',
      error: error instanceof Error ? error.message : 'Failed to fetch webpage',
    };
  }
}

/**
 * Extract domain name from URL for display
 */
function extractDomainName(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Web Page';
  }
}

/**
 * Extract title from HTML
 */
function extractTitle(html: string): string | null {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : null;
}

/**
 * Validate if string is a valid URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}
