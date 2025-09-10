import type { RequestHandler } from "express";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
  content?: string;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// Economics-related keywords for filtering
const ECONOMICS_KEYWORDS = [
  'economy', 'economics', 'economic', 'inflation', 'recession', 'gdp', 'unemployment',
  'federal reserve', 'fed', 'interest rates', 'monetary policy', 'fiscal policy',
  'budget', 'deficit', 'debt', 'treasury', 'bonds', 'stocks', 'market', 'trading',
  'nasdaq', 'dow jones', 's&p 500', 'wall street', 'banking', 'finance', 'financial',
  'tax', 'taxation', 'tariff', 'trade', 'commerce', 'retail sales', 'consumer',
  'housing market', 'mortgage', 'employment', 'jobs report', 'payroll', 'wages',
  'cpi', 'ppi', 'consumer price index', 'producer price index'
];

// Check if article is economics-related
const isEconomicsRelated = (article: NewsArticle): boolean => {
  const textToCheck = `${article.title} ${article.description || ''}`.toLowerCase();
  return ECONOMICS_KEYWORDS.some(keyword => textToCheck.includes(keyword.toLowerCase()));
};

export const handleNews: RequestHandler = async (_req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "News API key not configured" });
    }

    // Fetch news from NewsAPI with economics focus
    const queries = [
      'US economy OR inflation OR "Federal Reserve" OR "interest rates" OR unemployment',
      'GDP OR recession OR "economic growth" OR "monetary policy" OR "fiscal policy"',
      '"stock market" OR nasdaq OR "dow jones" OR "wall street" OR trading'
    ];

    let allArticles: NewsArticle[] = [];

    for (const query of queries) {
      try {
        const url = `https://newsapi.org/v2/everything?` + new URLSearchParams({
          q: query,
          domains: 'reuters.com,apnews.com,bloomberg.com,cnbc.com,marketwatch.com,wsj.com,ft.com,economist.com,forbes.com,businessinsider.com',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: '20',
          apiKey
        });

        const response = await fetch(url);
        if (response.ok) {
          const data: NewsResponse = await response.json();
          if (data.articles) {
            allArticles.push(...data.articles);
          }
        }
      } catch (error) {
        console.error('Error fetching news for query:', query, error);
      }
    }

    // Remove duplicates based on URL
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    );

    // Filter for economics-related content
    const economicsArticles = uniqueArticles.filter(isEconomicsRelated);

    // Sort by publish date (newest first) and limit results
    const sortedArticles = economicsArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 30);

    // Transform to match frontend expectations
    const items = sortedArticles.map(article => ({
      title: article.title,
      link: article.url,
      pubDate: article.publishedAt,
      description: article.description || '',
      source: article.source.name,
      image: article.urlToImage
    }));

    res.json({ 
      items,
      totalResults: items.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({ error: "Failed to load economics news" });
  }
};