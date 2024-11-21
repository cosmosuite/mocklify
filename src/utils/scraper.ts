import { load } from 'cheerio';

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

const RETRY_ATTEMPTS = 2;
const TIMEOUT_MS = 3000;

interface ScrapedData {
  text: string;
  companyName?: string;
  productName?: string;
  error?: string;
}

async function fetchWithRetry(url: string, attempt = 0): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (attempt < RETRY_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      return fetchWithRetry(url, attempt + 1);
    }
    throw error;
  }
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  try {
    // Validate URL format
    const parsedUrl = new URL(url);
    if (!parsedUrl.protocol.startsWith('http')) {
      return {
        text: url,
        error: 'Invalid URL protocol. Please use http:// or https://'
      };
    }

    // Try each proxy in sequence
    let lastError: Error | null = null;
    
    for (const proxy of CORS_PROXIES) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url);
        const response = await fetchWithRetry(proxyUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        
        if (!html || html.length < 100) {
          throw new Error('Invalid HTML content received');
        }

        const $ = load(html);

        // Extract company/brand name
        const companyName = 
          $('meta[property="og:site_name"]').attr('content') ||
          $('meta[name="application-name"]').attr('content') ||
          $('.brand, .logo, [class*="brand"], [class*="logo"]').first().text().trim() ||
          parsedUrl.hostname.replace(/^www\./i, '').split('.')[0];

        // Extract product name
        const productName = 
          $('meta[property="og:title"]').attr('content') ||
          $('meta[name="twitter:title"]').attr('content') ||
          $('h1').first().text().trim();

        // Extract main content with priority
        const contentPriority = [
          // Product descriptions
          $('.product-description, .description, [class*="description"]').text(),
          
          // Main content areas
          $('.main-content, .content, #content, [class*="content"]').text(),
          $('main').text(),
          $('article').text(),
          
          // Meta descriptions
          $('meta[name="description"]').attr('content'),
          $('meta[property="og:description"]').attr('content'),
          
          // Hero/Landing sections
          $('.hero, .landing, [class*="hero"], [class*="landing"]').text(),
          
          // About sections
          $('.about, #about, [class*="about"]').text(),
          
          // Features sections
          $('.features, #features, [class*="features"]').text()
        ];

        // Combine and clean content
        const content = contentPriority
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s.,!?-]/g, '')
          .trim();

        if (!content) {
          // Fallback to basic text extraction
          const fallbackContent = $('body')
            .text()
            .replace(/\s+/g, ' ')
            .trim();

          if (!fallbackContent) {
            throw new Error('No content could be extracted');
          }

          return {
            text: fallbackContent.slice(0, 1000),
            companyName,
            productName
          };
        }

        return {
          text: content.slice(0, 1000),
          companyName,
          productName
        };
      } catch (proxyError) {
        lastError = proxyError as Error;
        continue;
      }
    }

    // If all proxies fail, return a user-friendly message
    return {
      text: `Please provide a description for: ${url}`,
      error: 'Unable to access the website. Please try using the description tab instead.'
    };

  } catch (error) {
    console.error('Failed to scrape website:', error);
    
    let errorMessage = 'Failed to analyze website.';
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Network error: Please check your internet connection.';
    } else if (error instanceof Error && error.message.includes('abort')) {
      errorMessage = 'Request timed out. The website might be slow or unavailable.';
    }

    return {
      text: `Please describe: ${url}`,
      error: `${errorMessage} Please use the description tab instead.`
    };
  }
}