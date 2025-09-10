import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  RefreshCw,
  Filter,
  Calendar
} from "lucide-react";

interface NewsItem { 
  title: string; 
  link: string; 
  pubDate?: string; 
  description?: string;
  source?: string;
  image?: string;
}

interface NewsResponse {
  items: NewsItem[];
  totalResults: number;
  lastUpdated: string;
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [totalResults, setTotalResults] = useState(0);
  const [filter, setFilter] = useState('all');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/news");
      const data: NewsResponse = await r.json();
      setItems(Array.isArray(data.items) ? data.items : []);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
      setTotalResults(data.totalResults || 0);
    } catch (e) {
      console.error('Failed to fetch news:', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    const text = `${item.title} ${item.description}`.toLowerCase();
    switch (filter) {
      case 'stocks': return text.includes('stock') || text.includes('market') || text.includes('nasdaq') || text.includes('dow');
      case 'fed': return text.includes('federal reserve') || text.includes('fed') || text.includes('interest rate');
      case 'inflation': return text.includes('inflation') || text.includes('price') || text.includes('cpi');
      case 'employment': return text.includes('employment') || text.includes('job') || text.includes('unemployment');
      default: return true;
    }
  });

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getCategoryIcon = (item: NewsItem) => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    if (text.includes('stock') || text.includes('market')) return <BarChart3 className="h-4 w-4" />;
    if (text.includes('federal reserve') || text.includes('fed')) return <TrendingUp className="h-4 w-4" />;
    if (text.includes('inflation') || text.includes('price')) return <DollarSign className="h-4 w-4" />;
    return <Calendar className="h-4 w-4" />;
  };

  return (
    <section className="container py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">US Economics News</h1>
          <Button 
            onClick={fetchNews} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{totalResults} articles</span>
            {lastUpdated && (
              <span>• Updated {getTimeAgo(lastUpdated)}</span>
            )}
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button 
            size="sm" 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All News
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'stocks' ? 'default' : 'outline'}
            onClick={() => setFilter('stocks')}
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            Stock Market
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'fed' ? 'default' : 'outline'}
            onClick={() => setFilter('fed')}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Federal Reserve
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'inflation' ? 'default' : 'outline'}
            onClick={() => setFilter('inflation')}
          >
            <DollarSign className="h-3 w-3 mr-1" />
            Inflation
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'employment' ? 'default' : 'outline'}
            onClick={() => setFilter('employment')}
          >
            Employment
          </Button>
        </div>
      </div>
      
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading latest economics news...</p>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((n, i) => (
          <Card key={i} className="rounded-xl hover:shadow-lg transition-all duration-200 h-full cursor-pointer group" onClick={() => setSelectedArticle(n)}>
            <CardContent className="p-0">
              {n.image && (
                <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                  <img 
                    src={n.image} 
                    alt={n.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  {getCategoryIcon(n)}
                  {n.source && (
                    <Badge variant="secondary" className="text-xs">
                      {n.source}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Clock className="h-3 w-3" />
                    {n.pubDate ? getTimeAgo(n.pubDate) : "Recent"}
                  </div>
                </div>
                <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">
                  {n.title}
                </h3>
                {n.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {n.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!loading && filteredItems.length === 0 && items.length > 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No articles found for the selected filter.</p>
          <Button 
            variant="outline" 
            onClick={() => setFilter('all')}
            className="mt-4"
          >
            Show All Articles
          </Button>
        </div>
      )}
      
      {!loading && items.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-2">No economics news available right now.</p>
          <p className="text-sm text-muted-foreground">Please try refreshing or check back later.</p>
        </div>
      )}
      
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedArticle(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {selectedArticle.image && (
                <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                  <img 
                    src={selectedArticle.image} 
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(selectedArticle)}
                    {selectedArticle.source && (
                      <Badge variant="secondary">
                        {selectedArticle.source}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {selectedArticle.pubDate ? getTimeAgo(selectedArticle.pubDate) : "Recent"}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-semibold p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    ×
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 leading-tight">{selectedArticle.title}</h2>
                
                {selectedArticle.description && (
                  <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                    {selectedArticle.description}
                  </p>
                )}
                
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Continue reading the full article:
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-sm">
                        {selectedArticle.link}
                      </p>
                    </div>
                    <Button asChild>
                      <a 
                        href={selectedArticle.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Read Full Article
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
